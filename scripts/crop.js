#define MY_DEFAULT_CROP 0.08

function StreamCropper() {

   this.execute = function(views) {

      for(var i = 0; i < views.length; i++) {
         var view = views[i];

         var alreadyCropped = false;
         for(var k = 0; k < view.window.keywords.length; k++) {
            var kw = view.window.keywords[k];
            if(kw.name == "HISTORY" && /StreamCrop/.test(kw.comment)) {
               alreadyCropped = true;
               break;
            }
         }
         if(alreadyCropped) continue;

         var addedKeywords = new Array;
         addedKeywords.push(new FITSKeyword("HISTORY", "", "StreamCrop"));
         view.window.keywords = view.window.keywords.concat(addedKeywords);

         var cropAmountW = Math.round(view.image.width * MY_DEFAULT_CROP);
         var cropAmountH = Math.round(view.image.height * MY_DEFAULT_CROP);

         var P = new Crop;
         P.leftMargin = -cropAmountW;
         P.topMargin = -cropAmountH;
         P.rightMargin = -cropAmountW;
         P.bottomMargin = -cropAmountH;
         P.mode = Crop.prototype.AbsolutePixels;
         P.xResolution = 72.000;
         P.yResolution = 72.000;
         P.metric = false;
         P.forceResolution = false;
         P.red = 0.000000;
         P.green = 0.000000;
         P.blue = 0.000000;
         P.alpha = 1.000000;
         P.noGUIMessages = true;

         P.executeOn(view);
         processEvents();
      }

   }
}
