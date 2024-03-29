import React from 'react';
import InvoiceCreator from './InvoiceCreator';
import { Heading } from '@chakra-ui/react'
import PaymentScheduleForm from './PaymentScheduleForm';
import InvoiceSummary from './InvoiceSummary';

const Stepper = () => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabClick = (index) => {
    setTabIndex(index);
  };

  return (
    <div className="stepper-container">
      <div className="tabs-container">
        <div className="tab-heading">
        <Heading fontSize='26px'> Créez votre facture avec paiement automatique </Heading>
        </div>
        <div className="tab-list">
          <button className={`tab ${tabIndex === 0 ? 'active' : ''}`} onClick={() => handleTabClick(0)}>Facture</button>
          <button className={`tab ${tabIndex === 1 ? 'active' : ''}`} onClick={() => handleTabClick(1)}>Échéances & Paiements</button>
          <button className={`tab ${tabIndex === 2 ? 'active' : ''}`} onClick={() => handleTabClick(2)}>Envoie</button>
        </div>
        <div className="tab-panel">
          {tabIndex === 0 && (
            <div>
              <Heading mb='1rem' size="md">Créez votre facture</Heading>
              <InvoiceCreator />
            </div>
          )}
          {tabIndex === 1 && (
            <div>
                <Heading mb='1rem' size="md">Définissez vos échéances de paiement</Heading>
              <PaymentScheduleForm />
            </div>
          )}
          {tabIndex === 2 && (
            <div>
                 <Heading mb='1rem' size="md">Résumé de la Facture</Heading>
              <InvoiceSummary />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stepper;
