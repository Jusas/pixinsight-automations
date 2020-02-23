

function StreamSaveAsJpeg(view, filename) {

   var format = new FileFormat(".jpg", false/*toRead*/, true/*toWrite*/);
   var jpg = new FileFormatInstance(format);

   jpg.create(filename);

   var desc = new ImageDescription;
   desc.bitsPerSample = 8;
   jpg.setOptions(desc);
   jpg.writeImage(view.image);

}
