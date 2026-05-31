import { Project } from '@/services/project.service';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({
  project,
}: ProjectCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6 transition-all hover:shadow-lg">
      <h2 className="text-xl font-semibold">
        {project.name}
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">
        {project.description ||
          'No description'}
      </p>

      <div className="mt-4 text-xs text-muted-foreground">
        Created:
        {' '}
        {new Date(
          project.createdAt,
        ).toLocaleDateString()}
      </div>
    </div>
  );
}