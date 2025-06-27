// Load environment variables from .env file
require("dotenv").config();

const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/./../functions/.env" });

require("ts-node").register({
  transpileOnly: true,
  compilerOptions: {
    module: "commonjs",
  },
});

const { updateMenu } = require("../functions/src/utils/menu");

async function main() {
  try {
    const result = await updateMenu();
    console.log(result.message);
    if (result.changes.length > 0) {
      console.log("Menu Diffs: ", result.changes.join("\n"));
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
