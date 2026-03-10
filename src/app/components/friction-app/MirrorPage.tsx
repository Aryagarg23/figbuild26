import { motion } from "motion/react";
import { Brain, Zap, Clock, TrendingDown, AlertTriangle } from "lucide-react";
import { DepthTimeline } from "./DepthTimeline";
import { InsightCard } from "./InsightCard";

export function MirrorPage() {
  return (
    <div className="size-full overflow-y-auto" style={{ backgroundColor: "var(--friction-bg-primary)" }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h2
            className="uppercase tracking-[0.3em] mb-2"
            style={{ fontSize: "0.65rem", color: "var(--friction-accent-amber)" }}
          >
            Page 03 — The Mirror
          </h2>
          <p style={{ fontSize: "0.75rem", color: "var(--friction-text-muted)" }}>
            Your session visualized not as a score, but as a topography of mental energy.
          </p>
        </motion.div>

        {/* Session summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-4 gap-4 mb-10"
        >
          {[
            { label: "Duration", value: "2h 30m", sub: "Planned: 2h 00m" },
            { label: "Peak Focus", value: "92%", sub: "at 0:32 mark" },
            { label: "Avg Fatigue", value: "48%", sub: "Above baseline" },
            { label: "Tasks Done", value: "5/7", sub: "2 deferred" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="p-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded"
            >
              <span className="text-[#444] uppercase tracking-[0.15em] block" style={{ fontSize: "0.5rem" }}>
                {stat.label}
              </span>
              <span className="text-amber-500 block mt-1" style={{ fontSize: "1.1rem" }}>
                {stat.value}
              </span>
              <span className="text-[#333] block mt-0.5" style={{ fontSize: "0.55rem" }}>
                {stat.sub}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Depth of Field Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-10 p-6 bg-[#0d0d0d] border border-[#1a1a1a] rounded"
        >
          <DepthTimeline />
        </motion.div>

        {/* Qualitative Insights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-10"
        >
          <h3
            className="text-[#555] uppercase tracking-[0.2em] mb-4"
            style={{ fontSize: "0.6rem" }}
          >
            Qualitative Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InsightCard
              icon={<Zap size={16} />}
              title="Flow State Achieved"
              description="You entered deep flow during the normalization pipeline debug — your strongest cognitive window was between 0:15 and 0:45. Consider scheduling complex work in this window."
              color="#f59e0b"
              delay={0.7}
            />
            <InsightCard
              icon={<Clock size={16} />}
              title="Context Switch Cost"
              description="The lab mate interruption at 1:20 cost approximately 5 minutes of recovery time. The moss-assisted return reduced the typical 23-minute context-switching tax by 78%."
              color="#22c55e"
              delay={0.8}
            />
            <InsightCard
              icon={<TrendingDown size={16} />}
              title="Fatigue Accumulation"
              description="Glutamate accumulation became significant after the 90-minute mark. Your cognitive output dropped 40% in the final 30 minutes — the taper intervention successfully redirected you to lighter tasks."
              color="#d97706"
              delay={0.9}
            />
            <InsightCard
              icon={<AlertTriangle size={16} />}
              title="Late Session Override"
              description="A hard intercept was triggered at the 2:30 mark. Your subjective fatigue perception had plateaued while objective performance continued to decline — a classic Van Dongen effect."
              color="#ef4444"
              delay={1.0}
            />
          </div>
        </motion.div>

        {/* Biological context */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mb-10 p-5 bg-[#0d0d0d] border border-[#1a1a1a] rounded"
        >
          <div className="flex items-start gap-3">
            <Brain size={16} className="text-amber-500/50 shrink-0 mt-0.5" />
            <div>
              <span className="text-[#888] block" style={{ fontSize: "0.7rem" }}>
                Why the system intervened
              </span>
              <p className="text-[#555] leading-relaxed mt-2" style={{ fontSize: "0.65rem" }}>
                Prolonged cognitive work causes glutamate buildup in the lateral prefrontal cortex (Wiehler et al., 2022).
                After ~90 minutes of sustained deep work, your neuro-metabolic markers indicated the onset of
                cognitive diminishment. The taper and eventual hard intercept were designed to protect you from
                fatigue-induced errors — not to limit your productivity. Your brain needs approximately 20 minutes
                of downtime to clear accumulated glutamate and restore optimal function.
              </p>
            </div>
          </div>
        </motion.div>

        {/* New session note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="flex justify-center"
        >
          <div
            className="text-center px-6 py-3 text-[#555]"
            style={{ fontSize: "0.7rem" }}
          >
            <span className="uppercase tracking-[0.2em]">End of Session Review</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
