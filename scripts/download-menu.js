const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");

const GCS_MENU_BUCKET_NAME =
  process.env.GCS_MENU_BUCKET_NAME || "soulzuerich.ch";
const DEST_FILE_NAME = "menu.json";

async function downloadMenu() {
  const storage = new Storage();
  const bucket = storage.bucket(GCS_MENU_BUCKET_NAME);
  const file = bucket.file(DEST_FILE_NAME);

  // Create the static directory if it doesn't exist
  const staticDir = path.join(__dirname, "../static");
  if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
  }

  const destPath = path.join(staticDir, DEST_FILE_NAME);

  console.log(
    `Downloading menu from gs://${GCS_MENU_BUCKET_NAME}/${DEST_FILE_NAME}...`,
  );

  try {
    await file.download({
      destination: destPath,
    });

    console.log(`Menu downloaded to ${destPath}`);
  } catch (error) {
    console.error("Error downloading menu from GCS:", error);
    throw new Error(`Failed to download menu from GCS: ${error.message}`);
  }
}

// Run the download if this script is executed directly
if (require.main === module) {
  downloadMenu().catch(console.error);
}

module.exports = { downloadMenu };
