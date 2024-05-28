import React, { useEffect } from 'react';

const Toast = ({ message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4">
      <p>{message}</p>
    </div>
  );
};

export default Toast;
