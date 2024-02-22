// Imports the Google Cloud client library
const { Storage } = require("@google-cloud/storage");

const GCS_BUCKET_NAME = "soulzuerich.ch";
const DEST_FILE_NAME = "menu.json";

// Creates a client
const storage = new Storage();
const bucket = storage.bucket(GCS_BUCKET_NAME);

async function uploadFile(data) {
  const file = bucket.file(DEST_FILE_NAME);
  const contents = JSON.stringify(data);
  console.log("Uploading menu.json to GCS...");

  await file.save(contents, {
    metadata: { contentType: "application/json", cacheControl: "no-cache" },
  });

  await bucket.file(DEST_FILE_NAME).makePublic();
  return;
}

exports.uploadFile = uploadFile;
