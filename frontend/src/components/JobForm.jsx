import React, { useState } from 'react';
import { createJob } from '../api/api';

const JobForm = ({ onJobCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    method: 'GET',
    cron: '',
    headers: '',
    body: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        headers: formData.headers ? JSON.parse(formData.headers) : {},
        body: formData.body ? JSON.parse(formData.body) : {}
      };

      await createJob(payload);
      setFormData({
        name: '',
        url: '',
        method: 'GET',
        cron: '',
        headers: '',
        body: ''
      });
      onJobCreated();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Create New Job</h3>
      
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <div className="mt-1">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="My Daily Job"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700">Cron Expression</label>
            <div className="mt-1">
              <input
                type="text"
                name="cron"
                value={formData.cron}
                onChange={handleChange}
                required
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border font-mono"
                placeholder="*/5 * * * *"
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <div className="mt-1">
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="https://api.example.com/webhook"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Method</label>
            <div className="mt-1">
              <select
                name="method"
                value={formData.method}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">Headers (JSON)</label>
            <div className="mt-1">
              <textarea
                name="headers"
                rows={2}
                value={formData.headers}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border font-mono"
                placeholder='{"Authorization": "Bearer token"}'
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">Body (JSON)</label>
            <div className="mt-1">
              <textarea
                name="body"
                rows={2}
                value={formData.body}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border font-mono"
                placeholder='{"key": "value"}'
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating...' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
