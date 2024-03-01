import clone from 'lodash.clonedeep';

function stringifyIfObject(val) {
	if (typeof val === 'object' && val != null) {
		return val.toString();
	}
	return val;
}

export function updateStore(
	{
		idField,
		store,
		remove,
		create,
		onRemove,
		onAdd,
		method,
		restrictTo = { field: '', value: null },
		updating
	},
	response
) {
	let list = response.data || response;
	if (remove) {
		if (Array.isArray(list)) {
			list = list.filter((item) => shouldUpdate(item, restrictTo.field, restrictTo.value));
			let toArrRemove = [];
			list.forEach((item) => {
				const id = getId(item, idField);
				if (id !== null && id !== undefined) {
					delete store.key[id];
					toArrRemove.push(id);
				}
			});
			store.arr = store.arr.filter((a) => !toArrRemove.includes(getId(a, idField)));
		} else if (shouldUpdate(list, restrictTo.field, restrictTo.value)) {
			const id = getId(list, idField);
			if (id !== null && id !== undefined) {
				delete store.key[id];
				store.arr = store.arr.filter((item) => getId(item, idField) !== id);
			}
		}
		for (const fn of onRemove) {
			fn(list);
		}
		return store;
	}
	if (Array.isArray(list)) {
		list = list.filter((item) => shouldUpdate(item, restrictTo.field, restrictTo.value));
		const isPaginated = response.hasOwnProperty('total');
		list.forEach((item) => {
			const id = getId(item, idField);
			if (id !== null && id !== undefined) {
				store.arr = store.arr.filter((a) => getId(a, idField) !== id);
				if (!item.isDeleted) {
					store.key[id] = item;
					store.arr.push(store.key[id]);
				}
			}
		});
		if (method === 'find' && !isPaginated) {
			// Find IDs from the store which are not in the list
			Object.keys(store.key).forEach((id) => {
				if (!list.some((item) => getId(item, idField) === id)) {
					delete store[id];
				}
			});
		}
		if (create) {
			for (const fn of onAdd) {
				fn(list);
			}
		}
	} else if (shouldUpdate(list, restrictTo.field, restrictTo.value)) {
		const id = getId(list, idField);
		if (id !== null && id !== undefined) {
			store.arr = store.arr.filter((item) => getId(item, idField) !== id);
			if (!list.isDeleted) {
				store.key[id] = list;
				store.arr.push(store.key[id]);
			}
		}
		if (create) {
			for (const fn of onAdd) {
				fn(list);
			}
		}
	} else {
		console.log("don't update store");
	}
	updating(false);
	return store;
}

export function getId(item, idField) {
	if (!item) {
		return;
	}
	if (item[idField] != null || item.hasOwnProperty(idField)) {
		return stringifyIfObject(item[idField]);
	}
	if (item.id != null || item.hasOwnProperty('id')) {
		return stringifyIfObject(item.id);
	}
	if (item._id != null || item.hasOwnProperty('_id')) {
		return stringifyIfObject(item._id);
	}
}

function shouldUpdate(item, path, value) {
	return item && (item[path] === void 0 || item[path] === value);
}

/**
 * Check if two arrays are equal
 * @param  {Array}   arr1 The first array
 * @param  {Array}   arr2 The second array
 * @return {Boolean}      If true, both arrays are equal
 */
const arraysMatch = function (arr1, arr2) {
	// Check if the arrays are the same length
	if (arr1.length !== arr2.length) return false;

	// Check if all items exist and are in the same order
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) return false;
	}

	// Otherwise, return true
	return true;
};

/*!
 * Find the differences between two objects and push to a new object
 * @param  {Object} obj1 The original object
 * @param  {Object} obj2 The object to compare against it
 * @return {Object}      An object of differences between the two
 */
export function diff(obj1, obj2) {
	// Make sure an object to compare is provided
	if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
		return obj1;
	}

	// Make sure we have an object in the store to compare against
	if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
		return obj1;
	}

	//
	// Variables
	//

	let diffs = {};
	let key;

	//
	// Methods
	//

	/**
	 * Compare two items and push non-matches to object
	 * @param  {*}      item1 The first item
	 * @param  {*}      item2 The second item
	 * @param  {String} key   The key in our object
	 */
	const compare = function (item1, item2, key) {
		// Get the object type
		const type1 = Object.prototype.toString.call(item1);
		const type2 = Object.prototype.toString.call(item2);

		// If type2 is undefined it has been removed
		if (type2 === '[object Undefined]') {
			diffs[key] = null;
			return;
		}

		// If items are different types
		if (type1 !== type2) {
			diffs[key] = item2;
			return;
		}

		// If an object, compare recursively
		if (type1 === '[object Object]') {
			const objDiff = diff(item1, item2);
			if (Object.keys(objDiff).length > 0) {
				diffs[key] = objDiff;
			}
			return;
		}

		// If an array, compare
		if (type1 === '[object Array]') {
			if (!arraysMatch(item1, item2)) {
				diffs[key] = item2;
			}
			return;
		}

		// Else if it's a function, convert to a string and compare
		// Otherwise, just compare
		if (type1 === '[object Function]') {
			if (item1.toString() !== item2.toString()) {
				diffs[key] = item2;
			}
		} else {
			if (item1 !== item2) {
				diffs[key] = item2;
			}
		}
	};

	//
	// Compare our objects
	//

	// Loop through the first object
	for (let key in obj1) {
		// eslint-disable-next-line no-prototype-builtins
		if (obj1.hasOwnProperty(key)) {
			compare(obj1[key], obj2[key], key);
		}
	}

	// Loop through the second object and find missing items
	for (let key in obj2) {
		// eslint-disable-next-line no-prototype-builtins
		if (obj2.hasOwnProperty(key)) {
			if (!obj1[key] && obj1[key] !== obj2[key]) {
				diffs[key] = obj2[key];
			}
		}
	}

	// Return the object of differences
	return diffs;
}

export function acceptDiff(obj1, obj2) {
	// don't modify the existing object
	let obj = clone(obj1);
	if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
		return obj1;
	}

	// get differences between obj1 and obj2
	let getDiff = diff(obj, obj2);

	console.log('the diff', { getDiff, obj1, obj2 });

	for (let key in getDiff) {
		if (key in obj) {
			const diffType = Object.prototype.toString.call(getDiff[key]);
			if (diffType === '[object Object]') {
				for (let keyDiff in getDiff[key]) {
					obj[key][keyDiff] = getDiff[key][keyDiff];
				}
			} else if (diffType === '[object Array]') {
				if (!arraysMatch(obj[key], getDiff[key])) {
					obj[key] = getDiff[key];
				}
				return;
			} else if (getDiff[key]) {
				obj[key] = getDiff[key];
			}
		} else {
		}
	}
	return obj;
}
