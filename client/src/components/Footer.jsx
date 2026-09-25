import React from 'react';
import { Link } from 'react-router-dom';
import { Train, Heart, ShieldCheck, Info } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Train className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                RAIL<span className="text-blue-400">TRACK</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              A comprehensive MERN stack train journey tracking platform designed for B.Tech CSE major projects and technical interviews. Delivers real-time station-wise timeline tracking, delay calculations, and journey management.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs font-medium">
              <Info className="w-4 h-4 shrink-0" />
              <span>Academic Demo: Train tracking data is simulated and for testing purposes.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-white transition-colors">
                  Search Trains
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  User Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Architecture
            </h4>
            <ul className="space-y-1 text-xs text-slate-400">
              <li><strong className="text-slate-300">Frontend:</strong> React 19, Vite, Tailwind CSS</li>
              <li><strong className="text-slate-300">Backend:</strong> Node.js, Express.js</li>
              <li><strong className="text-slate-300">Database:</strong> MongoDB Atlas & Mongoose</li>
              <li><strong className="text-slate-300">Security:</strong> JWT & bcryptjs</li>
              <li><strong className="text-slate-300">Deployment:</strong> Vercel (Client) & Render (API)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RAILTRACK – All demo data reserved for CSE major project demonstration.</p>
          <div className="flex items-center gap-1">
            Built with modern MERN stack engineering
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
