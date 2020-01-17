const { src, dest } = require('gulp');

const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');

const { dest: { dev, prod } } = paths = require('./gulp.paths');
const { env } = require('./gulp.utils');

const plugins = {
    process: [
        require('postcss-each'),
        require('postcss-responsive-type'),
        require('postcss-custom-media'),
        require('postcss-easing-gradients'),
        require('postcss-combine-media-query'),
    ],
    preset: [
        require('postcss-preset-env')({
            config: {
                stage: 3,
                browsers: '',
                preserve: true,
            }
        })
    ],
    stylelint: [
        require('stylelint'),
    ],
    min: [
        require('cssnano'),
    ]
}

function processes() {
    if (env === 'dev') {
        return src('./processing/main.import.css')
            .pipe(postcss(plugins.process))
            .pipe(rename('main.processed.css'))
            .pipe(dest(dev))
            .pipe(rename('dais.css'))
            .pipe(dest(prod))
    }
    return src('dais.css')
        .pipe(postcss(plugins.process))
        .pipe(dest(prod))
}
processes.description = `Runs CSS through postcss plugins -> each -> responsive-type -> custom-media -> easing-gradients -> combine-media-queries`;

/* Internal functions */
function preset() {
    return src('dais.css')
        .pipe(postcss(plugins.preset))
        .pipe(dest(prod))
}
preset.description = `Applies the preset-env from postcss to make the css more compatible`;

function minify() {
    return src('./dais.css')
        .pipe(sourcemaps.init())
        .pipe(postcss(plugins.min))
        .pipe(rename('dais.min.css'))
        .pipe(sourcemaps.write(prod))
        .pipe(dest(prod));
}
minify.description = `Minifies CSS and produces a sourcemap`;

module.exports = {
    minify,
    preset,
    processes,
};