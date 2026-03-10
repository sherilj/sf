import React, { useState, useEffect } from "react";
import { User, Mail, Edit3, Check } from "lucide-react";

export default function ProfileModal({ initialProfile = {}, onSave }) {
  const [name, setName] = useState(initialProfile.name || "");
  const [email, setEmail] = useState(initialProfile.email || "");
  const [gender, setGender] = useState(initialProfile.gender || "");
  const [dob, setDob] = useState(initialProfile.dob || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(initialProfile.name || "");
    setEmail(initialProfile.email || "");
    setGender(initialProfile.gender || "");
    setDob(initialProfile.dob || "");
  }, [initialProfile]);

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSaving(true);
    const payload = { name: name.trim(), email: email.trim(), gender, dob };
    try {
      // allow onSave to perform remote save and return a promise
      await onSave(payload);
    } catch (err) {
      // keep modal open on error (onSave already alerts)
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      <form
        onSubmit={handleSubmit}
        className="relative bg-white w-full max-w-md mx-4 rounded-xl shadow-lg p-6 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <User size={18} /> Complete Your Profile
        </h3>

        <p className="text-sm text-gray-500 mb-4">Please provide your details to continue.</p>

        <label className="block text-sm text-gray-600">Full name</label>
        <div className="mt-1 mb-3">
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>

        <label className="block text-sm text-gray-600">Email</label>
        <div className="mt-1 mb-3">
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm text-gray-600">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              <option value="">Prefer not to say</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-60"
          >
            <Check size={16} />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
