#include "filter-defines.js"

var StreamPipelineType = { Unknown: 0, NarrowBand: 1, LRGB: 2 };

function StreamPipelineResolver() {

   this.resolve = function(workViews) {

      // Resolve pipeline from work views
      if(_narrowbandFramesPresent(workViews)) {
         console.noteln("Detected narrowband images, resolved narrowband pipeline");
         return StreamPipelineType.NarrowBand;
      }
      if(_lrgbFramesPresent(workViews)) {
         console.noteln("Detected LRGB images, resolved LRGB pipeline");
         return StreamPipelineType.LRGB;
      }
      console.noteln("Failed to detect pipeline type!");
      return StreamPipelineType.Unknown;
   }

   function _narrowbandFramesPresent(workViews) {

      for(var i = 0; i < workViews.length; i++) {
         var imageWin = workViews[i].window;

         for(var k = 0; k < imageWin.keywords.length; k++) {
            var key = imageWin.keywords[k].name;

            var value = imageWin.keywords[k].strippedValue.trim();
            if(key == "FILTER") {
               if(value == FILTER_HA || value == FILTER_O3) {
                  return true;
               }
            }
         }
      }

      return false;

   }

   function _lrgbFramesPresent(workViews) {

      for(var i = 0; i < workViews.length; i++) {
         var imageWin = workViews[i].window;

         for(var k = 0; k < imageWin.keywords.length; k++) {
            var key = imageWin.keywords[k].name;

            var value = imageWin.keywords[k].strippedValue.trim();
            if(key == "FILTER") {
               if(value == FILTER_L || value == FILTER_R || value == FILTER_G || value == FILTER_B) {
                  return true;
               }
            }
         }
      }

      return false;

   }

}
