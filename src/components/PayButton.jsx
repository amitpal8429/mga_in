import { useState } from "react";

// Payment API lives in the mga-payment-api WordPress plugin.
const PAY_API = "https://medicalglobalacademy.com/wp-json/mga-payment/v1";

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

async function post(path, payload) {
  const res = await fetch(`${PAY_API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
}

export default function PayButton({
  amount = 0, // ignored by the server (price comes from the plugin list); kept for test mode
  course = "",
  name = "",
  email = "",
  phone = "",
  label = "Enroll & Pay Now",
  className = "",
  buttonStyle = {},
  hoverBg = "#1867a8",
  validate, // optional: () => "error message" or "" when OK
  onSuccess, // called after the backend verifies the payment
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setError("");

    if (validate) {
      const msg = validate();
      if (msg) {
        setError(msg);
        return;
      }
    }

    setLoading(true);

    try {
      const ok = await loadRazorpay();
      if (!ok) throw new Error("Could not load payment window. Check your internet.");

      // 1. Backend creates the order (secret key stays on the server)
      const order = await post("/create-order", { amount, course, name, email, phone });

      // 2. Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "Medical Global Academy",
        description: course || "Course enrollment",
        prefill: { name, email, contact: phone },
        theme: { color: "#1a7fd4" },
        handler: async (response) => {
          setError("");
          try {
            // 3. Backend verifies the signature
            await post("/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            onSuccess?.(response);
          } catch (err) {
            setError(
              err.message ||
                "Payment done but verification failed. Please contact support."
            );
          } finally {
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      });

      rzp.on("payment.failed", (r) => {
        setError(r?.error?.description || "Payment failed. Please try again.");
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className={className}
        style={{
          ...buttonStyle,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : buttonStyle.cursor || "pointer",
        }}
        onClick={handlePay}
        disabled={loading}
        onMouseEnter={(e) => {
          if (buttonStyle?.backgroundColor) {
            e.currentTarget.style.backgroundColor = hoverBg;
          }
        }}
        onMouseLeave={(e) => {
          if (buttonStyle?.backgroundColor) {
            e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor;
          }
        }}
      >
        {loading ? "Please wait..." : label}
      </button>

      {error && (
        <p style={{ color: "#dc2626", marginTop: 8, fontSize: 14 }}>{error}</p>
      )}
    </div>
  );
}