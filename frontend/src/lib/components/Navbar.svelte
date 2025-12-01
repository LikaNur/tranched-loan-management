<script lang="ts">
	import favicon from '$lib/assets/favicon.png';
	import GithubIcon from './icons/GithubIcon.svelte';
	import LinkedInIcon from './icons/LinkedInIcon.svelte';
	import EmailIcon from './icons/EmailIcon.svelte';

	const email = 'nurmatova.mlk@gmail.com';
	const github = 'https://github.com/LikaNur';
	const linkedin = 'https://www.linkedin.com/in/nurmatova-malika/';
</script>

<nav class="relative px-3 sm:px-4 py-3 sm:py-5">
	<div class="absolute top-0 right-0 h-full w-full opacity-20"></div>

	<div class="max-w-14xl relative mx-auto flex items-center justify-between">
		<div class="flex items-center">
			<img src={favicon} alt="Tranched company logo" class="h-8 w-10 sm:h-10 sm:w-12 rounded-lg" />
			<a
				href="https://tranched.fi/"
                target="_blank"
                rel="noopener noreferrer"
			aria-label="Visit Tranched website"
			>
				<span class="pl-1 text-sm sm:text-[17.5px] tracking-wide text-white">Tranched</span>
			</a>
		</div>

		<div class="flex items-center gap-2 sm:gap-4 md:gap-6">
			<a
				href="mailto:{email}"
				class="hidden sm:inline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950 rounded"
				aria-label="Contact via email"
			>
				<span class="text-base sm:text-lg tracking-wide text-[#94A2B8] hover:text-white">Contact</span>
			</a>
			<div class="flex items-center gap-2 sm:gap-3 md:gap-4">
				<a
					href={linkedin}
					target="_blank"
					rel="noopener noreferrer"
					class="text-[#94A2B8] transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950 rounded"
					aria-label="Visit LinkedIn profile"
				>
					<span aria-hidden="true">
						<LinkedInIcon class="h-5 w-5 sm:h-6 sm:w-6" />
					</span>
				</a>
				<a
					href={github}
					target="_blank"
					rel="noopener noreferrer"
					class="text-[#94A2B8] transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950 rounded"
					aria-label="Visit GitHub profile"
				>
					<span aria-hidden="true">
						<GithubIcon class="h-5 w-5 sm:h-6 sm:w-6" />
					</span>
				</a>
				<a
					href="mailto:{email}"
					class="text-[#94A2B8] transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950 rounded sm:hidden"
					aria-label="Send email"
				>
					<span aria-hidden="true">
						<EmailIcon class="h-5 w-5 sm:h-6 sm:w-6" />
					</span>
				</a>
				<a
					href="mailto:{email}"
					class="hidden sm:inline text-[#94A2B8] transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950 rounded"
					aria-label="Send email"
				>
					<span aria-hidden="true">
						<EmailIcon class="h-5 w-5 sm:h-6 sm:w-6" />
					</span>
				</a>
			</div>
		</div>
	</div>
</nav>
