"use client";
import React, { createContext, useContext, useState } from "react";
import {
  mockUsers,
  mockStudents,
  mockTeachers,
  User,
  Student,
  Teacher,
  Secretary,
  Head,
} from "@/data/mockData";

interface AuthContextType {
  user: User | null;
  profile: Student | Teacher | Secretary | Head | null;
  login: (username: string, password: string, role: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved =
        typeof window !== "undefined"
          ? localStorage.getItem("currentUser")
          : null;
      return saved ? (JSON.parse(saved) as User) : null;
    } catch {
      return null;
    }
  });

  const [profile, setProfile] = useState<
    Student | Teacher | Secretary | Head | null
  >(() => {
    try {
      const saved =
        typeof window !== "undefined"
          ? localStorage.getItem("currentUser")
          : null;
      if (!saved) return null;
      const parsedUser = JSON.parse(saved) as User;
      if (parsedUser.role === "student") {
        return mockStudents.find((s) => s.id === parsedUser.profileId) || null;
      } else if (parsedUser.role === "teacher") {
        return mockTeachers.find((t) => t.id === parsedUser.profileId) || null;
      }
      return null;
    } catch {
      return null;
    }
  });

  const loadProfile = (user: User) => {
    if (user.role === "student") {
      const student = mockStudents.find((s) => s.id === user.profileId);
      setProfile(student || null);
    } else if (user.role === "teacher") {
      const teacher = mockTeachers.find((t) => t.id === user.profileId);
      setProfile(teacher || null);
    } else if (user.role === "secretary") {
      const staff = mockUsers.find(
        (u) => u.id === user.profileId && u.role === "secretary"
      ) as Secretary | undefined;
      setProfile(staff || null);
    } else if (user.role === "head") {
      const deptHead = mockUsers.find(
        (u) => u.id === user.profileId && u.role === "head"
      ) as Head | undefined;
      setProfile(deptHead || null);
    } else {
      setProfile(null);
    }
  };

  const login = (username: string, password: string, role: string): boolean => {
    if (role === "Sinh viên") role = "student";
    else if (role === "Giảng viên") role = "teacher";
    else if (role === "Nhân viên") role = "staff";
    const foundUser =
      role !== "staff"
        ? mockUsers.find(
            (u) =>
              u.username === username &&
              u.password === password &&
              u.role === role
          )
        : mockUsers.find(
            (u) => u.username === username && u.password === password
          );
    if (foundUser) {
      setUser(foundUser);
      loadProfile(foundUser);
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
