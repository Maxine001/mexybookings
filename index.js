fetch("https://ofvrujqjbqevpalfzoyh.supabase.co/functions/v1/paystack-webhook", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    // Optional header — only needed if your webhook requires it:
    // "x-paystack-signature": "your_test_signature"
  },
  body: JSON.stringify({
    event: "charge.success",
    data: {
      id: 1234567890,
      status: "success",
      reference: "REF12345678",
      amount: 10000,
      currency: "NGN",
      transaction_date: "2023-06-15T14:25:33.000Z",
      customer: {
        id: 12345,
        email: "customer@example.com",
        name: "John Doe"
      }
    }
  })
})
.then(response => response.text())
.then(console.log)
.catch(console.error);
