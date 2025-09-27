import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import * as ethers from 'ethers';
import SimpleEscrowABI from '../../abi/SimpleEscrow.json';
import { Web3Storage } from 'web3.storage';

const ESCROW_CONTRACT_ADDRESS = "0xea7098b8cc404e423630edb1f4726d366b4afdae"; // Replace with actual contract address - Placeholder
const WEB3_STORAGE_TOKEN = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN || 'YOUR_WEB3_STORAGE_API_TOKEN'; // Replace with your actual API token

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  // Add job details fetched from IPFS
  projectId: number;
  client: string;
  freelancer: string;
  amount: string; 
  descriptionCID: string;
  deliverableCID: string;
  status: number; // Enum: 0 = Created, 1 = WorkSubmitted, 2 = Completed
  createdAt: number;
  deadline: number;
  fullDescription: string;
  budgetEth: string; // Renamed to avoid conflict with existing budget
}

const JobList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      if (network.chainId !== 296n) {
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
      const fetchedJobs: Job[] = [];

      for (let i = 0; i < projectCount; i++) {
        const project = await escrowContract.getProject(i);
        // Only show jobs that are in 'Created' status and not yet assigned (freelancer is address(0))
        // Or, show jobs that have been created and are open for applications
        if (project.status === 0) { // Assuming 0 is 'Created' or 'Open'
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
              console.error("Error fetching job details from IPFS for JobList:", ipfsError);
            }
          }
          fetchedJobs.push({
            id: String(i), // Unique ID for React key
            title: jobDetails.title,
            description: jobDetails.description.substring(0, 100) + '...', // Short description for card
            budget: parseFloat(jobDetails.budget) || 0, // Assuming budget from IPFS is a string
            projectId: i,
            client: project.client,
            freelancer: project.freelancer,
            amount: ethers.formatEther(project.amount),
            descriptionCID: project.descriptionCID,
            deliverableCID: project.deliverableCID,
            status: project.status,
            createdAt: Number(project.createdAt),
            deadline: Number(project.deadline),
            fullDescription: jobDetails.description,
            budgetEth: jobDetails.budget,
          });
        }
      }
      setJobs(fetchedJobs);
    } catch (err: any) {
      console.error("Error fetching all jobs:", err);
      setError("Failed to fetch jobs: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []); // Empty dependency array to fetch once on component mount

  if (loading) return <p>Loading available jobs...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (jobs.length === 0) return <p>No jobs available at the moment.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-4xl">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobList;
