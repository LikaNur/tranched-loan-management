<script lang="ts">
	import type { Loan } from '$lib/types/loan';
	import { calculateBalance } from '$lib/types/loan';
	import LoadingSpinner from './icons/LoadingSpinner.svelte';

	let {
		loans,
		selectable = false,
		selectedIds,
		loadingIds,
		errorIds,
		toggleSelection,
		retryMove
	} = $props<{
		loans: Loan[];
		selectable?: boolean;
		selectedIds?: Set<number>;
		loadingIds?: Set<number>;
		errorIds?: Map<number, string>;
		toggleSelection?: (id: number) => void;
		retryMove?: (id: number) => void;
	}>();
</script>

<div
	class="hide-scrollbar -mx-4 overflow-x-auto rounded-xl border border-gray-300 shadow-sm sm:mx-0 sm:rounded-2xl"
>
	<table
		class="w-full min-w-[640px] border-collapse"
		role="table"
		aria-label={selectable ? 'Inactive loans table with selection' : 'Active loans table'}
		aria-describedby={selectable ? 'inactive-table-description' : 'active-table-description'}
	>
		<thead>
			<tr class="bg-gray-50 font-semibold text-gray-700">
				{#if selectable}
					<th
						scope="col"
						class="border-b border-gray-300 px-2 py-2 text-center text-xs sm:px-4 sm:py-3 sm:text-sm"
						>Select</th
					>
				{/if}
				<th
					scope="col"
					class="border-b border-gray-300 px-2 py-2 text-left text-xs sm:px-4 sm:py-3 sm:text-sm"
					>ID</th
				>
				<th
					scope="col"
					class="border-b border-gray-300 px-2 py-2 text-left text-xs sm:px-4 sm:py-3 sm:text-sm"
					>Initial Debt</th
				>
				<th
					scope="col"
					class="border-b border-gray-300 px-2 py-2 text-left text-xs sm:px-4 sm:py-3 sm:text-sm"
					>Paid</th
				>
				<th
					scope="col"
					class="border-b border-gray-300 px-2 py-2 text-left text-xs font-bold sm:px-4 sm:py-3 sm:text-sm"
					>Current Balance</th
				>
				{#if selectable}
					<th
						scope="col"
						class="w-40 border-b border-gray-300 px-2 py-2 text-left text-xs sm:w-56 sm:px-4 sm:py-3 sm:text-sm"
						>Status</th
					>
				{/if}
			</tr>
		</thead>
		<tbody>
			{#each loans as loan, index (loan.id)}
				<tr
					class="transition-colors even:bg-gray-50/30 hover:bg-blue-50 {selectable
						? 'cursor-pointer focus-within:bg-blue-100'
						: ''}"
					onclick={(e) => {
						if (selectable && toggleSelection && e.target instanceof HTMLInputElement === false) {
							toggleSelection(loan.id);
						}
					}}
					role="row"
					aria-rowindex={index + 2}
					tabindex={selectable ? 0 : undefined}
					onkeydown={(e) => {
						if (selectable && (e.key === 'Enter' || e.key === ' ')) {
							e.preventDefault();
							if (toggleSelection) {
								toggleSelection(loan.id);
							}
						}
					}}
				>
					{#if selectable}
						<td class="border-b border-gray-200 px-2 py-2 text-center sm:px-4 sm:py-3">
							<input
								type="checkbox"
								checked={selectedIds?.has(loan.id) ?? false}
								disabled={loadingIds?.has(loan.id) ?? false}
								onchange={() => toggleSelection?.(loan.id)}
								onclick={(e) => e.stopPropagation()}
								class="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#1E4ED8] checked:bg-[#1E4ED8] focus:ring-2 focus:ring-[#1E4ED8] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
								aria-label="Select loan ID {loan.id} with balance ${calculateBalance(loan).toFixed(
									2
								)}"
								aria-describedby="checkbox-description-{loan.id}"
							/>
							<span id="checkbox-description-{loan.id}" class="sr-only">
								Loan ID {loan.id}, Initial debt: ${loan.initialDebt.toFixed(2)}, Paid: ${loan.paid.toFixed(
									2
								)}, Balance: ${calculateBalance(loan).toFixed(2)}
							</span>
						</td>
					{/if}
					<td
						class="border-b border-gray-200 px-2 py-2 text-xs font-medium sm:px-4 sm:py-3 sm:text-sm"
						role="gridcell"
					>
						<span aria-label="Loan ID">{loan.id}</span>
					</td>
					<td
						class="border-b border-gray-200 px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm"
						role="gridcell"
					>
						<span aria-label="Initial debt">${loan.initialDebt.toFixed(2)}</span>
					</td>
					<td
						class="border-b border-gray-200 px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm"
						role="gridcell"
					>
						<span aria-label="Amount paid">${loan.paid.toFixed(2)}</span>
					</td>
					<td
						class="border-b border-gray-200 px-2 py-2 text-xs font-semibold text-[#077757] sm:px-4 sm:py-3 sm:text-sm"
						role="gridcell"
					>
						<span aria-label="Current balance">${calculateBalance(loan).toFixed(2)}</span>
					</td>
					{#if selectable}
						<td class="min-h-10 border-b border-gray-200 px-2 py-2 sm:min-h-12 sm:px-4 sm:py-3">
							<div class="flex min-h-5 items-center gap-1 sm:min-h-6 sm:gap-2">
								{#if loadingIds?.has(loan.id)}
									<div class="flex items-center gap-1 sm:gap-2" role="status" aria-live="polite">
										<span aria-hidden="true">
											<LoadingSpinner size="sm" class="text-blue-600" />
										</span>
										<span class="text-xs text-blue-600 sm:text-sm">Loading...</span>
									</div>
								{:else if errorIds?.has(loan.id)}
									<div class="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
										<span class="text-xs text-red-600 sm:text-sm" role="alert">
											{errorIds.get(loan.id)}
										</span>
										{#if retryMove}
											<button
												onclick={(e) => {
													e.stopPropagation();
													retryMove(loan.id);
												}}
												class="rounded bg-red-600 px-2 py-1 text-xs font-medium whitespace-nowrap text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
												aria-label="Retry moving loan {loan.id} to active"
											>
												Retry
											</button>
										{/if}
									</div>
								{/if}
							</div>
						</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

{#if loans.length === 0}
	<div class="py-12 text-center" role="status" aria-live="polite">
		<div class="animate-bounce-vertical mb-4 text-6xl" aria-hidden="true">💸</div>
		<p class="text-lg text-gray-400">No loans found</p>
		<p class="mt-2 text-sm text-gray-500">There are no loans to display</p>
	</div>
{/if}
