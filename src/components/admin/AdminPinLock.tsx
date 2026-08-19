import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ShieldAlert, ArrowRight, ArrowLeft, KeyRound, CheckCircle2, Delete } from 'lucide-react';

interface AdminPinLockProps {
  onUnlock: () => void;
  onCancel: () => void;
}

const CORRECT_PIN = '2004';
const PIN_LENGTH = 4;

export const AdminPinLock: React.FC<AdminPinLockProps> = ({ onUnlock, onCancel }) => {
  const [pin, setPin] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus and listen to keyboard numbers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSuccess) return;

      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isSuccess]);

  const handleDigit = (digit: string) => {
    if (pin.length >= PIN_LENGTH || isSuccess) return;
    const newPin = pin + digit;
    setPin(newPin);
    setIsError(false);

    if (newPin.length === PIN_LENGTH) {
      verifyPin(newPin);
    }
  };

  const handleBackspace = () => {
    if (isSuccess) return;
    setPin((prev) => prev.slice(0, -1));
    setIsError(false);
  };

  const handleClear = () => {
    if (isSuccess) return;
    setPin('');
    setIsError(false);
  };

  const verifyPin = (enteredPin: string) => {
    if (enteredPin === CORRECT_PIN) {
      setIsSuccess(true);
      setTimeout(() => {
        onUnlock();
      }, 500);
    } else {
      setIsError(true);
      setAttempts((prev) => prev + 1);
      setTimeout(() => {
        setPin('');
        setIsError(false);
      }, 900);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#ff2e4d]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-[#0e0e14]/95 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff2e4d]/20 to-[#ff2e4d]/5 border border-[#ff2e4d]/30 text-[#ff2e4d] mb-4 shadow-[0_0_20px_rgba(255,46,77,0.2)]">
            {isSuccess ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
            ) : isError ? (
              <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" />
            ) : (
              <Lock className="w-8 h-8 text-[#ff2e4d]" />
            )}
          </div>

          <h2 className="text-2xl font-black text-white font-serif tracking-wide">
            Espace Sécurisé
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Veuillez entrer votre code PIN administrateur
          </p>
        </div>

        {/* PIN Dots Display */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <motion.div
                key={index}
                animate={
                  isError
                    ? { x: [-10, 10, -8, 8, -4, 4, 0] }
                    : { scale: isFilled ? [1, 1.2, 1] : 1 }
                }
                transition={{ duration: isError ? 0.4 : 0.15 }}
                className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                  isSuccess
                    ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_12px_#10b981]'
                    : isError
                    ? 'bg-red-600 border-red-500 shadow-[0_0_12px_#ef4444]'
                    : isFilled
                    ? 'bg-[#ff2e4d] border-[#ff2e4d] shadow-[0_0_12px_#ff2e4d]'
                    : 'bg-[#14141e] border-white/20'
                }`}
              />
            );
          })}
        </div>

        {/* Error Feedback */}
        <div className="h-6 text-center mb-4">
          <AnimatePresence>
            {isError && (
              <motion.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs font-bold text-red-400 flex items-center justify-center space-x-1"
              >
                <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                Code PIN incorrect. Réessayez.
              </motion.span>
            )}
            {isSuccess && (
              <motion.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold text-emerald-400 flex items-center justify-center space-x-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Accès autorisé...
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-6 max-w-[280px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-2xl bg-[#14141e] hover:bg-[#1f1f2e] active:scale-95 text-white font-bold text-xl border border-white/5 hover:border-white/20 transition-all flex items-center justify-center shadow-md focus:outline-none"
            >
              {digit}
            </button>
          ))}

          {/* Clear Button */}
          <button
            type="button"
            onClick={handleClear}
            className="h-14 rounded-2xl bg-[#14141e]/50 hover:bg-[#1f1f2e] active:scale-95 text-gray-400 hover:text-white font-semibold text-xs border border-white/5 transition-all flex items-center justify-center focus:outline-none"
          >
            Effacer
          </button>

          {/* 0 Button */}
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-[#14141e] hover:bg-[#1f1f2e] active:scale-95 text-white font-bold text-xl border border-white/5 hover:border-white/20 transition-all flex items-center justify-center shadow-md focus:outline-none"
          >
            0
          </button>

          {/* Backspace Button */}
          <button
            type="button"
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-[#14141e]/50 hover:bg-[#1f1f2e] active:scale-95 text-gray-400 hover:text-white font-semibold text-xs border border-white/5 transition-all flex items-center justify-center focus:outline-none"
            title="Effacer le dernier chiffre"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Back to Client Site Button */}
        <div className="pt-4 border-t border-white/10 flex justify-center">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition-colors py-2 px-4 rounded-xl hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au site public</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
