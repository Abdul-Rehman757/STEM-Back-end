const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const role = "user"
    const newUser = new User({ name, email,role, password });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error: error.message });
    
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};


const updateUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.user.id;

  try {
    // Prepare the update object
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    if (password) {
      // Hash the new password before updating
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Exclude the password field from the response for security
    res.status(200).json({
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
      message: password ? 'Password updated successfully' : 'User updated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};



const getUserProfile = async (req, res) => {
  const userId = req.user.id; // Assuming middleware sets req.user
  try {
    const user = await User.findById(userId).select('-password'); // Exclude the password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user data', error: error.message });
  }
};

const allUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      message: 'Users fetched successfully',
      users: users,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users', details: err.message });
  }
};

const updateUserRole = async (req, res) => {
  console.log("Fun called role update");
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }

    console.log('Updated user:', user);
    res.status(200).json({
      message: 'user approval status updated successfully',
      user,
    });
  } catch (err) {
    console.error('Error updating user approval:', err);
    res.status(500).json({ error: 'Error updating user approval status', details: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User deleted successfully',
      user,
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Error deleting user', details: err.message });
  }
};


module.exports = { signup, login, updateUser, getUserProfile, allUsers, updateUserRole, deleteUser};