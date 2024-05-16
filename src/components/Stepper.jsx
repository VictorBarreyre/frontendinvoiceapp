import React, { useEffect, useState } from 'react';
import { useInvoiceData } from '../context/InvoiceDataContext';
import InvoiceCreator from './InvoiceCreator';
import { Heading, Text, Button } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import PaymentScheduleForm from './PaymentScheduleForm';
import InvoiceSummary from './InvoiceSummary';
import { useTheme } from '@chakra-ui/react';

const Stepper = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { invoiceData,
    attemptedNavigation,
    setAttemptedNavigation,
    buttonLabel,
    setButtonLabel,
    isTotalPercentage100,
    setIsTotalPercentage100,
    remainingPercentage,
    setRemainingPercentage,
    handleInvoiceActionSendMail }
    = useInvoiceData(); // Accéder aux données de la facture depuis le contexte
  const [isStepNextAvailable, setIsStepNextAvailable] = useState(false);
  const [showError, setShowError] = useState(false);

  const theme = useTheme();
  // Accéder au point de rupture 'md' à partir du thème
  const breakpointMd = parseInt(theme.breakpoints.md, 10);

  const [isMobile, setIsMobile] = useState(false);



    // Détecter si l'appareil est mobile
    useEffect(() => {
      const handleResize = () => {
          setIsMobile(window.innerWidth < 768); // Supposons que mobile est < 768px
      };

      // Écouter les changements de taille de fenêtre
      window.addEventListener('resize', handleResize);
      handleResize(); // Appeler immédiatement pour définir l'état initial

      return () => window.removeEventListener('resize', handleResize);
  }, []);


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

  useEffect(() => {
    updateButtonLabel(); // Update button label based on current tabIndex
    console.log(buttonLabel)
  }, [tabIndex]);

  const updateButtonLabel = () => {
    switch (tabIndex) {
      case 0:
        setButtonLabel("Définir mes échéances de paiement");
        break;
      case 1:
        setButtonLabel("Finalisez et envoyez votre facture");
        break;
      case 2:
        setButtonLabel("Envoyer ma facture");
        break;
      default:
        setButtonLabel("Définir mes échéances de paiement"); // Default case if needed
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


  const renderButton = () => {
    if (tabIndex === 1) {
        return remainingPercentage > 0 ? (
            <Button borderRadius='30px' mt="4" colorScheme="red"  w={{ base: '100%', lg: 'unset' }} isDisabled={true}>Pourcentage restant à attribuer : {remainingPercentage}%</Button>
        ) : ( 
            <Button onClick={handleSubmit} rightIcon={<ArrowForwardIcon />} w={{ base: '100%', lg: 'unset' }}  color='white' borderRadius='30px' backgroundColor='black'>
                {buttonLabel}
            </Button>
        );
    } else if (tabIndex === 2) {
        // Step 2 spécifique: Envoi de l'email
        return (
            <Button onClick={handleInvoiceActionSendMail} rightIcon={<ArrowForwardIcon />} w={{ base: '100%', lg: 'unset' }}  color='white' borderRadius='30px' backgroundColor='black' >
                {buttonLabel}
            </Button>
        );
    } else {
        // Pour les autres étapes, navigation normale
        return (
            <Button onClick={handleNavigateTo} rightIcon={<ArrowForwardIcon />} w={{ base: '100%', lg: 'unset' }}  color='white' borderRadius='30px' backgroundColor='black' colorScheme="gray">
                {buttonLabel}
            </Button>
        );
    }
};



const handleSubmit = () => {
  if (remainingPercentage <= 0) {
      handleNavigateTo(); // Supposer que handleNavigateTo gère la navigation
  } else {
      setShowError(true);
  }
};

  const getHeadingText = (index) => {
    switch (index) {
      case 0:
        return "Créez votre facture en ligne";
      case 1:
        return "Vos échéances de paiement";
      default:
        return "Envoyez votre facture"; // Valeur par défaut
    }
  };


  const tabText = (index, isMobile) => {
    // Définir les textes par défaut pour le bureau
    const texts = [
        "Votre Facture",
        "Vos échéances de paiements",
        "Résumé & Envoi"
    ];

    // Définir les textes pour mobile
    const mobileTexts = [
        "Votre facture",
        "Vos échéances",
        "Envoi"
    ];

    // Retourner le texte correspondant en fonction de l'index et de si le mode mobile est activé
    return isMobile ? mobileTexts[index] : texts[index];
};


  return (
    <div className='flex-stepper'>
      <div className="stepper-container">
        <div className="tabs-container">
          <div className="tab-heading">
            <Heading fontSize={{ base: '24px', lg: '26px' }} >{getHeadingText(tabIndex)}</Heading>
          </div>
          <div className="tab-list">
            <button className={`tab ${tabIndex === 0 ? 'active' : ''}`} onClick={() => handleTabClick(0)}>{tabText(0, isMobile)}</button>
            <button className={`tab ${tabIndex === 1 ? 'active' : ''} ${!isStepNextAvailable ? 'disabled' : 'abled'}`} onClick={() => handleTabClick(1)}>{tabText(1, isMobile)}</button>
            <button className={`tab ${tabIndex === 2 ? 'active' : ''} ${!isStepNextAvailable ? 'disabled' : 'abled'}`} onClick={() => handleTabClick(2)} >{tabText(2, isMobile)}</button>
          </div>

          <div className="tab-panel">
            {tabIndex === 0 && <InvoiceCreator totalError={totalError} errorMsg={errorMsg} handleNavigateTo={handleNavigateTo} />}
            {tabIndex === 1 && <PaymentScheduleForm handleNavigateTo={handleNavigateTo} />}
            {tabIndex === 2 && <InvoiceSummary />}
          </div>
          {renderButton()}
        </div>

      </div>
    </div>
  );
};

export default Stepper;