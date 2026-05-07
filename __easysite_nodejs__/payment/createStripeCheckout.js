import axios from "npm:axios@1.7.7";

const SECRETS_TABLE_ID = 82489;

async function getStripeKey() {
  // 1. Try system env var
  const systemKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (systemKey) return systemKey;

  // 2. Try database (app_secrets table)
  try {
    const { data, error } = await easysite.table.page(SECRETS_TABLE_ID, {
      PageNo: 1,
      PageSize: 1,
      Filters: [{ name: "secret_key", op: "Equal", value: "STRIPE_SECRET_KEY" }]
    });
    if (!error && data?.List?.length > 0) {
      const val = data.List[0].secret_value;
      if (val) return val;
    }
  } catch {
    // fall through
  }

  return null;
}

export async function createStripeCheckout(params) {
  const {
    amount,
    currency,
    registration_code,
    customer_email,
    description,
    success_url,
    cancel_url
  } = params || {};

  const secretKey = await getStripeKey();

  if (!secretKey) {
    throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY in Admin → Env Vars.");
  }

  if (!amount || typeof amount !== "number" || amount <= 0) {
    throw new Error("Invalid amount. Must be a positive integer in NZD cents.");
  }
  if (!currency || String(currency).toLowerCase() !== "nzd") {
    throw new Error("Invalid currency. Only 'nzd' is supported.");
  }
  if (!success_url || !cancel_url) {
    throw new Error("success_url and cancel_url are required.");
  }

  const form = new URLSearchParams();
  form.append("mode", "payment");
  form.append("payment_method_types[0]", "card");
  form.append("line_items[0][quantity]", "1");
  form.append("line_items[0][price_data][currency]", "nzd");
  form.append("line_items[0][price_data][unit_amount]", String(amount));
  form.append(
    "line_items[0][price_data][product_data][name]",
    description || "NZ Melting Pot Booking"
  );
  form.append("success_url", success_url);
  form.append("cancel_url", cancel_url);

  if (registration_code) {
    form.append("client_reference_id", String(registration_code));
  }
  if (customer_email) {
    form.append("customer_email", String(customer_email));
  }

  form.append("payment_method_options[card][request_three_d_secure]", "automatic");

  try {
    const resp = await axios.post(
      "https://api.stripe.com/v1/checkout/sessions",
      form.toString(),
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        timeout: 15000
      }
    );

    return {
      url: resp.data.url,
      session_id: resp.data.id
    };
  } catch (err) {
    const msg =
      err?.response?.data?.error?.message ||
      err?.message ||
      "Failed to create Stripe Checkout session";
    throw new Error(msg);
  }
}
