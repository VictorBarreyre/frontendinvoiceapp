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
            // Ajoutez d'autres vérifications si nécessaire
            return isNumberFilled && isIssuerNameFilled && isClientNameFilled &&
            isIssuerAdresseFilled && isIssuerSiretFilled && isIssuerEmailFilled && isIssuerIbanFilled &&
            isClientAdresseFilled && isClientSiretFilled && isClientEmailFilled ;
        };

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

    const handleNavigateToPaymentSchedule = () => {
        // Vérifie si l'onglet actuel est le dernier ou si les conditions pour passer à l'onglet suivant sont remplies
        if (isStepNextAvailable && tabIndex < 3 - 1) {
            setTabIndex(prevTabIndex => prevTabIndex + 1); // Naviguez vers l'onglet suivant
        } else {
            console.warn("Les champs requis pour passer à l'étape suivante ne sont pas tous remplis.");
            setAttemptedNavigation(true);
        }
    };

    const handleNavigateToInvoiceConfirn = () => {
        // Vérifie si les conditions pour passer à l'onglet final sont remplies
        if (isStepNextAvailable) {
            setTabIndex(2); // Naviguez directement vers l'onglet final
        } else {
            console.warn("Les champs requis pour passer à l'étape finale ne sont pas tous remplis.");
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
                    <button className={`tab ${tabIndex === 1 ? 'active' : ''} ${!isStepNextAvailable ? 'disabled' : ''}`} onClick={() => handleTabClick(1)} >Échéances & Paiements</button>
                    <button className={`tab ${tabIndex === 2 ? 'active' : ''} ${!isStepNextAvailable ? 'disabled' : ''}`} onClick={() => handleTabClick(2)} >Envoi</button>
                </div>


                {showError && <Text color="#FB7575">Veuillez remplir tous les champs requis avant de continuer.</Text>}


                <div className="tab-panel">
                    {tabIndex === 0 && <InvoiceCreator navigateToPaymentSchedule={handleNavigateToPaymentSchedule} />}
                    {tabIndex === 1 && <PaymentScheduleForm handleNavigateToInvoiceConfirn={handleNavigateToInvoiceConfirn} />}
                    {tabIndex === 2 && <InvoiceSummary />}
                </div>
            </div>
        </div>
    );
};

export default Stepper;
