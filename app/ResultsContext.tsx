// app/ResultsContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Result = {
  name: string;
  image: string;
};

type ResultsContextType = {
  results: Result[];
  addResult: (result: Result) => void;
};

const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

export const ResultsProvider = ({ children }: { children: ReactNode }) => {
  const [results, setResults] = useState<Result[]>([]);

  const addResult = (result: Result) => {
    setResults((prev) => [...prev, result]);
  };

  return (
    <ResultsContext.Provider value={{ results, addResult }}>
      {children}
    </ResultsContext.Provider>
  );
};

export const useResults = () => {
  const context = useContext(ResultsContext);
  if (!context) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
};
