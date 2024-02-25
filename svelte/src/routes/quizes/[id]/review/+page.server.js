import { services } from '$lib/feathers/index.js';

let { Drugs, Quizes } = services;

export const load = async ({ params }) => {
	let quiz = await Quizes.fetchOne(params.id);
	let drugIDs = Object.keys(quiz).filter((k) => !['_id', 'name', 'fields'].includes(k));
	let drugs = await Promise.all(
		drugIDs.map((id) => {
			return Drugs.fetchOne(id);
		})
	);
	return { quiz, drugs };
};
