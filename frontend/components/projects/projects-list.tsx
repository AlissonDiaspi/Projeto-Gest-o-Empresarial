import { Project } from '@/services/project.service';
import { ProjectCard } from './project-card';

interface ProjectsListProps {
  projects: Project[];
}

export function ProjectsList({
  projects,
}: ProjectsListProps) {
  if (!projects.length) {
    return (
      <div className="rounded-xl border p-10 text-center">
        <p className="text-muted-foreground">
          No projects found
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
        />
      ))}
    </div>
  );
}