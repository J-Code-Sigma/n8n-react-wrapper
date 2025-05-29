
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ExternalLink, Settings, AlertTriangle } from 'lucide-react';

const Index = () => {
  const [n8nUrl, setN8nUrl] = useState('http://localhost:5678');
  const [isConnected, setIsConnected] = useState(false);
  const [showIframeError, setShowIframeError] = useState(false);

  const handleConnect = () => {
    if (n8nUrl) {
      setIsConnected(true);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setShowIframeError(false);
  };

  const handleIframeError = () => {
    setShowIframeError(true);
  };

  if (isConnected) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold text-gray-900">n8n Workflow Automation</h1>
              <span className="text-sm text-gray-500">({n8nUrl})</span>
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
                  <strong>Browser Security Restriction:</strong> Your browser is blocking the embedded n8n interface for security reasons. 
                  This is normal when using localhost. Please use the "Open in New Tab" button above to access n8n directly.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <iframe
          src={n8nUrl}
          className="w-full h-[calc(100vh-80px)] border-0"
          title="n8n Workflow Automation"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-top-navigation"
          onError={handleIframeError}
          onLoad={(e) => {
            // Check if iframe loaded successfully
            try {
              const iframe = e.target as HTMLIFrameElement;
              iframe.contentWindow?.document;
            } catch (error) {
              setShowIframeError(true);
            }
          }}
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
              placeholder="http://localhost:5678"
              value={n8nUrl}
              onChange={(e) => setN8nUrl(e.target.value)}
            />
          </div>
          <Button onClick={handleConnect} className="w-full">
            Connect to n8n
          </Button>
          <div className="text-sm text-gray-600 text-center">
            <p>Make sure your n8n instance is running and accessible.</p>
            <p className="mt-1">Default: http://localhost:5678</p>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> Some browsers may block embedded localhost content for security. 
                If the embed doesn't work, use the "Open in New Tab" button that will appear.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
