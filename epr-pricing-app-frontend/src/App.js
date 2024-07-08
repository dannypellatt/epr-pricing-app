import React, { useState } from 'react';
import PricingForm from './components/PricingForm';
import { Grid, Box, Typography, Container, Paper, Modal, Backdrop, Fade, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const ModalBox = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
  border: '2px solid #000',
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2, 4, 3),
  maxWidth: '500px',
  margin: '0 auto',
  zIndex: 1300, 
  position: 'relative',
}));

const App = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h3" component="h1" align="center">
          EPR Scraping Cost Calculator
        </Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: '20px' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Calculator
            </Typography>
            <br></br>
            <PricingForm />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: '20px' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              How to Use the Calculator
            </Typography>
            <Typography variant="body1">
              <ol>
                <li>Enter the estimated number of items you want to scrape.</li>
                <br />
                <li>Select the difficulty level of scraping: 
                  <ul>
                    <li><b>Easy: </b>The information is from one place (e.g. phone numbers from LinkedIn.)</li>
                    <li><b>Medium: </b>The information is from a known place, with unknown factors (e.g. phone numbers from company websites - Each site is different, so will take more work.)</li>
                    <li><b>Hard: </b>The information is from an unknown place (e.g. phone numbers from anywhere, must be searched for on multiple sites to find.)</li>
                  </ul>
                </li>
                <br />
                <li>Indicate if you already have base information. For instance, if you are searching for information on practices and we already have the names of each practice within our database.</li>
              </ol>
              These costs are calculated based on predefined rates.{' '}
              <Typography
                variant="body1"
                color="primary"
                onClick={handleOpen}
                sx={{ cursor: 'pointer', display: 'inline' }}
              >
                See assumptions here.
              </Typography>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <ModalBox>
            <Typography variant="h6" id="transition-modal-title">
              Assumptions
            </Typography>
            <Typography id="transition-modal-description">
              Here are the assumptions made in the calculations:
            </Typography>
            <ul>
              <li>The base cost per scrape is determined by predefined ranges from <a target="_blank" href="https://www.clay.com/pricing">Clay</a>.
                <ul>
                  <li>0-2000 = $0.0745</li>
                  <li>2000-3000 = $0.0763</li>
                  <li>3000-10,000 = $0.0349</li>
                  <li>10,000-14,000 = $0.356</li>
                  <li>14,000-20,000 = $0.0349</li>
                  <li>20,000-50,000 = $0.016</li>
                  <li>50,000-70,000 = $0.0142</li>
                  <li>70,000-100,000 = $0.015</li>
                  <li>100,000-150,000 = $0.0133</li>
                  <li>150,000+ = N/A - must reach out to Clay</li>
                </ul>
              </li>
              <li>The difficulty level takes into account necessary passes, so multiplies the base cost: Easy (x1), Medium (x3), Hard (x6).</li>
              <li>If base information is not available, the total cost is doubled, as the base information must be found.</li>
              <li>Verification involves checking 5% of the results manually.</li>
              <li>Verification times are: Easy (0.5 minutes/item), Medium (1.5 minutes/item), Hard (4 minutes/item).</li>
              <li>Verification cost is calculated at $30 per hour.</li>
            </ul>
            <Button onClick={handleClose} color="primary" variant="contained">
              Close
            </Button>
          </ModalBox>
        </Fade>
      </Modal>
    </Container>
  );
};

export default App;
