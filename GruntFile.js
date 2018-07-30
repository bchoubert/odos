module.exports = function(grunt) {

    grunt.initConfig({
      sass: {                              // Task
        dist: {                            // Target
          options: {                       // Target options
            style: 'expanded'
          },
          files: {                         // Dictionary of files
            './dist/styles/styles.css': './styles.scss'       // 'destination': 'source'
          }
        }
      },
      ts: {
        dist : {
          src: ["scripts/*.ts", "!node_modules/**"],
          out: "dist/scripts/script.js",
          options: {
            module: 'amd'
          }
        }
      }
    });
    
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks("grunt-ts");
    
    grunt.registerTask('default', ['sass', 'ts']);
};