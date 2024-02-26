function generateQuiz(fields, drugList, drugs, name) {
	let quiz = { name, fields: Object.keys(fields).filter((key) => fields[key]) };
	for (const drug of drugList) {
		quiz[drug._id] = { name: drug.name, drugID: drug._id };
		let foundValues = {};
		let otherDrugs = drugs
			.filter((d) => d._id !== drug._id)
			.sort(() => (Math.random() > 0.5 ? 1 : -1));
		let drugValues = Object.keys(drug).reduce((acc, key) => {
			if (fields[key]) {
				acc[key] = drug[key];
				if (Array.isArray(acc[key])) {
					for (const value of acc[key]) {
						if (typeof value === 'string') {
							foundValues[value.toLowerCase()] = true;
						}
					}
				}
			}
			return acc;
		}, {});
		let otherValues = otherDrugs.reduce((acc, d) => {
			let dValues = Object.keys(d).reduce((keyed, k) => {
				if (fields[k]) {
					keyed[k] = d[k];
					if (Array.isArray(keyed[k])) {
						keyed[k] = keyed[k]
							.filter((value) => {
								return !foundValues[value];
							})
							.map((v) => {
								if (typeof v === 'string') {
									foundValues[v.toLowerCase()] = true;
								}
								return v;
							});
					}
				}
				return keyed;
			}, {});
			for (const key in dValues) {
				if (!acc[key]) {
					acc[key] = [];
				} else {
					if (Array.isArray(dValues[key])) {
						for (const value of dValues[key]) {
							acc[key].push(value);
						}
					} else {
						acc[key].push(dValues[key]);
					}
				}
			}
			return acc;
		}, {});
		let getNumber = () => Math.floor(Math.random() * 10);
		let amount = getNumber();
		let trueAmount = amount > 8 ? amount - 2 : amount;

		for (const key in fields) {
			let otherAmount = 8 - trueAmount;
			if (fields[key]) {
				let trues = [];
				let wrongs = [];
				if (Array.isArray(drugValues[key])) {
					otherAmount = 8 - drugValues[key].slice(0, trueAmount).length;
					drugValues[key].forEach((v, i) => {
						trues.push({ value: v, answer: true });
					});
				} else {
					otherAmount = 3;
					trues.push({ value: drugValues[key], answer: true });
				}
				otherValues[key].slice(0, 20).forEach((v) => {
					wrongs.push({ value: v, answer: false });
				});
				// quiz[drug._id][key] = [trues, wrongs].flat().sort(() => (Math.random() > 0.5 ? 1 : -1));
				quiz[drug._id][key] = { trues, wrongs };
			}
		}
	}
	return quiz;
}

export default generateQuiz;
