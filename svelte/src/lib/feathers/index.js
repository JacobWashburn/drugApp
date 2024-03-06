import schemas from './services/schemas.js';
import Authentication from './services/authentication.js';
import createService from './services/create_service.js';
import { browser } from '$app/environment';

export const auth = Authentication;
export const services = schemas
	.map((s) => ({ ...s, store: createService(s) }))
	.reduce((acc, curr) => {
		acc[curr.name] = curr.store;
		return acc;
	}, {});

export const load = () => {
	if (browser) {
		return Promise.all(
			Object.values(services).map((s) =>
				s.fetch({ query: { isDeleted: false } }).then((res) => {
					console.log('load', s.servicePath, res);
				})
			)
		).catch((err) => {
			console.log('load error', err);
		});
	} else return Promise.resolve();
};
