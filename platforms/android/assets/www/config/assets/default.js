'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/angular-wizard/dist/angular-wizard.css',
        'public/lib/angular-ui-grid/ui-grid.css',
        'public/lib/angular-spin/font-awesome.css',
		    'public/lib/Angularjs-Toaster/toaster.css'
      ],
      js: [
       // 'public/lib/jquery/dist/jquery.js',
       // 'public/lib/bootstrap/dist/js/bootstrap.min.js',
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/jquery/dist/jquery.js',
        'public/lib/csv-js/csv.js',
        'public/lib/jquery-csv/src/jquery.csv.js',
        'public/lib/pdfmake/build/pdfmake.js',
        'public/lib/pdfmake/build/vfs_fonts.js',
        'public/lib/angular-ui-grid/ui-grid.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/angular-wizard/dist/angular-wizard.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-spin/angular-spinner.js',
        'public/lib/angular-smart-table/dist/smart-table.js',
		    'public/lib/Angularjs-Toaster/toaster.js',
        'public/lib/highcharts/highcharts.js',
        'public/lib/ng-file-upload/ng-file-upload.js',
        'public/lib/file-saver/FileSaver.js',
        'public/lib/angular-file-saver/dist/angular-file-saver.js'

      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};
