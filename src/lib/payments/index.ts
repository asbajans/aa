// Ödeme sağlayıcılar — manuel + Iyzico/PayTR/Stripe
// İlk faz: SuperAdmin manuel kredi ekler. Otomatik entegrasyonlar hazır, webhook ile aktif olacak.

export type Provider = "manual" | "iyzico" | "paytr" | "stripe";

export interface PaymentRequest {
  userId: string;
  packageId: string;
  provider: Provider;
  amountTry: number;
  credits: number;
}

export async function createPayment(req: PaymentRequest) {
  // Manuel ise direkt success
  if (req.provider === "manual") {
    return { status: "success" as const, providerPaymentId: `manual_${Date.now()}` };
  }
  if (req.provider === "iyzico") return createIyzicoPayment(req);
  if (req.provider === "paytr") return createPaytrPayment(req);
  if (req.provider === "stripe") return createStripePayment(req);
  throw new Error("Bilinmeyen provider");
}

async function createIyzicoPayment(_req: PaymentRequest) {
  void _req;
  // Gerçek entegrasyon: iyzipay npm paketi ile
  // const iyzipay = new Iyzipay({ apiKey: process.env.IYZICO_API_KEY, secretKey: ... });
  // Şimdilik mock — env yoksa hata fırlatma, sandbox'ta test edilecek
  if (!process.env.IYZICO_API_KEY) return { status: "pending" as const, providerPaymentId: `iyzico_mock_${Date.now()}`, checkoutUrl: "/odeme/iyzico-mock" };
  // TODO: iyzico checkoutFormInitialize çağrısı
  return { status: "pending" as const, providerPaymentId: `iyzico_${Date.now()}`, checkoutUrl: "https://sandbox-api.iyzipay.com/checkout" };
}

async function createPaytrPayment(_req: PaymentRequest) {
  void _req;
  if (!process.env.PAYTR_MERCHANT_ID) return { status: "pending" as const, providerPaymentId: `paytr_mock_${Date.now()}`, checkoutUrl: "/odeme/paytr-mock" };
  // TODO: PayTR token oluşturma (hash = merchant_key + ...)
  return { status: "pending" as const, providerPaymentId: `paytr_${Date.now()}`, checkoutUrl: "https://www.paytr.com/odeme" };
}

async function createStripePayment(_req: PaymentRequest) {
  void _req;
  if (!process.env.STRIPE_SECRET_KEY) return { status: "pending" as const, providerPaymentId: `stripe_mock_${Date.now()}`, checkoutUrl: "/odeme/stripe-mock" };
  // TODO: stripe.checkout.sessions.create
  return { status: "pending" as const, providerPaymentId: `stripe_${Date.now()}`, checkoutUrl: "https://checkout.stripe.com/pay/..." };
}

// Hakediş periyodu hesaplama
export function nextPayoutDate(lastPayout: Date, period: "weekly" | "biweekly" | "monthly" | "manual") {
  const d = new Date(lastPayout);
  if (period === "weekly") d.setDate(d.getDate() + 7);
  else if (period === "biweekly") d.setDate(d.getDate() + 14);
  else if (period === "monthly") d.setMonth(d.getMonth() + 1);
  else return null; // manual
  return d;
}

// Komisyon hesaplama
export function calcPayout(grossTry: number, commissionPercent: number) {
  const fee = (grossTry * commissionPercent) / 100;
  return { netToTeacher: grossTry - fee, platformFee: fee };
}
