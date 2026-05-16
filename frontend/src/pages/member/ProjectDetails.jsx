import { Folder } from 'lucide-react';

const ProjectDetails = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-textMain">Project Details</h1>
      <div className="glass-panel p-12 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-surfaceItem rounded-full flex items-center justify-center mb-4">
          <Folder size={28} className="text-textMuted" />
        </div>
        <h3 className="text-lg font-medium text-textMain mb-2">Project view</h3>
        <p className="text-textMuted">Select a project to view its details. (Requires additional API for single project fetch)</p>
      </div>
    </div>
  );
};

export default ProjectDetails;
