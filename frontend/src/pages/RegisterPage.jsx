import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    skills: '',
    availability: 'Weekdays',
    weeklyHours: '',
    motivation: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear field-specific error as they type
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.fullName.trim()) tempErrors.fullName = 'Full Name is required';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      tempErrors.email = 'Email is not valid';
    }

    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{8,15}$/.test(formData.phone.trim())) {
      tempErrors.phone = 'Enter a valid phone number (8 to 15 digits)';
    }

    if (!formData.age) {
      tempErrors.age = 'Age is required';
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 13 || ageNum > 100) {
        tempErrors.age = 'Age must be between 13 and 100';
      }
    }

    if (!formData.skills.trim()) {
      tempErrors.skills = 'Skills are required';
    }

    if (!formData.weeklyHours) {
      tempErrors.weeklyHours = 'Weekly hours are required';
    } else {
      const hoursNum = parseInt(formData.weeklyHours, 10);
      if (isNaN(hoursNum) || hoursNum < 1 || hoursNum > 168) {
        tempErrors.weeklyHours = 'Weekly hours must be between 1 and 168';
      }
    }

    if (!formData.motivation.trim()) {
      tempErrors.motivation = 'Motivation statement is required';
    } else if (formData.motivation.trim().length < 20) {
      tempErrors.motivation = 'Please tell us a bit more (minimum 20 characters)';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/volunteers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age, 10),
          weeklyHours: parseInt(formData.weeklyHours, 10),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitSuccess(true);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          age: '',
          skills: '',
          availability: 'Weekdays',
          weeklyHours: '',
          motivation: '',
        });
      } else {
        setServerError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setServerError('Unable to connect to the server. Please check if backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="container">
        <div className="form-card text-center" style={{ margin: '4rem auto' }}>
          <h2 style={{ borderBottom: 'none', marginBottom: '1.5rem' }}>Application Submitted!</h2>
          <div className="alert alert-success" style={{ marginBottom: '2rem' }}>
            Thank you for applying to volunteer with Naye Pankh Foundation. Our administrative team will review your application and contact you soon.
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/" className="btn btn-primary">
              Return Home
            </Link>
            <button onClick={() => setSubmitSuccess(false)} className="btn btn-secondary">
              Submit Another Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-card">
        <h2 className="text-center" style={{ marginBottom: '2rem' }}>Volunteer Registration</h2>
        
        {serverError && (
          <div className="alert alert-danger">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-input"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
            />
            {errors.fullName && <div className="form-error">{errors.fullName}</div>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="john.doe@example.com"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          {/* Phone & Age Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <input
                type="text"
                id="phone"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 9999999999"
              />
              {errors.phone && <div className="form-error">{errors.phone}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                className="form-input"
                value={formData.age}
                onChange={handleChange}
                placeholder="21"
                min="13"
                max="100"
              />
              {errors.age && <div className="form-error">{errors.age}</div>}
            </div>
          </div>

          {/* Skills */}
          <div className="form-group">
            <label className="form-label" htmlFor="skills">Skills</label>
            <input
              type="text"
              id="skills"
              name="skills"
              className="form-input"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. Teaching, Graphic Design, Social Media (separated by commas)"
            />
            {errors.skills && <div className="form-error">{errors.skills}</div>}
          </div>

          {/* Availability & Hours Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="availability">Availability</label>
              <select
                id="availability"
                name="availability"
                className="form-select"
                value={formData.availability}
                onChange={handleChange}
              >
                <option value="Weekdays">Weekdays</option>
                <option value="Weekends">Weekends</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="weeklyHours">Commitment (Hours/Week)</label>
              <input
                type="number"
                id="weeklyHours"
                name="weeklyHours"
                className="form-input"
                value={formData.weeklyHours}
                onChange={handleChange}
                placeholder="e.g. 5"
                min="1"
              />
              {errors.weeklyHours && <div className="form-error">{errors.weeklyHours}</div>}
            </div>
          </div>

          {/* Motivation */}
          <div className="form-group">
            <label className="form-label" htmlFor="motivation">Motivation</label>
            <textarea
              id="motivation"
              name="motivation"
              className="form-textarea"
              value={formData.motivation}
              onChange={handleChange}
              placeholder="Tell us why you want to volunteer with Naye Pankh Foundation and what you hope to achieve..."
            />
            {errors.motivation && <div className="form-error">{errors.motivation}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Submitting Application...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
