import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { chromium } from "playwright";

import { formatMenu } from "./formatMenu";
import { getMenuDiffs } from "./getMenuDiffs";

export const MENU_URL = "https://mylightspeed.app/UYRRDNWF/C-ordering/menu";
export const MENU_API_ENDPOINT = "https://mylightspeed.app/api/oa/pos/v1/menu";

// Resolve the path to menu.json based on the execution context
const getMenuPath = () => {
  const cwd = process.cwd();
  // If we're in the functions directory (Firebase Functions context)
  if (cwd.endsWith("functions")) {
    return path.join(cwd, "..", "static", "menu.json");
  }
  // If we're in the root directory (npm script context)
  return path.join(cwd, "static", "menu.json");
};

export const localFileName = getMenuPath();

export const updateMenu = async (gitCommit: boolean = true) => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(MENU_URL);
    const promise = page.waitForResponse(MENU_API_ENDPOINT);

    const response = await promise;
    const menu = await response.json();
    const formattedMenu = formatMenu(menu.groups);

    const menuDiffs = getMenuDiffs(
      JSON.parse(fs.readFileSync(localFileName, "utf8")),
      formattedMenu,
    );

    if (menuDiffs.length === 0) {
      await browser.close();
      return { message: "No menu changes detected", changes: [] };
    }

    // Write the new menu to file
    fs.writeFileSync(localFileName, JSON.stringify(formattedMenu, null, 2));

    // Configure Git with environment variables
    if (process.env.GIT_USER_NAME && process.env.GIT_USER_EMAIL) {
      execSync(`git config --global user.name "${process.env.GIT_USER_NAME}"`);
      execSync(
        `git config --global user.email "${process.env.GIT_USER_EMAIL}"`,
      );
    }

    // Use HTTPS with token for authentication
    const repoUrl = process.env.GIT_REPO_URL;
    const token = process.env.GIT_TOKEN;

    if (!token) {
      throw new Error(
        "Git token not configured. Please set GIT_TOKEN environment variable.",
      );
    }

    if (!repoUrl) {
      throw new Error(
        "Repository URL not configured. Please set GIT_REPO_URL environment variable.",
      );
    }

    // Update remote URL to include token
    execSync(
      `git remote set-url origin https://${token}@${repoUrl.replace("https://", "")}`,
    );

    if (gitCommit) {
      console.log("Committing changes");
      // Commit and push changes
      try {
        execSync("git add ../static/menu.json");
        // execSync('git commit -m "Update menu from admin interface"');
        // execSync("git push origin main");
      } catch (error) {
        throw new Error(
          `Error committing changes: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }

    await browser.close();
    return {
      message:
        "Menu updated successfully. Changes will be visible in the website in a few minutes. If not, please contact the website administrator.",
      changes: menuDiffs,
    };
  } catch (error) {
    await browser.close();
    throw error;
  }
};
