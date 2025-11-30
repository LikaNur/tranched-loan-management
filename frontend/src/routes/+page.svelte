<script lang="ts">
	import { onMount } from 'svelte';
	import { client } from '$lib/core/client';
	import type { Loan } from '$lib/types/loan';
	import LoanTable from '$lib/components/LoanTable.svelte';
	import ArrowRightIcon from '$lib/components/icons/ArrowRightIcon.svelte';

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

<main class="min-h-screen bg-gray-50 p-10">
	<div class="mx-auto max-w-7xl">
		<h1 class="mb-8 text-4xl font-semibold text-gray-900">Loan Management</h1>

		<div class="mb-8 rounded-4xl bg-white p-6 shadow-md">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-2xl font-semibold text-gray-800">
					Inactive Loans <span class="text-lg text-gray-500">({inactiveCount})</span>
				</h2>
				<button
					onclick={() => selectedCount > 0 && moveSelected()}
					class="group flex items-center gap-2 rounded-3xl bg-gray-950 px-6 py-2.5 font-medium text-white shadow-md transition-colors {selectedCount === 0 ? 'cursor-not-allowed opacity-85' : 'hover:shadow-lg cursor-pointer hover:bg-gray-800'}"
				>
					Move {selectedCount > 0 ? selectedCount : ''} to Active
					<ArrowRightIcon
						class="h-5 w-5 transition-transform {selectedCount > 0 ? 'group-hover:translate-x-1' : ''}"
					/>
				</button>
			</div>
			<LoanTable
				loans={inactiveLoans}
				selectable={true}
				{selectedIds}
				{toggleSelection}
			/>
		</div>

		<div class="rounded-xl bg-white p-6 shadow-md">
			<h2 class="mb-4 text-2xl font-semibold text-gray-800">
				Active Loans <span class="text-lg text-gray-500">({activeCount})</span>
			</h2>
			<LoanTable loans={activeLoans} />
		</div>
	</div>
</main>