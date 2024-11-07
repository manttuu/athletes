const mariadb = require("mariadb");

// Määritellään yhteys
const pool = mariadb.createPool({
  host: "localhost",
  user: "root", // Käyttäjätunnus
  password: "ruutti", // Käyttäjän salasana
  database: "urheilijat", // Tietokannan nimi
  connectionLimit: 5, // Maksimi yhteyksien määrä
});

module.exports = pool;
