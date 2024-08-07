import cors from 'cors';
import express from 'express';
import { cars } from './data.js'; 

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Get Most Popular Make
app.get('/api/mostPopularMake', (req, res) => {
  const makeCount = cars.reduce((acc, car) => {
    acc[car.make] = (acc[car.make] || 0) + 1;
    return acc;
  }, {});
  
  const mostPopularMake = Object.keys(makeCount).reduce((a, b) => makeCount[a] > makeCount[b] ? a : b);
  res.json({ mostPopularMake });
});

// Get All Cars
app.get('/api/cars', (req, res) => {
  res.json(cars);
});

// Add a Car
app.post('/api/cars', (req, res) => {
  const { color, make, model, reg_number } = req.body;
  if (!color || !make || !model || !reg_number) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  cars.push({ color, make, model, reg_number });
  res.status(201).json({ message: 'Car added successfully' });
});

// Delete a Car
app.delete('/api/cars/:reg_number', (req, res) => {
  const { reg_number } = req.params;
  const initialLength = cars.length;
  
  // Filter out the car with the given registration number
  const updatedCars = cars.filter(car => car.reg_number !== reg_number);
  
  if (updatedCars.length === initialLength) {
    return res.status(404).json({ message: 'Car not found' });
  }
  
  // Update the cars array
  cars.length = 0;
  cars.push(...updatedCars);
  
  res.json({ message: 'Car deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
