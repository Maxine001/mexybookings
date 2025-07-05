
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const headers = req.headers
    const rawBody = await req.text()

    // Log all headers to diagnose signature issue
    console.log(headers,"Headers received:")
    for (const [key, value] of headers.entries()) {
      console.log(`${key}: ${value}`)
    }

    const signature = headers.get("x-paystack-signature")

    console.log("Raw Body:", rawBody)
    console.log("Signature:", signature)

    const body = JSON.parse(rawBody)

    const event = body?.event
    const data = body?.data

    if (!data) {
      return new Response(JSON.stringify({ error: "No data in webhook payload" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const email = data?.customer?.email || "No email"
    const amount = data?.amount || 0
    const status = data?.status || "unknown"
    const transactionId = data?.id || "No ID"
    const reference = data?.reference || null

    console.log("Event:", event)
    console.log("Transaction ID:", transactionId)
    console.log("Email:", email)
    console.log("Amount:", amount)
    console.log("Status:", status)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (status === 'success') {
      // Update booking status and add payment information
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('package_price', amount / 100)
        .eq('status', 'payment_pending')

      if (updateError) {
        console.error('Error updating booking:', updateError)
        return new Response(JSON.stringify({
          error: 'Failed to update booking status'
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          reference: reference,
          amount: amount,
          currency: data.currency,
          customer_email: email,
          status: status,
          paid_at: data.paid_at,
          channel: data.channel,
          gateway_response: data.gateway_response
        })

      if (paymentError) {
        console.error('Error creating payment record:', paymentError)
      }

      return new Response(JSON.stringify({
        success: true, 
        message: 'Payment confirmed and booking updated'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } else {
      return new Response(JSON.stringify({
        success: false,
        message: `Payment status is ${status}, no update performed`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  } catch (err) {
    console.error("Webhook Error:", err)
    return new Response("Internal Server Error", { status: 500 })
  }
})







/*

$body = '{
  "event": "charge.success",
  "data": {
    "id": 123456789,
    "status": "success",
    "reference": "ref_2435342",
    "amount": 5000,
    "currency": "NGN",
    "customer": {
      "email": "customer@example.com"
    },
    "paid_at": "2024-07-10T12:34:56.000Z",
    "channel": "card",
    "gateway_response": "Successful"
  }
}'

$headers = @{
  "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdnJ1anFqYnFldnBhbGZ6b3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMDkwMjksImV4cCI6MjA2NjU4NTAyOX0.lYqjpWhiNLR6ATmXgxvcU7lpAZxCAOOSrT-c79_vESQ"
  "Content-Type" = "application/json"
}

Invoke-WebRequest -Uri "https://ofvrujqjbqevpalfzoyh.supabase.co/functions/v1/paystack-webhook" -Method POST -Body $body -Headers $headers
*/