import { writable, get } from 'svelte/store';
import { Toasts } from '../utils/toasts';
import { initClient, printerClient } from '../stores';
import type { ConnectionType } from '../types';
import { ImageEncoder, type EncodedImage, type NiimbotAbstractClient } from '@mmote/niimbluelib';

const API_BASE = '/functions/v1';

export interface PrintJob {
  id: string;
  created_at: string;
  printer_address: string;
  printer_type: ConnectionType;
  printer_model: string;
  image_data: string;
  print_settings: {
    density?: number;
    quantity?: number;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  error_message?: string;
}

export const currentJob = writable<PrintJob | null>(null);
export const jobHistory = writable<PrintJob[]>([]);
export const agentStatus = writable<'idle' | 'polling' | 'processing'>('idle');
export const isPolling = writable<boolean>(false);

let pollingInterval: any; // Use 'any' to avoid setInterval return type issues (Node vs. Browser)

async function fetchPendingJob(): Promise<PrintJob | null> {
  try {
    const response = await fetch(`${API_BASE}/get-print-jobs?status=pending&limit=1`);
    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    }
    const data = await response.json();
    return data.jobs && data.jobs.length > 0 ? data.jobs[0] : null;
  } catch (error: any) {
    Toasts.error(error.message);
    return null;
  }
}

async function updateJobStatus(id: string, status: PrintJob['status'], errorMessage: string | null = null) {
  try {
    const response = await fetch(`${API_BASE}/update-print-job`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, errorMessage }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update job status: ${response.statusText}`);
    }
  } catch (error: any) {
    Toasts.error(error.message);
  }
}

async function processNextJob() {
  if (get(agentStatus) !== 'idle') return;

  agentStatus.set('polling');
  const job = await fetchPendingJob();

  if (!get(isPolling)) {
    agentStatus.set('idle');
    return;
  }

  agentStatus.set('idle');

  if (!job) {
    return;
  }

  agentStatus.set('processing');
  currentJob.set(job);
  await updateJobStatus(job.id, 'processing');

  let client: NiimbotAbstractClient | undefined;

  try {
    initClient(job.printer_type);
    client = get(printerClient);
    if (!client) {
        throw new Error('Printer client not initialized');
    }

    // The connect method for bluetooth/serial will show a popup if no device is selected
    await client.connect();

    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = job.image_data;
    });

    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    ctx.drawImage(image, 0, 0);

    const encodedImage: EncodedImage = ImageEncoder.encodeCanvas(canvas, 'left');

    const printTask = client.abstraction.newPrintTask('D110', {
      density: job.print_settings?.density || 3,
    });

    await printTask.printInit();
    await printTask.printPage(encodedImage, job.print_settings?.quantity || 1);
    await printTask.waitForFinished();
    await printTask.printEnd();

    await updateJobStatus(job.id, 'completed');
    Toasts.message(`Job ${job.id} completed.`);
    jobHistory.update(history => [{ ...job, status: 'completed' }, ...history]);
  } catch (e: any) {
    await updateJobStatus(job.id, 'failed', e.message);
    Toasts.error(`Job ${job.id} failed: ${e.message}`);
    jobHistory.update(history => [{ ...job, status: 'failed', error_message: e.message }, ...history]);
  } finally {
    if (client && client.isConnected()) {
        await client.disconnect();
    }
    currentJob.set(null);
    agentStatus.set('idle');
  }
}

export function startPolling() {
  if (get(isPolling)) return;
  isPolling.set(true);
  Toasts.message('Print agent started.');
  pollingInterval = setInterval(processNextJob, 5000);
  processNextJob();
}

export function stopPolling() {
  if (!get(isPolling)) return;
  isPolling.set(false);
  Toasts.message('Print agent stopped.');
  clearInterval(pollingInterval);
}