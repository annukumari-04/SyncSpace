import Task from '../models/Task.js';

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin
export const createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      project,
      assignedTo,
      priority,
      dueDate,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    let query = {};

    // If user is Member, they only see tasks assigned to them
    // Or if you want ALL users to see ALL tasks as per requirements: "ALL USERS: GET /api/tasks"
    // Wait, requirement says "MEMBER CAN: View assigned tasks". Let's restrict it if Member.
    if (req.user.role === 'Member') {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate('project', 'title description')
      .populate('assignedTo', 'name email');

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private/Member
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Members can only update their own tasks (or admin can update any)
    if (
      req.user.role !== 'Admin' &&
      task.assignedTo.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    task.status = status;
    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error) {
    next(error);
  }
};
