#include <pjsr/Sizer.jsh>
#include <pjsr/DataType.jsh>
#include <pjsr/NumericControl.jsh>
#include "C:/Program Files/PixInsight/src/scripts/BatchPreprocessing/BatchPreprocessing-global.js"   // global defines
#include "C:/Program Files/PixInsight/src/scripts/BatchPreprocessing/BatchPreprocessing-helper.js"   // helper functions
#include "C:/Program Files/PixInsight/src/scripts/BatchPreprocessing/BatchPreprocessing-engine.js"   // stack engine
#include "C:/Program Files/PixInsight/src/scripts/BatchPreprocessing/BatchPreprocessing-GUI.js"      // GUI part


function StreamImagePreprocessor() {

   var actualOutputDir = "";

   function _configureInstance(config) {

      var preprocessor = new StackEngine;
      preprocessor.setDefaultParameters();

      preprocessor.outputDirectory = config.outputDir; // create if not exist
      preprocessor.exportCalibrationFiles = false;
      preprocessor.generateRejectionMaps = false;
      preprocessor.calibrateOnly = false;
      preprocessor.evaluateNoise = true;
      preprocessor.referenceImage = config.lights[0];
      preprocessor.saveProcessLog = true;
      preprocessor.optimizeDarks = false;

      // Assume darks and flats are always masters.
      preprocessor.useAsMaster[ImageType.DARK] = true;
      preprocessor.useAsMaster[ImageType.FLAT] = true;

      for(var i = 0; i < config.lights.length; i++) {
         console.noteln("Adding light " + config.lights[i]);
         preprocessor.addFile(config.lights[i]);
      }

      for(var i = 0; i < config.masterFlats.length; i++) {
         console.noteln("Adding flat " + config.masterFlats[i]);
         preprocessor.addFile(config.masterFlats[i]);
      }

      for(var i = 0; i < config.masterDarks.length; i++) {
         console.noteln("Adding dark " + config.masterDarks[i]);
         preprocessor.addFile(config.masterDarks[i]);
      }

      var minFrameGroupCount = Math.min.apply(Math, preprocessor.frameGroups.filter(x => x.imageType == ImageType.LIGHT).map(x => x.fileItems.length));
      console.noteln("Minimum light frame group count is " + minFrameGroupCount);
      // If any of the groups has less than 3 frames, reduce all groups to 1 frame, and disable integration.
      if(minFrameGroupCount < 3) {
         console.noteln("Going with single frame per filter");
         for(var i = 0; i < preprocessor.frameGroups.length; i++) {
            for(var j = preprocessor.frameGroups[i].fileItems.length-1; j > 0; j--) {
               preprocessor.frameGroups[i].fileItems[j] = null;
               preprocessor.purgeRemovedElements();
            }
         }
         console.noteln("Will not integrate");
         actualOutputDir = preprocessor.outputDirectory + "/registered";
         preprocessor.integrate = false;
      }
      else {
         console.noteln("Will integrate");
         actualOutputDir = preprocessor.outputDirectory + "/master";
         preprocessor.integrate = true;
         if(minFrameGroupCount <= 8) {
            preprocessor.rejection[ImageType.LIGHT] = ImageIntegration.prototype.PercentileClip;
         }
         else {
            preprocessor.rejection[ImageType.LIGHT] = ImageIntegration.prototype.WinsorizedSigmaClip;
         }
      }

      return {
         preprocessor: preprocessor,
         frameGroupSize: minFrameGroupCount
      };
   }

   this.execute = function(config) {
      var configuredInstance = _configureInstance(config);

      if(!File.directoryExists(configuredInstance.preprocessor.outputDirectory)) {
         File.createDirectory(configuredInstance.preprocessor.outputDirectory, true);
      }

      configuredInstance.preprocessor.doLight();
      return {
         outputDir: actualOutputDir,
         frameGroupSize: configuredInstance.frameGroupSize
      }
   }

}
