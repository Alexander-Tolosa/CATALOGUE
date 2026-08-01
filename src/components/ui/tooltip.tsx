import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  position?: "top" | "bottom" | "left" | "right"
  className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  className
}) => {
  const [isVisible, setIsVisible] = React.useState(false)

  const positionClasses = {
    top: "-top-10 left-1/2 -translate-x-1/2",
    bottom: "-bottom-10 left-1/2 -translate-x-1/2",
    left: "top-1/2 -left-32 -translate-y-1/2",
    right: "top-1/2 -right-32 -translate-y-1/2"
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 px-2.5 py-1 text-[11px] font-bold text-white bg-slate-900 dark:bg-slate-800 rounded-lg shadow-lg whitespace-nowrap pointer-events-none border border-slate-700/50",
              positionClasses[position],
              className
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
