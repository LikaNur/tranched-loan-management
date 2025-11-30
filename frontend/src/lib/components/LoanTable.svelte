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

<div class="overflow-hidden rounded-2xl border border-gray-300 shadow-sm">
	<table
		class="w-full border-collapse"
		role="table"
		aria-label={selectable ? 'Inactive loans table with selection' : 'Active loans table'}
		aria-describedby={selectable ? 'inactive-table-description' : 'active-table-description'}
	>
		<thead>
			<tr class="bg-gray-50 font-semibold text-gray-700">
				{#if selectable}
					<th scope="col" class="border-b border-gray-300 px-4 py-3 text-center">Select</th>
				{/if}
				<th scope="col" class="border-b border-gray-300 px-4 py-3 text-left">ID</th>
				<th scope="col" class="border-b border-gray-300 px-4 py-3 text-left">Initial Debt</th>
				<th scope="col" class="border-b border-gray-300 px-4 py-3 text-left">Paid</th>
				<th scope="col" class="border-b border-gray-300 px-4 py-3 text-left font-bold"
					>Current Balance</th
				>
				{#if selectable}
					<th scope="col" class="border-b border-gray-300 px-4 py-3 text-left w-56">Status</th>
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
						<td class="border-b border-gray-200 px-4 py-3 text-center">
							<input
								type="checkbox"
								checked={selectedIds?.has(loan.id) ?? false}
								disabled={loadingIds?.has(loan.id) ?? false}
								onchange={() => toggleSelection?.(loan.id)}
								onclick={(e) => e.stopPropagation()}
								class="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#1E4ED8] checked:bg-[#1E4ED8] focus:outline-none focus:ring-2 focus:ring-[#1E4ED8] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								aria-label="Select loan ID {loan.id} with balance ${calculateBalance(loan).toFixed(2)}"
								aria-describedby="checkbox-description-{loan.id}"
							/>
							<span id="checkbox-description-{loan.id}" class="sr-only">
								Loan ID {loan.id}, Initial debt: ${loan.initialDebt.toFixed(2)}, Paid: ${loan.paid.toFixed(2)}, Balance: ${calculateBalance(loan).toFixed(2)}
							</span>
						</td>
					{/if}
					<td class="border-b border-gray-200 px-4 py-3 font-medium" role="gridcell">
						<span aria-label="Loan ID">{loan.id}</span>
					</td>
					<td class="border-b border-gray-200 px-4 py-3" role="gridcell">
						<span aria-label="Initial debt">${loan.initialDebt.toFixed(2)}</span>
					</td>
					<td class="border-b border-gray-200 px-4 py-3" role="gridcell">
						<span aria-label="Amount paid">${loan.paid.toFixed(2)}</span>
					</td>
					<td class="border-b border-gray-200 px-4 py-3 font-semibold text-[#077757]" role="gridcell">
						<span aria-label="Current balance">${calculateBalance(loan).toFixed(2)}</span>
					</td>
					{#if selectable}
						<td class="border-b border-gray-200 px-4 py-3 min-h-12">
							<div class="flex min-h-6 items-center gap-2">
								{#if loadingIds?.has(loan.id)}
									<div class="flex items-center gap-2" role="status" aria-live="polite">
										<span aria-hidden="true">
											<LoadingSpinner size="sm" class="text-blue-600" />
										</span>
										<span class="text-sm text-blue-600">Loading...</span>
									</div>
								{:else if errorIds?.has(loan.id)}
									<div class="flex items-center gap-2">
										<span class="text-sm text-red-600" role="alert">
											{errorIds.get(loan.id)}
										</span>
										{#if retryMove}
										<button
											onclick={(e) => {
												e.stopPropagation();
												retryMove(loan.id);
											}}
											class="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
		<p class="text-lg text-gray-400">No loans found</p>
		<p class="mt-2 text-sm text-gray-500">There are no loans to display</p>
	</div>
{/if}
