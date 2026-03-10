import type { Task } from "../../context/SessionContext";

interface BatteryStackProps {
  tasks: Task[];
  sessionDuration: number;
}

export function BatteryStack({ tasks, sessionDuration }: BatteryStackProps) {
  const totalWeight = tasks.reduce((sum, t) => sum + t.cognitiveWeight * t.estimatedMinutes, 0);
  const maxCapacity = sessionDuration * 0.8; // biological limit
  const fillPercent = Math.min((totalWeight / maxCapacity) * 100, 100);
  const isOverloaded = fillPercent > 90;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="uppercase tracking-[0.2em] text-[#555]" style={{ fontSize: "0.6rem" }}>
          Cognitive Load
        </span>
        <span
          className={`tabular-nums ${isOverloaded ? "text-red-500" : "text-amber-500"}`}
          style={{ fontSize: "0.65rem" }}
        >
          {fillPercent.toFixed(0)}%
        </span>
      </div>

      {/* Battery visualization */}
      <div className="relative w-full h-48 bg-[#0d0d0d] border border-[#1a1a1a] rounded overflow-hidden">
        {/* Fill */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out"
          style={{
            height: `${fillPercent}%`,
            background: isOverloaded
              ? "linear-gradient(to top, #ef4444, #dc2626)"
              : "linear-gradient(to top, #92400e, #f59e0b)",
            opacity: 0.3,
          }}
        />

        {/* Task segments */}
        <div className="absolute inset-0 flex flex-col-reverse p-2 gap-1">
          {tasks.filter(t => !t.completed).map((task) => {
            const segmentHeight = (task.cognitiveWeight * task.estimatedMinutes / maxCapacity) * 100;
            return (
              <div
                key={task.id}
                className="w-full rounded flex items-center px-2 shrink-0"
                style={{
                  height: `${Math.max(segmentHeight, 8)}%`,
                  backgroundColor: `${task.category === "deep" ? "#f59e0b" : task.category === "moderate" ? "#d97706" : "#92400e"}15`,
                  borderLeft: `2px solid ${task.category === "deep" ? "#f59e0b" : task.category === "moderate" ? "#d97706" : "#92400e"}50`,
                }}
              >
                <span className="text-[#888] truncate" style={{ fontSize: "0.55rem" }}>
                  {task.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Biological limit line */}
        <div
          className="absolute left-0 right-0 border-t border-dashed border-red-500/30"
          style={{ top: "10%" }}
        >
          <span className="absolute right-1 -top-3 text-red-500/50 uppercase tracking-[0.15em]" style={{ fontSize: "0.45rem" }}>
            Bio Limit
          </span>
        </div>
      </div>

      {isOverloaded && (
        <p className="text-red-500/70" style={{ fontSize: "0.6rem" }}>
          Cognitive load exceeds your historical stamina. Consider removing heavy tasks.
        </p>
      )}
    </div>
  );
}
