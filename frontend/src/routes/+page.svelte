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
	let isMoving = $state(false); 

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
		if (selectedIds.size === 0 || isMoving) return;

		isMoving = true;
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
		isMoving = false;
	}

	async function retryMove(id: number) {
		if (loadingIds.has(id) || isMoving) return; 

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

<main id="main-content" class="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10" tabindex="-1">
	<div class="mx-auto max-w-7xl">
		<h1 class="mb-4 text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">Loan Management</h1>

		{#if loadError}
			<div class="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4" role="alert" aria-live="assertive">
				<p class="text-sm sm:text-base font-medium text-[#C3420D]">Error loading data</p>
				<p class="mt-1 text-xs sm:text-sm text-[#C3420D]">{loadError}</p>
				<button
					onclick={loadData}
					class="mt-2 w-full sm:w-auto rounded bg-[#C3420D] px-4 py-2 text-xs sm:text-sm text-white hover:bg-[#C3420D] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
					aria-label="Retry loading loan data"
				>
					Retry
				</button>
			</div>
		{/if}

		{#if isLoading && inactiveLoans.length === 0 && activeLoans.length === 0}
			<div
				class="mb-6 sm:mb-8 flex flex-col items-center justify-center rounded-xl bg-white p-6 sm:p-8 md:p-12 shadow-md"
				role="status"
				aria-live="polite"
				aria-busy="true"
			>
				<div aria-hidden="true">
					<LoadingSpinner size="lg" class="mb-4 text-[#1E4ED8]" />
				</div>
				<p class="text-base sm:text-lg font-medium text-gray-700">Loading loans...</p>
				<p class="mt-2 text-xs sm:text-sm text-gray-500">Please wait while we fetch your data</p>
			</div>
		{:else}
			<section
				aria-labelledby="inactive-loans-heading"
				class="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-md"
			>
				<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<h2 id="inactive-loans-heading" class="text-xl sm:text-2xl font-semibold text-gray-800">
						Inactive Loans <span class="text-base sm:text-lg text-[#94A2B8]">({inactiveCount})</span>
					</h2>
					<button
						onclick={() => selectedCount > 0 && !isMoving && moveSelected()}
						disabled={selectedCount === 0 || isMoving}
						aria-label="Move {selectedCount} selected loan{selectedCount !== 1
							? 's'
							: ''} to active"
						aria-describedby="move-button-description"
						class="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-3xl bg-gray-950 px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-medium text-white shadow-md transition-colors hover:bg-gray-800 hover:shadow-lg focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-85 disabled:focus:ring-0"
					>
						<span class="whitespace-nowrap">Move {selectedCount > 0 ? selectedCount : ''} to Active</span>
						<span aria-hidden="true">
							<ArrowRightIcon
								class="h-4 w-4 sm:h-5 sm:w-5 transition-transform {selectedCount > 0
									? 'group-hover:translate-x-1'
									: ''}"
							/>
						</span>
					</button>
					<span id="move-button-description" class="sr-only">
						{selectedCount === 0
							? 'Select loans from the table below to enable this button'
							: `Currently {selectedCount} loan{selectedCount !== 1 ? 's' : ''} selected`}
					</span>
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

			<section aria-labelledby="active-loans-heading" class="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-md">
				<h2 id="active-loans-heading" class="mb-4 text-xl sm:text-2xl font-semibold text-gray-800">
					Active Loans <span class="text-base sm:text-lg text-[#94A2B8]">({activeCount})</span>
				</h2>
				<LoanTable loans={activeLoans} />
			</section>
		{/if}
	</div>
</main>
