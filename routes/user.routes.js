const express = require('express');
const { signup, login, updateUser, getUserProfile, allUsers, updateUserRole, deleteUser } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/update', authMiddleware, updateUser);
router.get('/profile', authMiddleware, getUserProfile);

router.get('/users', allUsers);
router.put('/users/update/:id', updateUserRole);
router.put('/users/delete/:id', deleteUser);

module.exports = router;