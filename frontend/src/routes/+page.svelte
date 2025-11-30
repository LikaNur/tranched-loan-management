<script lang="ts">
	import { onMount } from 'svelte';
	import { client } from '$lib/core/client';
	import type { Loan } from '$lib/types/loan';
	import LoanTable from '$lib/components/LoanTable.svelte';

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
	<h1 class="mb-8 text-3xl font-bold">Loan Management</h1>

	<div class="mb-8">
		<h2 class="mb-4 text-2xl">Inactive Loans ({inactiveCount})</h2>
        <LoanTable loans={inactiveLoans} />
	</div>

	<div>
		<h2 class="mb-4 text-2xl">Active Loans ({activeCount})</h2>
		<LoanTable loans={activeLoans} />
	</div>
</main>
