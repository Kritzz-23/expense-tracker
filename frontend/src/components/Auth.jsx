import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, ArrowRight } from 'lucide-react';

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
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#121214]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors duration-500">
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/30 transition-colors duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/30 transition-colors duration-1000"></div>
        
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400 mb-2 text-center tracking-tight">
            {isLogin ? 'Welcome Back' : 'Get Started'}
          </h2>
          <p className="text-zinc-500 text-center text-sm font-medium mb-10">
            {isLogin ? 'Log in to track your expenses smarter.' : 'Sign up to organize your financial health.'}
          </p>

          {error && (
             <div className={`p-4 rounded-xl text-sm font-semibold mb-6 border ${error.includes('successful') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {error}
             </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 mb-2 tracking-[0.15em] uppercase">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-5 py-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all backdrop-blur-sm shadow-inner font-medium"
                placeholder="Choose a username"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 mb-2 tracking-[0.15em] uppercase">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-5 py-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all backdrop-blur-sm shadow-inner font-medium"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="pt-2">
              <button
                disabled={loading}
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold tracking-wide rounded-xl py-4 px-6 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group"
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

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm font-semibold text-zinc-500 hover:text-white transition-colors underline-offset-4 hover:underline"
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
