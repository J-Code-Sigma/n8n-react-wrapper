
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ExternalLink, Settings, AlertTriangle } from 'lucide-react';

const Index = () => {
  const [n8nUrl, setN8nUrl] = useState('http://localhost:8081');
  const [isConnected, setIsConnected] = useState(false);
  const [showIframeError, setShowIframeError] = useState(false);

  const handleConnect = () => {
    if (n8nUrl) {
      setIsConnected(true);
      setShowIframeError(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setShowIframeError(false);
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
                  <strong>Connection Issue:</strong> Unable to load n8n interface. 
                  Make sure both n8n and nginx are running with the docker-compose setup.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <iframe
          src={n8nUrl}
          className="w-full h-[calc(100vh-80px)] border-0"
          title="n8n Workflow Automation"
          allow="fullscreen"
          onError={() => setShowIframeError(true)}
          onLoad={(e) => {
            const iframe = e.target as HTMLIFrameElement;
            setTimeout(() => {
              try {
                if (!iframe.contentDocument && !iframe.contentWindow) {
                  setShowIframeError(true);
                }
              } catch (error) {
                setShowIframeError(true);
              }
            }, 2000);
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
              placeholder="http://localhost:8081"
              value={n8nUrl}
              onChange={(e) => setN8nUrl(e.target.value)}
            />
          </div>
          <Button onClick={handleConnect} className="w-full">
            Connect to n8n
          </Button>
          <div className="text-sm text-gray-600 text-center">
            <p>Make sure your n8n instance is running with nginx proxy.</p>
            <p className="mt-1">Default: http://localhost:8081</p>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Setup with nginx proxy:</strong> Run 
                <code className="bg-white px-1 rounded mx-1">docker compose up -d</code> 
                in the n8n directory. The nginx proxy handles iframe embedding automatically.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
