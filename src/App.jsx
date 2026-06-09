import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#0e1e25',
      color: '#fff',
      margin: 0
    }}>
      <h1 style={{ color: '#00C7B7' }}>🚀 Netlify Deployment Test</h1>
      <p style={{ fontSize: '1.2rem' }}>If you can see this, your React app is live!</p>
      
      <div style={{
        marginTop: '20px',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#1f363d',
        textAlign: 'center'
      }}>
        <h2>Test Interactivity</h2>
        <p>Current Count: <strong>{count}</strong></p>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            fontWeight: 'bold',
            backgroundColor: '#00C7B7',
            color: '#0e1e25',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Click Me
        </button>
      </div>
    </div>
  );
}

export default App;
