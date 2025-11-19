"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProjectById } from "@/services/projects";
import { useProjectStore } from "@/lib/store/projects";
import { PresenceBar } from "@/components/PresenceBar";
import { CollabField } from "@/components/CollabField";
import { useCollab } from "@/lib/collab/CollabProvider";
import { useLock } from "@/lib/hooks/useLock";
import type { Project } from "@/lib/supabase-types";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { setViewing } = useCollab();

  const storeProject = useProjectStore((state) => state.projects.find((p) => p.id === projectId));

  useEffect(() => {
    async function loadProject() {
      try {
        const fetched = await getProjectById(projectId);
        setProject(fetched);
      } catch (error) {
        console.error("Error loading project:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!storeProject) {
      loadProject();
    } else {
      setProject(storeProject);
      setLoading(false);
    }
  }, [projectId, storeProject]);

  useEffect(() => {
    if (projectId) {
      setViewing(projectId);
    }
  }, [projectId, setViewing]);

  useLock({ recordType: "project", recordId: projectId, enabled: true });

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!project) {
    return <div className="p-6">Project not found</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Project Details</h1>
        <PresenceBar module="projects" />
      </div>

      <div className="max-w-4xl space-y-6">
        <CollabField recordId={projectId} field="project_name" recordType="project">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Project Name</label>
            <input
              type="text"
              defaultValue={project.project_name}
              className="w-full p-2 border rounded bg-white dark:bg-neutral-900"
              readOnly
            />
          </div>
        </CollabField>

        <CollabField recordId={projectId} field="description" recordType="project">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              defaultValue={project.description || ""}
              rows={8}
              className="w-full p-2 border rounded bg-white dark:bg-neutral-900"
              readOnly
            />
          </div>
        </CollabField>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <div className="p-2 border rounded bg-white/50">{project.status || "N/A"}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <div className="p-2 border rounded bg-white/50">{project.priority || "N/A"}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Health Score</label>
            <div className="p-2 border rounded bg-white/50">{project.health_score || "N/A"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

