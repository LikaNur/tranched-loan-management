<script lang="ts">
	import { onMount } from 'svelte';
	import { client } from '$lib/core/client';
	import type { Loan } from '$lib/types/loan';
	import LoanTable from '$lib/components/LoanTable.svelte';
	import ArrowRightIcon from '$lib/components/icons/ArrowRightIcon.svelte';
	import LoadingSpinner from '$lib/components/icons/LoadingSpinner.svelte';

	let inactiveLoans = $state<Loan[]>([]);
	let activeLoans = $state<Loan[]>([]);
	let inactiveCount = $state(0);
	let activeCount = $state(0);
	let selectedIds = $state(new Set<number>());
	let selectedCount = $derived(selectedIds.size);
	let loadingIds = $state(new Set<number>());
	let errorIds = $state(new Map<number, string>());
	let isLoading = $state(false);
	let loadError = $state<string | null>(null);

	async function loadData() {
		console.log('Loading data...');
		isLoading = true;
		loadError = null;

		try {
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
		} catch (error: any) {
			console.error('Error loading data:', error);
			loadError =
				error?.data?.message ||
				error?.shape?.message ||
				error?.message ||
				'Failed to load data. Please check if backend is running on http://localhost:3000';
		} finally {
			isLoading = false;
		}
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
			loadingIds.add(id);
			errorIds.delete(id);
			loadingIds = new Set(loadingIds);
			errorIds = new Map(errorIds);

			try {
				await client.moveLoanToActive.mutate(id);
				console.log(`Loan ${id} moved successfully`);
				selectedIds.delete(id);
				selectedIds = new Set(selectedIds);
			} catch (error: any) {
				console.error(`Failed to move loan ${id}:`, error);
				const errorMessage =
					error?.data?.message ||
					error?.shape?.message ||
					error?.message ||
					'Internal server error. Please try again.';
				errorIds.set(id, errorMessage);
				errorIds = new Map(errorIds);
			} finally {
				loadingIds.delete(id);
				loadingIds = new Set(loadingIds);
			}
		}

		await loadData();
	}

	async function retryMove(id: number) {
		loadingIds.add(id);
		errorIds.delete(id);
		loadingIds = new Set(loadingIds);
		errorIds = new Map(errorIds);

		try {
			await client.moveLoanToActive.mutate(id);
			selectedIds.delete(id);
			selectedIds = new Set(selectedIds);
			await loadData();
		} catch (error: any) {
			const errorMessage =
				error?.data?.message ||
				error?.shape?.message ||
				error?.message ||
				'Internal server error. Please try again.';
			errorIds.set(id, errorMessage);
			errorIds = new Map(errorIds);
		} finally {
			loadingIds.delete(id);
			loadingIds = new Set(loadingIds);
		}
	}

	onMount(async () => {
		await loadData();
	});
</script>

<main class="min-h-screen bg-gray-50 p-10">
	<div class="mx-auto max-w-7xl">
		<h1 class="mb-8 text-4xl font-semibold text-gray-900">Loan Management</h1>

		{#if loadError}
			<div class="mb-4 rounded-lg border border-red-200 bg-red-50 p-4" role="alert">
				<p class="font-medium text-[#C3420D]">Error loading data</p>
				<p class="mt-1 text-sm text-[#C3420D]">{loadError}</p>
				<button
					onclick={loadData}
					class="mt-2 rounded bg-[#C3420D] px-4 py-2 text-sm text-white hover:bg-[#C3420D]"
				>
					Retry
				</button>
			</div>
		{/if}

		{#if isLoading && inactiveLoans.length === 0 && activeLoans.length === 0}
			<div
				class="mb-8 flex flex-col items-center justify-center rounded-xl bg-white p-12 shadow-md"
			>
				<LoadingSpinner size="lg" class="mb-4 text-[#1E4ED8]" />
				<p class="text-lg font-medium text-gray-700">Loading loans...</p>
				<p class="mt-2 text-sm text-gray-500">Please wait while we fetch your data</p>
			</div>
		{:else}
			<section
				aria-labelledby="inactive-loans-heading"
				class="mb-8 rounded-2xl bg-white p-6 shadow-md"
			>
				<div class="mb-4 flex items-center justify-between">
					<h2 id="inactive-loans-heading" class="text-2xl font-semibold text-gray-800">
						Inactive Loans <span class="text-lg text-[#94A2B8]">({inactiveCount})</span>
					</h2>
					<button
						onclick={() => selectedCount > 0 && moveSelected()}
						disabled={selectedCount === 0}
						aria-label="Move {selectedCount} selected loan{selectedCount !== 1
							? 's'
							: ''} to active"
						class="group flex items-center gap-2 rounded-3xl bg-gray-950 px-6 py-2.5 font-medium text-white shadow-md transition-colors hover:bg-gray-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-85"
					>
						Move {selectedCount > 0 ? selectedCount : ''} to Active
						<ArrowRightIcon
							class="h-5 w-5 transition-transform {selectedCount > 0
								? 'group-hover:translate-x-1'
								: ''}"
						/>
					</button>
				</div>
				<LoanTable
					loans={inactiveLoans}
					selectable={true}
					{selectedIds}
					{loadingIds}
					{errorIds}
					{toggleSelection}
					{retryMove}
				/>
			</section>

			<section aria-labelledby="active-loans-heading" class="rounded-xl bg-white p-6 shadow-md">
				<h2 id="active-loans-heading" class="mb-4 text-2xl font-semibold text-gray-800">
					Active Loans <span class="text-lg text-[#94A2B8]">({activeCount})</span>
				</h2>
				<LoanTable loans={activeLoans} />
			</section>
		{/if}
	</div>
</main>
