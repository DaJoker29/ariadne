module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        watch: {
            sass: {
                files: ['src/scss/**/*.scss'],
                tasks: ['sass:dev', 'postcss:dev']
            },
            client: {
                files: [
                    'client/scripts/**/*.js',
                    '!client/scripts/script.*js'
                ],
                tasks: ['eslint:client', 'uglify']
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
            uncompressed: {
                options: {
                    mangle: false,
                    beautify: true,
                    preserveComments: 'all',
                    compress: false
                },
                files: {
                    'client/scripts/script.js': [
                        'client/scripts/**/*.js',
                        '!client/scripts/script.*js'
                    ]
                }
            },
            compressed: {
                options: {
                    sourceMap: true
                },
                files: {
                    'client/scripts/script.min.js': [
                        'client/scripts/**/*.js',
                        '!client/scripts/script.*js'
                    ]
                }
            }
        },
        eslint: {
            options: {
                quiet: true
            },
            client: ['client/scripts/**/*.js'],
            server: ['server/**/*.js'],
            source: ['src/js/**/*.js']
        }
    });

    grunt.registerTask('dev', 'Build development version of project', ['eslint', 'uglify', 'sass:dev', 'postcss:dev']);
    grunt.registerTask('prod', 'Build production version of project', ['eslint', 'uglify', 'sass:prod', 'postcss:prod']);
    grunt.registerTask('default', 'Build development version and run watch server', ['dev', 'watch']);
};
