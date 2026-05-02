// Custom hook for managing SOS request state (CRUD operations)

import { useState, useCallback } from 'react';

const useRequests = (initialRequests = []) => {
  const [requests, setRequests] = useState(initialRequests);

  const addRequest = useCallback((request) => {
    const newRequest = {
      id: 'r-' + Date.now(),
      timestamp: Date.now(),
      status: 'pending',
      ...request,
    };
    setRequests((prev) => [newRequest, ...prev]);
    return newRequest;
  }, []);

  const updateRequest = useCallback((id, updates) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  }, []);

  const acceptRequest = useCallback((id, volunteerId) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'accepted', assignedVolunteer: volunteerId } : r
      )
    );
  }, []);

  const completeRequest = useCallback((id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'completed' } : r))
    );
  }, []);

  const getByStatus = useCallback(
    (status) => requests.filter((r) => r.status === status),
    [requests]
  );

  const pending = requests.filter((r) => r.status === 'pending');
  const active = requests.filter((r) => r.status === 'accepted' || r.status === 'active');
  const completed = requests.filter((r) => r.status === 'completed');

  return {
    requests,
    pending,
    active,
    completed,
    addRequest,
    updateRequest,
    acceptRequest,
    completeRequest,
    getByStatus,
  };
};

export default useRequests;
