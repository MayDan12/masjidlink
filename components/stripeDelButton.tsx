import React from "react";

export default function StripeDelButton({ accountId }: { accountId: string }) {
  async function deleteAccount(accountId: string) {
    try {
      const res = await fetch("/api/stripe/delete", {
        method: "DELETE",
        body: JSON.stringify({ accountId }),
      });
      const data = await res.json();
      if (data.success) {
        console.log(`Account ${accountId} deleted successfully`);
      } else {
        console.error(`Error deleting account ${accountId}: ${data.error}`);
      }
    } catch (error) {
      console.error(`Error deleting account ${accountId}:`, error);
    }
  }
  return (
    <div>
      <button onClick={() => deleteAccount(accountId)}>Delete Account</button>
    </div>
  );
}
