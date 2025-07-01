
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('x-paystack-signature')
    const body = await req.text()
    
    // Verify webhook signature
    const hash = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(Deno.env.get('PAYSTACK_SECRET_KEY') || ''),
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign']
    )
    
    const expectedSignature = Array.from(
      new Uint8Array(
        await crypto.subtle.sign('HMAC', hash, new TextEncoder().encode(body))
      )
    ).map(b => b.toString(16).padStart(2, '0')).join('')

    if (signature !== expectedSignature) {
      return new Response('Invalid signature', { 
        status: 401, 
        headers: corsHeaders 
      })
    }

    const event = JSON.parse(body)

    if (event.event === 'transfer.success' || event.event === 'transfer.failed') {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const transferData = event.data
      const status = event.event === 'transfer.success' ? 'success' : 'failed'

      await supabase
        .from('transfers')
        .update({
          status,
          completed_at: new Date().toISOString(),
          failure_reason: transferData.failure_reason || null
        })
        .eq('reference', transferData.reference)
    }

    return new Response('OK', {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Error processing webhook', {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    })
  }
})
