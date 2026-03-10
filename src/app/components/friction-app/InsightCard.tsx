import { motion } from "motion/react";
import type { ReactNode } from "react";

interface InsightCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color?: string;
  delay?: number;
}

export function InsightCard({ icon, title, description, color = "#f59e0b", delay = 0 }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded hover:border-[#2a2a2a] transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5" style={{ color }}>
          {icon}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[#ccc]" style={{ fontSize: "0.75rem" }}>
            {title}
          </span>
          <p className="text-[#555] leading-relaxed" style={{ fontSize: "0.65rem" }}>
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
