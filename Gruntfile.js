module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                files: {
                    'static/css/style.css': 'static/scss/style.scss',
                }
            }
        },
        watch: {
            css: {
                files: 'scss/partials/*.scss',
                tasks: ['default']
            }
        },
        concat: {
            dist: {
                src: [
                    'static/scss/partials/*.scss',
                ],
                dest: 'static/scss/style.scss',
            }
        },
    });
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sass');
    grunt.registerTask('default', ['concat', 'sass']);
}