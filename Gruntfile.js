module.exports = function(grunt){
  "use strict";
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: ".jshintrc",
        reports: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        './js/app.js',
        './controller/*.js']
    }
  });
  grunt.registerTask('check', ['jshint']);
  grunt.loadNpmTasks('grunt-contrib-jshint');
};

