import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Logos from './Logos'
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Grid from '@mui/material/Grid'; // Grid version 1
import dateFormat, { masks } from "dateformat";



function GameStepper(props) {

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const getCurrentTime = (dateTimeUTC, area) => {
    dateTimeUTC = dateTimeUTC == null ? new Date.UTC() : dateTimeUTC

    dateTimeUTC = dateTimeUTC+'Z'

    if (area == 'header') {
        return (dateFormat(dateTimeUTC, 'longDate'))
    }
    // dateTimeUTC += ' UTC'
    return (dateFormat(dateTimeUTC, 'shortTime'))

  }
    const handleNext = () => {
            if (activeStep == props.currentGames.length) {
                setActiveStep(0)
                return
            }
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
      };
    
      const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      };
    
      const handleStepChange = (step) => {
    
        setActiveStep(step);
      };

    return(

        <Paper
          elevation={1}
          sx={{
            display: 'flex',
            alignItems: 'center',
            pl: 2,
            bgcolor: 'background.default',
            flexDirection: 'column',
            padding: 7,
          }}
        >
            {
                getCurrentTime(props.currentGames[activeStep].DateTimeUTC, 'header')
            }
            
            <Grid display="flex" justifyContent="space-evenly" alignItems="center" flexDirection="row">  
                <Logos viewing={props.currentGames[activeStep]} teams={props.teams} standings={props.standings}/>
            </Grid>
            {
                getCurrentTime(props.currentGames[activeStep].DateTimeUTC, 'time')
            }
            <Grid container display="flex" justifyContent="space-evenly">
        <MobileStepper
            variant="progress"
          steps={props.currentGames.length}
          position="static"
          activeStep={activeStep}
          sx={{ maxWidth: 400, flexGrow: 1 }}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === props.currentGames.length - 1}
            >
              Next
              {theme.direction === 'rtl' ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              {theme.direction === 'rtl' ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
        </Grid>
        </Paper>

    )

}

export default GameStepper;
