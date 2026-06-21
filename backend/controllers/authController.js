const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'naye_pankh_secret_key', {
    expiresIn: '30d',
  });
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for admin email
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(admin._id),
        admin: {
          id: admin._id,
          email: admin.email,
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Seed default admin if none exists
// @access  Internal
const seedAdmin = async () => {
  try {
    const count = await Admin.countDocuments();
    if (count === 0) {
      const email = process.env.ADMIN_EMAIL || 'admin@nayepankh.org';
      const password = process.env.ADMIN_PASSWORD || 'admin123';
      
      await Admin.create({
        email,
        password, // Pre-save hook will hash this
      });
      console.log(`Default admin account seeded successfully: ${email}`);
    }
  } catch (error) {
    console.error('Error seeding default admin:', error.message);
  }
};

module.exports = {
  loginAdmin,
  seedAdmin,
};
