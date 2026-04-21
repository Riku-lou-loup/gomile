import type { AuthSession } from "./auth-client";
import { refreshSession } from "./auth-client";

let cachedSession: AuthSession | null = null;
let inFlightSessionRequest: Promise<AuthSession> | null = null;

function isMerchantRole(role: string) {
  return role === "MERCHANT";
}

export function primeMerchantSession(session: AuthSession) {
  if (isMerchantRole(session.user.role)) {
    cachedSession = session;
    return;
  }

  cachedSession = null;
}

export function clearMerchantSession() {
  cachedSession = null;
  inFlightSessionRequest = null;
}

export async function getCurrentMerchantSession(): Promise<AuthSession> {
  if (cachedSession && isMerchantRole(cachedSession.user.role)) {
    return cachedSession;
  }

  if (inFlightSessionRequest) {
    return inFlightSessionRequest;
  }

  inFlightSessionRequest = refreshSession()
    .then((session) => {
      if (!isMerchantRole(session.user.role)) {
        throw new Error("La session courante n'est pas un compte marchand.");
      }

      cachedSession = session;
      return session;
    })
    .catch((error) => {
      clearMerchantSession();
      throw error;
    })
    .finally(() => {
      inFlightSessionRequest = null;
    });

  return inFlightSessionRequest;
}
