const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologyUsed: { type: String, required: true },
    category: {
        type: String,
        enum: ['Science', 'Technology', 'Mathematics', 'Engineering'],
        required: true,
    },
    filePath: { type: String, required: true },
    userEmail: { type: String, required: true },
    approve: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
