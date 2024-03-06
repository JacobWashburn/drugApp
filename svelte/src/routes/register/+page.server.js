import { auth, services } from '$lib/feathers';

export const actions = {
	register: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username');
		const email = data.get('email');
		const password = data.get('password');
		return services.Users.create({
			email: email.toLowerCase(),
			password,
			username: username.toLowerCase()
		})
			.then((user) => {
				const strategy = 'local';
				let credentials = { email, password, strategy };
				return auth.login(credentials).then((res) => {
					return { success: true, ...res };
				});
			})
			.catch((err) => {
				console.log('the error', err.data);
				return { success: false, error: err.data };
			});
	}
};
