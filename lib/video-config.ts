// Video configuration for Mux integration
export const videoConfig = {
  // Replace this with your actual Mux Playback ID once you have it
  homePageVideo: {
    playbackId: "AY02ObBaJzq01dJCjKL4hVjxVmV6cqgFdVnT15Rn1xOds", // Your Mux Playback ID
    title: "Welcome to Golden HomeShare",
    description: "Discover how our homesharing platform connects older adults with trusted housemates for mutual benefit and companionship.",
    thumbnailUrl: "/video-thumbnail.jpg", // Custom thumbnail image
    autoplay: false,
    muted: false,
    loop: false,
  }
};

// You can add more video configurations here for different pages
export const additionalVideos = {
  aboutPage: {
    playbackId: "ANOTHER_MUX_PLAYBACK_ID",
    title: "Our Story",
    description: "Learn about the mission behind Golden HomeShare.",
  },
  // Add more videos as needed
}; 