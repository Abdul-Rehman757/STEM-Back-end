const Project = require('../models/project.model');

exports.createProject = async (req, res) => {
    try {
        const { title, description, technologyUsed, category, userEmail } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Project file is required' });
        }

        const newProject = new Project({
            title,
            description,
            technologyUsed,
            category,
            filePath: req.file.path,
            userEmail,
        });

        await newProject.save();

        res.status(201).json({
            message: 'Project uploaded successfully',
            project: newProject,
        });
    } catch (err) {
        res.status(500).json({ error: 'Error uploading project', details: err.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findByIdAndDelete(id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ message: 'Project deleted successfully', project });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting project', details: err.message });
    }
};

exports.updateProjectApproval = async (req, res) => {
  try {
    const { id } = req.params; 
    const { approve } = req.body;
    console.log(`Approving project with ID: ${id} and status: ${approve}`);

    const project = await Project.findByIdAndUpdate(
      id,
      { approve },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log('Updated project:', project);
    res.status(200).json({
      message: 'Project approval status updated successfully',
      project,
    });
  } catch (err) {
    console.error('Error updating project approval:', err);
    res.status(500).json({ error: 'Error updating project approval status', details: err.message });
  }
};

// Updated to handle category filter
exports.getApprovedProjects = async (req, res) => {
    try {
      const { category } = req.query;  // Extract category from query params
      const query = { approve: 'approved' };
      if (category) {
        query.category = category;  // Filter by category if specified
      }
  
      const pendingProjects = await Project.find(query);
  
      res.status(200).json({
        message: 'Pending projects fetched successfully',
        projects: pendingProjects,
      });
    } catch (err) {
      res.status(500).json({ error: 'Error fetching pending projects', details: err.message });
    }
  };
  
exports.getPendingProjects = async (req, res) => {
    try {
      const { category } = req.query;  // Extract category from query params
      const query = { approve: 'pending' };
      if (category) {
        query.category = category;  // Filter by category if specified
      }
  
      const pendingProjects = await Project.find(query);
  
      res.status(200).json({
        message: 'Pending projects fetched successfully',
        projects: pendingProjects,
      });
    } catch (err) {
      res.status(500).json({ error: 'Error fetching pending projects', details: err.message });
    }
  };
  exports.getProjectsByEmail = async (req, res) => {
    try {
        const { userEmail } = req.query;  // Extract userEmail from query params
        if (!userEmail) {
            return res.status(400).json({ error: 'User email is required' });
        }

        const userProjects = await Project.find({ userEmail });

        if (!userProjects.length) {
            return res.status(404).json({ error: 'No projects found for this user' });
        }

        res.status(200).json({
            message: 'Projects fetched successfully',
            projects: userProjects,
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching user projects', details: err.message });
    }
};
