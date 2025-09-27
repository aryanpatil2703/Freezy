"use client"
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import JobPostForm from '@/components/JobPostForm';
import JobList from '@/components/JobList';
import MyPostedJobs from '@/components/MyPostedJobs';
import ProfileForm from '@/components/ProfileForm';

export default function Home() {
  const [showJobPostForm, setShowJobPostForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting to Metamask", error);
      }
    } else {
      alert("Please install Metamask to use this dApp!");
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar account={account} connectWallet={connectWallet} onShowProfile={() => setShowProfileForm(true)} />
      <main className="container mx-auto p-4 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-1/4">
          {account && (
            <div className="space-y-4">
              <button
                onClick={() => setShowJobPostForm(true)}
                className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Post a Job
              </button>
              <MyPostedJobs account={account} />
            </div>
          )}
        </aside>
        <section className="w-full lg:w-3/4 flex justify-center">
          <JobList />
        </section>
      </main>
      {showJobPostForm && <JobPostForm onClose={() => setShowJobPostForm(false)} account={account} />}
      {showProfileForm && <ProfileForm onClose={() => setShowProfileForm(false)} account={account} />}
    </div>
  );
}
