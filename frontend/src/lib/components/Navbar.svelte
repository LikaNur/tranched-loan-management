<script lang="ts">
	import favicon from '$lib/assets/favicon.png';
	import GithubIcon from './icons/GithubIcon.svelte';
	import LinkedInIcon from './icons/LinkedInIcon.svelte';
	import EmailIcon from './icons/EmailIcon.svelte';

	const email = 'nurmatova.mlk@gmail.com';
	const github = 'https://github.com/LikaNur';
	const linkedin = 'https://www.linkedin.com/in/nurmatova-malika/';
</script>

<nav class="relative border-b border-gray-800 bg-gray-950 px-4 py-5">
	<div class="absolute top-0 right-0 h-full w-full opacity-20"></div>

	<div class="max-w-14xl relative mx-auto flex items-center justify-between">
		<div class="flex items-center">
			<img src={favicon} alt="Tranched Logo" class="h-10 w-12 rounded-lg" />
			<a href="https://tranched.fi/"
				><span class="pl-1 text-[17.5px] tracking-wide text-white">Tranched</span></a
			>
		</div>

		<div class="flex items-center gap-6">
			<a href="mailto:{email}"
				><span class="text-lg tracking-wide text-[#94A2B8] hover:text-white">Contact</span></a
			>
			<div class="flex items-center gap-4">
				<a
					href={linkedin}
					target="_blank"
					rel="noopener noreferrer"
					class="text-[#94A2B8] transition-colors hover:text-white"
					aria-label="LinkedIn"
				>
					<LinkedInIcon class="h-6 w-6" />
				</a>
				<a
					href={github}
					target="_blank"
					rel="noopener noreferrer"
					class="text-[#94A2B8] transition-colors hover:text-white"
					aria-label="GitHub"
				>
					<GithubIcon class="h-6 w-6" />
				</a>
				<a
					href="mailto:{email}"
					class="text-[#94A2B8] transition-colors hover:text-white"
					aria-label="Email"
				>
					<EmailIcon class="h-6 w-6" />
				</a>
			</div>
		</div>
	</div>
</nav>
