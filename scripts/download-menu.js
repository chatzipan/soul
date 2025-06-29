require("dotenv").config();

const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/./../.env" });

const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");

const GCS_MENU_BUCKET_NAME =
  process.env.GCS_MENU_BUCKET_NAME || "soulzuerich.ch";
const DEST_FILE_NAME = "menu.json";

async function downloadMenu() {
  let storage;

  // Use prod credentials from environment variable if available
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    try {
      const credentials = JSON.parse(
        process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
      );
      storage = new Storage({
        credentials: credentials,
        projectId: credentials.project_id,
      });
      console.log(
        `Using prod credentials for project: ${credentials.project_id}`,
      );
    } catch (error) {
      console.error(
        "Error parsing GOOGLE_APPLICATION_CREDENTIALS_JSON:",
        error,
      );
      throw new Error("Invalid GOOGLE_APPLICATION_CREDENTIALS_JSON format");
    }
  } else {
    // Fallback to default credentials (dev environment)
    storage = new Storage();
    console.log("Using default credentials (dev environment)");
  }

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

    if (
      error.message.includes("Anonymous caller") ||
      error.message.includes("Permission")
    ) {
      console.error(
        "Authentication error. Please check your Google Cloud credentials.",
      );
      console.error(
        "Make sure GOOGLE_APPLICATION_CREDENTIALS_JSON is set with prod project credentials.",
      );
    }

    throw new Error(`Failed to download menu from GCS: ${error.message}`);
  }
}

// Run the download if this script is executed directly
if (require.main === module) {
  downloadMenu().catch(console.error);
}

module.exports = { downloadMenu };
