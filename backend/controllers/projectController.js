import Project from '../models/Project.js';

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res, next) => {
  try {
    const { title, description, members } = req.body;

    const project = new Project({
      title,
      description,
      members: members || [],
      createdBy: req.user._id,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private/Admin
export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({})
      .populate('createdBy', 'name email')
      .populate('members', 'name email');
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get assigned projects for a member
// @route   GET /api/projects/my-projects
// @access  Private
export const getMyProjects = async (req, res, next) => {
  try {
    // Find projects where the members array contains the logged in user's ID
    const projects = await Project.find({ members: req.user._id })
      .populate('createdBy', 'name email')
      .populate('members', 'name email');
      
    res.json(projects);
  } catch (error) {
    next(error);
  }
};
