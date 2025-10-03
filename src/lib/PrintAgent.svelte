<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { agentStatus, currentJob, jobHistory, isPolling, startPolling, stopPolling, type PrintJob } from './job-queue';
  import { Toasts } from '../utils/toasts';

  onMount(() => {
    // Optionally, auto-start polling when the component mounts
    // startPolling();
  });

  onDestroy(() => {
    stopPolling();
  });
</script>

<div>
  <div class="d-flex justify-content-end align-items-center mb-4">
    <span class="badge bg-secondary me-2 text-capitalize">{$agentStatus}</span>
    {#if $isPolling}
      <button class="btn btn-danger btn-sm" on:click={stopPolling}>Stop Agent</button>
    {:else}
      <button class="btn btn-primary btn-sm" on:click={startPolling}>Start Agent</button>
    {/if}
  </div>

  {#if $currentJob}
    <div>
      <h5 class="mt-4">Processing Job</h5>
      <div class="mb-3 border rounded p-2">
        <div class="row g-0">
          <div class="col-md-3">
            <img src={$currentJob.image_data} class="img-fluid rounded-start" alt="Label preview">
          </div>
          <div class="col-md-9">
            <div class="ps-2">
              <p class="mb-1"><strong>ID:</strong> {$currentJob.id}</p>
              <p class="mb-1"><strong>Printer:</strong> {$currentJob.printer_model} ({$currentJob.printer_address})</p>
              <p class="mb-1"><strong>Status:</strong> <span class="badge bg-info">{$currentJob.status}</span></p>
              <p class="mb-1"><strong>Density:</strong> {$currentJob.print_settings?.density || 'default'}</p>
              <p class="mb-1"><strong>Quantity:</strong> {$currentJob.print_settings?.quantity || 'default'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <div>
    <h5 class="mt-4 mb-3">Job History</h5>
    {#if $jobHistory.length > 0}
      <ul class="list-group">
        {#each $jobHistory as job (job.id)}
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <p class="mb-1"><strong>ID:</strong> {job.id}</p>
              <p class="mb-0 text-muted">Printer: {job.printer_address}</p>
               {#if job.error_message}
                  <p class="mb-0 text-danger small">Error: {job.error_message}</p>
               {/if}
            </div>
            <span class="badge {job.status === 'completed' ? 'bg-success' : 'bg-danger'}">{job.status}</span>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-muted">No jobs processed yet.</p>
    {/if}
  </div>
</div>