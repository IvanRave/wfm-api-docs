/**
 * Grunt file
 */
module.exports = function (grunt) {

	grunt.config.init({
		pkg : grunt.file.readJSON('package.json'),
		gitlog : {
			options : {
				dest : 'doc/month.log',
				afterDate : new Date(2014, 6, 3),
				beforeDate : new Date(2014, 7, 4)
			}
		}
	});

	grunt.loadNpmTasks('grunt-git-log');
};
