module.exports = function(grunt) {

    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	shell : {
            clean : {
		command : 'rm -rf public/css/concat.css; rm -rf public/dist/* ; find . -name "*~" -delete ; cp public/js/flashcards.js public/js/dictionary.js public/dist/.'
            },
	    startserver : {
                command : 'forever stopall ; forever start server.js'
            },
	    cleanconcat : {
                command : 'rm -rf public/css/concat.css;'
            },
	    commit : {
		command : 'sudo sh /root/ilcgit.sh'
	    }
	},
	concat: {
	    js: {
		src: ['public/js/*.js','!public/js/flashcards.js','!public/js/dictionary.js'],
		dest: 'public/dist/ilc.js'
	    },
	    css: {
		src: 'public/css/*.css',
		dest: 'public/css/concat.css'
	    }
	},
	cssmin: {
	    options: {
		banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            my_target: {
		src: 'public/css/concat.css',
		dest: 'public/dist/ilc.min.css'
            }
	}
    })

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-css');

    grunt.registerTask('build', ['shell:clean','concat','cssmin','shell:cleanconcat','shell:startserver']);
    grunt.registerTask('commit', ['shell:clean','concat','cssmin','shell:cleanconcat','shell:commit']);
    // Définition des tâches Grunt
    grunt.registerTask('default', '')
}