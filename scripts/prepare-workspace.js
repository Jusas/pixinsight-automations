#include "fileutils.js"

function StreamWorkspace() {

   var openedWindows = [];

   this.openFilesToViews = function(srcDir) {

      // return opened views
      var fileInfos = FindFileData(srcDir, ["*.xisf"], true);
      for(var i = 0; i < fileInfos.length; i++) {
         var existingWindow = ImageWindow.windowByFilePath(fileInfos[i].path);
         if(existingWindow.isNull) {
            var opened = ImageWindow.open(fileInfos[i].path);
            openedWindows.push(opened[0]);
         }
         else {
            openedWindows.push(existingWindow);
         }
      }

      return openedWindows.map(x => x.mainView);

   }

   this.cleanupWindows = function() {
      // cleanup openedViews

      for(var i = 0; i < openedWindows.length; i++) {
         openedWindows[i].forceClose();
      }

      openedWindows.length = 0;
   }

}
