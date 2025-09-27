import React from 'react';
import JobCard from './JobCard';

const mockJobs = [
  {
    id: '1',
    title: 'Build a Decentralized Marketplace',
    description: 'I need a skilled blockchain developer to build a decentralized marketplace for digital assets. The platform should include smart contracts for escrow, secure user authentication, and a user-friendly interface. Experience with Solidity, Web3.js, and React is a must.',
    budget: 5,
  },
  {
    id: '2',
    title: 'Smart Contract Auditor Needed',
    description: 'Looking for an experienced smart contract auditor to review and secure our new DeFi protocol. The audit should cover potential vulnerabilities, gas optimizations, and adherence to best practices. A strong understanding of various attack vectors is crucial.',
    budget: 3,
  },
  {
    id: '3',
    title: 'DApp Frontend Developer',
    description: 'We are building a new dApp and need a talented frontend developer to create an intuitive and responsive user interface. The ideal candidate will have experience with Next.js, Tailwind CSS, and integrating with Web3 libraries.',
    budget: 2.5,
  },
  {
    id: '4',
    title: 'NFT Collection Creator',
    description: 'I am looking for a creative artist and blockchain enthusiast to help me design and deploy an NFT collection. This includes generating unique art, writing the smart contract for minting, and setting up a basic landing page for the collection.',
    budget: 4,
  },
];

const JobList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-4xl">
      {mockJobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobList;
