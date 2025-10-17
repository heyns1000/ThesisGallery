import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface MinimalSectorLoaderProps {
  sectorName?: string;
  isVisible: boolean;
}

export default function MinimalSectorLoader({ sectorName, isVisible }: MinimalSectorLoaderProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-gray-900/90 border border-gray-700 rounded-lg p-6 max-w-sm mx-4 text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-4 flex justify-center"
        >
          <Loader2 className="w-8 h-8 text-blue-400" />
        </motion.div>
        
        <h3 className="text-white font-medium mb-2">
          {sectorName ? `Loading ${sectorName}...` : "Loading Sector..."}
        </h3>
        
        <div className="flex justify-center space-x-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 bg-blue-400 rounded-full"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}