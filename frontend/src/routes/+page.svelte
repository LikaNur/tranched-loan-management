<script lang="ts">
	import { onMount } from 'svelte';
	import { client } from '$lib/core/client';
	import type { Loan } from '$lib/types/loan';
	import LoanTable from '$lib/components/LoanTable.svelte';

	let inactiveLoans = $state<Loan[]>([]);
	let activeLoans = $state<Loan[]>([]);
	let inactiveCount = $state(0);
	let activeCount = $state(0);
	let selectedIds = $state(new Set<number>());
	let selectedCount = $derived(selectedIds.size);

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

	function toggleSelection(id: number) {
		if (selectedIds.has(id)) {
			selectedIds.delete(id);
		} else {
			selectedIds.add(id);
		}
		selectedIds = new Set(selectedIds);
	}

	async function moveSelected() {
		if (selectedIds.size === 0) return;

		const idsToMove = Array.from(selectedIds);
		console.log('Moving loans:', idsToMove);

		for (const id of idsToMove) {
			try {
				await client.moveLoanToActive.mutate(id);
				console.log(`Loan ${id} moved successfully`);
			} catch (error) {
				console.error(`Failed to move loan ${id}:`, error);
			}
		}

		selectedIds = new Set();
		await loadData();
	}

	onMount(async () => {
		await loadData();
	});
</script>

<main class="p-8">
	<h1 class="mb-8 text-3xl font-bold">Loan Management</h1>

	<div class="mb-8">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-2xl">Inactive Loans ({inactiveCount})</h2>
			<button
				disabled={selectedCount === 0}
				onclick={moveSelected}
				class="rounded bg-blue-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50 hover:bg-blue-600"
			>
				Move {selectedCount > 0 ? selectedCount : ''} to Active
			</button>
		</div>
		<LoanTable
			loans={inactiveLoans}
			selectable={true}
			{selectedIds}
			{toggleSelection}
		/>
	</div>

	<div>
		<h2 class="mb-4 text-2xl">Active Loans ({activeCount})</h2>
		<LoanTable loans={activeLoans} />
	</div>
</main>