module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        watch: {
            sass: {
                files: ['src/scss/**/*.scss'],
                tasks: ['sass:dev', 'postcss:dev']
            },
            client: {
                files: ['client/scripts/**/*.js'],
                tasks: ['eslint:client']
            },
            server: {
                files: ['server/**/*.js'],
                tasks: ['eslint:server']
            },
            src: {
                files: ['src/**/*.js'],
                tasks: ['eslint:source']
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
                    'client/scripts/script.js': ['client/scripts/**/*.js', '!client/scripts/script.js']
                }
            },
            prod: {
                files: {
                    'client/scripts/script.js': ['client/scripts/**/*.js', '!client/scripts/script.js']
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
