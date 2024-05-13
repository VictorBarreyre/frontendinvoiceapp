import React, { useEffect, useState } from 'react';
import { useInvoiceData } from '../context/InvoiceDataContext';
import InvoiceCreator from './InvoiceCreator';
import { Heading, Text } from '@chakra-ui/react';
import PaymentScheduleForm from './PaymentScheduleForm';
import InvoiceSummary from './InvoiceSummary';

const Stepper = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const { invoiceData, attemptedNavigation, setAttemptedNavigation } = useInvoiceData(); // Accéder aux données de la facture depuis le contexte
    const [isStepNextAvailable, setIsStepNextAvailable] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        // Cette fonction vérifie si les champs requis pour activer l'étape suivante sont remplis.
        const checkStepNextAvailability = () => {
            const isNumberFilled = invoiceData.number.trim() !== '';
            const isIssuerNameFilled = invoiceData.issuer.name.trim() !== '';
            const isClientNameFilled = invoiceData.client.name.trim() !== '';
            const isIssuerAdresseFilled = invoiceData.issuer.adresse.trim() !== '';
            const isIssuerSiretFilled = invoiceData.issuer.siret.trim() !== '';
            const isIssuerEmailFilled = invoiceData.issuer.email.trim() !== '';
            const isIssuerIbanFilled = invoiceData.issuer.iban.trim() !== '';
            const isClientAdresseFilled = invoiceData.client.adresse.trim() !== '';
            const isClientSiretFilled = invoiceData.client.siret.trim() !== '';
            const isClientEmailFilled = invoiceData.client.email.trim() !== '';
            const areQuantitiesValid = invoiceData.items.every(item => item.quantity > 0);
            const isTotalValid = invoiceData.total > 0;
            // Ajoutez d'autres vérifications si nécessaire
            return isNumberFilled && isIssuerNameFilled && isClientNameFilled &&
                isIssuerAdresseFilled && isIssuerSiretFilled && isIssuerEmailFilled && isIssuerIbanFilled &&
                isClientAdresseFilled && isClientSiretFilled && isClientEmailFilled && areQuantitiesValid && isTotalValid;
        };
        setShowError(false)
        setIsStepNextAvailable(checkStepNextAvailability());
    }, [invoiceData]); // Se déclenche à chaque fois que invoiceData change

    const handleTabClick = (index) => {
        if (index > 0 && !isStepNextAvailable) {
            setAttemptedNavigation(true);
            setShowError(true);
        } else {
            setTabIndex(index);
            setShowError(false) // Réinitialiser le message d'erreur
        }
    };


    const handleNavigateTo = () => {
        const isTotalValid = invoiceData.total > 0;
        if (isStepNextAvailable && tabIndex < 3 - 1 && isTotalValid) {
            setTabIndex(prevTabIndex => prevTabIndex + 1); // Naviguer vers l'onglet suivant
            setShowError(false);
        } else {
            console.warn("Les champs requis pour passer à l'étape suivante ne sont pas tous remplis ou le total est à 0.");
            setAttemptedNavigation(true);
            setShowError(true); // Montrer l'erreur si le total est à 0 ou d'autres champs ne sont pas remplis
        }
    };
    
    const errorMsg = () => {
        if (showError) {
            return (
                <Text color="red" fontSize={{ base: '13px', lg: '16px' }}>Veuillez remplir tous les champs requis avant de continuer</Text>
            )
        };
    };

  const totalError = () => {
  if (attemptedNavigation && invoiceData.total <= 0) {
    return (
      'La somme de la facture ne peut pas être égale à 0.'
    );
  }
};

const getHeadingText = (index) => {
    switch(index) {
      case 0:
        return "Créez votre facture avec paiement automatique";
      case 1:
        return "Finalisez et envoyez votre facture";
      default:
        return "Créez votre facture avec paiement automatique"; // Valeur par défaut
    }
  };

      
    return (
      <div className='flex-stepper'> 
        <div className="stepper-container">
            <div className="tabs-container">
                <div className="tab-heading">
                <Heading fontSize='26px'>{getHeadingText(tabIndex)}</Heading>
                </div>
                <div className="tab-list">
                    <button className={`tab ${tabIndex === 0 ? 'active' : ''}`} onClick={() => handleTabClick(0)}>Votre Facture</button>
                    <button className={`tab ${tabIndex === 1 ? 'active' : ''} ${!isStepNextAvailable ? 'disabled' : ''}`}  onClick={() => handleTabClick(1)}>Vos échéances de paiements</button>
                    <button className={`tab ${tabIndex === 2 ? 'active' : ''} ${!isStepNextAvailable ? 'disabled' : ''}`} onClick={() => handleTabClick(2)} >Résumé & Envoi </button>
                </div>

                <div className="tab-panel">
                    {tabIndex === 0 && <InvoiceCreator totalError={totalError} errorMsg={errorMsg} handleNavigateTo={handleNavigateTo} />}
                    {tabIndex === 1 && <PaymentScheduleForm handleNavigateTo={handleNavigateTo} />}
                    {tabIndex === 2 && <InvoiceSummary />}
                </div>
            </div>
        </div>
        </div>
    );
};

export default Stepper;