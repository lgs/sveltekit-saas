<script lang="ts">
	import '../../app.css'
	import { signOut } from '@auth/sveltekit/client'
	import { user } from '$lib/stores'
</script>

<header class="container">
	<nav>
		<ul>
			<li><strong>Sveltekit SaaS</strong></li>
		</ul>
		<ul>
			<li><a href="/">Home</a></li>
			<li><a href="/billing">Billing</a></li>
			<li><button on:click|preventDefault={() => signOut({ callbackUrl: '/' })}>Sign out</button></li>
		</ul>
	</nav>	
</header>

<main class="container">
	<slot />
</main>
