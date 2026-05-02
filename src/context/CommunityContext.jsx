import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { demoCommunityList } from '../data';

const CommunityContext = createContext(null);

export const useCommunities = () => {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error('useCommunities must be used within CommunityProvider');
  return ctx;
};

export const CommunityProvider = ({ children }) => {
  const [communities, setCommunities] = useState(() => {
    const saved = localStorage.getItem('crisisconnect_communities');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return demoCommunityList;
  });

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('crisisconnect_communities', JSON.stringify(communities));
  }, [communities]);

  const createCommunity = useCallback((data) => {
    const newCommunity = {
      id: 'comm-' + Date.now(),
      status: 'active',
      createdAt: Date.now(),
      closedAt: null,
      proofPhotos: [],
      memberCount: data.members?.length || 1,
      victimsHelped: 0,
      resourceNeeds: [],
      ...data,
    };
    setCommunities(prev => [newCommunity, ...prev]);
    return newCommunity;
  }, []);

  const joinCommunity = useCallback((communityId, user) => {
    setCommunities(prev => prev.map(c => {
      if (c.id !== communityId) return c;
      const alreadyMember = c.members.some(m => m.id === user.id);
      if (alreadyMember) return c;
      return {
        ...c,
        members: [...c.members, { id: user.id, name: user.name, role: 'volunteer', phone: user.phone || '' }],
        memberCount: c.memberCount + 1,
      };
    }));
  }, []);

  const leaveCommunity = useCallback((communityId, userId) => {
    setCommunities(prev => prev.map(c => {
      if (c.id !== communityId) return c;
      return {
        ...c,
        members: c.members.filter(m => m.id !== userId),
        memberCount: Math.max(0, c.memberCount - 1),
      };
    }));
  }, []);

  const raiseResourceRequest = useCallback((communityId, resource) => {
    const newResource = {
      id: 'rn-' + Date.now(),
      fulfilled: false,
      ...resource,
    };
    setCommunities(prev => prev.map(c => {
      if (c.id !== communityId) return c;
      return {
        ...c,
        resourceNeeds: [...c.resourceNeeds, newResource],
      };
    }));
    return newResource;
  }, []);

  const fulfillResource = useCallback((communityId, resourceId) => {
    setCommunities(prev => prev.map(c => {
      if (c.id !== communityId) return c;
      return {
        ...c,
        resourceNeeds: c.resourceNeeds.map(r =>
          r.id === resourceId ? { ...r, fulfilled: true } : r
        ),
      };
    }));
  }, []);

  const closeCommunity = useCallback((communityId, proofPhotos = []) => {
    setCommunities(prev => prev.map(c => {
      if (c.id !== communityId) return c;
      return {
        ...c,
        status: 'resolved',
        closedAt: Date.now(),
        proofPhotos,
      };
    }));
  }, []);

  const getCommunity = useCallback((id) => {
    return communities.find(c => c.id === id) || null;
  }, [communities]);

  const activeCommunities = communities.filter(c => c.status === 'active');
  const resolvedCommunities = communities.filter(c => c.status === 'resolved');

  return (
    <CommunityContext.Provider value={{
      communities,
      activeCommunities,
      resolvedCommunities,
      createCommunity,
      joinCommunity,
      leaveCommunity,
      raiseResourceRequest,
      fulfillResource,
      closeCommunity,
      getCommunity,
    }}>
      {children}
    </CommunityContext.Provider>
  );
};
