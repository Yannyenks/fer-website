import React, { createContext, useContext, useState, useCallback } from 'react';

type Toast = { id: number; text: string; type?: 'info'|'success'|'error' };

const ToastContext = createContext<{ show: (text:string, type?:Toast['type'])=>void } | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const ToastProvider: React.FC<{children:React.ReactNode}> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((text: string, type: Toast['type']='info') => {
    const id = Date.now();
    setToasts(t => [...t, { id, text, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div style={{position:'fixed', right:20, top:20, zIndex:9999}}>
        {toasts.map(t => (
          <div key={t.id} style={{ marginBottom:8, padding:'10px 14px', borderRadius:8, background: t.type==='error' ? '#fee2e2' : t.type==='success' ? '#ecfdf5' : '#eef2ff', color: t.type==='error' ? '#991b1b' : t.type==='success' ? '#065f46' : '#3730a3', boxShadow:'0 6px 18px rgba(0,0,0,0.08)' }}>
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
