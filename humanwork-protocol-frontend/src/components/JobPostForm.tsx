import React, { useState } from 'react';
import { ethers } from 'ethers';
import SimpleEscrowABI from '../../abi/SimpleEscrow.json';
import { Web3Storage, File } from 'web3.storage';

const ESCROW_CONTRACT_ADDRESS = "0xea7098b8cc404e423630edb1f4726d366b4afdae"; // Replace with actual contract address - Placeholder for now
const WEB3_STORAGE_TOKEN = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN || 'YOUR_WEB3_STORAGE_API_TOKEN'; // Replace with your actual API token

interface JobPostFormProps {
  onClose: () => void;
  account: string | null;
}

const JobPostForm = ({ onClose, account }: JobPostFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');

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
      const web3StorageClient = new Web3Storage({ token: WEB3_STORAGE_TOKEN });
      const jobDetails = { 
        title, 
        description, 
        budget, 
        deadline,
        client: account,
        timestamp: Date.now() 
      };
      const blob = new Blob([JSON.stringify(jobDetails)], { type: 'application/json' });
      const file = new File([blob], 'job.json', { type: 'application/json' });

      console.log("Uploading job details to Web3.Storage...");
      const jobCID = await web3StorageClient.put([file]);
      console.log("Job details uploaded to IPFS. CID:", jobCID);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const escrowContract = new ethers.Contract(
        ESCROW_CONTRACT_ADDRESS,
        SimpleEscrowABI.abi,
        signer
      );

      const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);

      const tx = await escrowContract.createProject(
        account,
        jobCID, // Pass the IPFS CID for the job description
        deadlineTimestamp,
        { value: ethers.parseEther(budget) }
      );
      await tx.wait();
      alert("Job posted successfully!");
      onClose();
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Error posting job. See console for details.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">Post a New Job</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              id="title"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (will be IPFS CID)</label>
            <textarea
              id="description"
              rows={5}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget (ETH)</label>
            <input
              type="text" // Changed to text to avoid type conflict with useState('')
              id="budget"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              id="deadline"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
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
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPostForm;
