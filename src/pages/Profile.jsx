import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import ProtectedRoute from '../components/ProtectedRoute';

function ProfileContent() {
  const { user, isProvider } = useAuth();
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchSubscription();
  }, []);

  const fetchProfile = async () => {
    if (!isProvider) {
      setLoading(false);
      return;
    }
    try {
      const response = await api.get('/provider_profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      const response = await api.get('/subscriptions/current');
      setSubscription(response.data);
    } catch (error) {
      // No subscription is okay
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Email:</span> {user?.email}</p>
          <p><span className="font-medium">Role:</span> {user?.role}</p>
        </div>
      </div>

      {isProvider && (
        <>
          {profile ? (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Provider Profile</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {profile.full_name}</p>
                <p><span className="font-medium">CNIC:</span> {profile.cnic_number}</p>
                <p><span className="font-medium">Skills:</span> {profile.skills}</p>
                <p><span className="font-medium">Experience:</span> {profile.experience}</p>
                <p><span className="font-medium">Service Areas:</span> {profile.service_areas}</p>
                <p>
                  <span className="font-medium">Verification Status:</span>{' '}
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    profile.verification_status === 'approved' ? 'bg-green-100 text-green-800' :
                    profile.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {profile.verification_status}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <p className="text-gray-600 mb-4">You haven't completed your provider profile yet.</p>
              <a
                href="/provider/onboarding"
                className="inline-block px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Complete Profile
              </a>
            </div>
          )}

          {subscription && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Subscription</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Plan:</span>{' '}
                  <span className="capitalize">{subscription.plan_type}</span>
                </p>
                <p>
                  <span className="font-medium">Status:</span>{' '}
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {subscription.status}
                  </span>
                </p>
                {subscription.end_date && (
                  <p>
                    <span className="font-medium">Expires:</span>{' '}
                    {new Date(subscription.end_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

