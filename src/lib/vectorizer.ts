import type { AccountStatus, VectorizeOptions, VectorizeResult } from '../types';

const API_BASE = '/api';

export async function getAccountStatus(): Promise<AccountStatus | null> {
  try {
    const response = await fetch(`${API_BASE}/account`, {
      headers: {},
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
    headers: {},
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || `Erro ${response.status}: ${response.statusText}`);
  }

  return {
    content: data.content,
    contentType: data.contentType || 'application/octet-stream',
    isBase64: Boolean(data.isBase64),
    format: options.outputFormat,
    creditsCharged: parseFloat(data.creditsCharged) || 0,
    creditsCalculated: parseFloat(data.creditsCalculated) || 0,
  };
}
