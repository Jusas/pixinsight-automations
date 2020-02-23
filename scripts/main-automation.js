#include "preprocess.js"
#include "crop.js"
#include "narrowband-pipeline.js"
#include "lrgb-pipeline.js"
#include "prepare-workspace.js"
#include "pipeline-resolver.js"
#include "save-jpeg.js"

/*
var inputJson = {
   "outputDir": "Z:/temp/IC-1795",
   "lights": [
      "V:/Sessions/2019-08-21/IC1795/Light/Ha/accepted/Light_Ha_150_secs_001.fits",
      "V:/Sessions/2019-08-21/IC1795/Light/Ha/accepted/Light_Ha_150_secs_002.fits",
      "V:/Sessions/2019-08-21/IC1795/Light/Ha/accepted/Light_Ha_150_secs_003.fits",
      "V:/Sessions/2019-08-21/IC1795/Light/Ha/accepted/Light_Ha_150_secs_004.fits",
      "V:/Sessions/2019-08-21/IC1795/Light/Ha/accepted/Light_Ha_150_secs_005.fits",
      "V:/Sessions/2019-08-21/IC1795/Light/Ha/accepted/Light_Ha_150_secs_006.fits",
      "V:/Sessions/2019-08-21/IC1795/Light/O3/accepted/Light_O3_150_secs_001.fits",
      "V:/Sessions/2019-08-21/IC1795/Light/O3/accepted/Light_O3_150_secs_002.fits",
      "V:/Sessions/2019-08-21/IC1795/Light/O3/accepted/Light_O3_150_secs_003.fits",
      "V:/Sessions/2019-08-21/IC1795/Light/O3/accepted/Light_O3_150_secs_004.fits",
      "V:/Sessions/2019-08-21/IC1795/Light/O3/accepted/Light_O3_150_secs_005.fits",
      "V:/Sessions/2019-08-21/IC1795/Light/O3/accepted/Light_O3_150_secs_006.fits"
   ],
   "masterFlats": [
      "V:/Sessions/2019-08-21/IC1795/Light/master/flat-FILTER_Ha-BINNING_1.xisf",
      "V:/Sessions/2019-08-21/IC1795/Light/master/flat-FILTER_O3-BINNING_1.xisf"
   ],
   "masterDarks": [
      "V:/Calibration/Darks/asi1600/dark/g139/bin1/Dark/master/dark-BINNING_1-EXPTIME_150.xisf"
   ],
   "outputImage": "Z:/temp/ic1795-6.jpg"
};
*/

/*
var inputJson = {
   "outputDir": "Z:/temp/Galaxy",
   "lights": [
      "V:/Sessions/2018-11-24/M101/Light/Blue/Light_Blue_20_secs_001.fits",
      "V:/Sessions/2018-11-24/M101/Light/Blue/Light_Blue_20_secs_002.fits",
      "V:/Sessions/2018-11-24/M101/Light/Blue/Light_Blue_20_secs_003.fits",
      "V:/Sessions/2018-11-24/M101/Light/Blue/Light_Blue_20_secs_004.fits",
      "V:/Sessions/2018-11-24/M101/Light/Blue/Light_Blue_20_secs_005.fits",
      "V:/Sessions/2018-11-24/M101/Light/Blue/Light_Blue_20_secs_006.fits",
      "V:/Sessions/2018-11-24/M101/Light/Blue/Light_Blue_20_secs_007.fits",
      "V:/Sessions/2018-11-24/M101/Light/Blue/Light_Blue_20_secs_008.fits",
      "V:/Sessions/2018-11-24/M101/Light/Green/Light_Green_20_secs_001.fits",
      "V:/Sessions/2018-11-24/M101/Light/Green/Light_Green_20_secs_002.fits",
      "V:/Sessions/2018-11-24/M101/Light/Green/Light_Green_20_secs_003.fits",
      "V:/Sessions/2018-11-24/M101/Light/Green/Light_Green_20_secs_004.fits",
      "V:/Sessions/2018-11-24/M101/Light/Green/Light_Green_20_secs_005.fits",
      "V:/Sessions/2018-11-24/M101/Light/Green/Light_Green_20_secs_006.fits",
      "V:/Sessions/2018-11-24/M101/Light/Green/Light_Green_20_secs_007.fits",
      "V:/Sessions/2018-11-24/M101/Light/Green/Light_Green_20_secs_008.fits",
      "V:/Sessions/2018-11-24/M101/Light/Red/Light_Red_20_secs_001.fits",
      "V:/Sessions/2018-11-24/M101/Light/Red/Light_Red_20_secs_002.fits",
      "V:/Sessions/2018-11-24/M101/Light/Red/Light_Red_20_secs_003.fits",
      "V:/Sessions/2018-11-24/M101/Light/Red/Light_Red_20_secs_004.fits",
      "V:/Sessions/2018-11-24/M101/Light/Red/Light_Red_20_secs_005.fits",
      "V:/Sessions/2018-11-24/M101/Light/Red/Light_Red_20_secs_006.fits",
      "V:/Sessions/2018-11-24/M101/Light/Red/Light_Red_20_secs_007.fits",
      "V:/Sessions/2018-11-24/M101/Light/Red/Light_Red_20_secs_008.fits"
   ],
   "masterFlats": [
      "V:/Sessions/2018-11-24/M101/processed/master/flat-FILTER_Blue-BINNING_2.xisf",
      "V:/Sessions/2018-11-24/M101/processed/master/flat-FILTER_Red-BINNING_2.xisf",
      "V:/Sessions/2018-11-24/M101/processed/master/flat-FILTER_Green-BINNING_2.xisf"
   ],
   "masterDarks": [
      "V:/Calibration/Darks/asi1600/dark/g76/bin2/Dark/master/dark-BINNING_2-EXPTIME_20.xisf"
   ],
   "outputImage": "Z:/temp/galaxy-1.jpg"
};
*/

