# JS-Bundler
A transform to build javascript files in the browser extending all dependencies in other file.

> Inspired on browserify but with all style of Gulp.

```javascript
const gulp = require("gulp")
const jsBundler = require("js-bundler").jsBundler

gulp.task("script", () =>
  gulp.src("src/scripts/**/*.js")
  .pipe(jsBundler({
    modules: [
      "react",
      "react-render",
      "debug",
      "lodash",
      "jquery"
    ]
  }))
  .pipe(gulp.dest("www"))
)

// Output files
// www/app.js
// www/app.requeriments.js
```

