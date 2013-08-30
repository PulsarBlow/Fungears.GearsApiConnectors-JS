module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
	    clean: ['dist'],
        ts: {
            dist: {
                src: ["./src/**/*.ts"],
                reference: "./src/_references.ts",
                //out: 'dist/fungears.apiconnectors.js',
                options: {
                    target: 'es5',
                    module: 'amd',
                    sourcemap: false,
                    declaration: false,
                    comments: false
                }
            }
        },
	    concat: {
		    options: {
			    banner: '/*! <%= pkg.name %> - version: <%= pkg.version %> - revision: <%= grunt.template.today("yyyymmdd") %>\n    <%= pkg.description %>\n    Author: <%= pkg.author %>\n    Repository: <%= pkg.repository.url %>\n    Licence: <%= pkg.license %> */\n'
		    },
		    dist: {
			    src: [
				    'src/nativeShims.js',
				    'src/system.js',
				    'src/http.js',
				    'src/eventAggregator.js',
				    'src/bindingProvider.js',
				    'src/api.js',
				    'src/listener.js'
			    ],
			    dest: 'dist/fungears.apiconnectors.js'
		    }
	    },
        uglify: {
            options: {
	            preserveComments: 'some'
            },
            dist: {
                src: 'dist/fungears.apiconnectors.js',
                dest: 'dist/fungears.apiconnectors.min.js'
            }
        }
    });

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-ts');

    grunt.registerTask('default', ['clean', 'ts:dist', 'concat:dist', 'uglify:dist']);

};