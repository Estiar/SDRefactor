var awspublish = require('gulp-awspublish');
var gulp = require('gulp');
var AWS = require('aws-sdk');
var cloudfront = cloudfront = require('gulp-cloudfront-invalidate-aws-publish');
var exec = require('child_process').exec;

var cfSettings = {
  distribution: 'E323SDOFUADGPE', // Cloudfront distribution ID
  wait: true,                     // Whether to wait until invalidation is completed (default: false)
  indexRootPath: true,            // Invalidate index.html root paths (`foo/index.html` and `foo/`) (default: false)
  credentials: new AWS.SharedIniFileCredentials({profile: 'smart.list'})
};

gulp.task('build', function (cb) {
  exec('ng build --prod --aot=false --build-optimizer=false', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    return cb(err);
  });
});

//aws configure --profile smart.list
//gulp.task('publish', ['build'], function () {
gulp.task('publish', function () {
  var publisher = awspublish.create({
    region: 'us-east-1',
    params: {
      Bucket: 'smart.list'
    },
    credentials: new AWS.SharedIniFileCredentials({profile: 'smart.list'})
  });

  var headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
  };

  return gulp.src('./dist/**/*')
    .pipe(publisher.publish(headers))
    .pipe(cloudfront(cfSettings))
    .pipe(publisher.sync())
    .pipe(awspublish.reporter())
});
