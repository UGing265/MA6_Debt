"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { User, Mail, Lock, Save, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getProfile, updateProfile, changePassword, UserProfile } from "@/features/user/api/userApi";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Password change state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setUsername(data.username);
        setEmail(data.email || "");
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        username: username.trim(),
        email: email.trim() || null,
      });
      setProfile((prev) => prev ? { ...prev, username: username.trim(), email: email.trim() || null } : null);
      toast.success("Profile updated successfully");
    } catch (error) {
      const parsed = parseErrorResponse(error);
      toast.error(parsed.general || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }
    if (!newPassword) {
      toast.error("New password is required");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword === currentPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword({
        currentPassword,
        newPassword,
      });
      toast.success("Password changed successfully");
      setIsPasswordDialogOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const parsed = parseErrorResponse(error);
      toast.error(parsed.general || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-5xl font-bold text-ink-black">Profile</h1>
        <Card className="animate-pulse h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-5xl font-bold text-ink-black">Profile</h1>
          <p className="text-pencil-gray mt-2">Manage your account settings</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Info Card */}
        <Card className="border-note-yellow/25">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-note-yellow" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-ink-black">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pencil-gray" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm text-ink-black outline-none transition-colors focus:border-note-yellow focus:ring-2 focus:ring-note-yellow/30"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-ink-black">
                Email (optional)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pencil-gray" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm text-ink-black outline-none transition-colors focus:border-note-yellow focus:ring-2 focus:ring-note-yellow/30"
                  placeholder="Enter email"
                />
              </div>
            </div>

            {profile?.createdAt && (
              <p className="text-xs text-pencil-gray">
                Member since {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            )}

            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full bg-note-yellow text-ink-black hover:bg-note-yellow/90"
            >
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="border-note-yellow/25">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lock className="h-5 w-5 text-note-yellow" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <div>
                <p className="font-medium text-ink-black">Password</p>
                <p className="text-sm text-pencil-gray">Change your password to keep your account secure</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(true)}
                className="border-note-yellow text-ink-black hover:bg-note-yellow/10"
              >
                <KeyRound className="h-4 w-4 mr-2" />
                Change
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogClose onClose={() => setIsPasswordDialogOpen(false)} />
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and a new password to update your credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-ink-black">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-ink-black outline-none transition-colors focus:border-note-yellow focus:ring-2 focus:ring-note-yellow/30"
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-ink-black">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-ink-black outline-none transition-colors focus:border-note-yellow focus:ring-2 focus:ring-note-yellow/30"
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-ink-black">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-ink-black outline-none transition-colors focus:border-note-yellow focus:ring-2 focus:ring-note-yellow/30"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPasswordDialogOpen(false)}
              disabled={isChangingPassword}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="bg-note-yellow text-ink-black hover:bg-note-yellow/90"
            >
              {isChangingPassword ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
