import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { LangProvider } from './i18n.jsx';
import './styles.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('FixMyStreet Runtime Error Caught:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('fms-complaints');
      localStorage.removeItem('fms-notifications');
      localStorage.removeItem('fms-current-user');
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#f8fafc',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          color: '#0f172a',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '520px',
            background: '#ffffff',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏛️</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              FixMyStreet / நம்ம ஊர் புகார்
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              ஏதேனும் பிழை ஏற்பட்டால் கீழே உள்ள பட்டனை அழுத்தவும். Local Cache மீட்டமைக்கப்பட்டு பக்கம் திறக்கும்.
            </p>
            <div style={{
              background: '#f1f5f9',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              color: '#e11d48',
              marginBottom: '1.75rem',
              wordBreak: 'break-word',
              textAlign: 'left'
            }}>
              {this.state.error?.message || 'Unknown Application Error'}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  background: '#087f8c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                🔄 Reset Cache & Reload
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: '#e2e8f0',
                  color: '#1e293b',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <LangProvider>
      <App />
    </LangProvider>
  </ErrorBoundary>
);
