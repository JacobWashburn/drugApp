import { services } from '$lib/feathers/index.js';

let { Quizes } = services;

export const load = async ({ params }) => {
	let quiz = await Quizes.fetchOne(params.id);
	return { quiz };
};
