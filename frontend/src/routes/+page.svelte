<script lang="ts">
    import { onMount } from 'svelte';
    import { client } from '$lib/core/client';
    import type { Loan } from '$lib/types/loan';
  
    let inactiveLoans = $state<Loan[]>([]);
    let activeLoans = $state<Loan[]>([]);
    let inactiveCount = $state(0);
    let activeCount = $state(0);
  
    async function loadData() {
      console.log('Loading data...');
      
      const [inactive, active, inactiveC, activeC] = await Promise.all([
        client.getInactiveLoans.query(),
        client.getActiveLoans.query(),
        client.getInactiveLoanCount.query(),
        client.getActiveLoanCount.query()
      ]);
      
      inactiveLoans = inactive;
      activeLoans = active;
      inactiveCount = inactiveC;
      activeCount = activeC;
      
      console.log('Data loaded:', { inactiveLoans, activeLoans, inactiveCount, activeCount });
    }
  
    onMount(async () => {
      await loadData();
    });
</script>

<main class="p-8">
    <h1 class="text-3xl font-bold mb-8">Loan Management</h1>
    
    <div class="mb-8">
      <h2 class="text-2xl mb-4">Inactive Loans ({inactiveCount})</h2>
      <p>Loaded {inactiveLoans.length} loans</p>
      <pre class="bg-gray-100 p-4 rounded mt-4 overflow-auto max-h-96">
        {JSON.stringify(inactiveLoans, null, 2)}
      </pre>
    </div>
    
    <div>
      <h2 class="text-2xl mb-4">Active Loans ({activeCount})</h2>
      <p>Loaded {activeLoans.length} loans</p>
      <pre class="bg-gray-100 p-4 rounded mt-4 overflow-auto max-h-96">
        {JSON.stringify(activeLoans, null, 2)}
      </pre>
    </div>
  </main>