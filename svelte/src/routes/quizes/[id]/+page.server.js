import { services } from '$lib/feathers/index.js';

let { Quizes, Takes } = services;

export const load = async ({ params }) => {
	let quiz = await Quizes.fetchOne(params.id);
	let takes = await Takes.fetch({ query: { quizID: quiz._id } });
	return {
		quiz,
		takes: takes.data
	};
};
