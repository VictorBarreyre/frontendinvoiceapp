import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import InvoicePDF from '../components/InvoicePDF';
import { pdf, PDFViewer } from '@react-pdf/renderer';
import axios from 'axios';

const InvoiceDataContext = createContext();

export const useInvoiceData = () => useContext(InvoiceDataContext);

export const InvoiceDataProvider = ({ children }) => {

    const { user } = useAuth();

    const [invoiceData, setInvoiceData] = useState({
        number: '02',
        date: new Date().toISOString().split('T')[0],
        issuer: {
            name: '',
            adresse: '',
            siret: '',
            email: '',
            iban: ''
        },
        client: {
            name: 'Victor Barreyre',
            adresse: '43 Grande rue',
            siret: 'zrzaeazeaz',
            email: 'barreyrevictor.contact@gmail.com',
            iban: '',
        },
        items: [{ description: '', quantity: 1, unitPrice: 0 }],
        subtotal: 0,
        vatRate: 20,
        total: 0,
        devise: '€',
    });

    useEffect(() => {
        console.log(user)
        if (user) {
            setInvoiceData(prevData => ({
                ...prevData,
                issuer: {
                    name: user.name || '',
                    adresse: user.adresse || '',
                    siret: user.siret || '',
                    email: user.email || '',
                    iban: user.iban || ''
                }
            }));
        }
    }, [user]);

    const baseUrl = "http://localhost:8000";
    const [requiredFieldsValid, setRequiredFieldsValid] = useState({
        number: false,
        issuerName: false,
        clientName: false,
    });
    const [pdfInstance, setPdfInstance] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [buttonLabel, setButtonLabel] = useState(null);
    const [attemptedDownloadWithoutRequiredFields, setAttemptedDownloadWithoutRequiredFields] = useState(false);
    const [attemptedNavigation, setAttemptedNavigation] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState('');
    const [itemsnames, setItemsNames] = useState('');
    const [payments, setPayments] = useState([{ percentage: 100, dueDate: new Date() }]);
    const [isTotalPercentage100, setIsTotalPercentage100] = useState(false);
    const [remainingPercentage, setRemainingPercentage] = useState(100);
    const [sendButtonClicked, setSendButtonClicked] = useState(null);

    const handleInvoiceDataChange = (newData) => {
        setInvoiceData(newData);
    };

    const getClassForField = (fieldValue, isQuantity = false) => {
        if (isQuantity) {
            return fieldValue >= 1 ? 'classicinput' : 'emptyinput';
        } else {
            const valueAsString = typeof fieldValue === 'string' ? fieldValue : '';
            return valueAsString.trim() === '' && attemptedNavigation ? 'emptyinput' : 'classicinput';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('items.')) {
            const [_, index, field] = name.split('.');
            handleInvoiceDataChange(prevState => {
                const newItems = [...prevState.items];
                const newItem = { ...newItems[index], [field]: value };
                newItems[index] = newItem;
                return { ...prevState, items: newItems };
            });
        } else {
            const keys = name.split('.');
            if (keys.length === 2) {
                const [section, field] = keys;
                handleInvoiceDataChange(prevState => ({
                    ...prevState,
                    [section]: {
                        ...prevState[section],
                        [field]: value,
                    },
                }));
                setRequiredFieldsValid(true)
            } else {
                handleInvoiceDataChange(prevState => ({ ...prevState, [name]: value }));
            }
        }
    };

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };


    const createCheckoutSession = async (email, name, priceId, onSuccess, onError) => {
        try {
            const response = await fetch(`${baseUrl}/abonnement/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, priceId }),
            });
    
            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Error creating checkout session:', errorResponse);
                onError(errorResponse.error.message);
                return;
            }
    
            const { clientSecret, sessionId } = await response.json();
            if (clientSecret) {
                onSuccess(clientSecret, sessionId);
            } else {
                console.error('No clientSecret returned from backend.');
                onError('No clientSecret returned from backend.');
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
            onError(error.message);
        }
    };
    
    
    const handleSendInvoice = () => {
        const { email, name } = invoiceData.issuer;
        if (!email || !name) {
            console.error("Email or Name is missing.");
            setShowError(true);
            return;
        }
        createCheckoutSession(email, name, (sessionId) => {
            console.log(`Checkout session created: ${sessionId}`);
            onSuccess();
        }, (errorMessage) => {
            console.error("Error during checkout creation:", errorMessage);
            setShowError(true);
        });
    };
    

    const checkActiveSubscription = async (email) => {
        try {
            const response = await axios.post(`${baseUrl}/abonnement/check-active-subscription`, { email }, {
                headers: { 'Content-Type': 'application/json' }
            });

            const { hasActiveSubscription } = response.data;
            return hasActiveSubscription;
        } catch (error) {
            console.error('Error checking subscription:', error.message);
            return false;
        }
    };

    const handleInvoiceActionSendMail = async (invoiceData, onSuccess, onError) => {
        const { number, issuer, client, total } = invoiceData;
        const areAllRequiredFieldsValid = number !== '' && issuer.name !== '' && client.name !== '';

        if (!areAllRequiredFieldsValid) {
            console.log('Champs requis manquants ou invalides');
            return;
        }

        try {
            const file = <InvoicePDF invoiceData={invoiceData} />;
            const asPDF = pdf([]);
            asPDF.updateContainer(file);
            const pdfBlob = await asPDF.toBlob();

            if (client.email && isValidEmail(client.email)) {
                const factureIdResponse = await axios.get(`${baseUrl}/email/generateFactureId`);
                const { factureId } = factureIdResponse.data;

                const confirmationLink = `http://localhost:5173/confirmation?facture=${factureId}&montant=${total}`;
                const messageEmail = `Cher ${client.name},\n\nVeuillez trouver ci-joint votre facture n° ${number}.\n\nPour confirmer votre accord et signer électroniquement le contrat, veuillez cliquer sur le lien ci-dessous :\n\n${confirmationLink}\n\nNous vous remercions pour votre confiance et restons à votre disposition pour toute information complémentaire.\n\nCordialement,\n${issuer.name}`;

                const formData = new FormData();
                formData.append('file', pdfBlob, `Facture-${number}.pdf`);
                formData.append('email', client.email);
                formData.append('subject', 'Votre Facture');
                formData.append('message', messageEmail);
                formData.append('montant', total);
                formData.append('emetteur', JSON.stringify(issuer));
                formData.append('destinataire', JSON.stringify(client));
                formData.append('factureId', factureId);

                const createAndSendEmailResponse = await axios.post(`${baseUrl}/email/sendEmail`, formData);

                if (createAndSendEmailResponse.status === 200) {
                    console.log("Facture créée et email envoyé avec succès !");
                    onSuccess();
                } else {
                    console.log('Erreur lors de la création de la facture et de l’envoi de l’email', createAndSendEmailResponse.data);
                    onError();
                }
            } else {
                console.log('Email invalide ou absent, téléchargement de la facture...');
            }
        } catch (error) {
            console.error('Erreur lors de la génération ou de l’envoi du PDF', error);
        }
    };

    return (
        <InvoiceDataContext.Provider value={{
            invoiceData,
            baseUrl,
            handleInvoiceDataChange,
            requiredFieldsValid,
            setRequiredFieldsValid,
            pdfInstance,
            setPdfInstance,
            startDate,
            setStartDate,
            buttonLabel,
            setButtonLabel,
            attemptedNavigation,
            setAttemptedNavigation,
            attemptedDownloadWithoutRequiredFields,
            setAttemptedDownloadWithoutRequiredFields,
            showErrorMessage,
            setShowErrorMessage,
            itemsnames,
            setItemsNames,
            handleChange,
            isValidEmail,
            payments,
            setPayments,
            isTotalPercentage100,
            setIsTotalPercentage100,
            remainingPercentage,
            setRemainingPercentage,
            handleInvoiceActionSendMail,
            getClassForField,
            createCheckoutSession,
            createSubscription,
            sendButtonClicked,
            setSendButtonClicked,
            checkActiveSubscription
        }}>
            {children}
        </InvoiceDataContext.Provider>
    );
};
