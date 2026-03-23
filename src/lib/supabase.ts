import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const normalizeUrl = (url: string) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  // If it looks like a Supabase project ID (20 chars alphanumeric), construct the full URL
  if (/^[a-z0-9]{20}$/i.test(trimmed)) {
    return `https://${trimmed}.supabase.co`;
  }
  return trimmed;
};

const supabaseUrl = normalizeUrl(rawUrl);

const getErrorMessage = (url: string, key: string) => {
  if (!url || !key) {
    return 'Supabase configuration missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Secrets panel.';
  }
  if (url.startsWith('sb_') || url.startsWith('eyJ')) {
    return `It looks like you put your Supabase API Key into the URL field. The URL should look like "https://xyz.supabase.co" or just your project ID. Please check your Secrets panel.`;
  }
  if (!url.startsWith('http')) {
    return `Invalid Supabase URL: "${url}". It must be a full URL like https://xyz.supabase.co or a 20-character project ID.`;
  }
  return 'Supabase configuration error. Please check your URL and Anon Key.';
};

// Create a proxy to handle cases where Supabase is not configured yet
// This prevents the app from crashing on load and provides a helpful error when used
export const supabase = (supabaseUrl && supabaseUrl.startsWith('http') && supabaseAnonKey && !supabaseUrl.startsWith('sb_') && !supabaseUrl.startsWith('eyJ'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as any, {
      get: (_, prop) => {
        if (prop === 'auth') {
          return new Proxy({} as any, {
            get: (_, authProp) => {
              if (authProp === 'onAuthStateChange') return () => ({ data: { subscription: { unsubscribe: () => {} } } });
              if (authProp === 'getSession') return async () => ({ data: { session: null } });
              return () => { 
                throw new Error(getErrorMessage(supabaseUrl, supabaseAnonKey)); 
              };
            }
          });
        }
        return () => {
          throw new Error(getErrorMessage(supabaseUrl, supabaseAnonKey));
        };
      }
    });
