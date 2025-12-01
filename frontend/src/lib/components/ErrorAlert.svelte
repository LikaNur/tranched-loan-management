<script lang="ts">
	let { error, onRetry } = $props<{
		error: string;
		onRetry?: () => void;
	}>();
</script>

<div class="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4" role="alert" aria-live="assertive">
	<p class="text-sm sm:text-base font-medium text-[#C3420D]">Error loading data</p>
	<p class="mt-1 text-xs sm:text-sm text-[#C3420D]">{error}</p>
	{#if onRetry}
		<button
			onclick={onRetry}
			class="mt-2 w-full sm:w-auto rounded bg-[#C3420D] px-4 py-2 text-xs sm:text-sm text-white hover:bg-[#C3420D] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
			aria-label="Retry loading loan data"
		>
			Retry
		</button>
	{/if}
</div>

