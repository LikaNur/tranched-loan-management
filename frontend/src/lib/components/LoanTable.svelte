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
		aria-label={selectable ? 'Inactive loans table' : 'Active loans table'}
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
			{#each loans as loan (loan.id)}
				<tr
					class="transition-colors even:bg-gray-50/30 hover:bg-blue-50 {selectable
						? 'cursor-pointer'
						: ''}"
					onclick={(e) => {
						if (selectable && toggleSelection && e.target instanceof HTMLInputElement === false) {
							toggleSelection(loan.id);
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
								class="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#1E4ED8] checked:bg-[#1E4ED8] focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
								aria-label="Select loan {loan.id}"
							/>
						</td>
					{/if}
					<td class="border-b border-gray-200 px-4 py-3 font-medium">{loan.id}</td>
					<td class="border-b border-gray-200 px-4 py-3">${loan.initialDebt.toFixed(2)}</td>
					<td class="border-b border-gray-200 px-4 py-3">${loan.paid.toFixed(2)}</td>
					<td class="border-b border-gray-200 px-4 py-3 font-semibold text-[#077757]">
						${calculateBalance(loan).toFixed(2)}
					</td>
					{#if selectable}
						<td class="border-b border-gray-200 px-4 py-3 min-h-[3rem]">
							<div class="flex min-h-[1.5rem] items-center gap-2">
								{#if loadingIds?.has(loan.id)}
									<div class="flex items-center gap-2" role="status" aria-live="polite">
										<LoadingSpinner size="sm" class="text-blue-600" />
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
												class="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700"
												aria-label="Retry moving loan {loan.id}"
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
	<div class="py-12 text-center">
		<p class="text-lg text-gray-400">No loans found</p>
		<p class="mt-2 text-sm text-gray-500">There are no loans to display</p>
	</div>
{/if}
