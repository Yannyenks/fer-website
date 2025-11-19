// Express routes for candidates, images, and admin CRUD
const express = require('express');
const db = require('./db');
const router = express.Router();

// Candidates CRUD
router.get('/candidates', (req, res) => {
  db.all('SELECT * FROM candidates', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/candidates', (req, res) => {
  const { slug, name, age, origin, domain, bio, photo } = req.body;
  db.run('INSERT INTO candidates (slug, name, age, origin, domain, bio, photo) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [slug, name, age, origin, domain, bio, photo],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
});

router.put('/candidates/:id', (req, res) => {
  const { name, age, origin, domain, bio, photo, votes } = req.body;
  db.run('UPDATE candidates SET name=?, age=?, origin=?, domain=?, bio=?, photo=?, votes=? WHERE id=?',
    [name, age, origin, domain, bio, photo, votes, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    });
});

router.delete('/candidates/:id', (req, res) => {
  db.run('DELETE FROM candidates WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Images CRUD
router.get('/images', (req, res) => {
  db.all('SELECT * FROM images', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/images', (req, res) => {
  const { section, url } = req.body;
  db.run('INSERT INTO images (section, url) VALUES (?, ?)', [section, url], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

router.put('/images/:id', (req, res) => {
  const { section, url } = req.body;
  db.run('UPDATE images SET section=?, url=? WHERE id=?', [section, url, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

router.delete('/images/:id', (req, res) => {
  db.run('DELETE FROM images WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
