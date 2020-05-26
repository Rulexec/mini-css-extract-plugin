let div = document.createElement('div');
document.body.appendChild(div);

// My page have <script> without `src` in the bottom
let script = document.createElement('script');
document.body.appendChild(script);

import(/* webpackChunkName: 'with-preload' */ './with-preload.js');

if (module.hot) {
	module.hot.accept('./with-preload.js');
}
