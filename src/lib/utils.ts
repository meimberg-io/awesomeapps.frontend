import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBrandfetchLogoUrl(serviceUrl: string, fallback: string = "/dummy.svg"): string {
  if (!serviceUrl) return fallback;
  
  try {
    const url = new URL(serviceUrl.startsWith('http') ? serviceUrl : `https://${serviceUrl}`);
    const domain = url.hostname.replace(/^www\./, '');
    return `https://cdn.brandfetch.io/${domain}/icon/fallback/lettermark?c=1idt6X8wgatx4zJkpOO`;
  } catch {
    return fallback;
  }
}
