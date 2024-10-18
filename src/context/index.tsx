import { createContext, useState, ReactNode } from 'react';

interface MessageContextType {
  showMessage: boolean;
  setShowMessage: React.Dispatch<React.SetStateAction<boolean>>;
  msgCardData: {
    status: boolean;
    message: string;
  };
  setMsgCardData: React.Dispatch<
    React.SetStateAction<{ status: boolean; message: string }>
  >;
  triggerMessage: (status: boolean, message: string) => void; // Add triggerMessage
}

interface MessageProviderProps {
  children: ReactNode;
}

export const MessageContext = createContext<MessageContextType | undefined>(
  undefined
);

export const MessageProvider: React.FC<MessageProviderProps> = ({
  children,
}) => {
  const [showMessage, setShowMessage] = useState(false);
  const [msgCardData, setMsgCardData] = useState({
    status: false,
    message: '',
  });

  const triggerMessage = (status: boolean, message: string) => {
    setMsgCardData({ status, message });
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 1000);
  };

  return (
    <MessageContext.Provider
      value={{
        showMessage,
        setShowMessage,
        msgCardData,
        setMsgCardData,
        triggerMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
