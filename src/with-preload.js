// Wait for `webpackPreload` finish
// to break `document.currentScript`
// Maybe it's not strictly required
setTimeout(() => {
	import(
		/* webpackChunkName: 'with-css', webpackPreload: true */ './with-css.js'
	);
}, 100);
