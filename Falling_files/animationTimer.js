AnimationTimer = function (duration, timeWarp)  {
   this.timeWarp = timeWarp;

   if (duration !== undefined) this.duration = duration;
   else                        this.duration = 1000;

   this.stopwatch = new Stopwatch();
};

AnimationTimer.prototype = {
   start: function () {
      this.stopwatch.start();
   },

   stop: function () {
      this.stopwatch.stop();
   },

   getRealElapsedTime: function () {
      return this.stopwatch.getElapsedTime();
   },
   
   getElapsedTime: function () {
      var elapsedTime = this.stopwatch.getElapsedTime(),
          percentComplete = elapsedTime / this.duration;

      if (!this.stopwatch.running)    return undefined;
      if (this.timeWarp == undefined) return elapsedTime;

      return elapsedTime * (this.timeWarp(percentComplete) / percentComplete);
   },

   isRunning: function() {
      return this.stopwatch.running;
   },
   
   isOver: function () {
      return this.stopwatch.getElapsedTime() > this.duration;
   },

   reset: function() {
      this.stopwatch.reset();
   }
};

