import React, { useState, useEffect } from 'react';
import * as ethers from 'ethers';
import SimpleEscrowABI from '../../abi/SimpleEscrow.json';
import { Web3Storage } from 'web3.storage';

const ESCROW_CONTRACT_ADDRESS = "0xea7098b8cc404e423630edb1f4726d366b4afdae"; // Replace with actual contract address - Placeholder
const WEB3_STORAGE_TOKEN = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN || 'YOUR_WEB3_STORAGE_API_TOKEN'; // Replace with your actual API token

interface Project {
  projectId: number;
  client: string;
  freelancer: string;
  amount: string;
  descriptionCID: string;
  deliverableCID: string;
  status: number; // Enum: 0 = Created, 1 = WorkSubmitted, 2 = Completed
  createdAt: number;
  deadline: number;
  // Add job details fetched from IPFS
  title: string;
  fullDescription: string;
  budgetEth: string; // Renamed to avoid conflict with existing amount
}

interface MyPostedJobsProps {
  account: string | null;
}

const MyPostedJobs = ({ account }: MyPostedJobsProps) => {
  const [myJobs, setMyJobs] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyJobs = async () => {
    if (!account) {
      setMyJobs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      console.log("Connected network chain ID:", network.chainId);
      if (network.chainId !== 296n) { // Use 'n' for BigInt literal
        setError("Connected to incorrect network. Please switch to Chain ID 296.");
        setLoading(false);
        return;
      }
      const escrowContract = new ethers.Contract(
        ESCROW_CONTRACT_ADDRESS,
        SimpleEscrowABI.abi,
        provider
      );
      
      if (!WEB3_STORAGE_TOKEN || WEB3_STORAGE_TOKEN === 'YOUR_WEB3_STORAGE_API_TOKEN') {
        alert("Please set your NEXT_PUBLIC_WEB3_STORAGE_TOKEN environment variable.");
        console.error("Web3.Storage API token is not set.");
        setLoading(false);
        return;
      }
      const web3StorageClient = new Web3Storage({ token: WEB3_STORAGE_TOKEN });

      const projectCount = await escrowContract.projectCount();
      const fetchedJobs: Project[] = [];

      for (let i = 0; i < projectCount; i++) {
        const project = await escrowContract.getProject(i);
        if (project.client.toLowerCase() === account.toLowerCase()) {
          // Fetch job details from IPFS
          let jobDetails = { title: 'N/A', description: 'N/A', budget: 'N/A' };
          if (project.descriptionCID) {
            try {
              const res = await web3StorageClient.get(project.descriptionCID);
              if (res && res.ok) {
                const files = await res.files();
                if (files.length > 0) {
                  const file = files[0];
                  const content = await file.text();
                  jobDetails = JSON.parse(content);
                }
              }
            } catch (ipfsError) {
              console.error("Error fetching job details from IPFS:", ipfsError);
            }
          }

          fetchedJobs.push({
            projectId: i,
            client: project.client,
            freelancer: project.freelancer,
            amount: ethers.formatEther(project.amount), 
            descriptionCID: project.descriptionCID,
            deliverableCID: project.deliverableCID,
            status: project.status,
            createdAt: Number(project.createdAt),
            deadline: Number(project.deadline),
            // Populate with data fetched from IPFS
            title: jobDetails.title,
            fullDescription: jobDetails.description,
            budgetEth: jobDetails.budget, 
          });
        }
      }
      setMyJobs(fetchedJobs);
    } catch (err: any) {
      console.error("Error fetching my jobs:", err);
      setError("Failed to fetch jobs: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, [account]);

  const handleApproveWork = async (projectId: number) => {
    if (!account) {
      alert("Please connect your wallet to approve work!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const escrowContract = new ethers.Contract(
        ESCROW_CONTRACT_ADDRESS,
        SimpleEscrowABI.abi,
        signer
      );
      const tx = await escrowContract.approveWork(projectId);
      await tx.wait();
      alert("Work approved successfully!");
      fetchMyJobs(); // Refresh the list of jobs
    } catch (err: any) {
      console.error("Error approving work:", err);
      alert("Error approving work: " + err.message);
    }
  };

  if (loading) return <p>Loading your posted jobs...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (myJobs.length === 0) return <p>No jobs posted by you yet.</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">My Posted Jobs</h3>
      {myJobs.map((job) => (
        <div key={job.projectId} className="bg-white shadow-md rounded-lg p-4">
          <h4 className="text-lg font-semibold">{job.title}</h4> 
          <p>Description: {job.fullDescription.substring(0, 100)}...</p>
          <p>Freelancer: {job.freelancer.substring(0, 6)}...</p>
          <p>Budget: {job.budgetEth} ETH</p>
          <p>Status: {job.status === 0 ? 'Created' : job.status === 1 ? 'Work Submitted' : 'Completed'}</p>
          {job.status === 1 && (
            <button
              onClick={() => handleApproveWork(job.projectId)}
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
            >
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyPostedJobs;
