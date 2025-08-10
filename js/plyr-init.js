// Custom Plyr media player settings
document.addEventListener("DOMContentLoaded", function () {
  const players = Plyr.setup(".plyr", {
    controls: [
      "play",
      "progress",
      "current-time",
      "mute",
      "volume",
      "settings",
    ],
    seekTime: 10, // Skip forward/back in seconds
    volume: 0.7, // Default volume
    tooltips: { controls: true },
  });
});
