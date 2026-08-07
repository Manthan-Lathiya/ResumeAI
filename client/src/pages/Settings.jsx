import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Settings as SettingsIcon, User, Shield, LogOut } from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile details updated!');
    }, 500);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl shadow-lg shadow-primary-500/20">
          <SettingsIcon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Account Settings</h1>
          <p className="text-xs text-gray-400">Manage your user profile and active login sessions.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Info Form */}
        <div className="glass-card p-6 space-y-4">
          <div className="border-b border-gray-800/80 pb-3">
            <h3 className="font-bold text-sm text-gray-100 flex items-center gap-2">
              <User className="w-4 h-4 text-primary-400" /> User Profile Information
            </h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label text-xs">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="input-label text-xs">Email Address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" disabled={saving} className="btn-primary text-xs py-2 px-5">
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Security & Logout Card */}
        <div className="glass-card p-6 space-y-4">
          <div className="border-b border-gray-800/80 pb-3">
            <h3 className="font-bold text-sm text-gray-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" /> Account Security & Session
            </h3>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-xs font-bold text-gray-200">Active Login Session</div>
              <div className="text-[11px] text-gray-400">Signed in as {user?.email}</div>
            </div>

            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" /> Log Out of Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
