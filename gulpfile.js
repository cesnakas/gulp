import gulp from 'gulp'
import {path} from './gulp/config/path.js'
import {plugins} from './gulp/config/plugins.js'

// Global
global.app = {
    path: path,
    gulp: gulp,
    plugins: plugins,
}

// Import
import {copy} from './gulp/tasks/copy.js'
import {reset} from './gulp/tasks/reset.js'
import {html} from './gulp/tasks/html.js'
import {server} from './gulp/tasks/server.js'
import {styles} from './gulp/tasks/styles.js'
import {scripts} from './gulp/tasks/scripts.js'
import {images} from './gulp/tasks/images.js'
import {imagesWebp} from './gulp/tasks/webp.js'
import { otfToTtf, ttfToWoff, fontStyle } from './gulp/tasks/fonts.js'

// Watch
function watcher() {
    gulp.watch(path.watch.html, html).on('change', gulp.series(html, app.plugins.browserSync.reload))
    gulp.watch(path.watch.styles, styles).on('change', gulp.series(styles, app.plugins.browserSync.reload))
    gulp.watch(path.watch.scripts, scripts).on('change', gulp.parallel(scripts, app.plugins.browserSync.reload))
    gulp.watch(path.watch.images, images).on('change', gulp.series(images, app.plugins.browserSync.reload))
    gulp.watch(path.watch.images, imagesWebp).on('change', gulp.series(imagesWebp, app.plugins.browserSync.reload))
    gulp.watch(path.watch.files, copy).on('change', gulp.series(copy, app.plugins.browserSync.reload))
}

// Fonts processing
const fonts = gulp.series(otfToTtf, ttfToWoff, fontStyle)

// Main task
const mainTasks = gulp.series(fonts, gulp.parallel(html, styles, scripts, images, imagesWebp, copy))
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server))

// Default task
gulp.task('default', dev)
