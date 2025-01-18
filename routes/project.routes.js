const express = require('express');
const multer = require('multer');
const path = require('path');
const { createProject, deleteProject, updateProjectApproval, getPendingProjects, getApprovedProjects, getProjectsByEmail } = require('../controllers/project.controller');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Routes
router.post('/upload', upload.single('projectFile'), createProject);
router.delete('/delete/:id', deleteProject);
router.put('/update-approval/:id', updateProjectApproval);
router.get('/pending', getPendingProjects);
router.get('/approved', getApprovedProjects);
router.get('/email', getProjectsByEmail);


module.exports = router;
