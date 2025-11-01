import React, { createContext, useContext, useState } from 'react';

type TitleContextType = {
  title: string;
  setTitle: (t: string) => void;
};

const TitleContext = createContext<TitleContextType | undefined>(undefined);

export const TitleProvider: React.FC<{ children: React.ReactNode; defaultTitle?: string }> = ({ children, defaultTitle = 'Business Dashboard' }) => {
  const [title, setTitle] = useState<string>(defaultTitle);
  return <TitleContext.Provider value={{ title, setTitle }}>{children}</TitleContext.Provider>;
};

export const useTitle = () => {
  const ctx = useContext(TitleContext);
  if (!ctx) throw new Error('useTitle must be used within TitleProvider');
  return ctx;
};