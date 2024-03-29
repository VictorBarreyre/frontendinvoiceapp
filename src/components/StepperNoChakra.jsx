import React, { useEffect, useState } from 'react';
import { useInvoiceData } from '../context/InvoiceDataContext';
import InvoiceCreator from './InvoiceCreator';
import { Heading } from '@chakra-ui/react';
import PaymentScheduleForm from './PaymentScheduleForm';
import InvoiceSummary from './InvoiceSummary';

const Stepper = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const { invoiceData, requiredFieldsValid, attemptedNavigation, setAttemptedNavigation } = useInvoiceData(); // Accéder aux données de la facture depuis le contexte
    const [isStepNextAvailable, setIsStepNextAvailable] = useState(false);

    console.log(attemptedNavigation, requiredFieldsValid)


    useEffect(() => {
        // Cette fonction vérifie si les champs requis pour activer l'étape suivante sont remplis.
        const checkStepNextAvailability = () => {
            const { number, issuer, client } = invoiceData;
            const issuerAndClientNamesFilled = issuer.name.trim() && client.name.trim();
            // Ajoutez toute autre logique de validation nécessaire ici
            return number.trim() && issuerAndClientNamesFilled;
        };

        setIsStepNextAvailable(checkStepNextAvailability());
    }, [invoiceData]); // Se déclenche à chaque fois que invoiceData change


    const handleTabClick = (index) => {
        if (index > 0 && !isStepNextAvailable) {
            setAttemptedNavigation(true);
        } else {
            setTabIndex(index);
            // Ne réinitialisez pas ici attemptedNavigation à false
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

    const areAllFieldsValid = (fields) => {
        return Object.values(fields).every(value => value);
    };
    
    return (
        <div className="stepper-container">
            <div className="tabs-container">
                <div className="tab-heading">
                    <Heading fontSize='26px'> Créez votre facture avec paiement automatique </Heading>
                </div>
                <div className="tab-list">
                    <button className={`tab ${tabIndex === 0 ? 'active' : ''}`} onClick={() => handleTabClick(0)}>Facture</button>
                    <button className={`tab ${tabIndex === 1 ? 'active' : ''} ${!areAllFieldsValid(requiredFieldsValid) ? 'disabled' : ''}`} onClick={() => handleTabClick(1)} >Échéances & Paiements</button>
                    <button className={`tab ${tabIndex === 2 ? 'active' : ''} ${!areAllFieldsValid(requiredFieldsValid) ? 'disabled' : ''}`} onClick={() => handleTabClick(2)} >Envoi</button>
                </div>
                <div className="tab-panel">
                    {tabIndex === 0 && <InvoiceCreator navigateToPaymentSchedule={handleNavigateToPaymentSchedule} />}
                    {tabIndex === 1 && <PaymentScheduleForm />}
                    {tabIndex === 2 && <InvoiceSummary />}
                </div>
            </div>
        </div>
    );
};

export default Stepper;
