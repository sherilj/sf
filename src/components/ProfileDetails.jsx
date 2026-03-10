import React, { useState, useEffect } from "react";
import { User, Mail, Edit3, Save } from "lucide-react";

export default function ProfileDetails({ profile = {}, onSave }) {
  const [name, setName] = useState(profile.name || "");
  const [email, setEmail] = useState(profile.email || "");
  const [gender, setGender] = useState(profile.gender || "");
  const [dob, setDob] = useState(profile.dob || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(profile.name || "");
    setEmail(profile.email || "");
    setGender(profile.gender || "");
    setDob(profile.dob || "");
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { name: name.trim(), email: email.trim(), gender, dob };
    try {
      await onSave && onSave(payload);
    } catch (err) {
      // swallow - onSave will have shown error
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-50 rounded-full">
          <User size={28} className="text-green-700" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Profile Details</h2>
          <p className="text-sm text-gray-500">Manage your personal information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Full name</label>
            <input className="mt-1 w-full px-3 py-2 border rounded-md" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input type="email" className="mt-1 w-full px-3 py-2 border rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Gender</label>
            <select className="mt-1 w-full px-3 py-2 border rounded-md" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Prefer not to say</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Date of Birth</label>
            <input type="date" className="mt-1 w-full px-3 py-2 border rounded-md" value={dob} onChange={(e) => setDob(e.target.value)} />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-emerald-400">
            <Save size={16} /> {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
