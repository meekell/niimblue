<script lang="ts">
  import PrintAgent from './PrintAgent.svelte';
</script>

<div class="container my-2">
    <div class="card">
        <div class="card-body">
            <h1 class="card-title">Print Agent</h1>
            <p class="card-subtitle mb-2 text-muted">This page automatically processes pending print jobs from the API.</p>
            <PrintAgent />
        </div>
    </div>
</div>