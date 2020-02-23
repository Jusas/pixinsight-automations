#include "histogram-stretch.js"
#include "filter-defines.js"

function LrgbPipeline() {

   this.execute = function(views) {

      _autoBackgroundExtraction(views);
      _applyHistogramTransforms(views);

      var redView = _findImageViewByFilter(views, FILTER_R);
      var greenView = _findImageViewByFilter(views, FILTER_G);
      var blueView = _findImageViewByFilter(views, FILTER_B);

      var combined = _channelCombineRgb(redView, greenView, blueView);
      _runMultiscaleMedianTransform(combined);
      _runCurvesTransform(combined);

      return combined;
   }

   function _autoBackgroundExtraction(views) {

      var P = new AutomaticBackgroundExtractor;
      P.tolerance = 1.000;
      P.deviation = 0.800;
      P.unbalance = 1.800;
      P.minBoxFraction = 0.050;
      P.maxBackground = 1.0000;
      P.minBackground = 0.0000;
      P.useBrightnessLimits = false;
      P.polyDegree = 4;
      P.boxSize = 5;
      P.boxSeparation = 5;
      P.modelImageSampleFormat = AutomaticBackgroundExtractor.prototype.f32;
      P.abeDownsample = 2.00;
      P.writeSampleBoxes = false;
      P.justTrySamples = false;
      P.targetCorrection = AutomaticBackgroundExtractor.prototype.Subtract;
      P.normalize = false;
      P.discardModel = true;
      P.replaceTarget = true;
      P.correctedImageId = "";
      P.correctedImageSampleFormat = AutomaticBackgroundExtractor.prototype.SameAsTarget;
      P.verboseCoefficients = false;
      P.compareModel = false;
      P.compareFactor = 10.00;

      for(var i = 0; i < views.length; i++) {
         P.executeOn(views[i]);
      }

   }

   function _applyHistogramTransforms(views) {

      var histo = new StreamHistogramStretch;

      for(var i = 0; i < views.length; i++) {
         histo.execute(views[i]);
      }

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


   function _channelCombineRgb(redView, greenView, blueView) {


      var P = new ChannelCombination;
      P.colorSpace = ChannelCombination.prototype.RGB;
      P.channels = [ // enabled, id
         [true, redView.id],
         [true, greenView.id],
         [true, blueView.id]
      ];

      //var newImage = new Image(w,h,channels,colorspace,bpsample,sampletype)
      // var newImage = new Image(redView.image.width, redView.image.height, 3, 1);
      var newWindow = new ImageWindow(redView.image.width, redView.image.height, 3, 32, true, true);
      // newWindow.mainView.image = newImage;

      //new ImageWindow( 1, 1, 1,/*numberOfChannels*/ 32,/*bitsPerSample*/ true/*floatSample*/ );
      P.executeOn(newWindow.mainView);
      return newWindow.mainView;
   }

   function _runMultiscaleMedianTransform(combinedImage) {
/*
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
      P.linear = false;*/

      var P = new MultiscaleMedianTransform;
      P.layers = [ // enabled, biasEnabled, bias, noiseReductionEnabled, noiseReductionThreshold, noiseReductionAmount, noiseReductionAdaptive
         [true, true, 0.000, true, 1.2000, 1.00, 0.3000],
         [true, true, 0.000, true, 1.0000, 1.00, 2.0000],
         [true, true, 0.000, true, 1.0000, 1.00, 0.3000],
         [true, true, 0.000, true, 1.0000, 1.00, 0.0000],
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

   function _runCurvesTransform(combinedImage) {

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

}
















