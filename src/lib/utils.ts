import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "anonymous";
  let userId = localStorage.getItem("dokterusaha_user_id");
  if (!userId) {
    userId = `usr_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    localStorage.setItem("dokterusaha_user_id", userId);
  }
  return userId;
}
