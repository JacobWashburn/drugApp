import { join } from 'path';

import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin';

let sizes = {
	'1/4': '25%',
	30: '30%',
	'1/3': '33.33333%',
	'1/2': '50%',
	'3/4': '75%',
	25: '25px',
	40: '40px',
	50: '50px',
	75: '75px',
	100: '100px',
	150: '150px',
	200: '200px',
	250: '250px',
	300: '300px',
	350: '350px',
	400: '400px',
	450: '450px',
	500: '500px',
	550: '550px',
	600: '600px',
	650: '650px',
	700: '700px',
	750: '750px',
	800: '800px'
};
export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			minWidth: sizes,
			minHeight: sizes,
			maxHeight: sizes,
			maxWidth: sizes,
			width: sizes,
			height: sizes,
			screens: {
				'max-2xl': { max: '1535px' },
				'2xl': '1535px',
				'max-xl': { max: '1279px' },
				xl: '1279px',
				'max-lg': { max: '1023px' },
				lg: '1023px',
				'max-md': { max: '880px' },
				md: '880px',
				'max-sm': { max: '639px' },
				sm: '639px'
			}
		}
	},
	plugins: [
		forms,
		typography,
		skeleton({
			themes: {
				preset: [
					{
						name: 'skeleton',
						enhancements: true
					}
				]
			}
		})
	]
};
