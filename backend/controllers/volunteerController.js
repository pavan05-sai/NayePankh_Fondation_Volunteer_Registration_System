const Volunteer = require('../models/Volunteer');

// @desc    Register a new volunteer
// @route   POST /api/volunteers
// @access  Public
const createVolunteer = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      age,
      skills,
      availability,
      weeklyHours,
      motivation,
    } = req.body;

    // Validation
    if (!fullName || !email || !phone || !age || !skills || !availability || !weeklyHours || !motivation) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if volunteer email already exists
    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({
        success: false,
        message: 'An application with this email address has already been submitted',
      });
    }

    // Parse skills (if sent as string, split by commas, otherwise keep array)
    let processedSkills = skills;
    if (typeof skills === 'string') {
      processedSkills = skills.split(',').map((skill) => skill.trim()).filter(Boolean);
    }

    if (!Array.isArray(processedSkills) || processedSkills.length === 0) {
      return res.status(400).json({ success: false, message: 'Skills must be a non-empty list' });
    }

    const volunteer = await Volunteer.create({
      fullName,
      email,
      phone,
      age,
      skills: processedSkills,
      availability,
      weeklyHours,
      motivation,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: volunteer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all volunteers with filtering & search
// @route   GET /api/volunteers
// @access  Private (Admin)
const getVolunteers = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Search by Name, Email, or Skill
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { skills: { $in: [searchRegex] } },
      ];
    }

    const volunteers = await Volunteer.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: volunteers.length,
      data: volunteers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get volunteer application statistics
// @route   GET /api/volunteers/stats
// @access  Public
const getVolunteerStats = async (req, res) => {
  try {
    const total = await Volunteer.countDocuments();
    const pending = await Volunteer.countDocuments({ status: 'Pending' });
    const approved = await Volunteer.countDocuments({ status: 'Approved' });
    const rejected = await Volunteer.countDocuments({ status: 'Rejected' });

    res.json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update volunteer application status
// @route   PUT /api/volunteers/:id/status
// @access  Private (Admin)
const updateVolunteerStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid status' });
    }

    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer application not found' });
    }

    volunteer.status = status;
    await volunteer.save();

    res.json({
      success: true,
      message: `Application ${status.toLowerCase()} successfully`,
      data: volunteer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a volunteer application
// @route   DELETE /api/volunteers/:id
// @access  Private (Admin)
const deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer application not found' });
    }

    await Volunteer.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: 'Volunteer application deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper for CSV escaping
const escapeCSV = (val) => {
  if (val === null || val === undefined) return '';
  let str = String(val);
  str = str.replace(/"/g, '""');
  if (str.includes(',') || str.includes('\n') || str.includes('\r') || str.includes('"')) {
    return `"${str}"`;
  }
  return str;
};

// @desc    Export volunteer data as CSV
// @route   GET /api/volunteers/export/csv
// @access  Private (Admin)
const exportCSV = async (req, res) => {
  try {
    const volunteers = await Volunteer.find({}).sort({ createdAt: -1 });

    const headers = [
      'ID',
      'Full Name',
      'Email',
      'Phone',
      'Age',
      'Skills',
      'Availability',
      'Weekly Commitment (Hours)',
      'Motivation',
      'Status',
      'Applied Date',
    ];

    let csvContent = headers.join(',') + '\n';

    volunteers.forEach((v) => {
      const row = [
        v._id,
        v.fullName,
        v.email,
        v.phone,
        v.age,
        v.skills.join('; '),
        v.availability,
        v.weeklyHours,
        v.motivation,
        v.status,
        v.createdAt.toISOString(),
      ];
      csvContent += row.map(escapeCSV).join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=volunteers.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export volunteer data as JSON
// @route   GET /api/volunteers/export/json
// @access  Private (Admin)
const exportJSON = async (req, res) => {
  try {
    const volunteers = await Volunteer.find({}).sort({ createdAt: -1 });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=volunteers.json');
    res.status(200).send(JSON.stringify(volunteers, null, 2));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createVolunteer,
  getVolunteers,
  getVolunteerStats,
  updateVolunteerStatus,
  deleteVolunteer,
  exportCSV,
  exportJSON,
};
