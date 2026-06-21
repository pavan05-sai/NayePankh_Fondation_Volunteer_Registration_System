import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const LandingPage = () => {
  const [stats, setStats] = useState({ total: 0, approved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/volunteers/stats`);
        const result = await res.json();
        if (result.success) {
          setStats({
            total: result.data.total,
            approved: result.data.approved,
          });
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="landing-hero">
        <h1>Naye Pankh Foundation</h1>
        <p>
          Empowering lives, creating opportunities, and spreading wings of hope. Join us in making a sustainable, positive impact on society.
        </p>
        <Link to="/register" className="btn btn-primary">
          Register as Volunteer
        </Link>
      </section>

      {/* Intro & Mission/Vision Section */}
      <section className="grid-2">
        <div className="info-card">
          <h3>Who We Are</h3>
          <p>
            Naye Pankh Foundation is one of the leading non-governmental organizations working towards the upliftment of underprivileged communities. Through targeted initiatives in child education, rural development, women empowerment, and immediate disaster relief, we strive to build a better future.
          </p>
        </div>
        <div className="info-card">
          <h3>Mission & Vision</h3>
          <p>
            <strong>Our Mission:</strong> To provide access to quality education, healthcare, and livelihood support to the marginalized sections of society, enabling sustainable growth.
          </p>
          <p>
            <strong>Our Vision:</strong> An inclusive world where every individual, regardless of their background, possesses the wings to fly, succeed, and lead a dignified life.
          </p>
        </div>
      </section>

      {/* Volunteer Benefits */}
      <section className="info-card" style={{ marginBottom: '3rem' }}>
        <h3>Why Volunteer With Us?</h3>
        <div className="grid-3" style={{ margin: '1.5rem 0 0 0' }}>
          <div>
            <h4 style={{ fontSize: '1rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '0.25rem' }}>Make a Difference</h4>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Your time and skills directly contribute to transforming lives and bringing hope to underprivileged children and families.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '0.25rem' }}>Growth & Experience</h4>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Gain valuable on-ground project management experience, enhance your communication, and build strong leadership skills.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '0.25rem' }}>Recognition</h4>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Receive an official Certificate of Appreciation from Naye Pankh Foundation documenting your contribution and hours served.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <h2>Our Growing Community</h2>
        {loading ? (
          <div className="spinner-container">
            <div className="spinner" style={{ borderTopColor: '#ffffff' }}></div>
          </div>
        ) : (
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Applications</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.approved}</div>
              <div className="stat-label">Approved Volunteers</div>
            </div>
          </div>
        )}
      </section>

      {/* Call to Action */}
      <div className="text-center" style={{ margin: '4rem 0 2rem 0' }}>
        <h3 style={{ borderBottom: 'none', marginBottom: '0.5rem' }}>Ready to Take Flight?</h3>
        <p style={{ marginBottom: '1.5rem' }}>Become a vital part of our journey. Fill out the volunteer application form today.</p>
        <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
          Apply Now
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
