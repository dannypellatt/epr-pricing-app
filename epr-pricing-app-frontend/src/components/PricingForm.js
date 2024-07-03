import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Checkbox, FormControlLabel, Card, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; 

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
  
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Number of Items"
            type="number"
            value={numItems}
            onChange={(e) => setNumItems(e.target.value)}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
            fullWidth
          >
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={hasBaseInfo}
                onChange={(e) => setHasBaseInfo(e.target.checked)}
              />
            }
            label="Has Base Information"
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Calculate
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">
            Total Cost: {totalCost !== null ? formatCurrency(totalCost) : '$0.00'}
          </Typography>
        </Grid>
      </Grid>     
    </form>
  );
};

export default PricingForm;
