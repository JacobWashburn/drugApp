import { auth } from '$lib/feathers';

export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		const strategy = 'local';
		let credentials = { email, password, strategy };
		return auth.login(credentials).then((res) => {
			return { success: true, ...res };
		});
	}
};
