"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, QueryExecutionResult } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";
import { authService, getRegisteredAccounts } from "@/lib/auth/authService";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "info" | "success" | "warning" | "security";
  read: boolean;
}

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  switchRole: (role: UserRole) => void;
  activeQueryResult: QueryExecutionResult | null;
  setActiveQueryResult: (result: QueryExecutionResult | null) => void;
  notifications: NotificationItem[];
  unreadCount: number;
  markNotificationsAsRead: () => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  favoriteDashboardIds: string[];
  toggleFavoriteDashboard: (id: string) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; user: User }>;
  signup: (data: {
    name: string;
    email: string;
    organization: string;
    role: UserRole;
    password: string;
    confirmPassword?: string;
  }) => Promise<{ success: boolean; user: User; message: string }>;
  signOut: () => Promise<void>;
  isSupabaseAuth: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    title: "Quarterly Target Exceeded",
    description: "North America region exceeded target by 18.4% this quarter.",
    time: "10 mins ago",
    type: "success",
    read: false,
  },
  {
    id: "notif_2",
    title: "Security Shield Interception",
    description: "Blocked unauthorized table alteration attempt from external IP.",
    time: "45 mins ago",
    type: "security",
    read: false,
  },
  {
    id: "notif_3",
    title: "Executive Dashboard Shared",
    description: "Executive Summary shared with your workspace.",
    time: "2 hours ago",
    type: "info",
    read: true,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isSupabaseAuth, setIsSupabaseAuth] = useState(false);
  const [activeQueryResult, setActiveQueryResult] = useState<QueryExecutionResult | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [favoriteDashboardIds, setFavoriteDashboardIds] = useState<string[]>([
    "dash_sales_overview",
    "dash_customer_analytics",
  ]);

  // Load existing session on mount
  useEffect(() => {
    let mounted = true;

    async function checkAuthSession() {
      try {
        // 1. Check local session storage first
        const activeLocal = authService.getActiveSession();
        if (activeLocal && mounted) {
          setCurrentUser(activeLocal);
        }

        // 2. Check Supabase Auth
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          const meta = session.user.user_metadata || {};
          const matched = getRegisteredAccounts().find(
            (a) => a.email.toLowerCase() === (session.user.email || "").toLowerCase()
          );

          const syncd: User = {
            id: session.user.id,
            organizationId: meta.organization || "org_insightflow",
            name: meta.name || session.user.email?.split("@")[0] || "Active User",
            email: session.user.email || "",
            role: (meta.role as UserRole) || matched?.role || "ANALYST",
            status: "active",
            createdAt: session.user.created_at?.split("T")[0] || "2026-10-04",
          };
          setCurrentUser(syncd);
          setIsSupabaseAuth(true);
          authService.saveActiveSession(syncd);
        }
      } catch (err) {
        console.warn("Session check exception:", err);
      } finally {
        if (mounted) setAuthLoading(false);
      }
    }

    checkAuthSession();

    // Listen to Supabase auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        const matched = getRegisteredAccounts().find(
          (a) => a.email.toLowerCase() === (session.user.email || "").toLowerCase()
        );
        const syncd: User = {
          id: session.user.id,
          organizationId: meta.organization || "org_insightflow",
          name: meta.name || session.user.email?.split("@")[0] || "Active User",
          email: session.user.email || "",
          role: (meta.role as UserRole) || matched?.role || "ANALYST",
          status: "active",
          createdAt: session.user.created_at?.split("T")[0] || "2026-10-04",
        };
        setCurrentUser(syncd);
        setIsSupabaseAuth(true);
        authService.saveActiveSession(syncd);
      } else {
        setIsSupabaseAuth(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await authService.login(email, pass);
    setCurrentUser(res.user);
    return res;
  };

  const signup = async (data: {
    name: string;
    email: string;
    organization: string;
    role: UserRole;
    password: string;
    confirmPassword?: string;
  }) => {
    const res = await authService.signup(data);
    return res;
  };

  const signOut = async () => {
    await authService.logout();
    setCurrentUser(null);
    setIsSupabaseAuth(false);
  };

  const switchRole = (role: UserRole) => {
    if (!currentUser) return;
    const updated = { ...currentUser, role };
    setCurrentUser(updated);
    authService.saveActiveSession(updated);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleFavoriteDashboard = (id: string) => {
    setFavoriteDashboardIds((prev) =>
      prev.includes(id) ? prev.filter((dId) => dId !== id) : [...prev, id]
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        authLoading,
        switchRole,
        activeQueryResult,
        setActiveQueryResult,
        notifications,
        unreadCount,
        markNotificationsAsRead,
        searchOpen,
        setSearchOpen,
        favoriteDashboardIds,
        toggleFavoriteDashboard,
        login,
        signup,
        signOut,
        isSupabaseAuth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
