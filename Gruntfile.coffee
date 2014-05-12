module.exports = (grunt) ->

  grunt.initConfig
    jison:
      target:
        files:
          'calculator.js': 'calculator.jison'
    watch:
   	  jison:
   	    files: ['*.jison']
   	    tasks: ['jison']
    sass:
   	  all:
   	    files:
   	      'main.css': 'main.scss'
    connect:
      server:
        options:
          port: 9000
          keepalive: true
          #open: true
          #base: '.'
          #hostname: 'localhost'

  grunt.loadNpmTasks 'grunt-jison'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.registerTask 'default', ['watch']