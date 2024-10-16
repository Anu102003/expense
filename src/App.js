import { Router } from './routes';
import './App.scss';
import { MessageProvider } from './context';
function App() {
  return (
    <MessageProvider>
      <Router />
    </MessageProvider>
  );
}

export default App;
