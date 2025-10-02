import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface PrintJobRequest {
  printerAddress: string;
  printerType: 'bluetooth' | 'serial' | 'capacitor-ble';
  printerModel?: string;
  imageData: string;
  printSettings?: {
    density?: number;
    quantity?: number;
    labelType?: number;
    printTaskName?: string;
    threshold?: number;
    postProcess?: string;
  };
  userId?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const body: PrintJobRequest = await req.json();

    if (!body.printerAddress || !body.imageData) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: printerAddress and imageData are required',
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { data, error } = await supabase
      .from('print_jobs')
      .insert({
        printer_address: body.printerAddress,
        printer_type: body.printerType || 'bluetooth',
        printer_model: body.printerModel,
        image_data: body.imageData,
        print_settings: body.printSettings || {},
        user_id: body.userId,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create print job', details: error.message }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        jobId: data.id,
        status: data.status,
        createdAt: data.created_at,
      }),
      {
        status: 201,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});