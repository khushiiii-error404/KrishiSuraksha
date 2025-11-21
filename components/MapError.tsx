import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';

interface MapErrorProps {
  errorMessage: string;
}

export const MapError: React.FC<MapErrorProps> = ({ errorMessage }) => {
  const lines = errorMessage.split('\n').filter(line => line.trim() !== '');
  
  const title = lines[0] || 'Map Error';
  const subtitle = lines.find(line => line.includes("must be fixed")) || 'Could not load map.';
  
  const checklistItems = lines.filter(line => /^\d+\./.test(line));
  const linkLine = lines.find(line => line.startsWith('Fix it here:'));
  const linkUrl = linkLine ? linkLine.replace('Fix it here: ', '') : null;

  return (
    <div className="h-full w-full bg-red-50 border border-red-200 text-red-900 text-sm p-4 rounded-lg flex flex-col items-center justify-center text-center">
      <div className="bg-red-100 p-3 rounded-full mb-3">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-red-800 mb-4 max-w-md font-semibold">{subtitle}</p>
      
      {checklistItems.length > 0 && (
        <div className="bg-white/70 p-4 rounded-md border border-red-200 text-left w-full max-w-md mb-4">
          <ul className="space-y-2 text-xs list-decimal list-inside">
            {checklistItems.map((step, index) => (
              <li key={index} className="leading-relaxed">{step.replace(/^\d+\.\s*/, '')}</li>
            ))}
          </ul>
        </div>
      )}

      {linkUrl && (
        <a 
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full max-w-md px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Open Google Cloud Console <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      )}
    </div>
  );
};
