module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
	    clean: ['dist'],
        ts: {
            dist: {
                src: ["./src/**/*.ts"],
                reference: "./src/_references.ts",
                out: 'dist/fungears.apiconnectors.js',
                options: {
                    target: 'es5',
                    module: 'amd',
                    sourcemap: false,
                    declaration: false,
                    comments: false
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - version: <%= pkg.version %> - revision: <%= grunt.template.today("yyyymmdd") %> */\n'
            },
            dist: {
                src: 'dist/fungears.apiconnectors.js',
                dest: 'dist/fungears.apiconnectors.min.js'
            }
        }
    });

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-ts');

    grunt.registerTask('default', ['clean', 'ts:dist', 'uglify:dist']);

};