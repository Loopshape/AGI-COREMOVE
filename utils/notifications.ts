

import ReactDOM from 'react-dom/client';
import React, { useEffect, useState } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'info' | 'warn' | 'error';
  onClose: () => void;
}

// FIX: Rewrote component to use React.createElement instead of JSX to be compatible with a .ts file.
const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Allow fade-out animation
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-emerald-600',
    info: 'bg-cyan-600',
    warn: 'bg-amber-400',
    error: 'bg-red-700',
  }[type];

  const textColor = type === 'warn' ? 'text-zinc-900' : 'text-white';

  const className = `fixed top-5 right-5 z-[1000] p-3 rounded-md shadow-lg transition-opacity duration-500 ${bgColor} ${textColor}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`;
  
  const style: React.CSSProperties = { fontFamily: 'var(--font-family)', fontSize: '12px' };

  return React.createElement(
    'div',
    {
      className,
      style,
    },
    message
  );
};

export const quantumNotify = (message: string, type: 'success' | 'info' | 'warn' | 'error' = 'info') => {
  // FIX: Dynamically create portal-root if it does not exist to prevent errors.
  let portalRoot = document.getElementById('portal-root');
  if (!portalRoot) {
    portalRoot = document.createElement('div');
    portalRoot.id = 'portal-root';
    document.body.appendChild(portalRoot);
  }

  const div = document.createElement('div');
  portalRoot.appendChild(div);

  const root = ReactDOM.createRoot(div);

  const handleClose = () => {
    root.unmount();
    if (portalRoot && portalRoot.contains(div)) {
        portalRoot.removeChild(div);
    }
  };

  // FIX: Use React.createElement to render the component.
  root.render(React.createElement(Notification, { message, type, onClose: handleClose }));
};