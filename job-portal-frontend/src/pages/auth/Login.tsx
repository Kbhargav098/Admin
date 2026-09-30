import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('orgadmin@demo.com');
  const [password, setPassword] = useState('Demo@1234');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const authData = await login(email, password);
      const orgId = authData.user?.organizationId || 'org_acme_1001';
      navigate(`/org/${orgId}/dashboard`);
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl border border-gray-100 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#0052CC] text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md">
            C
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#0B192C] tracking-tight">Clyptus</h2>
            <p className="text-xs font-bold text-[#0052CC] uppercase tracking-wider mt-0.5">
              ORGANIZATION & RECRUITER PORTAL
            </p>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Sign in to access your tenant dashboard or recruiter workspace.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1.5">Work Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0052CC] font-medium"
                placeholder="orgadmin@abctech.com or recruiter@abctech.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0052CC] font-medium"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#0052CC] text-white font-bold rounded-xl hover:bg-[#0043A8] transition shadow-md text-xs tracking-wide cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};


