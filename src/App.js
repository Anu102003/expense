import { useContext } from 'react';
import { MessageContext } from './context';
import { Router } from './routes';
import MsgCard from './components/MsgCard';
import './App.scss';
function App() {
  const { showMessage, msgCardData } = useContext(MessageContext);
  return (
    <>
      <Router />
      {showMessage && (
        <MsgCard
          status={msgCardData.status}
          message={msgCardData.message}
        />
      )}
    </>
  );
}

export default App;
