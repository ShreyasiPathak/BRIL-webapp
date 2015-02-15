module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        // src: ['app/js/*.js','app/js/vendor/*.js','app/js/vendor/modules/*.js'],
        src: ['app/js/*.js'],
        dest: 'build/<%= pkg.name %>.min.js'
      },
      // sourceMap: true,
      // sourceMapName: 'build/<%= pkg.name %>.map',
      // sourceMapIncludeSources: true,
      // preserveComments: 'some', // keep '//!' comments
    },
    eslint: {
      nodeFiles: {
        files: {
          src: ['server/**/*.js','demo/**/*.js']
        },
        options: {
          config: "server/eslint-node.json"
        }
      },
 
      browserFiles: {
        files: {
          src: ['app/js/*.js']
        },
        options: {
          config: "app/eslint-browser.json"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('eslint-grunt');

  // grunt.registerTask('default', ['uglify','eslint']);
  grunt.registerTask('default', ['eslint']);

};
