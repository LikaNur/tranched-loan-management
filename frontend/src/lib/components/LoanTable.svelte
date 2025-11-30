<script lang="ts">
	import type { Loan } from '$lib/types/loan';
	import { calculateBalance } from '$lib/types/loan';

	let { loans } = $props<{
		loans: Loan[];
	}>();
</script>

<table class="w-full border-collapse border border-gray-300">
	<thead>
		<tr class="bg-gray-100">
			<th class="border border-gray-300 p-3 text-left">ID</th>
			<th class="border border-gray-300 p-3 text-left">Initial Debt</th>
			<th class="border border-gray-300 p-3 text-left">Paid</th>
			<th class="border border-gray-300 p-3 text-left font-bold">Current Balance</th>
		</tr>
	</thead>
	<tbody>
		{#each loans as loan (loan.id)}
			<tr class="hover:bg-gray-50">
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
