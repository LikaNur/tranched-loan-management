<script lang="ts">
	let { class: className = '' } = $props<{
		class?: string;
	}>();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	viewBox="0 0 24 24"
	class={className}
	style="image-rendering: pixelated; flex-shrink: 0; background-size: 100% 100%;"
	aria-hidden="true"
>
	<path
		d="M 19 1 C 21.209 1 23 2.791 23 5 L 23 19 C 23 21.209 21.209 23 19 23 L 5 23 C 2.791 23 1 21.209 1 19 L 1 5 C 1 2.791 2.791 1 5 1 Z M 6.205 7.91 C 7.147 7.91 7.91 7.147 7.91 6.205 C 7.91 5.263 7.147 4.5 6.205 4.5 C 5.263 4.5 4.5 5.263 4.5 6.205 C 4.5 7.147 5.263 7.91 6.205 7.91 Z M 7.909 19.5 L 7.909 9.273 L 4.5 9.273 L 4.5 19.5 Z M 9.273 9.273 L 9.273 19.5 L 12.341 19.5 L 12.341 13.33 C 12.736 12.688 13.418 12 14.386 12 C 15.75 12 16.091 13.364 16.091 14.046 L 16.091 19.5 L 19.5 19.5 L 19.5 14.046 C 19.5 12.218 18.703 9.273 15.75 9.273 C 13.872 9.273 12.83 9.958 12.34 10.6 L 12.34 9.273 Z"
		fill="currentColor"
	/>
</svg>
