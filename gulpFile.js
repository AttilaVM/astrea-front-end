const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const pug = require("gulp-pug");
const stylus = require("gulp-stylus");

gulp.task("template", function buildHTML() {
  return gulp.src("./src/templates/index.pug")
    .pipe(pug({}))
    .pipe(gulp.dest("./dist"));
});

gulp.task("style", function () {
  return gulp.src("./src/styles/main.styl")
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist"));
});

gulp.task("default", function defaultTask() {
  gulp.watch(["./src/templates/*.pug"], ["template"]);
  gulp.watch(["./src/styles/*.styl"], ["style"]);
});
