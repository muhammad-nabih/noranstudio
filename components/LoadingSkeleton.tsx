import { motion } from "framer-motion"


function LoadingSkeleton() {
    return (
      <div className="fixed inset-0 bg-[#0D0D0D] flex items-center justify-center z-[200]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-8"
        >
          <div className="relative w-16 h-16">
            <motion.div
              className="absolute inset-0 rounded-full border-[1px] border-[#C9A96E]/30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border-[1px] border-[#C9A96E]/60"
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
            <div className="absolute inset-[6px] rounded-full bg-[#C9A96E]/20" />
          </div>
          <div className="text-[#C9A96E]/50 text-xs tracking-[0.4em] uppercase">Loading</div>
        </motion.div>
      </div>
    )
  }
  