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

<table class="w-full border-collapse border border-gray-300">
	<thead>
		<tr class="bg-gray-100">
			{#if selectable}
				<th class="border border-gray-300 p-3 text-center">Select</th>
			{/if}
			<th class="border border-gray-300 p-3 text-left">ID</th>
			<th class="border border-gray-300 p-3 text-left">Initial Debt</th>
			<th class="border border-gray-300 p-3 text-left">Paid</th>
			<th class="border border-gray-300 p-3 text-left font-bold">Current Balance</th>
		</tr>
	</thead>
	<tbody>
		{#each loans as loan (loan.id)}
			<tr class="hover:bg-gray-50">
				{#if selectable}
					<td class="border border-gray-300 p-3 text-center">
						<input
							type="checkbox"
							checked={selectedIds?.has(loan.id) ?? false}
							onchange={() => toggleSelection?.(loan.id)}
							class="h-4 w-4 cursor-pointer"
							aria-label="Select loan {loan.id}"
						/>
					</td>
				{/if}
				<td class="border border-gray-300 p-3">{loan.id}</td>
				<td class="border border-gray-300 p-3">${loan.initialDebt.toFixed(2)}</td>
				<td class="border border-gray-300 p-3">${loan.paid.toFixed(2)}</td>
				<td class="border border-gray-300 p-3 font-bold">
					${calculateBalance(loan).toFixed(2)}
				</td>
			</tr>
		{/each}
	</tbody>
</table>

{#if loans.length === 0}
	<p class="p-4 text-center text-gray-500">No loans found</p>
{/if}