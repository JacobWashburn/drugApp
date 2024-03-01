import { updateStore } from './utils.js';
import { writable } from 'svelte/store';
import { Timer } from '$lib/timer.js';

class BaseModel {
	constructor({ servicePath, service, idField = '_id', restrictedBy = '_id' }) {
		this.servicePath = servicePath;
		this.service = service;
		this.idField = idField;
		this._store = writable({ key: {}, arr: [] });
		this.value = { key: {}, arr: [] };
		let { set, update, subscribe } = this._store;
		subscribe((value) => (this.value = value));
		this._set = set;
		this._update = update;
		this.subscribe = subscribe;
		this._onAdd = [];
		this._onRemove = [];
		this.isFetchPending = false;
		this.isFetchOnePending = false;
		this.restrictedId = null;
		this.timer = new Timer();
		this.eventQueue = {};
		this.updatingStore = false;
		for (let event of ['created', 'patched', 'updated', 'removed']) {
			let self = this;
			self.eventQueue[event] = [];
			self.service.on(event, (data) => {
				let eventData = data;
				if (Array.isArray(eventData)) {
					while (eventData.length > 0) {
						self.eventQueue[event].push(eventData.shift());
					}
					// this.eventQueue[event] = [...this.eventQueue[event], ...eventData];
				} else {
					self.eventQueue[event].push(eventData);
				}
				if (!self.updatingStore) {
					self.updatingStore = true;
				}
				self.timer.start({
					cb: () => {
						// let queueData = Array.from(this.eventQueue[event]);
						// self.eventQueue[event] = [];

						let queueData = [];
						while (self.eventQueue[event].length > 0) {
							queueData.push(self.eventQueue[event].shift());
						}

						self._update((s) => {
							let done = updateStore(
								{
									idField: self.idField,
									store: s,
									remove: event === 'removed',
									create: event === 'created',
									onAdd: self._onAdd,
									onRemove: self._onRemove,
									restrictTo: self.restrictedId
										? { field: restrictedBy, value: self.restrictedId }
										: void 0,
									updating: (bool) => {
										self.updatingStore = bool;
									}
								},
								queueData
							);
							return done;
						});
						self.updatingStore = false;
					},
					iv: 500
				});
			});
		}
	}

	find(query = {}) {
		return this.value.arr.filter((item) => {
			let pass = true;
			for (const key in query) {
				if (!pass) break;
				pass = item[key] === query[key];
			}
			return pass;
		});
	}

	get(query = {}) {
		return this.value.arr.find((item) => {
			let pass = true;
			for (const key in query) {
				if (!pass) break;
				pass = item[key] === query[key];
			}
			return pass;
		});
	}

	// get(id) {
	//   return this.key[id];
	// }
	onAdd(fn) {
		this._onAdd.push(fn);
	}

	onRemove(fn) {
		this._onRemove.push(fn);
	}

	create(data, params) {
		if (
			!data ||
			(Array.isArray(data) && !data.length) ||
			(Object.prototype.toString.call(data) === '[object Object]' && !Object.keys(data).length)
		) {
			return Error('Method[create] cannot create empty record');
		}
		this.updatingStore = true;
		return this.service.create(data, params);
	}

	update(id, data, params) {
		if (!Object.keys(data).length) {
			return Error('Method[update] cannot update to an empty record');
		}
		this.updatingStore = true;
		return this.service.update(id, data, params);
	}

	patch(id, data, params) {
		this.updatingStore = true;
		return this.service.patch(id, data, params);
	}

	remove(id, params) {
		this.updatingStore = true;
		return this.service.remove(id, params);
	}

	fetch(params) {
		let self = this;
		self.isFetchPending = true;
		// console.log("fetching", this);
		return self.service.find(params).then((res) => {
			self.isFetchPending = false;
			return new Promise((resolve, reject) => {
				self.updatingStore = true;
				self._update((s) => {
					let sUpdate = updateStore(
						{
							idField: self.idField,
							store: s,
							method: 'find',
							updating: (bool) => {
								this.updatingStore = bool;
							}
						},
						res
					);
					resolve(res);

					return sUpdate;
				});
			});
		});
	}

	fetchOne(id, params) {
		let self = this;
		self.isFetchOnePending = true;
		return self.service.get(id, params).then((res) => {
			self._update((s) => {
				return updateStore(
					{
						idField: self.idField,
						store: s,
						updating: (bool) => {
							this.updatingStore = bool;
						}
					},
					res
				);
			});
			self.isFetchOnePending = false;
			return Promise.resolve(res);
		});
	}
}

export default BaseModel;
