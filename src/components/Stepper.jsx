import {
    Stack,
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
    Text,
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

    const activeStepText = steps[activeStep].description
    return (
        <Stack w='10vw' mb='3vw'>
        <Stepper size='sm' colorScheme='black' index={activeStep} gap='0'>
          {steps.map((step, index) => (
            <Step key={index} gap='0'>
              <StepIndicator>
                <StepStatus complete={<StepIcon />} />
              </StepIndicator>
              <StepSeparator _horizontal={{ ml: '0' }} />
            </Step>
          ))}
        </Stepper>
        <Text w='max-content'>
          Step {activeStep + 1}: <b>{activeStepText}</b>
        </Text>
      </Stack>
    )
  }
  
export default theStepper; 