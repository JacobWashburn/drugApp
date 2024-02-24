import { services } from '$lib/feathers/index.js';

let { Quizes, Takes } = services;
export const load = async ({ params }) => {
	let take = await Takes.fetchOne(params.id);
	let quiz = await Quizes.fetchOne(take.quizID);
	return { take, quiz };
};
