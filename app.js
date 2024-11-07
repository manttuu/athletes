const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const athleteRoutes = require("./athletes"); // Tuodaan urheilijat-reitit

// Middleware JSON-pyynnöille
app.use(bodyParser.json());

// Käytetään reittejä
app.use("/api", athleteRoutes);

// Käynnistetään palvelin
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
