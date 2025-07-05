import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reference } = await req.json()

    if (!reference) {
      return new Response(JSON.stringify({ error: 'Transaction reference is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch Paystack API key from configurations table
    const { data: configData, error: configError } = await supabase
      .from('configurations')
      .select('value')
      .eq('key', 'PAYSTACK_SECRET_KEY')
      .single()

    if (configError || !configData) {
      console.error('Error fetching Paystack API key from database:', configError)
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: 'Failed to fetch Paystack API key'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const paystackApiKey = configData.value

    // Verify payment with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${paystackApiKey}`,
        'Content-Type': 'application/json',
      }
    })

    const data = await response.json()

    if (!data.status) {
      return new Response(JSON.stringify({ 
        error: 'Payment verification failed',
        message: data.message 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const paymentData = data.data

    // Check if payment was successful
    if (paymentData.status !== 'success') {
      return new Response(JSON.stringify({ 
        error: 'Payment not successful',
        status: paymentData.status 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Update booking status and add payment information
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        updated_at: new Date().toISOString()
      })
      .eq('package_price', paymentData.amount / 100) // Paystack amounts are in kobo
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
        reference: paymentData.reference,
        amount: paymentData.amount / 100,
        currency: paymentData.currency,
        customer_email: paymentData.customer.email,
        status: paymentData.status,
        paid_at: paymentData.paid_at,
        channel: paymentData.channel,
        gateway_response: paymentData.gateway_response
      })

    if (paymentError) {
      console.error('Error creating payment record:', paymentError)
    }

    return new Response(JSON.stringify({ 
      success: true,
      payment: paymentData,
      message: 'Payment verified and booking confirmed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})