"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, QueryExecutionResult } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "info" | "success" | "warning" | "security";
  read: boolean;
}

interface AppContextType {
  currentUser: User;
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
  signOut: () => Promise<void>;
  isSupabaseAuth: boolean;
}

const DEFAULT_USERS: Record<UserRole, User> = {
  ADMIN: {
    id: "usr_admin_1",
    organizationId: "org_acme_bi",
    name: "Alex Vance",
    email: "alex.vance@insightflow.ai",
    role: "ADMIN",
    status: "active",
    createdAt: "2024-01-15",
  },
  ANALYST: {
    id: "usr_analyst_2",
    organizationId: "org_acme_bi",
    name: "Elena Rostova",
    email: "elena.r@insightflow.ai",
    role: "ANALYST",
    status: "active",
    createdAt: "2024-02-10",
  },
  VIEWER: {
    id: "usr_viewer_3",
    organizationId: "org_acme_bi",
    name: "David Chen",
    email: "d.chen@insightflow.ai",
    role: "VIEWER",
    status: "active",
    createdAt: "2024-03-01",
  },
};

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
    description: "Alex Vance shared 'Executive Summary' with your workspace.",
    time: "2 hours ago",
    type: "info",
    read: true,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USERS.ADMIN);
  const [isSupabaseAuth, setIsSupabaseAuth] = useState(false);
  const [activeQueryResult, setActiveQueryResult] = useState<QueryExecutionResult | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [favoriteDashboardIds, setFavoriteDashboardIds] = useState<string[]>([
    "dash_sales_overview",
    "dash_customer_analytics",
  ]);

  // Sync Supabase Auth session on mount and changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncUserFromSupabase(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        syncUserFromSupabase(session.user);
      } else {
        setIsSupabaseAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const syncUserFromSupabase = (sbUser: any) => {
    const meta = sbUser.user_metadata || {};
    const role: UserRole = (meta.role as UserRole) || "ANALYST";
    const name: string = meta.name || sbUser.email?.split("@")[0] || "Active User";

    setCurrentUser({
      id: sbUser.id,
      organizationId: meta.organization || "org_acme_bi",
      name,
      email: sbUser.email || "",
      role,
      status: "active",
      createdAt: sbUser.created_at ? sbUser.created_at.split("T")[0] : "2026-10-04",
    });
    setIsSupabaseAuth(true);
  };

  const switchRole = (role: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role,
      name: DEFAULT_USERS[role]?.name || prev.name,
      email: DEFAULT_USERS[role]?.email || prev.email,
    }));
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(DEFAULT_USERS.ANALYST);
    setIsSupabaseAuth(false);
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
