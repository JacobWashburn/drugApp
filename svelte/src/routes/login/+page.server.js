import { auth } from '$lib/feathers';

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		const strategy = 'local';
		let credentials = { email: email.toLowerCase(), password, strategy };
		return auth
			.login(credentials)
			.then((res) => {
				console.log('the login res', res);
				return { success: true, ...res };
			})
			.catch((err) => {
				console.log('the login error ', err);
				return { success: false };
			});
	}
};
