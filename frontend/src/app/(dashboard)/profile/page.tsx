"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { User, Mail, Lock, Save, KeyRound, Eye, EyeOff, Shield, Target } from "lucide-react";
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
import {
  getProfile,
  updateProfile,
  changePassword,
  getUserPreferences,
  updateDailySpendingLimit,
  UserProfile,
} from "@/features/user/api/userApi";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";
import { PageHeader } from "@/components/ui/page-header";
import { usePrivacy } from "@/context/PrivacyContext";

export default function ProfilePage() {
  const { hideAmount, toggleHideAmount } = usePrivacy();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dailyLimitEnabled, setDailyLimitEnabled] = useState(false);
  const [dailyLimitAmount, setDailyLimitAmount] = useState("");
  const [isSavingDailyLimit, setIsSavingDailyLimit] = useState(false);

  // Password change state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [data, preferences] = await Promise.all([getProfile(), getUserPreferences()]);
        setProfile(data);
        setUsername(data.username);
        setEmail(data.email || "");
        setDailyLimitEnabled(preferences.dailySpendingLimitEnabled);
        setDailyLimitAmount(preferences.dailySpendingLimitAmount ? String(preferences.dailySpendingLimitAmount) : "");
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

  const handleDailyLimitAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value.replace(/,/g, "").replace(/[^\d]/g, "");
    setDailyLimitAmount(raw);
  };

  const handleSaveDailyLimit = async () => {
    const amount = dailyLimitAmount ? Number(dailyLimitAmount) : null;

    if (dailyLimitEnabled && (!amount || amount <= 0)) {
      toast.error("Daily limit amount must be greater than 0");
      return;
    }

    setIsSavingDailyLimit(true);
    try {
      await updateDailySpendingLimit({
        enabled: dailyLimitEnabled,
        amount: dailyLimitEnabled ? amount : null,
      });
      toast.success("Daily spending limit updated");
    } catch (error) {
      const parsed = parseErrorResponse(error);
      toast.error(parsed.general || "Failed to update daily spending limit");
    } finally {
      setIsSavingDailyLimit(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Profile" />
        <Card className="animate-pulse h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage your account settings" />

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

        {/* Privacy & Display Card */}
        <Card className="border-note-yellow/25 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="h-5 w-5 text-note-yellow" />
              Privacy & Display Settings (Riêng tư & Hiển thị)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-gray-50 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-ink-black">Che số tiền (Hide Money Amounts)</p>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${hideAmount ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>
                    {hideAmount ? "Đang che (Hidden)" : "Đang hiện (Visible)"}
                  </span>
                </div>
                <p className="text-sm text-pencil-gray">
                  Tự động che các số dư ví, nợ và giao dịch thành dạng <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">•••••• vnd</code> trên toàn hệ thống.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button
                  variant="outline"
                  onClick={toggleHideAmount}
                  className="border-note-yellow text-ink-black hover:bg-note-yellow/20 flex items-center gap-2 cursor-pointer"
                >
                  {hideAmount ? (
                    <>
                      <Eye className="h-4 w-4 text-note-yellow" />
                      Hiện số tiền
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4 text-pencil-gray" />
                      Che số tiền
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Spending Limit Card */}
        <Card className="border-note-yellow/25 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="h-5 w-5 text-note-yellow" />
              Daily Spending Limit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-ink-black">Limit daily spending</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${dailyLimitEnabled ? "bg-green-100 text-green-800" : "bg-gray-200 text-pencil-gray"}`}>
                    {dailyLimitEnabled ? "On" : "Off"}
                  </span>
                </div>
                <p className="text-sm text-pencil-gray">
                  Dashboard will compare today&apos;s money-out transactions against this limit using Vietnam time.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDailyLimitEnabled((current) => !current)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                  dailyLimitEnabled ? "bg-note-yellow" : "bg-gray-200"
                }`}
                aria-pressed={dailyLimitEnabled}
                aria-label="Toggle daily spending limit"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    dailyLimitEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-ink-black">Daily limit amount</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={dailyLimitAmount ? Number(dailyLimitAmount).toLocaleString("en-US") : ""}
                  onChange={handleDailyLimitAmountChange}
                  disabled={!dailyLimitEnabled || isSavingDailyLimit}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 pr-14 text-sm text-ink-black outline-none transition-colors focus:border-note-yellow focus:ring-2 focus:ring-note-yellow/30 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="100,000"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-pencil-gray/80">vnd</span>
              </div>
            </div>

            <Button
              onClick={handleSaveDailyLimit}
              disabled={isSavingDailyLimit}
              className="w-full bg-note-yellow text-ink-black hover:bg-note-yellow/90"
            >
              {isSavingDailyLimit ? "Saving..." : "Save Daily Limit"}
            </Button>
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
