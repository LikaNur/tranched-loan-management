<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import Navbar from '$lib/components/Navbar.svelte';
	import bgImage from '$lib/assets/bg.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	class="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
	style="background-image: url('{bgImage}');"
	aria-hidden="true"
></div>

<Navbar />
{@render children()}
