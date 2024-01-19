// Imports the Google Cloud client library
const { Storage } = require("@google-cloud/storage");

// The ID of your GCS bucket
const bucketName = "soulzuerich.ch";

// The new ID for your GCS file
const destFileName = "menu.json";

// Creates a client
const storage = new Storage();
const bucket = storage.bucket(bucketName);

async function uploadFile(data) {
  const file = bucket.file(destFileName);
  const contents = JSON.stringify(data);
  console.log("Uploading menu.json to GCS...");

  await file.save(contents);
  await bucket.file(destFileName).makePublic();
  return;
}

exports.uploadFile = uploadFile;
