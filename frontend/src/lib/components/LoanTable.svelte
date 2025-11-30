<script lang="ts">
	import type { Loan } from '$lib/types/loan';
	import { calculateBalance } from '$lib/types/loan';

	let {
		loans,
		selectable = false,
		selectedIds,
		toggleSelection
	} = $props<{
		loans: Loan[];
		selectable?: boolean;
		selectedIds?: Set<number>;
		toggleSelection?: (id: number) => void;
	}>();
</script>

<div class="overflow-hidden rounded-2xl border border-gray-300 shadow-sm">
	<table class="w-full border-collapse">
		<thead>
			<tr class="bg-gray-50 font-semibold text-gray-700">
				{#if selectable}
					<th class="border-b border-gray-300 px-4 py-3 text-center">Select</th>
				{/if}
				<th class="border-b border-gray-300 px-4 py-3 text-left">ID</th>
				<th class="border-b border-gray-300 px-4 py-3 text-left">Initial Debt</th>
				<th class="border-b border-gray-300 px-4 py-3 text-left">Paid</th>
				<th class="border-b border-gray-300 px-4 py-3 text-left font-bold">Current Balance</th>
			</tr>
		</thead>
		<tbody>
			{#each loans as loan (loan.id)}
				<tr class="transition-colors hover:bg-blue-50 even:bg-gray-50/30">
					{#if selectable}
						<td class="border-b border-gray-200 px-4 py-3 text-center">
						<input
							type="checkbox"
							checked={selectedIds?.has(loan.id) ?? false}
							onchange={() => toggleSelection?.(loan.id)}
							class="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#1E4ED8] focus:ring-offset-0 checked:bg-[#1E4ED8]"
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