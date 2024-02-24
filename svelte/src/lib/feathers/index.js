import schemas from './services/schemas.js';
import Authentication from './services/authentication.js';
import createService from './services/create_service.js';

export const auth = Authentication;
export const services = schemas
	.map((s) => ({ ...s, store: createService(s) }))
	.reduce((acc, curr) => {
		acc[curr.name] = curr.store;
		return acc;
	}, {});

export const load = () => {
	Object.values(services).forEach((s) => s.fetch());
};
