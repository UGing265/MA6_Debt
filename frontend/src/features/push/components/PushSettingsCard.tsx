"use client";

import { Bell, BellOff, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { parseErrorResponse } from "@/features/auth/utils/errorParser";
import { usePushNotifications } from "../hooks/usePushNotifications";

export function PushSettingsCard() {
  const { t } = useLanguage();
  const { disable, enable, isBusy, isSubscribed, isSupported, permission, sendTest } = usePushNotifications();

  const handleEnable = async () => {
    try {
      const enabled = await enable();
      if (enabled) {
        toast.success(t.profile.push.toast.enabled);
      } else {
        toast.error(t.profile.push.toast.permissionDenied);
      }
    } catch (error) {
      const parsed = parseErrorResponse(error);
      toast.error(parsed.general || t.profile.push.toast.enableFailed);
    }
  };

  const handleDisable = async () => {
    try {
      await disable();
      toast.success(t.profile.push.toast.disabled);
    } catch (error) {
      const parsed = parseErrorResponse(error);
      toast.error(parsed.general || t.profile.push.toast.disableFailed);
    }
  };

  const handleSendTest = async () => {
    try {
      await sendTest();
      toast.success(t.profile.push.toast.testSent);
    } catch (error) {
      const parsed = parseErrorResponse(error);
      toast.error(parsed.general || t.profile.push.toast.testFailed);
    }
  };

  return (
    <Card className="border-note-yellow/25 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Bell className="h-5 w-5 text-note-yellow" />
          {t.profile.push.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-ink-black">{t.profile.push.label}</p>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${isSubscribed ? "bg-green-100 text-green-800" : "bg-gray-200 text-pencil-gray"}`}>
                {isSubscribed ? t.common.on : t.common.off}
              </span>
            </div>
            <p className="text-sm text-pencil-gray">
              {isSupported ? t.profile.push.description : t.profile.push.unsupported}
            </p>
            {permission === "denied" && <p className="text-sm font-medium text-debt-red">{t.profile.push.permissionBlocked}</p>}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={isSubscribed ? handleDisable : handleEnable}
              disabled={!isSupported || isBusy || permission === "denied"}
              className="border-note-yellow text-ink-black hover:bg-note-yellow/10"
            >
              {isSubscribed ? <BellOff className="mr-2 h-4 w-4" /> : <Bell className="mr-2 h-4 w-4" />}
              {isSubscribed ? t.profile.push.disable : t.profile.push.enable}
            </Button>
            <Button
              type="button"
              onClick={handleSendTest}
              disabled={!isSubscribed || isBusy}
              className="bg-note-yellow text-ink-black hover:bg-note-yellow/90"
            >
              <Send className="mr-2 h-4 w-4" />
              {t.profile.push.sendTest}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
