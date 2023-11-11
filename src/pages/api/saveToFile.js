import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Process POST request
    const data = req.body;
    const filePath = path.join(process.cwd(), "contact-data.json");

    try {
      // Read the existing file or create an empty array if the file doesn't exist
      let currentData = [];
      if (fs.existsSync(filePath)) {
        currentData = JSON.parse(fs.readFileSync(filePath, "utf8"));
      }

      // Append the new data
      currentData.push(data);

      // Write the updated array back to the file
      fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), "utf8");

      // Send a response back to the client
      res.status(200).json({ message: "Data has been saved" });
    } catch (error) {
      console.error("Error writing to the file:", error);
      res.status(500).json({ message: "Failed to save data" });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
