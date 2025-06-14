/**
 * Data cleanup script for islands.json
 * Run once to fix the data structure
 */
const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "../data/islands.json");

async function cleanupData() {
  try {
    // Read the islands.json file as text first to remove comments
    let fileContent = fs.readFileSync(FILE_PATH, "utf8");

    // Remove any JavaScript comments
    fileContent = fileContent.replace(/\/\/.*$/gm, "");

    // Parse the JSON
    let islandsData = JSON.parse(fileContent);

    // Filter out incomplete islands entries - keep only entries with all required fields
    const completeIslands = islandsData.filter((island) => island && island.name && island.prefecture && typeof island.rarity === "number");

    console.log(`Original entries: ${islandsData.length}, Complete entries: ${completeIslands.length}`);

    // Write the cleaned data back to the file
    fs.writeFileSync(FILE_PATH, JSON.stringify(completeIslands, null, 2), "utf8");

    console.log("Data cleanup completed successfully!");
  } catch (error) {
    console.error("Error during data cleanup:", error);
  }
}

cleanupData();
