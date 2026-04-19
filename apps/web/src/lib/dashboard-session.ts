const USERNAME_STORAGE_KEY = "username";
const MERCHANT_ID_STORAGE_KEY = "merchantId";

export function buildDashboardUsername(email: string) {
  const base = email.split("@")[0]?.trim() ?? "";

  const formatted = base
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return formatted || email;
}

export function getStoredUsername() {
  if (typeof window === "undefined") {
    return "Client";
  }

  return window.localStorage.getItem(USERNAME_STORAGE_KEY) || "Client";
}

export function setStoredUsername(username: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(USERNAME_STORAGE_KEY, username);
}

export function getStoredMerchantId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(MERCHANT_ID_STORAGE_KEY);
}

export function setStoredMerchantId(merchantId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(MERCHANT_ID_STORAGE_KEY, merchantId);
}

export function clearDashboardSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(USERNAME_STORAGE_KEY);
  window.localStorage.removeItem(MERCHANT_ID_STORAGE_KEY);
}
