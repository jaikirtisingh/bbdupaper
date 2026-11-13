import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, getProfile } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('eduvault_admin_token') || null);
  const [loading, setLoading] = useState(true);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Student local bookmarks (Zero-login required!)
  const [savedPapers, setSavedPapers] = useState(() => {
    try {
      const saved = localStorage.getItem('eduvault_saved_papers');
      return saved ? JSON.parse(saved) : ['res-dsa-pyq-2023', 'res-dsa-notes-1'];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('eduvault_saved_papers', JSON.stringify(savedPapers));
    } catch (e) {
      console.warn('Failed to persist bookmarks to local storage:', e);
    }
  }, [savedPapers]);

  useEffect(() => {
    if (token) {
      loadAdminProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadAdminProfile = async () => {
    try {
      const res = await getProfile();
      if (res.data.success && res.data.user.role === 'ADMIN') {
        setAdminUser(res.data.user);
      } else {
        adminLogout();
      }
    } catch (err) {
      adminLogout();
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email, password) => {
    const res = await loginUser({ email, password });
    if (res.data.success) {
      localStorage.setItem('eduvault_admin_token', res.data.token);
      setToken(res.data.token);
      setAdminUser(res.data.user);
      setAdminModalOpen(false);
      return res.data;
    }
    throw new Error(res.data.message || 'Admin authentication failed.');
  };

  const adminLogout = () => {
    localStorage.removeItem('eduvault_admin_token');
    setToken(null);
    setAdminUser(null);
  };

  // Student Bookmarking (Instant, Free, No Account)
  const toggleBookmarkResource = (resourceId) => {
    setSavedPapers((prev) => {
      if (prev.includes(resourceId)) {
        return prev.filter((id) => id !== resourceId);
      } else {
        return [...prev, resourceId];
      }
    });
  };

  const isBookmarked = (resourceId) => {
    return savedPapers.includes(resourceId);
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        isAdmin: !!adminUser,
        token,
        loading,
        adminLogin,
        adminLogout,
        adminModalOpen,
        openAdminModal: () => setAdminModalOpen(true),
        closeAdminModal: () => setAdminModalOpen(false),
        savedPapers,
        toggleBookmarkResource,
        isBookmarked
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
