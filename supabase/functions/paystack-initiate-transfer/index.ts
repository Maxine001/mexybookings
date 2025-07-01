
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: { user } } = await supabase.auth.getUser(
      req.headers.get('Authorization')?.replace('Bearer ', '') ?? ''
    )

    if (!user) {
      return new Response('Unauthorized', { 
        status: 401, 
        headers: corsHeaders 
      })
    }

    const { recipient_code, amount, reason } = await req.json()

    // Generate unique reference
    const reference = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Get recipient details
    const { data: recipient } = await supabase
      .from('transfer_recipients')
      .select('*')
      .eq('recipient_code', recipient_code)
      .single()

    if (!recipient) {
      return new Response(JSON.stringify({ error: 'Recipient not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Create transfer record in database first
    const { data: transfer, error: insertError } = await supabase
      .from('transfers')
      .insert({
        recipient_name: recipient.name,
        recipient_email: recipient.email,
        bank_name: recipient.bank_name,
        bank_code: recipient.bank_code,
        account_number: recipient.account_number,
        amount: amount,
        reference,
        paystack_recipient_code: recipient_code,
        initiated_by: user.id,
        status: 'pending'
      })
      .select()
      .single()

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Initiate transfer on Paystack
    const paystackResponse = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'balance',
        amount: amount * 100, // Convert to kobo
        recipient: recipient_code,
        reason: reason || 'Transfer from admin panel',
        reference
      })
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      // Update transfer record with failure
      await supabase
        .from('transfers')
        .update({ 
          status: 'failed',
          failure_reason: paystackData.message 
        })
        .eq('id', transfer.id)

      return new Response(JSON.stringify({ error: paystackData.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Update transfer record with Paystack response
    const { data: updatedTransfer, error: updateError } = await supabase
      .from('transfers')
      .update({
        transfer_code: paystackData.data.transfer_code,
        status: paystackData.data.status
      })
      .eq('id', transfer.id)
      .select()
      .single()

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ data: updatedTransfer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
