module.exports = function(grunt){
    var banner = '/*! \n' +
        ' * <%= pkg.name %> <%= pkg.description %>\n' +
        ' * jQuery Mobile Event Plugin, jQuery Mobile Animation used and iScroll 4 used.\n'+
        ' * \n' +
        ' * Copyright 2013, <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * <%= pkg.license %>\n' +
        ' * \n' +
        ' * project: <%= pkg.name %>\n' +
        ' * version: <%=pkg.version%>\n'+
        ' * repository: <%=pkg.repository.url%>\n' +
        ' * contact: <%=pkg.author_email%>\n' +
        ' * Date: <%= grunt.template.today("yyyy-mm-dd hh:mm") %> \n'+
        ' */\n';

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            dist:{
                options: {
                    banner: banner
                },
                src: [
                    'src/core/x-core.js',
                    'src/util/x-util-core.js',
                    'src/util/x-util-observer.js',
                    'src/util/x-util-elementmanager.js',
                    'src/util/x-util-componentmanager.js',
                    'src/util/x-util-viewcontroller.js',
                    'src/util/x-util-localviewcontroller.js',
                    'src/util/x-util-remoteviewcontroller.js',
                    'src/util/x-util-draggable.js',
                    'src/util/x-util-droppable.js',
                    'src/util/x-util-dragndropmanager.js',
                    'src/ui/x-ui-core.js',
                    'src/ui/x-view.js',
                    'src/ui/x-ui-accordion.js',
                    'src/ui/x-ui-carousel.js',
                    'src/ui/x-ui-listview.js',
                    'src/ui/x-ui-tabs.js',
                    'src/ui/x-ui-toolbar.js',
                    'src/ui/x-ui-layoutview.js',
                    'src/ui/x-ui-form.js',
                    'src/ui/x-ui-formview.js',
                    'src/ui/x-ui-textbox.js',
                    'src/ui/x-ui-slider.js',
                    'src/ui/x-ui-spinner.js',
                    'src/ui/x-ui-progressbar.js',
                    'src/ui/x-ui-switchbox.js',
                    'src/core/x-app.js'
                ],
                dest: 'src/<%= pkg.name %>.js'
            }
        },
        uglify: {
            dist: {
                options: {
                    banner: banner
                },
                files: {
                    'build/<%= pkg.name %>.min.js': 'src/<%= pkg.name %>.js',
                    'build/x-event.min.js': 'src/plugins/x-event.js',
                    'build/x-scroll.min.js': 'src/plugins/x-scroll.js'
                }
            }
        },
        jsdoc : {
			dist : {
				src: ['src/<%= pkg.name %>.js'], 
				options: {
					destination: 'doc',
					template: "node_modules/ink-docstrap/template"
				}
			}
		},
		replace: {
		    dist: {
		        options: {
                    variables: {
                        'version': '<%=pkg.version%>'
                    },
                    prefix: '@@'
                },
		        files: {
		            'src/<%= pkg.name %>.js':'src/<%= pkg.name %>.js',
		            'build/<%= pkg.name %>.min.js': 'build/<%= pkg.name %>.min.js'
		        }
		    }
		}
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-replace');

    grunt.registerTask('default', ['concat', 'uglify', 'replace', 'jsdoc']);
};