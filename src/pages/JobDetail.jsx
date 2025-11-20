import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isSeeker, isProvider } = useAuth();
  const [job, setJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidForm, setBidForm] = useState({
    proposed_cost: '',
    proposal_message: '',
    estimated_time: '',
  });
  const [submittingBid, setSubmittingBid] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data);
      setBids(response.data.bids || []);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setSubmittingBid(true);

    try {
      await api.post(`/bids`, {
        job_id: id,
        bid: bidForm,
      });
      setBidForm({ proposed_cost: '', proposal_message: '', estimated_time: '' });
      fetchJob();
      alert('Bid submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit bid');
    } finally {
      setSubmittingBid(false);
    }
  };

  const handleAssignProvider = async (providerId) => {
    if (!confirm('Are you sure you want to assign this provider?')) return;

    try {
      await api.post(`/jobs/${id}/assign_provider`, { provider_id: providerId });
      fetchJob();
      alert('Provider assigned successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to assign provider');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (!job) {
    return <div className="text-center py-12">Job not found</div>;
  }

  const canBid = isProvider && job.status === 'open';
  const canAssign = isSeeker && job.user_id === user?.id && job.status === 'open';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Posted by {job.user?.email} • {new Date(job.created_at).toLocaleDateString()}
            </p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded ${
            job.status === 'open' ? 'bg-green-100 text-green-800' :
            job.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {job.status}
          </span>
        </div>

        <div className="mb-4">
          <h2 className="text-sm font-medium text-gray-700 mb-1">Category</h2>
          <p className="text-gray-900">{job.category?.name}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-sm font-medium text-gray-700 mb-1">Location</h2>
          <p className="text-gray-900">{job.location}</p>
        </div>

        {job.budget && (
          <div className="mb-4">
            <h2 className="text-sm font-medium text-gray-700 mb-1">Budget</h2>
            <p className="text-gray-900">PKR {job.budget}</p>
          </div>
        )}

        <div className="mb-4">
          <h2 className="text-sm font-medium text-gray-700 mb-1">Description</h2>
          <p className="text-gray-900 whitespace-pre-wrap">{job.description}</p>
        </div>
      </div>

      {canBid && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Submit a Bid</h2>
          <form onSubmit={handleBidSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proposed Cost (PKR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={bidForm.proposed_cost}
                  onChange={(e) => setBidForm({ ...bidForm, proposed_cost: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Time
                </label>
                <input
                  type="text"
                  placeholder="e.g., 2-3 days"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={bidForm.estimated_time}
                  onChange={(e) => setBidForm({ ...bidForm, estimated_time: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proposal Message
                </label>
                <textarea
                  rows={4}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={bidForm.proposal_message}
                  onChange={(e) => setBidForm({ ...bidForm, proposal_message: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={submittingBid}
                className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {submittingBid ? 'Submitting...' : 'Submit Bid'}
              </button>
            </div>
          </form>
        </div>
      )}

      {bids.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Bids ({bids.length})
          </h2>
          <div className="space-y-4">
            {bids.map((bid) => (
              <div key={bid.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {bid.user?.provider_profile?.full_name || bid.user?.email}
                    </p>
                    <p className="text-sm text-gray-500">{bid.user?.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {bid.status}
                  </span>
                </div>
                <div className="mb-2">
                  <p className="text-lg font-semibold text-gray-900">
                    PKR {bid.proposed_cost}
                  </p>
                  <p className="text-sm text-gray-600">Estimated: {bid.estimated_time}</p>
                </div>
                <p className="text-gray-700 mb-3">{bid.proposal_message}</p>
                {canAssign && bid.status === 'pending' && (
                  <button
                    onClick={() => handleAssignProvider(bid.user_id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                  >
                    Accept Bid
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

