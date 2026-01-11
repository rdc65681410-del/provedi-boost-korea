import { motion, AnimatePresence } from 'framer-motion';

interface CreditConfirmationProps {
  isOpen: boolean;
  amount: number;
}

export const CreditConfirmation = ({ isOpen, amount }: CreditConfirmationProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        >
          {/* Floating coins */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                y: 100,
                x: (i % 4) * 80 - 120,
                scale: 0,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: -200,
                scale: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                ease: 'easeOut',
              }}
              className="absolute text-4xl"
            >
              🪙
            </motion.div>
          ))}

          <motion.div
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="gradient-card rounded-3xl p-8 max-w-sm w-full border border-success/50 text-center shadow-xl shadow-success/20"
          >
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-4xl font-black text-success mb-2">
              +{amount.toLocaleString()}원 확정
            </h2>
            <p className="text-muted-foreground">
              금액이 반영되었습니다!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
