import React, { useState } from 'react';

const JobCard = ({ job }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
      <h3 className="text-xl font-bold mb-2">{job.title}</h3>
      <p className="text-gray-600 mb-2">Budget: {job.budget} ETH</p>
      {!isExpanded && (
        <p className="text-gray-700">{job.description.substring(0, 100)}...</p>
      )}
      {isExpanded && (
        <>
          <p className="text-gray-700 mb-4">{job.description}</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Apply Now
          </button>
        </>
      )}
    </div>
  );
};

export default JobCard;
