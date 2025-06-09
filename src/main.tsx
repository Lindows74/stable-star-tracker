
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx: Starting application...');
console.log('main.tsx: Looking for root element...');

const rootElement = document.getElementById("root");
console.log('main.tsx: Root element found:', rootElement);

if (rootElement) {
  console.log('main.tsx: Creating React root...');
  const root = createRoot(rootElement);
  console.log('main.tsx: Rendering App component...');
  root.render(<App />);
  console.log('main.tsx: App component rendered successfully');
} else {
  console.error('main.tsx: Root element not found!');
}
