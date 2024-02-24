import { services } from '$lib/feathers/index.js';

let { Quizes, Takes } = services;
export const load = async ({ params }) => {
	let quiz = await Quizes.fetchOne(params.id);
	let take = await Takes.fetchOne(params.take);
	return { take, quiz };
};
