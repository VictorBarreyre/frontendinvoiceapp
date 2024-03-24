import {
    Box,
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,
  } from '@chakra-ui/react'



const steps = [
    { title: 'Création', description: 'de la facture' },
    { title: 'Échéances', description: 'de paiement' },
    { title: 'Envoie', description: 'par mail' },
  ]
  
  function theStepper() {
    const { activeStep } = useSteps({
      index: 0,
      count: steps.length,
    })
  
    return (
      <Stepper mb='3vh' colorScheme='black' index={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
          <StepIndicator>
              <StepStatus complete={<StepIcon />} />
            </StepIndicator>
  
            <Box flexShrink='0'>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
            <StepSeparator minWidth="3vh"/>
          </Step>
        ))}
      </Stepper>
    )
  }
  
export default theStepper; 