import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ExternalLink, Settings, AlertTriangle, Wifi, WifiOff } from 'lucide-react';

const Index = () => {
  const [n8nUrl, setN8nUrl] = useState('http://localhost:8081');
  const [isConnected, setIsConnected] = useState(false);
  const [showIframeError, setShowIframeError] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Monitor iframe loading and connection status
  useEffect(() => {
    if (isConnected && iframeRef.current) {
      console.log('n8n iframe loaded, monitoring connection...');
      
      // Listen for messages from the iframe to detect connection status
      const handleMessage = (event: MessageEvent) => {
        console.log('Message from n8n iframe:', event.data);
        
        // Check if it's a WebSocket status message
        if (typeof event.data === 'string') {
          if (event.data.includes('WebSocketClient') || event.data.includes('Connection lost')) {
            console.log('WebSocket connection issue detected');
            setConnectionStatus('reconnecting');
          } else if (event.data.includes('connected') || event.data.includes('ready')) {
            console.log('WebSocket connection established');
            setConnectionStatus('connected');
          }
        }
      };

      window.addEventListener('message', handleMessage);
      
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [isConnected]);

  const handleConnect = () => {
    if (n8nUrl) {
      console.log('Connecting to n8n at:', n8nUrl);
      setIsConnected(true);
      setShowIframeError(false);
      setConnectionStatus('reconnecting');
    }
  };

  const handleDisconnect = () => {
    console.log('Disconnecting from n8n');
    setIsConnected(false);
    setShowIframeError(false);
    setConnectionStatus('disconnected');
  };

  const handleIframeLoad = () => {
    console.log('n8n iframe loaded successfully');
    setShowIframeError(false);
    setConnectionStatus('connected');
    
    // Try to inject a script to monitor WebSocket status
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        // Post a message to establish communication
        iframe.contentWindow.postMessage({ type: 'connection-check' }, '*');
      }
    } catch (error) {
      console.log('Cannot access iframe content (expected due to CORS):', error);
    }
  };

  const handleIframeError = () => {
    console.log('n8n iframe failed to load');
    setShowIframeError(true);
    setConnectionStatus('disconnected');
  };

  if (isConnected) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold text-gray-900">n8n Workflow Automation</h1>
              <span className="text-sm text-gray-500">({n8nUrl})</span>
              <div className="flex items-center space-x-1">
                {connectionStatus === 'connected' && (
                  <Wifi className="w-4 h-4 text-green-500" title="Connected" />
                )}
                {connectionStatus === 'disconnected' && (
                  <WifiOff className="w-4 h-4 text-red-500" title="Disconnected" />
                )}
                {connectionStatus === 'reconnecting' && (
                  <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" title="Reconnecting" />
                )}
                <span className="text-xs text-gray-500 capitalize">{connectionStatus}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleDisconnect}>
                <Settings className="w-4 h-4 mr-2" />
                Change URL
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={n8nUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        {showIframeError && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Connection Issue:</strong> Unable to load n8n interface. 
                  Make sure both n8n and nginx are running with the docker-compose setup.
                  <br />
                  <strong>Debug tip:</strong> Check browser console for WebSocket connection errors.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src={n8nUrl}
          className="w-full h-[calc(100vh-80px)] border-0"
          title="n8n Workflow Automation"
          allow="fullscreen"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Connect to n8n</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="n8n-url">n8n Instance URL</Label>
            <Input
              id="n8n-url"
              type="url"
              placeholder="http://localhost:8081"
              value={n8nUrl}
              onChange={(e) => setN8nUrl(e.target.value)}
            />
          </div>
          <Button onClick={handleConnect} className="w-full">
            Connect to n8n
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
