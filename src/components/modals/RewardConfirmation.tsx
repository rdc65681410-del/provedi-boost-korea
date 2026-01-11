import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface RewardConfirmationProps {
  isOpen: boolean;
  onComplete: () => void;
  pendingAmount: number;
}

export const RewardConfirmation = ({
  isOpen,
  onComplete,
  pendingAmount,
}: RewardConfirmationProps) => {
  const [countdown, setCountdown] = useState(15);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(15);
      setCanClose(false);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleClose = () => {
    if (canClose) {
      onComplete();
    }
  };

  const progress = ((15 - countdown) / 15) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="gradient-card rounded-3xl p-8 max-w-sm w-full border border-border text-center relative"
          >
            <button
              onClick={handleClose}
              disabled={!canClose}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
                canClose
                  ? 'bg-primary text-white hover:bg-primary/80'
                  : 'bg-secondary/50 text-muted-foreground cursor-not-allowed opacity-50'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Spinning loader with circular progress */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-secondary"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                  className="text-primary transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="text-4xl"
                >
                  ⟳
                </motion.div>
              </div>
            </div>

            {countdown > 0 ? (
              <>
                <p className="text-lg font-medium mb-4">확인 중…</p>
                <div className="bg-secondary rounded-2xl p-6 mb-4">
                  <p className="text-6xl font-black text-gold mb-2">{countdown}</p>
                  <p className="text-sm text-muted-foreground">초</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  완료되면 방금 모은 금액이 확정됩니다
                </p>
                <p className="text-gold font-bold mt-2">
                  +{pendingAmount}원 적립 예정
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">✅</div>
                <p className="text-xl font-bold text-success mb-4">완료!</p>
                <p className="text-muted-foreground">
                  X 버튼을 눌러주세요
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
