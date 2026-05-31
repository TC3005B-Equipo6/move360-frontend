import { useEffect, useState } from "react";
import { getProfile, type UserProfile } from "./authService";

// Shared promise so all mounted screens issue at most one network request.
// Set to null to allow a retry (e.g. on error or after logout).
let shared: Promise<UserProfile> | null = null;
let cachedProfile: UserProfile | null = null;

/** Call this on logout so the next navigation fetches fresh profile data. */
export function clearProfileCache(): void {
  shared = null;
  cachedProfile = null;
}

export function displayName(profile: UserProfile | null): string {
  if (!profile) return "Usuario";
  return [profile.firstName, profile.surname, profile.maternalSurname]
    .filter(Boolean)
    .join(" ") || "Usuario";
}

export function useProfile(): { profile: UserProfile | null; isLoading: boolean } {
  const [profile, setProfile] = useState<UserProfile | null>(cachedProfile);
  const [isLoading, setIsLoading] = useState(!cachedProfile);

  useEffect(() => {
    let active = true;

    if (!shared) {
      shared = getProfile();
    }

    shared
      .then((data) => {
        cachedProfile = data;
        if (active) {
          setProfile(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        console.error("[useProfile] GET /auth/profile failed:", err);
        shared = null; // allow retry on next mount
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { profile, isLoading };
}
