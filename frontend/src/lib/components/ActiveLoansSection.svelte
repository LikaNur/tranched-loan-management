<script lang="ts">
	import type { Loan } from '$lib/types/loan';
	import LoanTable from './LoanTable.svelte';

	let { loans, count } = $props<{
		loans: Loan[];
		count: number;
	}>();
</script>

<section aria-labelledby="active-loans-heading" class="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-md">
	<h2 id="active-loans-heading" class="mb-4 text-xl sm:text-2xl font-semibold text-gray-800">
		Active Loans <span class="text-base sm:text-lg text-[#94A2B8]">({count})</span>
	</h2>
	<LoanTable loans={loans} />
</section>

