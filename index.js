const express = require("express");
const { google } = require("googleapis");
const app = express();

// Middleware for parsing JSON in the request body
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", async (req, res) => {
  console.log(req.body);
  const { name } = req.body;
  const currenttime = new Date();
  console.log(name, currenttime);
  const path = require("path");
  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve(__dirname, "./credentials.json"),
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1Y3PR4UUuBe-b_VSsO3OwIqYr3wVSqMNG7XZAJzDuEww";

  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1!A:A",
  });

  // Write row(s) to spreadsheet
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[name, currenttime]],
    },
  });

  res.send("Successfully submitted! Thank you!");
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
