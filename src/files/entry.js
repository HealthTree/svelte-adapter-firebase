import {Server} from 'SERVER';
import {manifest} from 'MANIFEST';
import {toSvelteKitRequest} from './firebase-to-svelte-kit.js';

const server = new Server(manifest);
/**
 * Firebase Cloud Function handler for SvelteKit
 *
 * This function converts the Firebase Cloud Function (Express.js) Request object
 * into a format consumable to the SvelteKit render() function
 *
 * Relevant documentation - https://firebase.google.com/docs/functions/http-events#read_values_from_the_request
 *
 * @param {import('firebase-functions').https.Request} request
 * @param {import('express').Response} response
 * @returns {Promise<void>}
 */
export default async function svelteKit(request, response) {
	const rendered = await app.render(toSvelteKitRequest(request));

	// TODO : we need this because we are using two domains in parallel and we access the session.host
	rendered.headers['cache-control'] = rendered.headers['cache-control']?.replace('private','pubic');
	return rendered
		? response.writeHead(rendered.status, rendered.headers).end(body)
		: response.writeHead(404, 'Not Found').end();
	if (rendered) {
		// TODO : we need this because we are using two domains in parallel and we access the session.host
		if (rendered.headers?.get && rendered.headers?.set) {
			rendered.headers.set('cache-control', rendered.headers.get('cache-control').replace('private', 'pubic'));
		} else {
			rendered.headers['cache-control'] = rendered.headers['cache-control']?.replace('private', 'pubic');
		}
		console.log(rendered.headers);
		response.writeHead(rendered.status, rendered.headers).end(rendered.body);
	} else {
		response.writeHead(404, 'Not Found').end();
	}
}
