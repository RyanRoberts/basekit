var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    nano        = require('gulp-cssnano'),
    deploy      = require('gulp-gh-pages'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    minifyHTML  = require('gulp-minify-html'),
    size        = require('gulp-size');

// Compile Sass with autoprefixer, I've removed sourcemaps
gulp.task('scss', function() {
  gulp.src('css/basekit.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(nano({autoprefixer: {browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']}}))
    .pipe(gulp.dest('css'))
    .pipe(size({ /* gzip: true,*/ showFiles: true }));
});

// Easy deploy to the gh-pages branch
gulp.task('deploy', function () {
  return gulp.src('**/*')
    .pipe(deploy());
});

// Minify and concat the js files for use
gulp.task('js', function() {
  gulp.src('js/*.js')
    .pipe(concat('basekit.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js/min'))
    .pipe(size({ /* gzip: true,*/ showFiles: true }));
});

// Optimise images
gulp.task('img', function () {
  return gulp.src('imgs/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      multipass: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest('imgs'));
});

// Minify HTML source and rename the index-dev file
gulp.task('html', function() {
  gulp.src(['**/*.html', '!**/*.dev.html'])
  .pipe(minifyHTML({cdata: true, conditionals: true, quotes: true, spare: true}))
  .pipe(gulp.dest('./'));
});

// Only watch Sass and JS files
gulp.task('watch', function() {
  gulp.watch('css/**/*.scss', ['scss']);
  gulp.watch('js/*.js', ['js']);
  gulp.watch('index-dev.html', ['html']);
});

gulp.task('default', ['watch']);