var inputJson = {
   "outputDir": "Z:/temp/Galaxy51",
   "lights": [
      "V:/Sessions/2019-01-27/M51/20s/Blue/Light_Blue_20_secs_001.fits",
      "V:/Sessions/2019-01-27/M51/20s/Blue/Light_Blue_20_secs_002.fits",
      "V:/Sessions/2019-01-27/M51/20s/Blue/Light_Blue_20_secs_003.fits",
      "V:/Sessions/2019-01-27/M51/20s/Blue/Light_Blue_20_secs_004.fits",
      "V:/Sessions/2019-01-27/M51/20s/Blue/Light_Blue_20_secs_005.fits",
      "V:/Sessions/2019-01-27/M51/20s/Blue/Light_Blue_20_secs_006.fits",
      "V:/Sessions/2019-01-27/M51/20s/Blue/Light_Blue_20_secs_007.fits",
      "V:/Sessions/2019-01-27/M51/20s/Blue/Light_Blue_20_secs_008.fits",
      "V:/Sessions/2019-01-27/M51/20s/Green/Light_Green_20_secs_001.fits",
      "V:/Sessions/2019-01-27/M51/20s/Green/Light_Green_20_secs_002.fits",
      "V:/Sessions/2019-01-27/M51/20s/Green/Light_Green_20_secs_003.fits",
      "V:/Sessions/2019-01-27/M51/20s/Green/Light_Green_20_secs_004.fits",
      "V:/Sessions/2019-01-27/M51/20s/Green/Light_Green_20_secs_005.fits",
      "V:/Sessions/2019-01-27/M51/20s/Green/Light_Green_20_secs_006.fits",
      "V:/Sessions/2019-01-27/M51/20s/Green/Light_Green_20_secs_007.fits",
      "V:/Sessions/2019-01-27/M51/20s/Green/Light_Green_20_secs_008.fits",
      "V:/Sessions/2019-01-27/M51/20s/Red/Light_Red_20_secs_001.fits",
      "V:/Sessions/2019-01-27/M51/20s/Red/Light_Red_20_secs_002.fits",
      "V:/Sessions/2019-01-27/M51/20s/Red/Light_Red_20_secs_003.fits",
      "V:/Sessions/2019-01-27/M51/20s/Red/Light_Red_20_secs_004.fits",
      "V:/Sessions/2019-01-27/M51/20s/Red/Light_Red_20_secs_005.fits",
      "V:/Sessions/2019-01-27/M51/20s/Red/Light_Red_20_secs_006.fits",
      "V:/Sessions/2019-01-27/M51/20s/Red/Light_Red_20_secs_007.fits",
      "V:/Sessions/2019-01-27/M51/20s/Red/Light_Red_20_secs_008.fits",
      "V:/Sessions/2019-01-27/M51/20s/Red/Light_Red_20_secs_010.fits",
      "V:/Sessions/2019-01-27/M51/20s/Red/Light_Red_20_secs_011.fits",
      "V:/Sessions/2019-01-27/M51/20s/Red/Light_Red_20_secs_012.fits",
      "V:/Sessions/2019-01-27/M51/20s/Red/Light_Red_20_secs_013.fits"
   ],
   "masterFlats": [
      "V:/Sessions/2019-08-15-flat/Flat/Blue/Flat_Blue_001.fits",
      "V:/Sessions/2019-08-15-flat/Flat/Green/Flat_Green_001.fits",
      "V:/Sessions/2019-08-15-flat/Flat/Red/Flat_Red_001.fits",
   ],
   "masterDarks": [
      "V:/Calibration/Darks/asi1600/dark/g0/bin1/Dark/master/dark-BINNING_1-EXPTIME_20.xisf"
   ],
   "outputImage": "Z:/temp/galaxy-51.jpg"
};

var pp = new StreamImagePreprocessor;
var preprocessOutput = pp.execute(inputJson);
var preprocessOutputDir = preprocessOutput.outputDir;
var frameGroupSize = preprocessOutput.frameGroupSize;

var ws = new StreamWorkspace;
var workViews = ws.openFilesToViews(preprocessOutputDir);

var cropper = new StreamCropper;
cropper.execute(workViews);

var pipelineResolver = new StreamPipelineResolver;
var pipelineType = pipelineResolver.resolve(workViews);

var imageToSave = null;
if(pipelineType == StreamPipelineType.NarrowBand) {
   var nbPipe = new StreamNarrowbandPipeline;
   imageToSave = nbPipe.execute(workViews, frameGroupSize);

   StreamSaveAsJpeg(imageToSave, inputJson.outputImage);
}
if(pipelineType == StreamPipelineType.LRGB) {
   var lrgbPipe = new LrgbPipeline;
   imageToSave = lrgbPipe.execute(workViews, frameGroupSize);

   StreamSaveAsJpeg(imageToSave, inputJson.outputImage);
}
ws.cleanupWindows();
