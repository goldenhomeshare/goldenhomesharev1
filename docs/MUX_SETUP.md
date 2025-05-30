# Mux Video Integration Setup Guide

## Overview
This guide walks you through setting up Mux video streaming for the Golden HomeShare website.

## Step 1: Create a Mux Account

1. Go to [mux.com](https://mux.com) and sign up for an account
2. Choose the plan that fits your needs (they have a free tier for testing)

## Step 2: Upload Your Video

1. In the Mux Dashboard, navigate to "Assets"
2. Click "Upload a video" 
3. Upload your video file (MP4, MOV, etc.)
4. Wait for processing to complete
5. Once processed, you'll get a **Playback ID** - copy this!

## Step 3: Update Your Website Configuration

1. Open `lib/video-config.ts`
2. Replace `"YOUR_MUX_PLAYBACK_ID"` with your actual Playback ID from step 2
3. Optionally customize the title, description, and other settings

Example:
```typescript
export const videoConfig = {
  homePageVideo: {
    playbackId: "abc123def456", // Your actual Playback ID
    title: "See How HomeSharing Works",
    description: "Watch this short video to understand how our platform connects homeowners with trusted housemates.",
    autoplay: false,
    muted: true,
    loop: false,
  }
};
```

## Step 4: Optional - Add a Poster Image

1. Add a video thumbnail image to your `public` folder (e.g., `public/video-poster.jpg`)
2. Update the config to include the poster:

```typescript
poster: "/video-poster.jpg"
```

## Step 5: Test Your Integration

1. Run your development server: `npm run dev`
2. Navigate to your homepage
3. You should see the video player under the hero section

## Advanced Configuration

### Multiple Videos
To add videos to other pages, update the `additionalVideos` object in `video-config.ts`:

```typescript
export const additionalVideos = {
  aboutPage: {
    playbackId: "your-about-video-playback-id",
    title: "Our Story",
    description: "Learn about the mission behind Golden HomeShare.",
  }
};
```

### Video Player Options
The VideoSection component supports these props:
- `playbackId`: Your Mux Playback ID (required)
- `title`: Video title displayed above player
- `description`: Description text below title
- `poster`: Thumbnail image URL
- `autoplay`: Auto-start video (default: false)
- `muted`: Start muted (default: true, required for autoplay)
- `loop`: Loop the video (default: false)

### Styling Customization
The video player uses Tailwind CSS classes and can be customized in `components/VideoSection.tsx`.

## Troubleshooting

### Video Not Loading
- Verify your Playbook ID is correct
- Check that the video finished processing in Mux Dashboard
- Make sure your Mux account is active

### Autoplay Issues
- Browsers require videos to be muted for autoplay
- Set `muted: true` if using `autoplay: true`

### Performance Tips
- Use appropriate video resolutions (1080p for most web use)
- Consider using poster images for faster initial load
- Mux automatically optimizes delivery for different devices

## Need Help?
- Check the [Mux documentation](https://docs.mux.com/)
- Review the [Mux React SDK docs](https://docs.mux.com/guides/system/react-player) 