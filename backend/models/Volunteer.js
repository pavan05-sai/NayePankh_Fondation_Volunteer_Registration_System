const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [13, 'Age must be at least 13'],
      max: [100, 'Age must be under 100'],
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
    },
    availability: {
      type: String,
      required: [true, 'Availability is required'],
      enum: ['Weekdays', 'Weekends', 'Flexible'],
    },
    weeklyHours: {
      type: Number,
      required: [true, 'Weekly commitment hours are required'],
      min: [1, 'Hours must be at least 1 hour per week'],
      max: [168, 'Hours cannot exceed 168'],
    },
    motivation: {
      type: String,
      required: [true, 'Motivation statement is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Volunteer', volunteerSchema);
