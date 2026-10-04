import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// Static build for GitHub Pages (served from the tacogod900.github.io repo root, so no base path).
		adapter: adapter({ pages: 'build', assets: 'build', fallback: '404.html', strict: true })
	}
};

export default config;
