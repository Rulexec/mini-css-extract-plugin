Demo of https://github.com/webpack-contrib/mini-css-extract-plugin/pull/531

* `npm ci`
* `npm run start`
* Go to `http://localhost:8080/`
* Edit `src/style.css`
* Exception should happen:

```
Uncaught TypeError: Cannot read property 'some' of null
    at getReloadUrl (hotModuleReplacement.js:129)
    at eval (hotModuleReplacement.js:145)
    at NodeList.forEach (<anonymous>)
    at reloadStyle (hotModuleReplacement.js:140)
    at update (hotModuleReplacement.js:194)
    at functionCall (hotModuleReplacement.js:24)
```

Why?

* `document.currentScript` is absent due to preload
* Last script is not our script, because page has `<script>` without `src` in the end of page
* `getCurrentScriptUrl` returns `null`
