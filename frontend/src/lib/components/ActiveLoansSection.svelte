<script lang="ts">
	import type { Loan } from '$lib/types/loan';
	import LoanTable from './LoanTable.svelte';

	let { loans, count } = $props<{
		loans: Loan[];
		count: number;
	}>();
</script>

<section
	aria-labelledby="active-loans-heading"
	class="rounded-xl bg-white p-4 shadow-md sm:rounded-2xl sm:p-6"
>
	<h2 id="active-loans-heading" class="mb-4 text-xl font-semibold text-gray-800 sm:text-2xl">
		Active Loans <span class="text-base text-[#94A2B8] sm:text-lg">({count})</span>
	</h2>
	<LoanTable {loans} />
</section>
