const express = require('express');
const router = express.Router();
const vectorDB = require('../services/VectorDB');

router.post('/search', async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;
    const results = await vectorDB.searchConversations(query, limit);
    res.json({ success: true, results });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/context', async (req, res) => {
  try {
    const { query, limit = 3 } = req.body;
    const context = await vectorDB.getRelevantContext(query, limit);
    res.json({ success: true, context });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
