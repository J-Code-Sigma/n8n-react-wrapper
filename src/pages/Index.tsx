
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ExternalLink, Settings } from 'lucide-react';

const Index = () => {
  const [n8nUrl, setN8nUrl] = useState('http://localhost:5678');
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    if (n8nUrl) {
      setIsConnected(true);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
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
        <iframe
          src={n8nUrl}
          className="w-full h-[calc(100vh-80px)] border-0"
          title="n8n Workflow Automation"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
