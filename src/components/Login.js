import React, { useState, useEffect } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect to dashboard if token already exists
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      window.location.href = '/dashboard';
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        alert('Login successful!');
        window.location.href = '/dashboard';
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          full_name: username,
          email: email,
          password: password,
          confirm_password: confirmPassword,
        }),
      });

      if (response.ok) {
        alert('Signup successful! Please log in.');
        setActiveTab('login');
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Signup failed. Please check your input.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        <div className="login-navbar">
          <div className="nav-brand">
            <span className="nav-mark">TRAVEL BUDDY</span>
          </div>
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/login" className="active">Login</a>
            <button
              type="button"
              className="nav-link-button"
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>
          <div className="nav-actions">
            {/* <button type="button" className="nav-ghost">Support</button> */}
            {/* <button type="button" className="nav-cta">Start Trip</button> */}
          </div>
        </div>

        <div className="login-content">
        <div className="login-panel">
          <div className="brand-row">
            <span className="brand-mark">Travel Buddy</span>
            {/* <span className="brand-sub">Explore More. Experience Life.</span> */}
          </div>

          <div className="tab-row" role="tablist">
            <button
              type="button"
              className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
            <button
              type="button"
              className={`tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Log In
            </button>
          </div>

          <div className="form-header">
            {/* <h1>Begin Your Adventure</h1> */}
            {/* <p>Sign in to continue your journey</p> */}
          </div>

          

          <form onSubmit={activeTab === 'signup' ? handleSignup : handleLogin} className="form">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrap">
                <span className="input-icon">U</span>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {activeTab === 'signup' && (
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrap">
                  <span className="input-icon">@</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {activeTab === 'signup' && (
              <div className="input-group">
                <label htmlFor="confirm-password">Confirm</label>
                <div className="input-wrap">
                  <span className="input-icon">*</span>
                  <input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <span className="input-icon">*</span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="form-row">
              {activeTab === 'login' && (
                <>
                  <label className="checkbox">
                    <input type="checkbox" />
                    Remember me
                  </label>
                  <a href="/forgot-password" className="link">Forgot password?</a>
                </>
              )}
            </div>

            <button className="primary-btn" type="submit" disabled={isLoading}>
              {isLoading
                ? 'Loading...'
                : activeTab === 'signup'
                ? 'Create Account'
                : "Let's Start"}
              <span className="arrow">Go</span>
            </button>
          </form>

          {activeTab === 'login' && (
            <div className="bottom-text">
              <span>Don't have an account?</span>
              <button
                type="button"
                className="link-button"
                onClick={() => setActiveTab('signup')}
              >
                Sign up
              </button>
            </div>
          )}
        </div>

        <div className="image-panel" aria-hidden="true">
          <div className="image-overlay"></div>
          <div className="floating-card">
            <div className="floating-card-header">
              <span className="card-icon">heart</span>
              <span className="card-icon">go</span>
            </div>
            <h3>Travel the World, Your Way!</h3>
            <p>
              Explore destinations at your pace with personalized journeys and unforgettable
              experiences.
            </p>
          </div>

          <div className="image-bottom">
            <div className="image-headline">Explore the World,<br />Beyond Boundaries!</div>
            {/* <button className="pill-btn" type="button">Start your adventure today!</button> */}
          </div>

          <div className="image-nav">
          </div>
        </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideRight {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .login-page {
          min-height: 100vh;
          background: #005f66;
          background-image:
            radial-gradient(circle at 15% 20%, rgba(255, 255, 255, 0.18), transparent 45%),
            radial-gradient(circle at 90% 10%, rgba(255, 255, 255, 0.12), transparent 40%),
            linear-gradient(140deg, rgba(0, 125, 133, 0.95), rgba(0, 85, 94, 1));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }

        .login-shell {
          width: min(1100px, 90vw);
          min-height: 80vh;
          background: #ffffff;
          border-radius: 30px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: fadeIn 0.6s ease;
        }

        .login-navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 32px;
          border-bottom: 1px solid rgba(0, 95, 102, 0.12);
          background: linear-gradient(90deg, rgba(0, 109, 119, 0.08), rgba(255, 255, 255, 0.9));
        }

        .nav-brand {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-mark {
          font-weight: 800;
          font-size: 16px;
          letter-spacing: 0.2rem;
          color: #0f1e23;
        }

        .nav-tag {
          font-size: 12px;
          color: #6c7a86;
        }

        .nav-links {
          display: flex;
          gap: 18px;
          font-size: 14px;
          color: #33515b;
          align-items: center;
        }

        .nav-links a {
          color: inherit;
          text-decoration: none;
          position: relative;
          padding-bottom: 4px;
        }

        .nav-link-button {
          border: none;
          background: transparent;
          color: inherit;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          padding-bottom: 4px;
        }

        .nav-links a.active::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          background: #006d77;
          border-radius: 999px;
        }

        .nav-actions {
          display: flex;
          gap: 10px;
        }

        .nav-ghost {
          border: 1px solid rgba(0, 109, 119, 0.3);
          background: transparent;
          color: #006d77;
          padding: 8px 14px;
          border-radius: 999px;
          font-weight: 600;
          cursor: pointer;
        }

        .nav-cta {
          border: none;
          background: #0f1e23;
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 999px;
          font-weight: 600;
          cursor: pointer;
        }

        .login-content {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          flex: 1;
          align-items: stretch;
        }

        .login-panel {
          padding: 44px 56px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          justify-content: center;
          animation: slideUp 0.7s ease;
        }

        .brand-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .brand-mark {
          font-weight: 700;
          font-size: 20px;
          color: #0f1e23;
          letter-spacing: 0.08rem;
        }

        .brand-sub {
          color: #6c7a86;
          font-size: 14px;
        }

        .tab-row {
          display: inline-flex;
          gap: 12px;
        }

        .tab {
          border-radius: 999px;
          border: 1px solid #006d77;
          padding: 8px 18px;
          font-weight: 600;
          background: transparent;
          color: #006d77;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tab.active {
          background: #0f1e23;
          border-color: #0f1e23;
          color: #ffffff;
        }

        .form-header h1 {
          margin: 0;
          font-size: 28px;
          color: #0f1e23;
        }

        .form-header p {
          margin: 6px 0 0;
          color: #6c7a86;
        }

        .social-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .social-btn {
          border-radius: 10px;
          border: 1px solid rgba(0, 109, 119, 0.25);
          padding: 10px 0;
          background: #f5fafb;
          font-weight: 600;
          color: #0f1e23;
          cursor: pointer;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #9aa5b1;
          font-size: 13px;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8ef;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-group {
          display: grid;
          grid-template-columns: 90px 1fr;
          align-items: center;
          gap: 12px;
        }

        .input-group label {
          font-size: 13px;
          color: #5c6b75;
          margin: 0;
          text-align: left;
        }

        .input-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(0, 109, 119, 0.18);
          border-radius: 12px;
          padding: 0 12px;
          height: 52px;
          background: #ffffff;
          transition: border 0.3s ease, box-shadow 0.3s ease;
        }

        .input-wrap:focus-within {
          border-color: #006d77;
          box-shadow: 0 0 0 3px rgba(0, 109, 119, 0.12);
        }

        .input-wrap input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 15px;
          color: #0f1e23;
        }

        .input-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: rgba(0, 109, 119, 0.08);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #006d77;
          font-weight: 700;
        }

        .eye-btn {
          border: none;
          background: transparent;
          color: #006d77;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .form-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: #5c6b75;
          margin-top: 4px;
        }

        .checkbox {
          display: inline-flex;
          gap: 8px;
          align-items: center;
        }

        .link {
          color: #006d77;
          text-decoration: none;
          font-weight: 600;
        }

        .primary-btn {
          width: 100%;
          background: linear-gradient(135deg, #006d77, #005f66);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-weight: 700;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .primary-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(0, 95, 102, 0.2);
        }

        .primary-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .arrow {
          font-size: 16px;
        }

        .bottom-text {
          display: flex;
          gap: 8px;
          font-size: 14px;
          color: #6c7a86;
          align-items: center;
        }

        .link-button {
          border: none;
          background: transparent;
          color: #006d77;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }

        .image-panel {
          background: url('https://img.freepik.com/free-photo/view-travel-items-assortment-still-life_23-2149617645.jpg?semt=ais_hybrid&w=740&q=80') center/cover no-repeat;
          position: relative;
          padding: 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          animation: slideRight 0.7s ease;
        }

        .image-panel::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.2));
        }

        .image-panel,
        .image-panel * {
          z-index: 1;
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          border-radius: 0 30px 30px 120px;
          border-left: 2px solid rgba(255, 255, 255, 0.35);
        }

        .floating-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 18px;
          padding: 18px;
          max-width: 260px;
          margin-left: auto;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
          animation: float 4s ease-in-out infinite;
        }

        .floating-card-header {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-bottom: 10px;
        }

        .card-icon {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(0, 109, 119, 0.12);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #006d77;
          font-weight: 700;
          font-size: 12px;
        }

        .floating-card h3 {
          margin: 0 0 6px;
          font-size: 16px;
          color: #0f1e23;
        }

        .floating-card p {
          margin: 0;
          font-size: 12px;
          color: #5c6b75;
        }

        .image-bottom {
          color: #ffffff;
        }

        .image-headline {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .pill-btn {
          border-radius: 999px;
          border: none;
          padding: 10px 18px;
          background: rgba(255, 255, 255, 0.9);
          color: #0f1e23;
          font-weight: 600;
          cursor: pointer;
        }

        .image-nav {
          display: flex;
          gap: 8px;
        }

        .image-nav button {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.9);
          cursor: pointer;
          font-weight: 700;
          color: #0f1e23;
        }

        @media (max-width: 900px) {
          .login-content {
            grid-template-columns: 1fr;
          }

          .login-navbar {
            flex-direction: column;
            align-items: flex-start;
          }

          .nav-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .image-panel {
            min-height: 280px;
            border-radius: 0 0 30px 30px;
          }

          .image-overlay {
            border-radius: 0 0 30px 30px;
          }
        }

        @media (max-width: 600px) {
          .login-panel {
            padding: 32px 24px;
          }

          .social-row {
            grid-template-columns: 1fr;
          }

          .form-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .input-group {
            grid-template-columns: 1fr;
            gap: 6px;
          }

          .image-panel {
            display: none;
          }

          .nav-links {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;