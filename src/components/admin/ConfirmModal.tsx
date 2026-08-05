import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  isDangerous = true,
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9990] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0e0e14] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl ${isDangerous ? 'bg-[#ff2e4d]/20 text-[#ff2e4d]' : 'bg-amber-500/20 text-amber-400'}`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Action nécessitant confirmation</p>
                </div>
              </div>

              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed bg-[#14141e] p-4 rounded-xl border border-white/5">
              {message}
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={onCancel}
                className="px-4 py-2.5 bg-[#1a1a24] hover:bg-[#252533] text-gray-300 font-semibold text-xs rounded-xl border border-white/10 transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`px-5 py-2.5 text-white font-bold text-xs rounded-xl transition-all shadow-lg ${
                  isDangerous
                    ? 'bg-[#ff2e4d] hover:bg-[#e60026] shadow-[#ff2e4d]/30'
                    : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
