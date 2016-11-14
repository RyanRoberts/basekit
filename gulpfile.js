var gulp            = require('gulp'),
    // Sass for writing and pre-processing the CSS
    sass            = require('gulp-sass'),
    // Nano for optimising and post-processing the CSS
    nano            = require('gulp-cssnano'),
    // Join JS into one file
    concat          = require('gulp-concat'),
    // Minify the one JS file
    uglify          = require('gulp-uglify'),
    // Minify and clean up HTML files
    htmlmin         = require('gulp-htmlmin'),
    // Data storage for Nunjucks, and anything else
    data            = require('gulp-data'),
    // HTML static templating, it's a bit like Twig
    nunjucksRender  = require('gulp-nunjucks-render'),
    // Report file sizes in the CLI
    size            = require('gulp-size');

// Compile Sass with autoprefixer, I've removed sourcemaps
gulp.task('scss', function() {
  gulp.src('css/basekit.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(nano({autoprefixer: {
      // Add prefixes
      add: true,
      browsers: [
        '> 0.5%',
        'last 2 versions',
        'ie >= 9'
      ]
    }}))
    .pipe(gulp.dest('css'))
    .pipe(size({ showFiles: true }))
    .pipe(size({ gzip: true, showFiles: true }));
});
// Minify and concat the js files for use
gulp.task('js', function() {
  gulp.src('js/*.js')
    .pipe(concat('basekit.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js/min'))
    .pipe(size({ gzip: true, showFiles: true }));
});

// Minify HTML source and rename the index-dev file
gulp.task('html', function() {
  gulp.src('./html/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      collapseBooleanAttributes: true,
      quoteCharacter: '\'',
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe(gulp.dest('./'));
});

// Compile Nunjucks static templates
gulp.task('nunjucks', function() {
  // Get the .html and .nunjucks files
  return gulp.src('templates/src/pages/**/*.+(html|njk|nunjucks)')
  // Pull in data for Nunjucks
  .pipe(data(function() { return require('./templates/data.json') }))
  // Renders template with nunjucks
  .pipe(nunjucksRender({ path: ['templates/src/partials'] }))
  // Output files for CMS devs to work with
  .pipe(gulp.dest('templates/dist'))
});

// Minify Nunjucks HTML files
gulp.task('njkdev', function() {
  gulp.src('./templates/dist/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      collapseBooleanAttributes: true,
      quoteCharacter: '\'',
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe(gulp.dest('templates/dist/min'));
});

gulp.task('watch', function() {
  gulp.watch('css/**/*.scss', ['scss']);
  gulp.watch('js/*.js', ['js']);
  gulp.watch('./templates/src/partials/**/*.+(html|njk|nunjucks)', ['nunjucks']);
  gulp.watch('./templates/dist/*.html', ['njkdev']);
});

gulp.task('default', ['watch']);