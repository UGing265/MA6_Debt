"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface PrivacyContextType {
  hideAmount: boolean;
  setHideAmount: (hide: boolean) => void;
  toggleHideAmount: () => void;
  formatAmount: (amount: number, forceShow?: boolean) => string;
  tempShow: boolean;
  setTempShow: (show: boolean) => void;
}

export const PRIVACY_STORAGE_KEY = "ma6_hide_amount";

const PrivacyContext = createContext<PrivacyContextType>({
  hideAmount: false,
  setHideAmount: () => {},
  toggleHideAmount: () => {},
  formatAmount: (amount: number) => `${amount.toLocaleString("en-US")} vnd`,
  tempShow: false,
  setTempShow: () => {},
});

export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hideAmount, setHideAmountState] = useState<boolean>(false);
  const [tempShow, setTempShowState] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem(PRIVACY_STORAGE_KEY);
    if (saved !== null) {
      setHideAmountState(saved === "true");
    }

    const handleStorageChange = () => {
      const current = localStorage.getItem(PRIVACY_STORAGE_KEY);
      setHideAmountState(current === "true");
      // Synchronize tempShow global variable
      if (typeof window !== "undefined") {
        setTempShowState(!!(window as any).__ma6_temp_show);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("privacy-change", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("privacy-change", handleStorageChange);
    };
  }, []);

  const setHideAmount = (hide: boolean) => {
    setHideAmountState(hide);
    localStorage.setItem(PRIVACY_STORAGE_KEY, hide ? "true" : "false");
    window.dispatchEvent(new Event("privacy-change"));
  };

  const toggleHideAmount = () => {
    setHideAmount(!hideAmount);
  };

  const setTempShow = (show: boolean) => {
    if (typeof window !== "undefined") {
      (window as any).__ma6_temp_show = show;
    }
    setTempShowState(show);
    window.dispatchEvent(new Event("privacy-change"));
  };

  const formatAmount = (amount: number, forceShow?: boolean): string => {
    if (tempShow) {
      return `${amount.toLocaleString("en-US")} vnd`;
    }
    const shouldHide = forceShow !== undefined ? !forceShow : hideAmount;
    if (shouldHide) {
      return "•••••• vnd";
    }
    return `${amount.toLocaleString("en-US")} vnd`;
  };

  return (
    <PrivacyContext.Provider
      value={{
        hideAmount,
        setHideAmount,
        toggleHideAmount,
        formatAmount,
        tempShow,
        setTempShow,
      }}
    >
      {children}
    </PrivacyContext.Provider>
  );
};

export const usePrivacy = () => useContext(PrivacyContext);
