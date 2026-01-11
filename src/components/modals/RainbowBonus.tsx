import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface RainbowBonusProps {
  isOpen: boolean;
  onClaim: () => void;
  onClose: () => void;
}

export const RainbowBonus = ({ isOpen, onClaim, onClose }: RainbowBonusProps) => {
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
            className="gradient-card rounded-3xl p-8 max-w-sm w-full border-2 border-transparent relative overflow-hidden"
            style={{
              borderImage: 'linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff, #5f27cd) 1',
              boxShadow: '0 0 30px rgba(255, 107, 107, 0.5), 0 0 60px rgba(84, 160, 255, 0.3)',
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-secondary/80 rounded-full hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Floating sparkles */}
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  scale: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200,
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="absolute text-2xl"
                style={{
                  left: '50%',
                  top: '30%',
                }}
              >
                ✨
              </motion.div>
            ))}

            {/* Rainbow mascot */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-9xl mb-4 relative z-10"
            >
              🦝
            </motion.div>

            <div className="relative z-10">
              <h2 className="text-2xl font-black mb-2 gradient-rainbow bg-clip-text text-transparent">
                ✨ 무지개 툭구리 등장! ✨
              </h2>
              <p className="text-lg font-bold mb-6">지금 누르면 보상 2배!</p>

              <button
                onClick={onClaim}
                className="w-full gradient-gold rounded-2xl py-4 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                2배 보상 받기
              </button>
            </div>

            {/* Rainbow glow effect */}
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 gradient-rainbow opacity-20 blur-3xl pointer-events-none"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
