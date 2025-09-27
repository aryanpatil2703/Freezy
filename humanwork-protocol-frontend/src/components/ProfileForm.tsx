import React, { useState } from 'react';
import { Web3Storage, File } from 'web3.storage';

const WEB3_STORAGE_TOKEN = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN || 'YOUR_WEB3_STORAGE_API_TOKEN'; // Replace with your actual API token

interface ProfileFormProps {
  onClose: () => void;
  account: string | null;
}

const ProfileForm = ({ onClose, account }: ProfileFormProps) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [skills, setSkills] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!WEB3_STORAGE_TOKEN || WEB3_STORAGE_TOKEN === 'YOUR_WEB3_STORAGE_API_TOKEN') {
      alert("Please set your NEXT_PUBLIC_WEB3_STORAGE_TOKEN environment variable.");
      console.error("Web3.Storage API token is not set.");
      return;
    }

    try {
      const client = new Web3Storage({ token: WEB3_STORAGE_TOKEN });
      const profileData = { name, age, email, skills, account, timestamp: Date.now() };
      const blob = new Blob([JSON.stringify(profileData)], { type: 'application/json' });
      const file = new File([blob], 'profile.json', { type: 'application/json' });

      console.log("Uploading profile data to Web3.Storage...");
      const cid = await client.put([file]);
      console.log("Profile data uploaded to IPFS. CID:", cid);
      // TODO: Store this CID in the UserRegistry smart contract

      alert("Profile saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving profile to Filecoin/IPFS:", error);
      alert("Error saving profile. See console for details.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              id="age"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
            <textarea
              id="skills"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
