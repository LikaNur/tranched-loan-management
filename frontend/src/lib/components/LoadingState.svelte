<script lang="ts">
	import LoadingSpinner from './icons/LoadingSpinner.svelte';
</script>

<div
	class="mb-6 sm:mb-8 flex flex-col items-center justify-center rounded-xl bg-white p-6 sm:p-8 md:p-12 shadow-md"
	role="status"
	aria-live="polite"
	aria-busy="true"
>
	<div aria-hidden="true">
		<LoadingSpinner size="lg" class="mb-4 text-[#1E4ED8]" />
	</div>
	<p class="text-base sm:text-lg font-medium text-gray-700">Loading loans...</p>
	<p class="mt-2 text-xs sm:text-sm text-gray-500">Please wait while we fetch your data</p>
</div>

