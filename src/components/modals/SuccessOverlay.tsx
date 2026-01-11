import { motion, AnimatePresence } from 'framer-motion';

interface SuccessOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  pendingAmount: number;
  onConfirm: () => void;
}

export const SuccessOverlay = ({
  isOpen,
  onClose,
  pendingAmount,
  onConfirm,
}: SuccessOverlayProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="gradient-card rounded-3xl p-8 max-w-sm w-full border border-border text-center"
          >
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-black mb-2">✨ 성공! ✨</h2>
            <p className="text-muted-foreground mb-6">보상을 확정해 주세요</p>
            
            <div className="gradient-card rounded-2xl p-4 mb-6 border border-border">
              <p className="text-sm text-muted-foreground mb-2">적립 예정 금액</p>
              <p className="text-4xl font-black text-gold text-shadow-glow">
                {pendingAmount}원
              </p>
            </div>
            
            <button
              onClick={onConfirm}
              className="w-full gradient-success rounded-2xl py-4 text-white font-bold text-lg shadow-lg"
            >
              확정 진행하기
            </button>
            
            <p className="text-xs text-muted-foreground mt-4">
              완료 후 금액이 반영됩니다
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
