import React, { useEffect, useState } from 'react';
import { useInvoiceData } from '../context/InvoiceDataContext';
import InvoiceCreator from './InvoiceCreator';
import { Heading } from '@chakra-ui/react';
import PaymentScheduleForm from './PaymentScheduleForm';
import InvoiceSummary from './InvoiceSummary';

const Stepper = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { invoiceData,requiredClassnameField,attemptedNavigation, setAttemptedNavigation } = useInvoiceData(); // Accéder aux données de la facture depuis le contexte
  const [isStepTwoAvailable, setIsStepTwoAvailable] = useState(false);




  useEffect(() => {
    // Cette fonction vérifie si les champs requis pour activer l'étape 2 sont remplis.
    const checkStepTwoAvailability = () => {
      const { number, issuer, client } = invoiceData;
      const issuerAndClientNamesFilled = issuer.name.trim() && client.name.trim();
      // Ajoutez toute autre logique de validation nécessaire ici
      return number.trim() && issuerAndClientNamesFilled;
    };

    setIsStepTwoAvailable(checkStepTwoAvailability());
  }, [invoiceData]); // Se déclenche à chaque fois que invoiceData change

  const handleTabClick = (index) => {
    if (index > 0 && !isStepTwoAvailable) {
      setAttemptedNavigation(true); // Indique une tentative de navigation sans champs valides
    } else {
      setTabIndex(index);
      setAttemptedNavigation(false); // Réinitialise l'indicateur si les conditions sont remplies
    }
  };
  
  const handleNavigateToPaymentSchedule = () => {
    if (isStepTwoAvailable) {
      setTabIndex(1); // Naviguez vers l'onglet suivant si la validation est réussie
    } else {
      console.warn("Les champs requis pour l'étape 2 ne sont pas tous remplis.");
      setAttemptedNavigation(true);
    }
  };


  
  
  return (
    <div className="stepper-container">
      <div className="tabs-container">
        <div className="tab-heading">
          <Heading fontSize='26px'> Créez votre facture avec paiement automatique </Heading>
        </div>
        <div className="tab-list">
          <button className={`tab ${tabIndex === 0 ? 'active' : ''}`} onClick={() => handleTabClick(0)}>Facture</button>
          <button className={`tab ${tabIndex === 1 ? 'active' : ''}`} onClick={() => handleTabClick(1)} disabled={!isStepTwoAvailable}>Échéances & Paiements</button>
          <button className={`tab ${tabIndex === 2 ? 'active' : ''}`} onClick={() => handleTabClick(2)} disabled={true}>Envoi</button> {/* Si l'étape 3 a également des conditions, ajoutez-les de manière similaire */}
        </div>
        <div className="tab-panel">
          {tabIndex === 0 && <InvoiceCreator  navigateToPaymentSchedule={handleNavigateToPaymentSchedule}/>}
          {tabIndex === 1 && <PaymentScheduleForm />}
          {tabIndex === 2 && <InvoiceSummary />}
        </div>
      </div>
    </div>
  );
};

export default Stepper;
