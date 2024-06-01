import React, { useEffect, useState } from 'react';
import { useInvoiceData } from '../context/InvoiceDataContext';
import InvoiceCreator from './InvoiceCreator';
import { Heading, Text, Button } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import PaymentScheduleForm from './PaymentScheduleForm';
import InvoiceSummary from './InvoiceSummary';
import { useTheme } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Stepper = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const {
    invoiceData,
    attemptedNavigation,
    setAttemptedNavigation,
    buttonLabel,
    setButtonLabel,
    remainingPercentage,
    setSendButtonClicked,
    requiredFieldsValid,
    handleInvoiceActionSendMail,
    checkActiveSubscription
  } = useInvoiceData();
  const [isStepNextAvailable, setIsStepNextAvailable] = useState(false);
  const [showError, setShowError] = useState(false);
  const theme = useTheme();
  const breakpointMd = parseInt(theme.breakpoints.md, 10);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSendInvoice = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const { email, name } = invoiceData.issuer;
    if (!email || !name) {
        console.error("Email or Name is missing.");
        setShowError(true);
        setIsSubmitting(false);
        return;
    }
    setSendButtonClicked('sendInvoice');

    const hasActiveSubscription = await checkActiveSubscription(email);

    if (hasActiveSubscription) {
        await handleInvoiceActionSendMail(invoiceData, () => {
            setIsSubmitting(false);
            console.log('Invoice sent successfully.');
            navigate('/success');
        }, (error) => {
            setIsSubmitting(false);
            console.error('Error sending invoice:', error);
        });
    } else {
        navigate('/abo');
        setIsSubmitting(false);
    }
};


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
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
      return isNumberFilled && isIssuerNameFilled && isClientNameFilled &&
        isIssuerAdresseFilled && isIssuerSiretFilled && isIssuerEmailFilled && isIssuerIbanFilled &&
        isClientAdresseFilled && isClientSiretFilled && isClientEmailFilled && areQuantitiesValid && isTotalValid;
    };
    setShowError(false);
    setIsStepNextAvailable(checkStepNextAvailability());
  }, [invoiceData]);

  const handleTabClick = (index) => {
    if (index > 0 && !isStepNextAvailable) {
      setAttemptedNavigation(true);
      setShowError(true);
    } else {
      setTabIndex(index);
      setShowError(false);
    }
  };

  const handleNavigateTo = () => {
    const isTotalValid = invoiceData.total > 0;
    if (isStepNextAvailable && tabIndex < 2 && isTotalValid) {
        setTabIndex(prevTabIndex => prevTabIndex + 1);
        setShowError(false);
    } else {
        console.warn("Les champs requis pour passer à l'étape suivante ne sont pas tous remplis ou le total est à 0.");
        setAttemptedNavigation(true);
        setShowError(true);
    }
};


  useEffect(() => {
    updateButtonLabel();
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
        setButtonLabel("Définir mes échéances de paiement");
    }
  };

  const errorMsg = () => {
    if (showError) {
      return (
        <Text color="red" fontSize={{ base: '13px', lg: '16px' }}>
          Veuillez remplir tous les champs requis avant de continuer
        </Text>
      );
    }
    return null;
  };

  const totalError = () => {
    if (attemptedNavigation && invoiceData.total <= 0) {
      return 'Certains champs sont manquants ou incomplets.';
    }
    return null;
  };

  const renderButton = () => {
    if (tabIndex === 1) {
      return remainingPercentage > 0 ? (
        <Button borderRadius='30px' mt="4" colorScheme="red" w={{ base: '100%', lg: 'unset' }} isDisabled>
          Pourcentage restant à attribuer : {remainingPercentage}%
        </Button>
      ) : (
        <Button onClick={handleSubmit} rightIcon={<ArrowForwardIcon />} w={{ base: '100%', lg: 'unset' }} color='white' borderRadius='30px' backgroundColor='black'>
          {buttonLabel}
        </Button>
      );
    } else if (tabIndex === 2) {
      return (
        <Button onClick={handleSendInvoice} disabled={isSubmitting} rightIcon={<ArrowForwardIcon />} w={{ base: '100%', lg: 'unset' }} color='white' borderRadius='30px' backgroundColor='black'>
          {buttonLabel}
        </Button>
      );
    } else {
      return (
        <Button onClick={handleNavigateTo} rightIcon={<ArrowForwardIcon />} w={{ base: '100%', lg: 'unset' }} color='white' borderRadius='30px' backgroundColor='black'>
          {buttonLabel}
        </Button>
      );
    }
  };

  const handleSubmit = () => {
    if (remainingPercentage <= 0) {
      handleNavigateTo();
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
        return "Envoyez votre facture";
    }
  };

  const tabText = (index, isMobile) => {
    const texts = ["Votre Facture", "Vos échéances de paiements", "Résumé & Envoi"];
    const mobileTexts = ["Votre facture", "Vos échéances", "Envoi"];
    return isMobile ? mobileTexts[index] : texts[index];
  };

  useEffect(() => {
    const checkStepNextAvailability = () => {
        return Object.values(requiredFieldsValid).every(value => value === true) &&
            invoiceData.items.every(item => item.quantity > 0) &&
            invoiceData.total > 0;
    };
    setShowError(false);
    setIsStepNextAvailable(checkStepNextAvailability());
}, [invoiceData, requiredFieldsValid]);


  return (
    <div className='flex-stepper'>
      <div className="stepper-container">
        <div className="tabs-container">
          <div className="tab-heading">
            <Heading fontSize={{ base: '20px', lg: '26px' }}>{getHeadingText(tabIndex)}</Heading>
          </div>
          <div className="tab-list">
            <button className={`tab ${tabIndex === 0 ? 'active' : ''}`} onClick={() => handleTabClick(0)}>{tabText(0, isMobile)}</button>
            <button className={`tab ${tabIndex === 1 ? 'active' : ''} ${!isStepNextAvailable ? 'disabled' : 'abled'}`} onClick={() => handleTabClick(1)}>{tabText(1, isMobile)}</button>
            <button className={`tab ${tabIndex === 2 ? 'active' : ''} ${!isStepNextAvailable ? 'disabled' : 'abled'}`} onClick={() => handleTabClick(2)}>{tabText(2, isMobile)}</button>
          </div>

          <div className="tab-panel">
            {tabIndex === 0 && <InvoiceCreator totalError={totalError} errorMsg={errorMsg} handleNavigateTo={handleNavigateTo} attemptedNavigation={attemptedNavigation} />}
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