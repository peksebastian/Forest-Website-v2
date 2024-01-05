const { src, dest, series, parallel, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const cssNano = require('gulp-cssnano')
const autoPrefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename')
const babel = require('gulp-babel')
const kit = require('gulp-kit-2')
const uglify = require('gulp-uglify')
const imageMin = require('gulp-imagemin')
const sourcemaps = require('gulp-sourcemaps')
const clean = require('gulp-clean')

const browserSync = require('browser-sync').create()
const reload = browserSync.reload

const paths = {
	html: './html/**/*.kit',
	sass: './src/sass/**/*.scss',
	js: './src/js/**/*.js',
	img: './src/img/*',
	dist: './dist',
	sassDest: './dist/css',
	jsDest: './dist/js',
	imgDest: './dist/img',
}

function sassCompiler(done) {
	src(paths.sass)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoPrefixer())
		.pipe(cssNano())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		.pipe(dest(paths.sassDest))
	done()
}

function javaScript(done) {
	src(paths.js)
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: ['@babel/env'],
			})
		)
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(dest(paths.jsDest))
	done()
}

function cleanStuff(done) {
	src(paths.dist, { read: false }).pipe(clean())
	done()
}

function startBrowserSync(done) {
	browserSync.init({
		server: {
			baseDir: './',
		},
	})

	done()
}

function convertImages(done) {
	src(paths.img).pipe(imageMin()).pipe(dest(paths.imgDest))
	done()
}

function handleKits(done) {
	src(paths.html).pipe(kit()).pipe(dest('./'))
	done()
}

function watchForChanges(done) {
	watch('./*.html').on('change', reload)
	watch(
		[paths.html, paths.sass, paths.js],
		parallel(handleKits, sassCompiler, javaScript)
	).on('change', reload)
	watch(paths.img, convertImages).on('change', reload)
	done()
}

const mainFunctions = parallel(
	handleKits,
	sassCompiler,
	javaScript,
	convertImages
)
exports.cleanStuff = cleanStuff
exports.default = series(mainFunctions, startBrowserSync, watchForChanges)
