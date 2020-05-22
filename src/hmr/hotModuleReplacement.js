/* eslint-env browser */
/*
  eslint-disable
  no-console,
  func-names
*/

const srcByModuleId = Object.create(null);

const noDocument = typeof document === 'undefined';

const { forEach } = Array.prototype;

function debounce(fn, time) {
  let timeout = 0;

  return function() {
    const self = this;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;

    const functionCall = function functionCall() {
      return fn.apply(self, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
}

function noop() {}

function getCurrentModuleChunks(moduleId) {
  let src = srcByModuleId[moduleId];

  if (!src) {
    src = module.miniCssModuleIdToChunkIds[moduleId];

    srcByModuleId[moduleId] = src;
  }

  return function() {
    return src;
  };
}

function updateCss(el, url) {
  if (!url) {
    if (!el.href) {
      return;
    }

    // eslint-disable-next-line
    url = el.href.split('?')[0];
  }

  if (!isUrlRequest(url)) {
    return;
  }

  if (el.isLoaded === false) {
    // We seem to be about to replace a css link that hasn't loaded yet.
    // We're probably changing the same file more than once.
    return;
  }

  if (!url || !(url.indexOf('.css') > -1)) {
    return;
  }

  // eslint-disable-next-line no-param-reassign
  el.visited = true;

  const newEl = el.cloneNode();

  newEl.isLoaded = false;

  newEl.addEventListener('load', () => {
    newEl.isLoaded = true;
    el.parentNode.removeChild(el);
  });

  newEl.addEventListener('error', () => {
    newEl.isLoaded = true;
    el.parentNode.removeChild(el);
  });

  newEl.href = `${url}?${Date.now()}`;

  if (el.nextSibling) {
    el.parentNode.insertBefore(newEl, el.nextSibling);
  } else {
    el.parentNode.appendChild(newEl);
  }
}

function reloadStyle(chunkIds) {
  if (!chunkIds) {
    return false;
  }

  const selector = chunkIds
    .map((id) => `link[data-mini-css-chunk-id="${id}"]`)
    .join(',');

  const elements = document.querySelectorAll(selector);
  let loaded = false;

  forEach.call(elements, (el) => {
    if (!el.href) {
      return;
    }

    if (el.visited === true) {
      return;
    }

    updateCss(el, el.href);

    loaded = true;
  });

  return loaded;
}

function reloadAll() {
  const elements = document.querySelectorAll('link');

  forEach.call(elements, (el) => {
    if (el.visited === true) {
      return;
    }

    updateCss(el);
  });
}

function isUrlRequest(url) {
  // An URL is not an request if

  // It is not http or https
  if (!/^https?:/i.test(url)) {
    return false;
  }

  return true;
}

module.exports = function(moduleId, options) {
  if (noDocument) {
    console.log('no window.document found, will not HMR CSS');

    return noop;
  }

  const getModuleChunks = getCurrentModuleChunks(moduleId);

  function update() {
    const chunkIds = getModuleChunks();
    const reloaded = reloadStyle(chunkIds);

    if (options.locals) {
      console.log('[HMR] Detected local css modules. Reload all css');

      reloadAll();

      return;
    }

    if (reloaded && !options.reloadAll) {
      console.log('[HMR] css reload %s', chunkIds.join(' '));
    } else {
      console.log('[HMR] Reload all css');

      reloadAll();
    }
  }

  return debounce(update, 50);
};
