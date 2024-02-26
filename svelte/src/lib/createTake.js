import clone from 'lodash.clonedeep';
import { services } from '$lib/feathers/index.js';

let { Takes } = services;

let getNumber = () => Math.floor(Math.random() * 10);
let sorted = (arr) => arr.sort(() => (Math.random() > 0.5 ? 1 : -1));

function createTake(drugs, quiz, fieldNames) {
	let newTake = { quizID: quiz._id, questions: [], score: 0 };
	drugs.forEach((dg) => {
		let amount = getNumber();
		let trueAmount = amount > 8 ? amount - 2 : amount;
		let d = clone(dg);
		console.log(dg);
		const drug = d.name;
		const drugID = d.drugID;
		delete d.name;
		delete d.drugID;
		Object.keys(d).forEach((key) => {
			let { trues, wrongs } = d[key];
			let correct = [];
			if (!newTake[key]) {
				newTake[key] = { result: 0, correct: [], wrong: [] };
			}
			let indexes = {};
			while (Object.keys(indexes).length < trues.slice(0, trueAmount).length) {
				let idx = getNumber();
				if (!indexes[idx] && trues[idx]) {
					correct.push(trues[idx]);
					indexes[idx] = true;
				}
			}
			let wrongAmount = key === 'notes' ? 4 - correct.length : 8 - correct.length;

			let choices = sorted([...correct, ...sorted(wrongs).slice(0, wrongAmount)]);
			newTake.questions.push({
				drug,
				drugID,
				label: fieldNames[key],
				field: key,
				answers: { wrong: [], correct: [], none: false },
				choices
			});
		});
	});
	newTake.questions = newTake.questions.sort(() => (Math.random() > 0.5 ? -1 : 1));
	return Takes.create(newTake);
}

export default createTake;
