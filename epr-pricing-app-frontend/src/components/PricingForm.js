import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Checkbox, FormControlLabel, Typography, Paper, Grid } from '@mui/material';

const PricingForm = () => {
  const [numItems, setNumItems] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [hasBaseInfo, setHasBaseInfo] = useState(false);
  const [totalCost, setTotalCost] = useState(null);
  const [verificationTime, setVerificationTime] = useState(null);
  const [costPerItem, setCostPerItem] = useState(null);
  const [predictedPasses, setPredictedPasses] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the default form submission
    if (numItems > 150000) {
      setError('Please enter a number less than or equal to 150,000.');
      return;
    } else {
      setError('');
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/calculate', {
        numItems,
        difficulty,
        hasBaseInfo,
      });
      console.log('Response received:', response.data);
      setTotalCost(response.data.total_cost);
      setVerificationTime(response.data.verification_time);
      setCostPerItem(response.data.cost_per_item);
      setPredictedPasses(response.data.predicted_passes);
    } catch (error) {
      console.error('Error calculating cost:', error);
    }
  };
  
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatPreciseCurrency = (amount) => {
    return `$${amount.toFixed(4)}`;
  };

  const formatHours = (hours) => {
    return `${hours.toFixed(2)} hours`;
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
            error={!!error}
            helperText={error}
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
        {totalCost !== null && (
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h6">
                Breakdown:
              </Typography>
              <Typography variant="body1">
                Verification Time: {formatHours(verificationTime)}
              </Typography>
              <Typography variant="body1">
                Cost per Item Scraped: {costPerItem !== null ? formatPreciseCurrency(costPerItem) : '$0.0000'}
              </Typography>
              <Typography variant="body1">
                Predicted Passes: {predictedPasses}
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>     
    </form>
  );
};

export default PricingForm;
