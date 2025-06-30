import { useState, useEffect } from 'react';
import { useDatabase } from '../../hooks/useDatabase';
import './DebugPanel.css';

const DebugPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const { isLoading, error, useMockData } = useDatabase();
  const [apiStatus, setApiStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const [dbStatus, setDbStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const [envVariables, setEnvVariables] = useState<Record<string, string>>({});

  // Get environment variables
  useEffect(() => {
    setEnvVariables({
      'VITE_API_URL': import.meta.env.VITE_API_URL || 'Not set',
      'VITE_USE_API': import.meta.env.VITE_USE_API || 'Not set',
      'NODE_ENV': import.meta.env.MODE || 'Not set'
    });
  }, []);

  // Update connection status
  useEffect(() => {
    // Check API status (fetch health endpoint)
    if (import.meta.env.VITE_USE_API === 'true') {
      fetch(import.meta.env.VITE_API_URL + '/health')
        .then(res => res.json())
        .then(data => {
          setApiStatus(data.status === 'ok' ? 'connected' : 'disconnected');
        })
        .catch(() => {
          setApiStatus('disconnected');
        });
      
      // Check DB status
      fetch(import.meta.env.VITE_API_URL + '/test-connection')
        .then(res => res.json())
        .then(data => {
          setDbStatus(data.connected ? 'connected' : 'disconnected');
        })
        .catch(() => {
          setDbStatus('disconnected');
        });
    } else {
      setApiStatus('disconnected');
      setDbStatus('disconnected');
    }
  }, [isExpanded]);

  // Override console methods to capture logs
  if (typeof window !== 'undefined' && !window.__debugPanelInitialized) {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    console.log = (...args) => {
      originalConsoleLog(...args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      setLogs(prev => [...prev, `LOG: ${message}`].slice(-50));
    };
    
    console.error = (...args) => {
      originalConsoleError(...args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      setLogs(prev => [...prev, `ERROR: ${message}`].slice(-50));
    };
    
    console.warn = (...args) => {
      originalConsoleWarn(...args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      setLogs(prev => [...prev, `WARN: ${message}`].slice(-50));
    };
    
    window.__debugPanelInitialized = true;
  }

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className={`debug-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="debug-panel-header" onClick={togglePanel}>
        Debug Panel {isExpanded ? '▼' : '▲'}
      </div>
      {isExpanded && (
        <div className="debug-panel-content">
          <div className="debug-panel-controls">
            <button onClick={clearLogs}>Clear Logs</button>
          </div>
          
          <div className="debug-panel-section">
            <h3>Connection Status</h3>
            <div className="status-grid">
              <div className="status-item">
                <span>API Server:</span>
                <span className={`status-indicator ${apiStatus === 'connected' ? 'connected' : 'disconnected'}`}>
                  {apiStatus === 'connected' ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="status-item">
                <span>Database:</span>
                <span className={`status-indicator ${dbStatus === 'connected' ? 'connected' : 'disconnected'}`}>
                  {dbStatus === 'connected' ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="status-item">
                <span>Data Source:</span>
                <span>{useMockData ? 'Mock Data' : 'Database'}</span>
              </div>
              <div className="status-item">
                <span>Loading State:</span>
                <span>{isLoading ? 'Loading...' : 'Complete'}</span>
              </div>
            </div>
            {error && (
              <div className="error-message">
                <h4>Error Message:</h4>
                <p>{error}</p>
              </div>
            )}
          </div>
          
          <div className="debug-panel-section">
            <h3>Environment</h3>
            <div className="env-grid">
              {Object.entries(envVariables).map(([key, value]) => (
                <div key={key} className="env-item">
                  <span>{key}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="debug-panel-section">
            <h3>Console Logs</h3>
            <div className="debug-panel-logs">
              {logs.length === 0 ? (
                <p>No logs yet...</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className={`log-entry ${log.startsWith('ERROR') ? 'error' : log.startsWith('WARN') ? 'warn' : ''}`}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add typings for window
declare global {
  interface Window {
    __debugPanelInitialized?: boolean;
  }
}

export default DebugPanel;
