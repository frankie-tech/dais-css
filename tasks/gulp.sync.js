const { watch, series } = require('gulp');

const b = require('browser-sync').create();

const { baseDir, main, glob } = (paths = require('./gulp.paths'));
const { devCSS } = require('./gulp.postcss');

const buildFiles = watch(glob);

function serve(done) {
	b.init({
		server: {
			baseDir,
			index: main
		}
	});
	done();
}
serve.description = `Starts a browser-sync server at ${baseDir} with index: ${main}`;

function reload(done) {
	b.reload();
	done();
}
reload.description = `Reloads server`;

function observe(done) {
	buildFiles.on('change', series(devCSS, reload));
	watch(main).on('change', series(reload));
	done();
}
observe.description = `Watches the _CSS files and ${main} for changes`;

module.exports = {
	serve,
	observe
};
