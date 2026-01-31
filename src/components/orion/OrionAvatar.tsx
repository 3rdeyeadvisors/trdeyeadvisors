import { motion } from "framer-motion";

interface OrionAvatarProps {
  size?: "sm" | "md" | "lg";
  isThinking?: boolean;
  onClick?: () => void;
  className?: string;
}

const OrionAvatar = ({ size = "md", isThinking = false, onClick, className = "" }: OrionAvatarProps) => {
  const sizeClasses = {
    sm: "w-11 h-11",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  };

  const eyeSize = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const Content = (
    <motion.div
      className={`relative ${onClick ? "cursor-pointer" : ""} ${sizeClasses[size]} ${className}`}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      animate={isThinking ? { y: [0, -2, 0] } : { y: [0, -3, 0] }}
      transition={isThinking ? { duration: 0.5, repeat: Infinity } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Robot body/head */}
      <div className="relative w-full h-full">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-md" />
        
        {/* Main head */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 border-2 border-primary/50 shadow-lg overflow-hidden">
          {/* Antenna */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <motion.div 
              className="w-2 h-2 rounded-full bg-primary"
              animate={isThinking ? { 
                boxShadow: ["0 0 8px hsl(var(--primary))", "0 0 16px hsl(var(--primary))", "0 0 8px hsl(var(--primary))"]
              } : {
                boxShadow: "0 0 8px hsl(var(--primary))"
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <div className="w-0.5 h-2 bg-slate-600" />
          </div>
          
          {/* Face plate */}
          <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-slate-600/50 to-slate-800/50 flex items-center justify-center gap-2">
            {/* Eyes */}
            <motion.div 
              className={`${eyeSize[size]} rounded-full bg-primary`}
              animate={isThinking ? {
                opacity: [1, 0.5, 1],
                scale: [1, 1.2, 1],
              } : {
                opacity: 1,
              }}
              transition={{ duration: 0.6, repeat: isThinking ? Infinity : 0 }}
              style={{ boxShadow: "0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary)/0.5)" }}
            />
            <motion.div 
              className={`${eyeSize[size]} rounded-full bg-primary`}
              animate={isThinking ? {
                opacity: [1, 0.5, 1],
                scale: [1, 1.2, 1],
              } : {
                opacity: 1,
              }}
              transition={{ duration: 0.6, repeat: isThinking ? Infinity : 0, delay: 0.1 }}
              style={{ boxShadow: "0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary)/0.5)" }}
            />
          </div>
          
          {/* Mouth/speaker grille */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
            <div className="w-1 h-1 rounded-full bg-slate-500" />
            <div className="w-1 h-1 rounded-full bg-slate-500" />
            <div className="w-1 h-1 rounded-full bg-slate-500" />
          </div>
        </div>
        
        {/* Ear pieces */}
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-4 rounded-l-full bg-slate-700 border border-primary/30" />
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-4 rounded-r-full bg-slate-700 border border-primary/30" />
      </div>
    </motion.div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
        aria-label="Open Orion chat assistant"
      >
        {Content}
      </button>
    );
  }

  return Content;
};

export default OrionAvatar;
