import { SvelteKitAuth } from '@auth/sveltekit'
import GitHub from '@auth/core/providers/github'

// import { env } from '$env/dynamic/private'
import { GITHUB_ID, GITHUB_SECRET, AUTH_SECRET } from "$env/static/private"

import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { db } from '$lib/db'
import { redirect, error } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import * as plans from '$lib/services/plans'

const protectedPaths = ['/dashboard', '/account']

async function protect({ event, resolve }) {
	if (!protectedPaths.includes(event.url.pathname)) {
		return resolve(event)
	}

	const session = await event.locals.getSession()

	if (!session?.user) {
		throw redirect(303, '/auth/signin')
	}

	return resolve(event)
}

const enterprisePaths = ['/advanced-feature']

async function enterpriseOnly({ event, resolve }) {
	if (!enterprisePaths.includes(event.url.pathname)) {
		return resolve(event)
	}

	const session = await event.locals.getSession()

	if (session?.plan?.handle != 'enterprise') {
		throw error(403, 'Enterprise plan is required')
	}

	return resolve(event)
}

// debugging env vars
// console.log('Hook server GITHUB_SECRET :', GITHUB_SECRET);
// console.log('Hook server AUTH_SECRET :', AUTH_SECRET);


const authenticate = SvelteKitAuth({
	// uncomment the following line for Auth.js debugging
	// debug: true,
	adapter: PrismaAdapter(db),
	providers: [
		GitHub({
			clientId: GITHUB_ID,
			clientSecret: GITHUB_SECRET
		})
	],
	secret: AUTH_SECRET,
	session: {
		// temporary workaround
		generateSessionToken() {
			return crypto.randomUUID()
		}
	},
	callbacks: {
		async session({ session, user }) {
			if (user.planId) {
				session.plan = await plans.get(user.planId)
			}

			session.user.status = user.status

			return session
		}
	}
})

export const handle = sequence(authenticate, protect, enterpriseOnly)
