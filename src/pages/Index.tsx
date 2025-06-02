
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

  // Monitor for WebSocket connection issues
  useEffect(() => {
    if (isConnected) {
      console.log('Setting up WebSocket monitoring...');
      
      let consecutiveErrors = 0;
      let lastErrorTime = 0;
      let statusCheckInterval: NodeJS.Timeout;
      
      // Store original console methods
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      
      // Override console methods to detect WebSocket issues
      const checkForWebSocketIssues = (message: string) => {
        if (message.includes('[WebSocketClient] Connection lost') && message.includes('code=1008')) {
          console.log('DETECTED: WebSocket connection lost (code=1008)');
          consecutiveErrors++;
          lastErrorTime = Date.now();
          
          // Only change status if we have multiple consecutive errors
          if (consecutiveErrors >= 2) {
            setConnectionStatus('reconnecting');
          }
        }
      };
      
      console.log = function(...args) {
        originalLog.apply(console, args);
        const message = args.join(' ');
        checkForWebSocketIssues(message);
      };

      console.error = function(...args) {
        originalError.apply(console, args);
        const message = args.join(' ');
        checkForWebSocketIssues(message);
      };

      console.warn = function(...args) {
        originalWarn.apply(console, args);
        const message = args.join(' ');
        checkForWebSocketIssues(message);
      };

      // Listen for messages from iframe
      const handleMessage = (event: MessageEvent) => {
        console.log('Message from n8n iframe:', event.data);
        
        if (typeof event.data === 'object' && event.data.command === 'n8nReady') {
          console.log('n8n is ready');
          // Reset error counter when n8n is ready
          consecutiveErrors = 0;
          setConnectionStatus('connected');
        }
      };

      // Periodically check if we should reset to connected status
      statusCheckInterval = setInterval(() => {
        const timeSinceLastError = Date.now() - lastErrorTime;
        
        // If no errors for 10 seconds and we're in reconnecting state, assume connected
        if (connectionStatus === 'reconnecting' && timeSinceLastError > 10000) {
          console.log('No recent WebSocket errors, resetting to connected');
          consecutiveErrors = 0;
          setConnectionStatus('connected');
        }
      }, 5000);

      window.addEventListener('message', handleMessage);
      
      return () => {
        window.removeEventListener('message', handleMessage);
        clearInterval(statusCheckInterval);
        // Restore original console methods
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
      };
    }
  }, [isConnected, connectionStatus]);

  const handleConnect = () => {
    if (n8nUrl) {
      console.log('Connecting to n8n at:', n8nUrl);
      setIsConnected(true);
      setShowIframeError(false);
      setConnectionStatus('connected'); // Start optimistically
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
                  <Wifi className="w-4 h-4 text-green-500" />
                )}
                {connectionStatus === 'disconnected' && (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                {connectionStatus === 'reconnecting' && (
                  <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
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

        {connectionStatus === 'reconnecting' && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>WebSocket Connection Issues:</strong> n8n is experiencing connectivity problems (code 1008) and attempting to reconnect.
                  <br />
                  <strong>Tip:</strong> This may indicate Docker networking issues or nginx configuration problems. n8n functionality may be limited during reconnection attempts.
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
