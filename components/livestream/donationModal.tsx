import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { auth } from "@/firebase/client";
interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  imamId?: string;
}
function DonationModal({ isOpen, onClose, imamId }: DonationModalProps) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  if (!isOpen) return null;

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    const donationAmount = parseFloat(amount);
    if (!donationAmount || donationAmount <= 0) return;

    setLoading(true);

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error("User not authenticated");
      }
      // 1. Call backend to create PaymentIntent
      const res = await fetch("/api/create-donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imamId,
          token,
          amount: donationAmount,
          message,
        }),
      });
      const data = await res.json();
      if (!data.clientSecret) throw new Error("Failed to initialize payment");

      // 2. Confirm payment with Stripe
      const card = elements?.getElement(CardElement);
      if (!stripe || !card) throw new Error("Stripe not loaded");

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
        alert("Donation successful!");
        // Optional: store donation in Firestore
        await fetch("/api/store-donation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imamId,
            token,
            amount: donationAmount,
            message,
            anonymous: isAnonymous,
            paymentIntentId: result.paymentIntent.id,
            status: "succeeded",
          }),
        });
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-lg w-full max-w-md p-6 overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Send Donation</h3>

        <form onSubmit={handleDonate} className="space-y-4">
          <input
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a message (optional)"
            className="w-full p-2 border rounded"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            Donate Anonymously
          </label>

          <div className="p-2 border rounded">
            <CardElement
              options={{ hidePostalCode: true }}
              className="text-white "
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-black py-2 rounded font-medium"
            disabled={loading}
          >
            {loading ? "Processing..." : `Donate $${amount || "0"}`}
          </button>
        </form>

        <button onClick={onClose} className="mt-3 w-full py-2 border rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default DonationModal;
