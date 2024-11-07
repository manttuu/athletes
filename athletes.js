const express = require("express");
const router = express.Router();
const pool = require("./db"); // Tietokannan yhteys

// Lisää urheilija
router.post("/athletes", async (req, res) => {
  // Otetaan pyynnöstä tarvittavat tiedot
  const {
    firstName,
    lastName,
    nickname,
    birthYear,
    weight,
    imageUrl,
    sport,
    achievements,
  } = req.body;

  // Parsitaan paino numero-arvoksi
  const parsedWeight = parseFloat(weight);

  // Tarkistetaan, että paino on kelvollinen numero
  if (isNaN(parsedWeight)) {
    return res.status(400).json({ message: "Virheellinen paino" });
  }

  try {
    // Suoritetaan SQL-kysely tietokantaan
    const result = await pool.query(
      "INSERT INTO athletes (first_name, last_name, nickname, birth_year, weight, image_url, sport, achievements) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        firstName,
        lastName,
        nickname,
        birthYear,
        parsedWeight,
        imageUrl,
        sport,
        achievements,
      ]
    );

    // Luodaan uusi urheilija-objekti palautettavaksi
    const newAthlete = {
      id: result.insertId.toString(),
      firstName,
      lastName,
      nickname,
      birthYear,
      weight: parsedWeight,
      imageUrl,
      sport,
      achievements,
    };

    // Lähetetään onnistunut vastaus
    res.status(201).json(newAthlete);
  } catch (err) {
    // Virhe tietokantakyselyssä
    console.error("Virhe urheilijan lisäämisessä:", err);
    res
      .status(500)
      .json({ message: "Virhe urheilijan lisäämisessä", error: err.message });
  }
});

// Hae kaikki urheilijat
router.get("/athletes", async (req, res) => {
  try {
    // Haetaan kaikki urheilijat tietokannasta
    const [athletes] = await pool.query("SELECT * FROM athletes");
    res.status(200).json(athletes);
  } catch (err) {
    // Virhe tietokannan kyselyssä
    console.error("Virhe urheilijoiden haussa:", err);
    res
      .status(500)
      .json({ message: "Virhe urheilijoiden haussa", error: err.message });
  }
});

// Hae urheilija ID:n perusteella
router.get("/athletes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Haetaan urheilija ID:n perusteella
    const [athletes] = await pool.query("SELECT * FROM athletes WHERE id = ?", [
      id,
    ]);

    // Tarkistetaan löytyikö urheilija
    if (athletes.length === 0) {
      return res.status(404).json({ message: "Urheilijaa ei löydy" });
    }

    res.status(200).json(athletes[0]);
  } catch (err) {
    // Virhe tietokannan kyselyssä
    console.error("Virhe urheilijan haussa:", err);
    res
      .status(500)
      .json({ message: "Virhe urheilijan haussa", error: err.message });
  }
});

// Päivitä urheilijan tiedot
router.put("/athletes/:id", async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    nickname,
    birthYear,
    weight,
    imageUrl,
    sport,
    achievements,
  } = req.body;

  // Parsitaan paino numero-arvoksi
  const parsedWeight = parseFloat(weight);

  if (isNaN(parsedWeight)) {
    return res.status(400).json({ message: "Virheellinen paino" });
  }

  try {
    // Päivitetään urheilija tietokannassa
    const result = await pool.query(
      "UPDATE athletes SET first_name = ?, last_name = ?, nickname = ?, birth_year = ?, weight = ?, image_url = ?, sport = ?, achievements = ? WHERE id = ?",
      [
        firstName,
        lastName,
        nickname,
        birthYear,
        parsedWeight,
        imageUrl,
        sport,
        achievements,
        id,
      ]
    );

    // Tarkistetaan, löytyikö päivitettävää urheilijaa
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Urheilijaa ei löydy" });
    }

    // Lähetetään onnistunut vastaus
    res.status(200).json({ message: "Urheilija päivitetty" });
  } catch (err) {
    // Virhe tietokannan kyselyssä
    console.error("Virhe urheilijan päivittämisessä:", err);
    res.status(500).json({
      message: "Virhe urheilijan päivittämisessä",
      error: err.message,
    });
  }
});

// Poista urheilija
router.delete("/athletes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Poistetaan urheilija tietokannasta
    const result = await pool.query("DELETE FROM athletes WHERE id = ?", [id]);

    // Tarkistetaan, löytyikö poistettavaa urheilijaa
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Urheilijaa ei löydy" });
    }

    // Lähetetään onnistunut vastaus
    res.status(200).json({ message: "Urheilija poistettu" });
  } catch (err) {
    // Virhe tietokannan kyselyssä
    console.error("Virhe urheilijan poistamisessa:", err);
    res
      .status(500)
      .json({ message: "Virhe urheilijan poistamisessa", error: err.message });
  }
});

module.exports = router;
