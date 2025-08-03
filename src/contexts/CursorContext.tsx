import { createContext, useContext, useState, ReactNode } from 'react';

type CursorType = 'hand' | 'location' | 'default';

interface CursorContextType {
   cursorType: CursorType;
   setCursorType: (type: CursorType) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const useCursor = () => {
   const context = useContext(CursorContext);
   if (!context) {
      throw new Error('useCursor must be used within a CursorProvider');
   }
   return context;
};

interface CursorProviderProps {
   children: ReactNode;
}

export const CursorProvider = ({ children }: CursorProviderProps) => {
   const [cursorType, setCursorType] = useState<CursorType>('default');

   return (
      <CursorContext.Provider value={{ cursorType, setCursorType }}>
         {children}
      </CursorContext.Provider>
   );
};
