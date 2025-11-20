/**
 * MiniGantt Component
 *
 * Lightweight timeline visualization for tasks
 */

import type { Task } from "@/lib/types";

interface MiniGanttProps {
  tasks: Task[];
}

export default function MiniGantt({ tasks }: MiniGanttProps) {
  if (tasks.length === 0) {
    return <p className="text-gray-500">No tasks to display.</p>;
  }

  // Calculate date range
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const taskDates = tasks
    .map((t) => {
      const start = t.created_at ? new Date(t.created_at) : thirtyDaysAgo;
      const end = t.updated_at ? new Date(t.updated_at) : now;
      return { start, end };
    });

  const minDate = taskDates.length > 0 
    ? new Date(Math.min(...taskDates.map(d => d.start.getTime())))
    : thirtyDaysAgo;
  const maxDate = taskDates.length > 0
    ? new Date(Math.max(...taskDates.map(d => d.end.getTime())))
    : now;

  const totalDays = Math.max(1, Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)));

  const getTaskPosition = (task: Task) => {
    const start = task.created_at ? new Date(task.created_at) : minDate;
    const end = task.updated_at ? new Date(task.updated_at) : maxDate;
    
    const startDay = Math.floor((start.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    const endDay = Math.floor((end.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.max(1, endDay - startDay + 1);

    return {
      left: (startDay / totalDays) * 100,
      width: (duration / totalDays) * 100,
    };
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      case "blocked":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="glass-card">
      <h3 className="text-lg font-semibold mb-4">Task Timeline</h3>
      <div className="relative" style={{ minHeight: `${tasks.length * 40 + 20}px` }}>
        {tasks.map((task, index) => {
          const { left, width } = getTaskPosition(task);
          return (
            <div
              key={task.id}
              className="absolute flex items-center"
              style={{
                top: `${index * 40}px`,
                left: `${left}%`,
                width: `${width}%`,
                minWidth: "2px",
              }}
            >
              <div
                className={`h-6 rounded ${getStatusColor(task.status)} opacity-80 hover:opacity-100 transition-opacity`}
                style={{ width: "100%" }}
                title={`${task.name} (${task.status})`}
              >
                <span className="absolute left-2 text-xs text-white font-medium truncate max-w-full">
                  {task.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-xs text-gray-500 flex justify-between">
        <span>{minDate.toLocaleDateString()}</span>
        <span>{maxDate.toLocaleDateString()}</span>
      </div>
    </div>
  );
}

