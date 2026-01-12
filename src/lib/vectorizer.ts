import type { AccountStatus, Credentials, VectorizeOptions, VectorizeResult } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const API_BASE = import.meta.env.VITE_API_BASE || (SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/vectorizer-proxy` : '/api');

function getAuthHeader(credentials: Credentials): string {
  return 'Basic ' + btoa(`${credentials.apiId}:${credentials.apiSecret}`);
}

export async function getAccountStatus(credentials: Credentials): Promise<AccountStatus | null> {
  try {
    const response = await fetch(`${API_BASE}/account`, {
      headers: {
        'Authorization': getAuthHeader(credentials),
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      subscriptionPlan: data.subscriptionPlan || 'none',
      subscriptionState: data.subscriptionState || 'ended',
      credits: parseFloat(data.credits) || 0,
    };
  } catch {
    return null;
  }
}

export async function vectorizeImage(
  credentials: Credentials,
  image: File | string,
  options: VectorizeOptions
): Promise<VectorizeResult> {
  const formData = new FormData();

  if (typeof image === 'string') {
    formData.append('image.url', image);
  } else {
    formData.append('image', image);
  }

  formData.append('mode', options.mode);
  formData.append('output.file_format', options.outputFormat);

  const response = await fetch(`${API_BASE}/vectorize`, {
    method: 'POST',
    headers: {
      'Authorization': getAuthHeader(credentials),
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || `Erro ${response.status}: ${response.statusText}`);
  }

  return {
    content: data.content,
    format: options.outputFormat,
    creditsCharged: parseFloat(data.creditsCharged) || 0,
    creditsCalculated: parseFloat(data.creditsCalculated) || 0,
  };
}
