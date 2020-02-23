
#define MY_TARGET_MEAN_BG 0.2
#define MY_SHADOWCLIP -3.8


function StreamHistogramStretch() {

   this.execute = function(masterView, otherViews) {

      var median = masterView.computeOrFetchProperty( "Median" );
      var mad = masterView.computeOrFetchProperty( "MAD" );
      mad.mul( 1.4826 ); // coherent with a normal distribution

      var c0 = 0;
      var m = 0;

      if (1 + mad.at(0) != 1) {
         c0 = median.at(0) + MY_SHADOWCLIP * mad.at(0);
      }
      m = median.at(0);

      c0 = Math.range(c0, 0.0, 1.0);
      m = Math.mtf(MY_TARGET_MEAN_BG, m - c0);

      var histogramMatrix = [
         [0, 0.5, 1.0, 0, 1.0],
         [0, 0.5, 1.0, 0, 1.0],
         [0, 0.5, 1.0, 0, 1.0],
         [c0, m, 1.0, 0, 1.0],
         [0, 0.5, 1.0, 0, 1.0]
      ];
      var P = new HistogramTransformation;
      P.H = histogramMatrix;

      P.executeOn(masterView);
      if(otherViews != undefined && otherViews.length > 0) {
         for(var i = 0; i < otherViews.length; i++) {
            P.executeOn(otherViews[i]);
         }
      }
   }



}
