import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DashboardPage = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  // Verify authorization
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Fetch stats and volunteer list
  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      // 1. Fetch stats
      const statsRes = await fetch(`${API_URL}/volunteers/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // 2. Fetch volunteers list (with search & status filters)
      const listRes = await fetch(
        `${API_URL}/volunteers?search=${encodeURIComponent(search)}&status=${statusFilter}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const listData = await listRes.json();
      if (listData.success) {
        setVolunteers(listData.data);
      } else {
        setError(listData.message || 'Failed to retrieve volunteers');
      }
    } catch (err) {
      setError('Failed to fetch data from the server. Check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Re-run search/filter fetch
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300); // Debounce typing search
    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter]);

  // Handle status update (Approve/Reject)
  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to change this status to ${status}?`)) return;
    
    setActionLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${API_URL}/volunteers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Volunteer successfully ${status.toLowerCase()}`);
        fetchData();
        // Update details view if open
        if (selectedVolunteer && selectedVolunteer._id === id) {
          setSelectedVolunteer(data.data);
        }
      } else {
        setError(data.message || 'Failed to update status');
      }
    } catch (err) {
      setError('Connection error occurred.');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete volunteer
  const handleDeleteVolunteer = async (id) => {
    if (!window.confirm('WARNING: Are you sure you want to permanently delete this application? This action cannot be undone.')) return;

    setActionLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${API_URL}/volunteers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('Volunteer application deleted successfully');
        setSelectedVolunteer(null);
        fetchData();
      } else {
        setError(data.message || 'Failed to delete application');
      }
    } catch (err) {
      setError('Connection error occurred.');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle file reports export (CSV/JSON)
  const handleExport = async (format) => {
    try {
      const res = await fetch(`${API_URL}/volunteers/export/${format}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `volunteers_report_${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        setError(`Failed to export as ${format.toUpperCase()}`);
      }
    } catch (err) {
      setError('Export error occurred.');
      console.error(err);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ borderBottom: 'none', marginBottom: '0.25rem' }}>Admin Dashboard</h1>
        <p className="text-mono" style={{ color: 'var(--color-gray-medium)', fontSize: '0.9rem' }}>
          Logged in as: {localStorage.getItem('adminEmail')}
        </p>
      </header>

      {/* Message banners */}
      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {/* Metrics Section */}
      <section className="dashboard-grid">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-title">Total Applications</div>
          <div className="dashboard-stat-val">{stats.total}</div>
        </div>
        <div className="dashboard-stat-card" style={{ outline: '1px solid #757575' }}>
          <div className="dashboard-stat-title">Pending</div>
          <div className="dashboard-stat-val">{stats.pending}</div>
        </div>
        <div className="dashboard-stat-card" style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-white)' }}>
          <div className="dashboard-stat-title" style={{ color: 'var(--color-gray-border)' }}>Approved</div>
          <div className="dashboard-stat-val">{stats.approved}</div>
        </div>
        <div className="dashboard-stat-card" style={{ borderStyle: 'dashed' }}>
          <div className="dashboard-stat-title">Rejected</div>
          <div className="dashboard-stat-val">{stats.rejected}</div>
        </div>
      </section>

      {/* Control Panel (Search, Filter, Export) */}
      <section className="controls-panel">
        <div className="search-filter-group">
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search by Name, Email, or Skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-select filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="action-buttons-group">
          <button onClick={() => handleExport('csv')} className="btn btn-secondary">
            Export CSV
          </button>
          <button onClick={() => handleExport('json')} className="btn btn-secondary">
            Export JSON
          </button>
        </div>
      </section>

      {/* Volunteers Table */}
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Availability</th>
                <th>Hours/Wk</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center" style={{ padding: '2rem' }}>
                    No volunteer applications found matching filters.
                  </td>
                </tr>
              ) : (
                volunteers.map((vol) => (
                  <tr key={vol._id}>
                    <td style={{ fontWeight: '700' }}>{vol.fullName}</td>
                    <td>{vol.email}</td>
                    <td className="text-mono">{vol.age}</td>
                    <td>{vol.availability}</td>
                    <td className="text-mono">{vol.weeklyHours}h</td>
                    <td>
                      <span
                        className={`badge ${
                          vol.status === 'Approved'
                            ? 'badge-approved'
                            : vol.status === 'Rejected'
                            ? 'badge-rejected'
                            : 'badge-pending'
                        }`}
                      >
                        {vol.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => setSelectedVolunteer(vol)}
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderWidth: '1px' }}
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(vol._id, 'Approved')}
                          className="btn btn-primary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderWidth: '1px' }}
                          disabled={vol.status === 'Approved' || actionLoading}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(vol._id, 'Rejected')}
                          className="btn btn-secondary"
                          style={{
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.8rem',
                            borderWidth: '1px',
                            borderStyle: vol.status === 'Rejected' ? 'solid' : 'dashed',
                          }}
                          disabled={vol.status === 'Rejected' || actionLoading}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Volunteer details modal drawer */}
      {selectedVolunteer && (
        <div className="modal-overlay" onClick={() => setSelectedVolunteer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedVolunteer(null)}>
              &times;
            </button>
            <h3 style={{ borderBottom: '2px solid var(--color-black)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
              Volunteer Application Details
            </h3>

            <div className="detail-row">
              <div className="detail-label">Status</div>
              <div className="detail-value">
                <span
                  className={`badge ${
                    selectedVolunteer.status === 'Approved'
                      ? 'badge-approved'
                      : selectedVolunteer.status === 'Rejected'
                      ? 'badge-rejected'
                      : 'badge-pending'
                  }`}
                >
                  {selectedVolunteer.status}
                </span>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Full Name</div>
              <div className="detail-value" style={{ fontWeight: '700' }}>
                {selectedVolunteer.fullName}
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Email Address</div>
              <div className="detail-value">{selectedVolunteer.email}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Phone Number</div>
              <div className="detail-value">{selectedVolunteer.phone}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Age</div>
              <div className="detail-value text-mono">{selectedVolunteer.age} years old</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Availability</div>
              <div className="detail-value">{selectedVolunteer.availability}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Weekly Hours</div>
              <div className="detail-value text-mono">{selectedVolunteer.weeklyHours} hours per week</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Skills</div>
              <div className="detail-value" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                {selectedVolunteer.skills.map((skill, index) => (
                  <span key={index} className="badge badge-pending" style={{ textTransform: 'none', fontWeight: 'normal' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="detail-row" style={{ borderBottom: 'none' }}>
              <div className="detail-label">Motivation</div>
              <div className="detail-value" style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', fontStyle: 'italic', backgroundColor: '#f9f9f9', padding: '1rem', border: '1px solid #e0e0e0' }}>
                "{selectedVolunteer.motivation}"
              </div>
            </div>

            <div className="detail-actions">
              <button
                onClick={() => handleUpdateStatus(selectedVolunteer._id, 'Approved')}
                className="btn btn-primary"
                disabled={selectedVolunteer.status === 'Approved' || actionLoading}
              >
                Approve Application
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedVolunteer._id, 'Rejected')}
                className="btn btn-secondary"
                disabled={selectedVolunteer.status === 'Rejected' || actionLoading}
              >
                Reject Application
              </button>
              <button
                onClick={() => handleDeleteVolunteer(selectedVolunteer._id)}
                className="btn btn-danger btn"
                disabled={actionLoading}
              >
                Delete Application
              </button>
              <button onClick={() => setSelectedVolunteer(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
