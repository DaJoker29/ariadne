module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        watch: {
            sass: {
                files: ['src/scss/**/*.scss'],
                tasks: ['sass:dev', 'postcss:dev']
            },
            js: {
                files: ['src/js/**/*.js'],
                tasks: ['eslint', 'uglify:dev']
            },
            livereload: {
                options: { livereload: true },
                files: ['client/**/*']
            }
        },
        sass: {
            dev: {
                expand: true,
                cwd: 'src/scss',
                src: ['**/*.scss'],
                dest: 'client/stylesheets',
                ext: '.css',
                options: {
                    style: 'expanded'
                }
            },
            prod: {
               expand: true,
                cwd: 'src/scss',
                src: ['**/*.scss'],
                dest: 'client/stylesheets',
                ext: '.css',
                options: {
                    style: 'compressed',
                    sourcemap: 'none'
                }
            }
        },
        postcss: {
            options: {
                processors: [
                    require('autoprefixer-core')({browsers: 'last 2 versions'})
                ]
            },
            dev: {
                src: 'client/stylesheets/style.css',
                map: true
            },
            prod: {
                src: 'client/stylesheets/style.css'
            }
        },
        uglify: {
            dev: {
                options: {
                    sourceMap: true,
                    mangle: false,
                    beautify: true,
                    preserveComments: 'all',
                    compress: false
                },
                files: {
                    'dist/script.js': ['src/js/**/*.js']
                }
            },
            prod: {
                files: {
                    'dist/script.js': ['src/js/**/*.js']
                }
            }
        },
        eslint: {
            client: ['client/scripts/**/*.js'],
            server: ['server/**/*.js'],
            source: ['src/js/**/*.js']
        }
    });

    grunt.registerTask('dev', 'Build development version of project', ['eslint', 'uglify:dev', 'sass:dev', 'postcss:dev']);
    grunt.registerTask('prod', 'Build production version of project', ['eslint', 'uglify:prod', 'sass:prod', 'postcss:prod']);
    grunt.registerTask('default', 'Build development version and run watch server', ['dev', 'watch']);
};
