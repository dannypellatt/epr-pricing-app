// src/components/PricingForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Checkbox, FormControlLabel } from '@mui/material';

const PricingForm = () => {
  const [numItems, setNumItems] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [hasBaseInfo, setHasBaseInfo] = useState(false);
  const [totalCost, setTotalCost] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the default form submission
    try {
        const response = await axios.post('http://127.0.0.1:5000/calculate', {
          numItems,
          difficulty,
          hasBaseInfo,
        });
        console.log('Response received:', response.data);
        setTotalCost(response.data.total_cost);
      } catch (error) {
        console.error('Error calculating cost:', error);
      }
  };
  
  return (
    <form onSubmit={handleSubmit}>
  <TextField
    label="Number of Items"
    type="number"
    value={numItems}
    onChange={(e) => setNumItems(e.target.value)}
    required
  />
  <TextField
    select
    label="Difficulty"
    value={difficulty}
    onChange={(e) => setDifficulty(e.target.value)}
    required
  >
    <MenuItem value="easy">Easy</MenuItem>
    <MenuItem value="medium">Medium</MenuItem>
    <MenuItem value="hard">Hard</MenuItem>
  </TextField>
  <FormControlLabel
    control={
      <Checkbox
        checked={hasBaseInfo}
        onChange={(e) => setHasBaseInfo(e.target.checked)}
      />
    }
    label="Has Base Information"
  />
  <Button type="submit" variant="contained" color="primary">
    Calculate
  </Button>
  {totalCost !== null && <div>Total Cost: {totalCost}</div>}
</form>

  );
};

export default PricingForm;
