import feathersClient from '../api/feathers-client.js';
import { writable } from 'svelte/store';
import { jwtDecode } from 'jwt-decode';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

class Authentication {
	static modelName = 'Authentication';

	constructor({ app, service }) {
		this.app = app;
		this.service = service;
		this.user = null;
		this.accessToken = null;
		this.isAuthenticated = false;
		this.store = writable({});
		this.expireTimeout = null;
	}

	logOut() {
		this.app.logout();
		window.localStorage.removeItem('feathers-jwt');
		this.isAuthenticated = false;
		this.accessToken = null;
		this.user = null;
		this.store.set({});
		this.expireTimeout = null;
		goto('/login');
	}

	login(credentials) {
		return this.app
			.authenticate(credentials)
			.then((res) => {
				return res;
			})
			.catch((err) => {
				console.log(err);
			});
	}

	reAuthenticate() {
		return this.app
			.reAuthenticate(true)
			.then((res) => {
				this.user = res.users;
				this.store.set(res.users);
				this.accessToken = res.accessToken;
				this.isAuthenticated = true;
				const { exp } = jwtDecode(this.accessToken);
				const expiresIn = exp * 1000 - Date.now();
				if (this.expireTimeout) {
					clearTimeout(this.expireTimeout);
				}
				this.expireTimeout = setTimeout(() => {
					this.logOut();
				}, expiresIn);
				return this.isAuthenticated;
			})
			.catch((err) => {
				console.log(`${err.message} rerouting to login`);
				if (browser) {
					goto('/login');
				}
				return Promise.reject('Not Authenticated');
			});
	}
}

const servicePath = 'authentication';
const options = {
	service: feathersClient.service(servicePath),
	app: feathersClient
	// idField: _id  -  optional field for setting a specific key for storing under in the store. default: _id
};

// const beforeHook = context => {
//   // eslint-disable-next-line no-console
//   console.log('------------->>>> beforeHook - context.method:', context.method);
//   console.log('------------->>>> beforeHook - context.params:', context.params);
//   console.log('------------->>>> beforeHook - context.data:', context.data);
// };

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
	before: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	},
	after: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	},
	error: {
		all: [(ctx) => console.log(ctx)],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	}
});

feathersClient.service(servicePath).model = new Authentication(options);

export default feathersClient.service(servicePath).model;
