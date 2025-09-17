// src/contexts/CapsLockContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

interface CapsLockContextType {
  isCapsLockOn: boolean;
}

const CapsLockContext = createContext<CapsLockContextType>({ isCapsLockOn: false });

export const useCapsLock = () => useContext(CapsLockContext);

export const CapsLockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  useEffect(() => {
    const handleKeyEvent = (event: KeyboardEvent) => {
      if (event.getModifierState) {
        setIsCapsLockOn(event.getModifierState('CapsLock'));
      }
    };

    // Only listen to real key events on the parent document
    document.addEventListener('keydown', handleKeyEvent);
    document.addEventListener('keyup', handleKeyEvent);

    return () => {
      document.removeEventListener('keydown', handleKeyEvent);
      document.removeEventListener('keyup', handleKeyEvent);
    };
  }, []);

  return (
    <CapsLockContext.Provider value={{ isCapsLockOn }}>
      {children}
      {/* Overlay that blocks all interactions when caps lock is on */}
      {isCapsLockOn && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            pointerEvents: 'auto',
            backgroundColor: 'transparent',
          }}
        />
      )}
    </CapsLockContext.Provider>
  );
};