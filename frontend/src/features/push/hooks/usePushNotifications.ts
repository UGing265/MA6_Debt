"use client";

import { useCallback, useEffect, useState } from "react";
import { getPushPublicKey, sendTestPush, subscribeToPush, unsubscribeFromPush } from "../api/pushApi";

const serviceWorkerPath = "/sw.js";

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
};

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    setIsSupported(supported);

    if (!supported) {
      return;
    }

    setPermission(Notification.permission);

    navigator.serviceWorker.register(serviceWorkerPath).then(async (registration) => {
      const existingSubscription = await registration.pushManager.getSubscription();
      setIsSubscribed(Boolean(existingSubscription));
    });
  }, []);

  const enable = useCallback(async () => {
    setIsBusy(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const nextPermission = await Notification.requestPermission();
      setPermission(nextPermission);

      if (nextPermission !== "granted") {
        return false;
      }

      const publicKey = await getPushPublicKey();
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      await subscribeToPush(subscription);
      setIsSubscribed(true);
      return true;
    } finally {
      setIsBusy(false);
    }
  }, []);

  const disable = useCallback(async () => {
    setIsBusy(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        setIsSubscribed(false);
        return;
      }

      await unsubscribeFromPush(subscription.endpoint);
      await subscription.unsubscribe();
      setIsSubscribed(false);
    } finally {
      setIsBusy(false);
    }
  }, []);

  const sendTest = useCallback(async () => {
    setIsBusy(true);
    try {
      await sendTestPush();
    } finally {
      setIsBusy(false);
    }
  }, []);

  return {
    disable,
    enable,
    isBusy,
    isSubscribed,
    isSupported,
    permission,
    sendTest,
  };
};
