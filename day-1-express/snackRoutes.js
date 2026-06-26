import express from 'express';

const router = express.Router();

const snacks = ['chips', 'cookies', 'popcorn'];

// GET /snacks
router.get('/', (req, res) => {
  res.json(snacks);
});
// GET /snacks/:id
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const snack = snacks[id];

  if (!snack) {
    return res.status(404).json({ message: 'Snack not found' });
  }

  // req.requestStartTime was attached by snackTimer middleware earlier in the chain.
  // This proves middleware can pass data forward through req.
  const elapsed = Date.now() - req.requestStartTime;

  res.json({ id, snack, processedInMs: elapsed });
});

// POST /snacks
router.post('/', (req, res) => {
  const { name } = req.body;
  res.json({ message: 'Snack added', snack: name });
});

export default router;