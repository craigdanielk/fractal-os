/**
 * ProjectsTable Component
 *
 * Displays projects in a table format with realtime updates
 */

"use client";

import { useEffect } from "react";
import type { Project } from "@/lib/types";
import { subscribe } from "@/lib/realtime";

interface ProjectsTableProps {
  projects: Project[];
  onRefresh?: () => void;
}

export default function ProjectsTable({ projects, onRefresh }: ProjectsTableProps) {
  useEffect(() => {
    const unsub = subscribe("projects", () => {
      onRefresh?.();
    });
    return () => {
      if (unsub?.unsubscribe) unsub.unsubscribe();
    };
  }, [onRefresh]);

  if (projects.length === 0) {
    return <p className="text-gray-500">No projects available.</p>;
  }

  return (
    <div className="glass-card">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/20">
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Progress</th>
            <th className="text-left p-2">Health</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-b border-white/10">
              <td className="p-2">{project.name}</td>
              <td className="p-2">{project.status}</td>
              <td className="p-2">N/A</td>
              <td className="p-2">{project.health_score || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

