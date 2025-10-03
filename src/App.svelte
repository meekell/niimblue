<script lang="ts">
  import MainPage from "./MainPage.svelte";
  import PrintAgentPage from "./lib/PrintAgentPage.svelte";

  let component;
  if (window.location.pathname === '/agent') {
    component = PrintAgentPage;
  } else {
    component = MainPage;
  }
</script>

<svelte:component this={component} />
