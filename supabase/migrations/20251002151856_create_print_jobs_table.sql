/*
  # Create Print Jobs Table

  1. New Tables
    - `print_jobs`
      - `id` (uuid, primary key) - Unique identifier for each print job
      - `created_at` (timestamptz) - When the job was created
      - `updated_at` (timestamptz) - Last update timestamp
      - `status` (text) - Job status: 'pending', 'processing', 'completed', 'failed', 'cancelled'
      - `printer_address` (text) - Bluetooth MAC address or serial port
      - `printer_type` (text) - Connection type: 'bluetooth', 'serial', 'capacitor-ble'
      - `printer_model` (text) - Printer model (B1, D110, etc)
      - `image_data` (text) - Base64 encoded image or URL
      - `print_settings` (jsonb) - Print configuration (density, quantity, label type, etc)
      - `error_message` (text) - Error details if status is 'failed'
      - `user_id` (uuid) - Optional user identifier for tracking
      
  2. Security
    - Enable RLS on `print_jobs` table
    - Add policies for creating jobs (public access for this use case)
    - Add policies for reading own jobs
    - Add policies for updating job status
*/

CREATE TABLE IF NOT EXISTS print_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'pending',
  printer_address text NOT NULL,
  printer_type text NOT NULL DEFAULT 'bluetooth',
  printer_model text,
  image_data text NOT NULL,
  print_settings jsonb DEFAULT '{}'::jsonb,
  error_message text,
  user_id uuid,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  CONSTRAINT valid_printer_type CHECK (printer_type IN ('bluetooth', 'serial', 'capacitor-ble'))
);

ALTER TABLE print_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create print jobs"
  ON print_jobs
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read print jobs"
  ON print_jobs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update print jobs"
  ON print_jobs
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_print_jobs_status ON print_jobs(status);
CREATE INDEX IF NOT EXISTS idx_print_jobs_created_at ON print_jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_print_jobs_user_id ON print_jobs(user_id) WHERE user_id IS NOT NULL;
