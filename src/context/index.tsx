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
}

interface MessageProviderProps {
  children: ReactNode;
}

export const MessageContext = createContext<MessageContextType | undefined>(
  undefined
);

// Create the provider component
export const MessageProvider: React.FC<MessageProviderProps> = ({
  children,
}) => {
  const [showMessage, setShowMessage] = useState(false);
  const [msgCardData, setMsgCardData] = useState({
    status: false,
    message: '',
  });

  return (
    <MessageContext.Provider
      value={{ showMessage, setShowMessage, msgCardData, setMsgCardData }}
    >
      {children}
    </MessageContext.Provider>
  );
};
