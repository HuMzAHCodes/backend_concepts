import express from 'express';
import snackRoutes from './snackRoutes.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/snacks', snackRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Snack Shop API');
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


