import React from 'react';
import { toggleJob, deleteJob } from '../api/api';

const JobList = ({ jobs, onRefresh, onViewLogs }) => {
  const handleToggle = async (id) => {
    try {
      await toggleJob(id);
      onRefresh();
    } catch (err) {
      alert('Failed to toggle job');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await deleteJob(id);
      onRefresh();
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No jobs scheduled yet. Create one above!
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
      {jobs.map(job => (
        <div 
          key={job._id} 
          className={`relative rounded-lg border p-5 shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md ${job.active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-75'}`}
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-900 truncate pr-2" title={job.name}>
                {job.name}
              </h4>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {job.active ? 'ACTIVE' : 'PAUSED'}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-800 text-xs mr-2">
                  {job.cron}
                </span>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${
                    job.method === 'GET' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                    job.method === 'POST' ? 'border-green-200 text-green-700 bg-green-50' :
                    job.method === 'DELETE' ? 'border-red-200 text-red-700 bg-red-50' :
                    'border-yellow-200 text-yellow-700 bg-yellow-50'
                }`}>
                  {job.method}
                </span>
              </div>
              
              <div className="truncate text-xs text-gray-500" title={job.url}>
                {job.url}
              </div>

              <div className="pt-2 border-t border-gray-100 mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="block text-gray-400">Last Run</span>
                  <span className="font-medium">
                    {job.lastRunAt ? new Date(job.lastRunAt).toLocaleString() : 'Never'}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-400">Next Run</span>
                  <span className="font-medium">
                    {job.nextRunAt ? new Date(job.nextRunAt).toLocaleString() : 'Not scheduled'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex space-x-3 border-t border-gray-100 pt-4">
            <button 
              onClick={() => handleToggle(job._id)}
              className="flex-1 inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {job.active ? 'Pause' : 'Resume'}
            </button>
            <button 
              onClick={() => onViewLogs(job)}
              className="flex-1 inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Logs
            </button>
            <button 
              onClick={() => handleDelete(job._id)}
              className="flex-1 inline-flex justify-center items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobList;
