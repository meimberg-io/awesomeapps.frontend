'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { Member } from '@/types/member';
import { Service } from '@/types/service';
import * as StrapiAPI from '@/lib/api/strapi-api';

interface MemberContextType {
  member: Member | null;
  favorites: Service[];
  loading: boolean;
  addFavorite: (serviceId: number) => Promise<void>;
  removeFavorite: (serviceId: number) => Promise<void>;
  isFavorite: (serviceId: number) => boolean;
  updateProfile: (data: { username?: string; displayName?: string; bio?: string }) => Promise<void>;
  refreshMember: () => Promise<void>;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export function MemberProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [member, setMember] = useState<Member | null>(null);
  const [favorites, setFavorites] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMemberData = async () => {
    if (status === 'authenticated' && session?.strapiJwt && session?.memberId) {
      try {
        setLoading(true);
        const profileData = await StrapiAPI.getMemberProfile(session.memberId, session.strapiJwt);
        setMember(profileData.data as any);
        
        const favoritesData = await StrapiAPI.getFavorites(session.memberId, session.strapiJwt);
        setFavorites(favoritesData.data);
      } catch (error) {
        console.error('Failed to fetch member data:', error);
      } finally {
        setLoading(false);
      }
    } else if (status === 'unauthenticated') {
      setMember(null);
      setFavorites([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberData();
  }, [status, session?.memberId]);

  const addFavorite = async (serviceDocumentId: string) => {
    if (!session?.strapiJwt || !session?.memberId) {
      throw new Error('Not authenticated');
    }

    await StrapiAPI.addFavorite(session.memberId, serviceDocumentId, session.strapiJwt);
    
    // Refresh favorites
    const favoritesData = await StrapiAPI.getFavorites(session.memberId, session.strapiJwt);
    setFavorites(favoritesData.data);
  };

  const removeFavorite = async (serviceDocumentId: string) => {
    if (!session?.strapiJwt || !session?.memberId) {
      throw new Error('Not authenticated');
    }

    await StrapiAPI.removeFavorite(session.memberId, serviceDocumentId, session.strapiJwt);
    
    // Refresh favorites
    const favoritesData = await StrapiAPI.getFavorites(session.memberId, session.strapiJwt);
    setFavorites(favoritesData.data);
  };

  const isFavorite = (serviceDocumentId: string): boolean => {
    return favorites.some(fav => fav.documentId === serviceDocumentId);
  };

  const updateProfile = async (data: { username?: string; displayName?: string; bio?: string }) => {
    if (!session?.strapiJwt || !session?.memberId) {
      throw new Error('Not authenticated');
    }

    const result = await StrapiAPI.updateMemberProfile(session.memberId, data, session.strapiJwt);
    setMember(result.data);
  };

  const refreshMember = async () => {
    await fetchMemberData();
  };

  return (
    <MemberContext.Provider
      value={{
        member,
        favorites,
        loading,
        addFavorite,
        removeFavorite,
        isFavorite,
        updateProfile,
        refreshMember,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
}

export function useMember() {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error('useMember must be used within a MemberProvider');
  }
  return context;
}

