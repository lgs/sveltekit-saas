<script lang="ts">
	import '../../app.css'
	import { signIn } from '@auth/sveltekit/client'
</script>

<header class="container">
	<nav>
		<ul>
			<li><strong>Sveltekit SaaS</strong></li>
		</ul>
		<ul>
			<li><a href="/">Home</a></li>
			<li><a href="/pricing">Pricing</a></li>
			<li><button on:click|preventDefault={() => signIn('github', { callbackUrl: '/dashboard' })} role="button" class="outline">Sign in</button></li>			
		</ul>
	</nav>	
</header>

<main class="container">
	<slot />
</main>
