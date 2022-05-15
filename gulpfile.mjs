// to use require in .mjs file 
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const gulp = require("gulp");
const sass = require("gulp-sass")(require('sass'));
const cssnano = require("gulp-cssnano")
const rev = require("gulp-rev");
// it minimizes javascript files
const uglify = require("gulp-uglify-es").default;

//for image minification
import imagemin from 'gulp-imagemin';

// for clearing previoud build
const del = require("del");

// we have to write task, one of the task is to minify css

gulp.task('css', function(done){
    console.log('minifying css.....');
    // ** means any folder, subfolder inside them,
    // *.scss, any file with extension scss
    // each file would go throug sass, then cssnano, then destination is what it is in .dest()
    gulp.src("./assets/sass/**/*.scss")
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets.css'));

    //now for production mode, we would store files in public folder 
    // now files are minified, now we take these files from src , then each file go thorugh rev
    // that would rename them, like home.css to home-123.css, then we put into dest location,then take
    // these files from public and create a manifest , in manifest we have key value pair like orignal_name: converted
    // eg. home.css: home-123.css, cwd would be public ,because we are taking everything from the public
    // and merge , if the name already exist it will not change , merge with already existing files
    // now again we put all of them to dest folder again, and manifest file is also created in public folder
    return gulp.src('./assets/**/*.css')
    .pipe(rev())
    // change path in .env file smw_asset_path: './public/assets'
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});


gulp.task('js', function(done){
    console.log('minifying js......');
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});



    gulp.task('images', function(done){
    console.log('minifying images......');
    gulp.src('./assets/**/*.+(pgn|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});


//when we are building the project, sometimes we have to clear the previous build and build it from scratch

gulp.task('clean:assets', function(done){
    del.sync('./public/assets');
    done();
});



//to run all above four tasks in one go

gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function(done){
    console.log("Building assets....");
    done();
});