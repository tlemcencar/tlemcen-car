import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAdminData();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-[#ff2e4d] shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-400 shrink-0" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30 bg-emerald-950/40';
      case 'warning':
        return 'border-amber-500/30 bg-amber-950/40';
      case 'error':
        return 'border-[#ff2e4d]/30 bg-red-950/40';
      default:
        return 'border-blue-500/30 bg-blue-950/40';
    }
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`pointer-events-auto flex items-start space-x-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl ${getBorderColor(
              toast.type
            )}`}
          >
            {getIcon(toast.type)}
            <div className="flex-1 text-xs text-white space-y-0.5">
              <h5 className="font-bold text-sm text-white">{toast.title}</h5>
              {toast.message && <p className="text-gray-300 font-light">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
