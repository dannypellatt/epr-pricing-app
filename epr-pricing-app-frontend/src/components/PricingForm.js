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
  const [error, setError] = useState({ numItems: '', difficulty: '', hasBaseInfo: '' });

  // Checks if number is over 0 and under 150,000 (the current Clay known limit)
  const validateNumItems = (value) => {
    if (!value || isNaN(value) || value <= 0) {
      return 'Please enter a positive number.';
    }
    // CHANGE IF NECESSARY
    if (value > 150000) {
      return 'Please enter a number less than or equal to 150,000.';
    }
    return '';
  };

  // Validates as user types
  const handleNumItemsChange = (e) => {
    const value = e.target.value;
    setNumItems(value);
    setError((prevError) => ({ ...prevError, numItems: validateNumItems(value) }));
  };

  // Updates changes and removes error messages that may be present.
  const handleDifficultyChange = (e) => {
    const value = e.target.value;
    setDifficulty(value);
    setError((prevError) => ({ ...prevError, difficulty: '' }));
  };
  const handleHasBaseInfoChange = (e) => {
    const value = e.target.checked;
    setHasBaseInfo(value);
    setError((prevError) => ({ ...prevError, hasBaseInfo: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numItemsError = validateNumItems(numItems);

    if (numItemsError) {
      setError({ numItems: numItemsError, difficulty: '', hasBaseInfo: '' });
      return;
    }

    try {
      const response = await axios.post('https://epr-pricing-app-backend.onrender.com/calculate', {
        numItems: parseInt(numItems, 10),
        difficulty,
        hasBaseInfo,
      });
      console.log('Response received:', response.data);
      setTotalCost(response.data.total_cost);
      setVerificationTime(response.data.verification_time);
      setCostPerItem(response.data.cost_per_item);
      setPredictedPasses(response.data.predicted_passes);
      setError({ numItems: '', difficulty: '', hasBaseInfo: '' });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError((prevError) => ({ ...prevError, form: error.response.data.error }));
      } else {
        setError((prevError) => ({ ...prevError, form: 'An error occurred while calculating the cost.' }));
      }
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
            onChange={handleNumItemsChange}
            required
            fullWidth
            error={!!error.numItems}
            helperText={error.numItems}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Difficulty"
            value={difficulty}
            onChange={handleDifficultyChange}
            required
            fullWidth
            error={!!error.difficulty}
            helperText={error.difficulty}
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
                onChange={handleHasBaseInfoChange}
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
        {error.form && (
          <Grid item xs={12}>
            <Typography color="error">
              {error.form}
            </Typography>
          </Grid>
        )}
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
