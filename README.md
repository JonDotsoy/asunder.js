# asunder.js
A transform to build javascript files in the browser extending all dependencies in other file.

[![npm](https://img.shields.io/npm/v/asunder.js.svg)](https://www.npmjs.com/package/asunder.js)
[![npm](https://img.shields.io/npm/dt/asunder.js.svg)](https://www.npmjs.com/package/asunder.js)
[![npm](https://img.shields.io/npm/l/asunder.js.svg)](https://www.npmjs.com/package/asunder.js)

> Inspired on browserify but with all style of Gulp.

```javascript
const gulp = require("gulp")
const asunder = require("asunder.js").asunder

gulp.task("script", () =>
  gulp.src("src/scripts/**/*.js")
  .pipe(asunder({
    modules: [
      "react",
      "react-render",
      "debug",
      "lodash",
      "jquery"
    ],
  }))
  .pipe(gulp.dest("www"))
)

// Output files
// www/app.js
// www/app.requeriments.js
```


## What up? In the behaviour.
### OLD
![](doc/assets/images/oldeprogress.png)

### NOW
![](doc/assets/images/newprogress.png)

![](doc/assets/images/newresults.png)
