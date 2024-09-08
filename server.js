const express = require("express");
const ytdl = require("yt-dl-core"); // Ensure yt-dl-core is installed
const app = express();

// Endpoint to handle YouTube video download
app.get("/download", async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).send("URL is required");
  }

  try {
    // Get video info
    const info = await ytdl.getInfo(videoUrl);
    const format = ytdl.chooseFormat(info.formats, { quality: "highest" });

    // Set headers for download
    res.header(
      "Content-Disposition",
      `attachment; filename="${info.videoDetails.title}.mp4"`,
    );
    res.header("Content-Type", "video/mp4");

    // Stream video
    ytdl(videoUrl, { format }).pipe(res);
  } catch (error) {
    console.error("Error downloading video:", error);
    res.status(500).send("Error downloading video");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
