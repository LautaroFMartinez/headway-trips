import crypto from 'crypto';

const SANDBOX_URL = 'https://sandbox-merchant.revolut.com/api';
const PROD_URL = 'https://merchant.revolut.com/api';

function getBaseUrl(): string {
  return process.env.REVOLUT_SANDBOX === 'true' ? SANDBOX_URL : PROD_URL;
}

function getHeaders(): Record<string, string> {
  return {
    'Authorization': `Bearer ${process.env.REVOLUT_SECRET_KEY}`,
    'Content-Type': 'application/json',
    'Revolut-Api-Version': '2024-09-01',
  };
}

export interface RevolutOrder {
  id: string;
  state: string;
  checkout_url: string;
}

export async function createOrder(
  amount: number,
  currency: string,
  description: string,
  redirectUrl?: string,
): Promise<RevolutOrder> {
  const body: Record<string, unknown> = {
    amount: Math.round(amount * 100), // Revolut expects minor units (cents)
    currency: currency.toUpperCase(),
    description,
  };
  if (redirectUrl) {
    body.redirect_url = redirectUrl;
  }
  const res = await fetch(`${getBaseUrl()}/orders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Revolut API error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  return {
    id: data.id,
    state: data.state,
    checkout_url: data.checkout_url,
  };
}

export async function getOrder(orderId: string): Promise<RevolutOrder & { state: string }> {
  const res = await fetch(`${getBaseUrl()}/orders/${orderId}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Revolut API error: ${res.status} - ${error}`);
  }

  return res.json();
}

export function verifyWebhookSignature(
  payload: string,
  signatureHeader: string,
  timestamp: string,
  secret: string,
): boolean {
  // Revolut signs: "v1.{timestamp}.{payload}" with HMAC-SHA256
  // Signature header may contain multiple signatures separated by commas
  const payloadToSign = `v1.${timestamp}.${payload}`;
  const expectedSignature = 'v1=' + crypto
    .createHmac('sha256', secret)
    .update(payloadToSign)
    .digest('hex');

  // Header can have multiple signatures: "v1=abc123,v1=def456"
  const signatures = signatureHeader.split(',');
  return signatures.some((sig) => {
    const trimmed = sig.trim();
    if (trimmed.length !== expectedSignature.length) return false;
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(trimmed),
    );
  });
}
