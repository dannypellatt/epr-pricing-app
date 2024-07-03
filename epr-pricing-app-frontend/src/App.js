import React from 'react';
import PricingForm from './components/PricingForm';
import { Grid, Box, Typography, Container, Paper } from '@mui/material';

const App = () => {
  return (
    <Container>
      <Box my={4}>
        <Typography variant="h3" component="h1" align="center">
          Scraping Cost Calculator
        </Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <PricingForm />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              How to Use the Calculator
            </Typography>
            <Typography variant="body1">
              This calculator helps you estimate the cost of scraping data. 
              <ol>
                <li>Enter the estimated number of items you want to scrape.</li>
                <li>Select the difficulty level of scraping. 
                  <ul>
                    <li><b>Easy: </b>The information is from one place (e.g. phone numbers from LinkedIn.)</li>
                    <li><b>Medium: </b>The information is from a known place, with unknown factors (e.g. phone numbers from company websites - Each site is different, so will take more work.)</li>
                    <li><b>Hard: </b>The information is from an unknown place (e.g. phone numbers from anywhere, must be searched for on multiple sites to find.)</li>
                  </ul>
                </li>
                <li>Indicate if you already have base information. For instance, if you are searching for information on LinkedIn, and we already have the LinkedIn addresses in our database.</li>
              </ol>
              These costs are calculated based on predefined rates. See assumptions here.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
