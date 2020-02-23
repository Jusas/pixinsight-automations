#include "filter-defines.js"
#include "histogram-stretch.js"

function StreamNarrowbandPipeline() {

   this.execute = function(views, frameGroupSize) {

      var haImage = _findImageViewByFilter(views, FILTER_HA);
      var o3Image = _findImageViewByFilter(views, FILTER_O3);

      var histo = new StreamHistogramStretch;
      histo.execute(haImage, [o3Image]);

      var combinedImage = _combineWithPixelMath(haImage, o3Image);
      _runBackgroundNeutralization(combinedImage);
      _runMultiscaleMedianTransform(combinedImage);
      _runCurvesTransformation(combinedImage, frameGroupSize);

      return combinedImage;
   }

   function _findImageViewByFilter(views, filter) {
      for(var i = 0; i < views.length; i++) {
         var view = views[i];
         for(var k = 0; k < view.window.keywords.length; k++) {
            if(view.window.keywords[k].name == "FILTER" &&
               view.window.keywords[k].strippedValue.trim() == filter) {
               return view;
            }
         }
      }
      return null;
   }

   function _combineWithPixelMath(haImage, o3Image) {

      var expressionTemplate0 = "iif(HALPHA > .15, HALPHA, (HALPHA*.8)+(OXY*.2))";
      var expressionTemplate1 = "iif(HALPHA > 0.5, 1-(1-HALPHA)*(1-(HALPHA-0.5)), OXY *(HALPHA+0.5))";
      var expressionTemplate2 = "iif(OXY > .1, OXY, (HALPHA*.3)+(OXY*.2))";

      var haImageId = haImage.id;
      var o3ImageId = o3Image.id;

      var expression0 = expressionTemplate0.replace(/HALPHA/g, haImageId).replace(/OXY/g, o3ImageId);
      var expression1 = expressionTemplate1.replace(/HALPHA/g, haImageId).replace(/OXY/g, o3ImageId);
      var expression2 = expressionTemplate2.replace(/HALPHA/g, haImageId).replace(/OXY/g, o3ImageId);

      var P = new PixelMath;
      P.expression = expression0;
      P.expression1 = expression1;
      P.expression2 = expression2;
      P.expression3 = "";
      P.useSingleExpression = false;
      P.symbols = "";
      P.generateOutput = true;
      P.singleThreaded = false;
      P.use64BitWorkingImage = false;
      P.rescale = false;
      P.rescaleLower = 0;
      P.rescaleUpper = 1;
      P.truncate = true;
      P.truncateLower = 0;
      P.truncateUpper = 1;
      P.createNewImage = true;
      P.showNewImage = true;
      P.newImageId = haImageId + "_pixelmath";
      P.newImageWidth = 0;
      P.newImageHeight = 0;
      P.newImageAlpha = false;
      P.newImageColorSpace = PixelMath.prototype.RGB;
      P.newImageSampleFormat = PixelMath.prototype.SameAsTarget;

      P.executeOn(haImage);

      return View.viewById(P.newImageId);
      /*
       * Read-only properties
       *
      P.outputData = [ // globalVariableId, globalVariableRK, globalVariableG, globalVariableB
      ];
       */

   }

   function _runBackgroundNeutralization(combinedImage) {

      var P = new BackgroundNeutralization;
      P.backgroundReferenceViewId = "";
      P.backgroundLow = 0.0000000;
      P.backgroundHigh = 0.4000000;
      P.useROI = false;
      P.roiX0 = 0;
      P.roiY0 = 0;
      P.roiX1 = 0;
      P.roiY1 = 0;
      P.mode = BackgroundNeutralization.prototype.RescaleAsNeeded;
      P.targetBackground = 0.0010000;

      P.executeOn(combinedImage);
   }

   function _runMultiscaleMedianTransform(combinedImage) {

      var P = new MultiscaleMedianTransform;
      P.layers = [ // enabled, biasEnabled, bias, noiseReductionEnabled, noiseReductionThreshold, noiseReductionAmount, noiseReductionAdaptive
         [true, true, 0.000, true, 4.0000, 1.00, 0.8000],
         [true, true, 0.000, true, 4.0000, 1.00, 3.5000],
         [true, true, 0.000, true, 4.0000, 1.00, 0.7000],
         [true, true, 0.000, true, 4.0000, 1.00, 0.0000],
         [true, true, 0.000, false, 1.0000, 1.00, 0.0000],
         [true, true, 0.030, false, 1.0000, 1.00, 0.0000],
         [true, true, 0.030, false, 1.0000, 1.00, 0.0000],
         [true, true, 0.000, false, 1.0000, 1.00, 0.0000]
      ];
      P.transform = MultiscaleMedianTransform.prototype.MultiscaleMedianTransform;
      P.medianWaveletThreshold = 5.00;
      P.scaleDelta = 0;
      P.linearMask = false;
      P.linearMaskAmpFactor = 100;
      P.linearMaskSmoothness = 1.00;
      P.linearMaskInverted = true;
      P.linearMaskPreview = false;
      P.lowRange = 0.0000;
      P.highRange = 0.0000;
      P.previewMode = MultiscaleMedianTransform.prototype.Disabled;
      P.previewLayer = 0;
      P.toLuminance = true;
      P.toChrominance = true;
      P.linear = false;

      P.executeOn(combinedImage);
   }

   function _runCurvesTransformation(combinedImage, frameGroupSize) {
      var P = new CurvesTransformation;
      P.R = [ // x, y
         [0.00000, 0.00000],
         [1.00000, 1.00000]
      ];
      P.Rt = CurvesTransformation.prototype.AkimaSubsplines;
      P.G = [ // x, y
         [0.00000, 0.00000],
         [1.00000, 1.00000]
      ];
      P.Gt = CurvesTransformation.prototype.AkimaSubsplines;
      P.B = [ // x, y
         [0.00000, 0.00000],
         [1.00000, 1.00000]
      ];
      P.Bt = CurvesTransformation.prototype.AkimaSubsplines;
      P.K = [ // x, y
         [0.00000, 0.00000],
         [0.25070, 0.21053],
         [0.75117, 0.87939],
         [1.00000, 1.00000]
      ];
      P.Kt = CurvesTransformation.prototype.AkimaSubsplines;
      P.A = [ // x, y
         [0.00000, 0.00000],
         [1.00000, 1.00000]
      ];
      P.At = CurvesTransformation.prototype.AkimaSubsplines;
      P.L = [ // x, y
         [0.00000, 0.00000],
         [1.00000, 1.00000]
      ];
      P.Lt = CurvesTransformation.prototype.AkimaSubsplines;
      P.a = [ // x, y
         [0.00000, 0.00000],
         [1.00000, 1.00000]
      ];
      P.at = CurvesTransformation.prototype.AkimaSubsplines;
      P.b = [ // x, y
         [0.00000, 0.00000],
         [1.00000, 1.00000]
      ];
      P.bt = CurvesTransformation.prototype.AkimaSubsplines;
      P.c = [ // x, y
         [0.00000, 0.00000],
         [1.00000, 1.00000]
      ];
      P.ct = CurvesTransformation.prototype.AkimaSubsplines;
      P.H = [ // x, y
         [0.00000, 0.00000],
         [1.00000, 1.00000]
      ];
      P.Ht = CurvesTransformation.prototype.AkimaSubsplines;
      P.S = [ // x, y
         [0.00000, 0.00000],
         [1.00000, 1.00000]
      ];
      P.St = CurvesTransformation.prototype.AkimaSubsplines;
      P.executeOn(combinedImage);
   }

   function _xxrunCurvesTransformation(combinedImage, frameGroupSize) {

      var P = new CurvesTransformation;
      if(frameGroupSize <= 3) {

         var P = new CurvesTransformation;
         P.R = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.Rt = CurvesTransformation.prototype.AkimaSubsplines;
         P.G = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.Gt = CurvesTransformation.prototype.AkimaSubsplines;
         P.B = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.Bt = CurvesTransformation.prototype.AkimaSubsplines;
         P.K = [ // x, y
            [0.00000, 0.00000],
            [0.24977, 0.12719],
            [0.75023, 0.88377],
            [1.00000, 1.00000]
         ];
         P.Kt = CurvesTransformation.prototype.AkimaSubsplines;
         P.A = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.At = CurvesTransformation.prototype.AkimaSubsplines;
         P.L = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.Lt = CurvesTransformation.prototype.AkimaSubsplines;
         P.a = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.at = CurvesTransformation.prototype.AkimaSubsplines;
         P.b = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.bt = CurvesTransformation.prototype.AkimaSubsplines;
         P.c = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.ct = CurvesTransformation.prototype.AkimaSubsplines;
         P.H = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.Ht = CurvesTransformation.prototype.AkimaSubsplines;
         P.S = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.St = CurvesTransformation.prototype.AkimaSubsplines;

         // Good for up to ~3 images?
         /*
         var P = new CurvesTransformation;
         P.R = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.Rt = CurvesTransformation.prototype.AkimaSubsplines;
         P.G = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.Gt = CurvesTransformation.prototype.AkimaSubsplines;
         P.B = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.Bt = CurvesTransformation.prototype.AkimaSubsplines;
         P.K = [ // x, y
            [0.00000, 0.00000],
            [0.31362, 0.25000],
            [0.56526, 0.86842],
            [1.00000, 1.00000]
         ];
         P.Kt = CurvesTransformation.prototype.AkimaSubsplines;
         P.A = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.At = CurvesTransformation.prototype.AkimaSubsplines;
         P.L = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.Lt = CurvesTransformation.prototype.AkimaSubsplines;
         P.a = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.at = CurvesTransformation.prototype.AkimaSubsplines;
         P.b = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.bt = CurvesTransformation.prototype.AkimaSubsplines;
         P.c = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.ct = CurvesTransformation.prototype.AkimaSubsplines;
         P.H = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.Ht = CurvesTransformation.prototype.AkimaSubsplines;
         P.S = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.St = CurvesTransformation.prototype.AkimaSubsplines;
         */
      }

      else {
         // Good for 6 images!

         P.R = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.Rt = CurvesTransformation.prototype.AkimaSubsplines;
         P.G = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.Gt = CurvesTransformation.prototype.AkimaSubsplines;
         P.B = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.Bt = CurvesTransformation.prototype.AkimaSubsplines;
         P.K = [ // x, y
            [0.00000, 0.00000],
            [0.24977, 0.23026],
            [0.74930, 0.77851],
            [1.00000, 1.00000]
         ];
         P.Kt = CurvesTransformation.prototype.AkimaSubsplines;
         P.A = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.At = CurvesTransformation.prototype.AkimaSubsplines;
         P.L = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.Lt = CurvesTransformation.prototype.AkimaSubsplines;
         P.a = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.at = CurvesTransformation.prototype.AkimaSubsplines;
         P.b = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.bt = CurvesTransformation.prototype.AkimaSubsplines;
         P.c = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.ct = CurvesTransformation.prototype.AkimaSubsplines;
         P.H = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.Ht = CurvesTransformation.prototype.AkimaSubsplines;
         P.S = [ // x, y
            [0.00000, 0.00000],
            [1.00000, 1.00000]
         ];
         P.St = CurvesTransformation.prototype.AkimaSubsplines;
      }



      P.executeOn(combinedImage);
   }

}
