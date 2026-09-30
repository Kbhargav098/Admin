import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organisationApi } from '../../services/api/organisation.api';
import { useAuthStore } from '../../store/auth.store';
import { Building, Save, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const OrgSettingsModal: React.FC<Props> = ({ onClose }) => {
  const organizationId = useAuthStore((state) => state.organizationId);
  const queryClient = useQueryClient();

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['orgSettings', organizationId],
    queryFn: async () => {
      if (!organizationId) return null;
      const res: any = await organisationApi.getSettings(organizationId);
      return res.data || res;
    },
  });

  const [form, setForm] = useState({
    name: '',
    description: '',
    website: '',
    industry: '',
    size: '',
    location: '',
  });

  useEffect(() => {
    if (settingsData) {
      setForm({
        name: settingsData.name || '',
        description: settingsData.description || '',
        website: settingsData.website || '',
        industry: settingsData.industry || '',
        size: settingsData.size || '',
        location: settingsData.location || '',
      });
    }
  }, [settingsData]);

  const updateMutation = useMutation({
    mutationFn: async (updated: any) => {
      if (!organizationId) return;
      return organisationApi.updateOrg(organizationId, updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['orgSettings', organizationId] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E5E5E5] relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-[#FFEDD5] rounded-xl text-[#F97316]">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#111111]">Organisation Settings & Profile</h3>
            <p className="text-xs text-gray-500">Manage company details and public profile info</p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-sm text-gray-400">Loading settings...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded-xl focus:ring-2 focus:ring-[#F97316] outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Industry</label>
                <input
                  type="text"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-xl focus:ring-2 focus:ring-[#F97316] outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Company Size</label>
                <input
                  type="text"
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-xl focus:ring-2 focus:ring-[#F97316] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Website URL</label>
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-xl focus:ring-2 focus:ring-[#F97316] outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Location / HQ</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-xl focus:ring-2 focus:ring-[#F97316] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Company Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded-xl focus:ring-2 focus:ring-[#F97316] outline-none resize-none"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-[#E5E5E5]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-5 py-2 rounded-xl text-white bg-[#F97316] hover:bg-[#EA580C] transition font-medium flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{updateMutation.isPending ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
