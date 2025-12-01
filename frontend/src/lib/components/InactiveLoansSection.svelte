<script lang="ts">
	import type { Loan } from '$lib/types/loan';
	import LoanTable from './LoanTable.svelte';
	import ArrowRightIcon from './icons/ArrowRightIcon.svelte';

	let {
		loans,
		count,
		selectedIds,
		loadingIds,
		errorIds,
		selectedCount,
		isMoving,
		toggleSelection,
		moveSelected,
		retryMove
	} = $props<{
		loans: Loan[];
		count: number;
		selectedIds: Set<number>;
		loadingIds: Set<number>;
		errorIds: Map<number, string>;
		selectedCount: number;
		isMoving: boolean;
		toggleSelection: (id: number) => void;
		moveSelected: () => void;
		retryMove: (id: number) => void;
	}>();
</script>

<section
	aria-labelledby="inactive-loans-heading"
	class="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-md"
>
	<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<h2 id="inactive-loans-heading" class="text-xl sm:text-2xl font-semibold text-gray-800">
			Inactive Loans <span class="text-base sm:text-lg text-[#94A2B8]">({count})</span>
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
		loans={loans}
		selectable={true}
		{selectedIds}
		{loadingIds}
		{errorIds}
		{toggleSelection}
		{retryMove}
	/>
</section>

