import React, { useState } from 'react';

const Stepper = () => {
  const [activeStep, setActiveStep] = useState(1); // Premier step comme étape active par défaut
  const steps = [1, 2, 3]; // Identifiants des steps

  // Gestion du clic pour changer l'étape active
  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
      {steps.map((step) => (
        <div
          key={step}
          onClick={() => handleStepClick(step)}
          style={{
            margin:'0.5vh',
            width: step === activeStep ? '22px' : '12px', // Plus large si actif
            height: step === activeStep ? '12px' : '12px',
            borderRadius: step === activeStep ? '10px' : '15px', // Moins arrondi si actif
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: step === activeStep ? 'black' : 'lightgrey',
          }}
        >
          
        </div>
      ))}
    </div>
  );
};

export default Stepper;

