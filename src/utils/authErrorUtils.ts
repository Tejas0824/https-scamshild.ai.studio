/**
 * Utility for formatting Supabase Auth errors into clean, professional user messages
 * and managing client-side attempt rate limits to prevent duplicate API requests.
 */

export interface FormattedAuthError {
  userMessage: string;
  isRateLimit: boolean;
  isUnconfirmedEmail: boolean;
  isAlreadyRegistered: boolean;
}

const REGISTRATION_CACHE_KEY = 'scamshield_signup_attempts';

/** Check if an email was registered/requested in the last N seconds to prevent duplicate API calls */
export function isRecentSignupAttempt(email: string, windowSeconds = 60): { isRecent: boolean; remainingSeconds: number } {
  if (!email || typeof window === 'undefined') return { isRecent: false, remainingSeconds: 0 };
  
  try {
    const raw = sessionStorage.getItem(REGISTRATION_CACHE_KEY);
    if (!raw) return { isRecent: false, remainingSeconds: 0 };

    const cache = JSON.parse(raw);
    const lastTimestamp = cache[email.toLowerCase().trim()];
    if (!lastTimestamp) return { isRecent: false, remainingSeconds: 0 };

    const elapsedMs = Date.now() - lastTimestamp;
    const cooldownMs = windowSeconds * 1000;

    if (elapsedMs < cooldownMs) {
      const remaining = Math.ceil((cooldownMs - elapsedMs) / 1000);
      return { isRecent: true, remainingSeconds: remaining };
    }
  } catch {
    // SessionStorage parse safe catch
  }

  return { isRecent: false, remainingSeconds: 0 };
}

/** Record a signup attempt timestamp for an email */
export function recordSignupAttempt(email: string): void {
  if (!email || typeof window === 'undefined') return;
  try {
    const raw = sessionStorage.getItem(REGISTRATION_CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    cache[email.toLowerCase().trim()] = Date.now();
    sessionStorage.setItem(REGISTRATION_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // SessionStorage write safe catch
  }
}

/** Formats raw Supabase errors into clean, professional, non-technical notices */
export function formatAuthError(error: any): FormattedAuthError {
  if (!error) {
    return {
      userMessage: 'An unexpected authentication error occurred.',
      isRateLimit: false,
      isUnconfirmedEmail: false,
      isAlreadyRegistered: false,
    };
  }

  const rawMessage = typeof error === 'string' ? error : (error.message || '');
  const status = error.status || 0;
  const lowerMsg = rawMessage.toLowerCase();

  // Rate limit detection (HTTP 429, rate limit keywords, or email quota limits)
  if (
    status === 429 ||
    lowerMsg.includes('rate limit') ||
    lowerMsg.includes('over_email_send_rate_limit') ||
    lowerMsg.includes('too many requests')
  ) {
    return {
      userMessage: 'A verification request was recently issued. Please wait a few minutes before requesting another email.',
      isRateLimit: true,
      isUnconfirmedEmail: false,
      isAlreadyRegistered: false,
    };
  }

  // Email not confirmed
  if (lowerMsg.includes('email not confirmed')) {
    return {
      userMessage: 'Your email address has not been confirmed yet. Please check your inbox for the confirmation link.',
      isRateLimit: false,
      isUnconfirmedEmail: true,
      isAlreadyRegistered: false,
    };
  }

  // Invalid login credentials
  if (lowerMsg.includes('invalid login credentials') || lowerMsg.includes('invalid_credentials')) {
    return {
      userMessage: 'Invalid email address or password. Please verify your credentials and try again.',
      isRateLimit: false,
      isUnconfirmedEmail: false,
      isAlreadyRegistered: false,
    };
  }

  // User already registered
  if (
    lowerMsg.includes('user already registered') ||
    lowerMsg.includes('already exists') ||
    lowerMsg.includes('user_already_exists')
  ) {
    return {
      userMessage: 'An account with this email address already exists. Sign in or request password recovery.',
      isRateLimit: false,
      isUnconfirmedEmail: false,
      isAlreadyRegistered: true,
    };
  }

  // Password requirements
  if (lowerMsg.includes('password') && (lowerMsg.includes('short') || lowerMsg.includes('at least'))) {
    return {
      userMessage: 'Password must be at least 6 characters long.',
      isRateLimit: false,
      isUnconfirmedEmail: false,
      isAlreadyRegistered: false,
    };
  }

  // Fallback clean message
  return {
    userMessage: 'Unable to complete request at this time. Please check your network and try again.',
    isRateLimit: false,
    isUnconfirmedEmail: false,
    isAlreadyRegistered: false,
  };
}

/** Password strength assessment */
export function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: 'bg-slate-700' };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
  if (score <= 4) return { score: 2, label: 'Medium', color: 'bg-amber-400' };
  return { score: 3, label: 'Strong', color: 'bg-emerald-400' };
}
