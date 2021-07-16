import React from 'react';
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
} from '@material-ui/core/styles';
import MuiStepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepConnector from '@material-ui/core/StepConnector';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  active: {
    '& $line': {
      borderColor: 'orange',
    },
  },
  completed: {
    '& $line': {
      borderColor: 'green',
    },
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

const Stepper = ({
  stepsContentDescription,
  handleOnReset,
  children,
  handleOnFinish,
}) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const stepsRef = React.useRef(stepsContentDescription);
  const stepsArrRef = React.useRef(Object.values(stepsContentDescription));
  const handleFinish = () => {
    handleOnFinish();
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    handleOnReset();
  };

  const numberOfSteps = stepsArrRef.current.length;

  return (
    <div className={classes.root}>
      <MuiStepper
        alternativeLabel
        activeStep={activeStep}
        connector={<QontoConnector />}
      >
        {stepsArrRef.current.map(({ shortDescription }) => (
          <Step key={shortDescription}>
            <StepLabel>{shortDescription}</StepLabel>
          </Step>
        ))}
      </MuiStepper>
      <div>
        {activeStep === numberOfSteps && (
          <>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </>
        )}
        <div>
          <Typography className={classes.instructions}>
            {stepsRef.current[activeStep] &&
              stepsRef.current[activeStep]['longDescription']}
          </Typography>
          {children[activeStep]}
          <div>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              className={classes.button}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                activeStep === numberOfSteps ? handleFinish() : handleNext();
              }}
              className={classes.button}
              disabled={
                activeStep === numberOfSteps
                  ? false
                  : !children[activeStep]?.props.isValid
              }
            >
              {activeStep === numberOfSteps ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stepper;
