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
          middleware: (connect, options, middlewares) ->
            middlewares.push((req, res, next) ->
              if (req.url.replace(/\?.*$/, '') != '/hello/world') 
                return next()
              console.log 
              res.end req.url.replace(/^.*?\?/, '')
            )
            return middlewares
          port: 9000
          keepalive: true

  grunt.loadNpmTasks 'grunt-jison'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.registerTask 'default', ['watch']