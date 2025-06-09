const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Koneksi MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ganti jika ada password
  database: 'ekspresi_muka'
});

db.connect((err) => {
  if (err) {
    console.error('Koneksi ke database gagal:', err);
    return;
  }
  console.log('Terhubung ke database MySQL.');
});

// Endpoint untuk menyimpan data
app.post('/log-expression', (req, res) => {
  const { timestamp, expression, image, song } = req.body;

  if (!image || !expression || !song) {
    return res.status(400).send('Data tidak lengkap.');
  }

  const imageBuffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');

  const sql = `
    INSERT INTO face_logs (timestamp, expression, face_image, song_title, song_artist, song_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    timestamp,
    expression,
    imageBuffer,
    song.title,
    song.artist,
    song.url
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Gagal menyimpan ke database:', err);
      return res.status(500).send('Database error');
    }
    res.status(200).send('Data berhasil disimpan.');
  });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});