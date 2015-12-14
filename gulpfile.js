var gulp          = require('gulp'),
    // Process and compile scss/css files
    sass          = require('gulp-sass'),
    // Optimise css
    nano          = require('gulp-cssnano'),
    // Join js files into one
    concat        = require('gulp-concat'),
    // Minify js
    uglify        = require('gulp-uglify'),
      // Optimise images
      // imagemin      = require('gulp-imagemin'),
      // pngquant      = require('imagemin-pngquant'),
    // Generate svg symbols file
    svgSymbols    = require('gulp-svg-symbols'),
    // Minify HTML
    minifyHTML    = require('gulp-minify-html'),
    // Minify css and js within html files
    minifyInline  = require('gulp-minify-inline'),
    // Deploy to gh pages
    deploy        = require('gulp-gh-pages'),
    // Report file sizes
    size          = require('gulp-size');

// Compile Sass with autoprefixer, I've removed sourcemaps
gulp.task('scss', function() {
  gulp.src('css/basekit.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(nano({autoprefixer: {browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']}}))
    .pipe(gulp.dest('css'))
    .pipe(size({ gzip: true, showFiles: true }));
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
    .pipe(size({ gzip: true, showFiles: true }));
});

gulp.task('svg', function () {
  return gulp.src('imgs/svg/*.svg')
    .pipe(svgSymbols({
      templates: ['default-svg'],
      title: '%f'
    }))
    .pipe(gulp.dest('imgs/svg'));
});

// Optimise images
// gulp.task('img', function () {
//   return gulp.src('imgs/*')
//     .pipe(imagemin({
//       progressive: true,
//       svgoPlugins: [{removeViewBox: false}],
//       multipass: true,
//       use: [pngquant()]
//     }))
//     .pipe(gulp.dest('imgs'));
// });

// Minify HTML source and rename the index-dev file
gulp.task('html', function() {
  gulp.src('./html/*.html')
    .pipe(minifyHTML({cdata: true}))
    .pipe(minifyInline())
    .pipe(gulp.dest('./'));
});

// Only watch Sass and JS files
gulp.task('watch', function() {
  gulp.watch('css/**/*.scss', ['scss']);
  gulp.watch('js/*.js', ['js']);
  gulp.watch('./html/*.html', ['html']);
});

gulp.task('default', ['watch']);