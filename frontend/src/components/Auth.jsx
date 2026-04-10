import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, ArrowRight } from 'lucide-react';

// Hardcode API_BASE to match App.jsx since config.js might be gone or mismatched
const API_BASE = 'http://127.0.0.1:8000';

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const res = await axios.post(`${API_BASE}/login`, formData);
        localStorage.setItem('token', res.data.access_token);
        onLogin(res.data.access_token);
      } else {
        await axios.post(`${API_BASE}/signup`, { username, password });
        setIsLogin(true);
        setError('Signup successful! Please log in.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center p-4 pt-16">
      <div className="max-w-md w-full bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-10 shadow-xl relative overflow-hidden group hover:border-primary/20 transition-all duration-500">

        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-secondary/10 transition-colors duration-1000"></div>

        <div className="relative z-10">
          <h2 className="text-4xl font-black font-manrope text-on-surface mb-2 text-center tracking-tight">
            {isLogin ? 'Welcome Back' : 'Get Started'}
          </h2>
          <p className="text-on-surface-variant text-center text-sm font-body mb-10">
            {isLogin ? 'Log in to securely access your financial architecture.' : 'Sign up to organize your wealth.'}
          </p>

          {error && (
            <div className={`p-4 rounded-xl text-sm font-semibold mb-6 border ${error.includes('successful') ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-error/10 border-error/20 text-error'}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-outline mb-2 tracking-[0.15em] uppercase">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-5 py-4 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all backdrop-blur-sm shadow-sm font-medium"
                placeholder="Choose a username"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-outline mb-2 tracking-[0.15em] uppercase">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-5 py-4 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all backdrop-blur-sm shadow-sm font-medium"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="pt-2">
              <button
                disabled={loading}
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-bold tracking-wide rounded-xl py-4 px-6 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? 'Log In' : 'Sign Up'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-outline-variant/10">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
