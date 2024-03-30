import React, { createContext, useContext, useState } from 'react';

const InvoiceDataContext = createContext();

export const useInvoiceData = () => useContext(InvoiceDataContext);

export const InvoiceDataProvider = ({ children }) => {


    const [subject, setSubject] = useState("Votre Facture");
    const [message, setMessage] = useState("Voici votre facture");

    const [invoiceData, setInvoiceData] = useState({
        number: '',
        date: new Date().toISOString().split('T')[0],
        issuer: {
            name: '',
            adresse: '',
            siret: '',
            email: '',
            iban: ''
        },
        client: {
            name: '',
            adresse: '',
            siret: '',
            email: '',
            iban: '',
        },
        items: [{ description: '', quantity: 0, unitPrice: 0 }],
        subtotal: 0,
        vatRate: 20,
        total: 0,
        devise: '€',
    });


    const [pdfInstance, setPdfInstance] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [itemsnames, setItemsNames] = useState('');
    const [payments, setPayments] = useState([
        { percentage: 25, dueDate: new Date() },
        { percentage: 75, dueDate: new Date() }
    ]);

    const [isTotalPercentage100, setIsTotalPercentage100] = useState(false);
    const [remainingPercentage, setRemainingPercentage] = useState(100);

    const [attemptedNavigation, setAttemptedNavigation] = useState(false);

    const handleInvoiceDataChange = (newData) => {
        setInvoiceData(newData);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        // Gère les champs de l'objet items
        if (name.startsWith('items.')) {
            const [, index, field] = name.split('.');
            handleInvoiceDataChange((prevState) => {
                const newItems = [...prevState.items];
                newItems[index] = { ...newItems[index], [field]: value };
                return { ...prevState, items: newItems };
            });
        } else {
            // Gère les champs simples et les champs d'objets comme issuer et client
            const keys = name.split('.');
            if (keys.length === 2) {
                // Pour les champs d'objets imbriqués comme issuer.name
                const [section, field] = keys;
                handleInvoiceDataChange((prevState) => ({
                    ...prevState,
                    [section]: {
                        ...prevState[section],
                        [field]: value,
                    },
                }));
            } else {
                // Pour les champs simples
                handleInvoiceDataChange((prevState) => ({ ...prevState, [name]: value }));
            }
        }
    };
    

    //fonction afin de savoir si le mail est validegui
    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

 
    const getClassForField = (fieldValue) => {
        // S'assure que la valeur existe avant de tenter d'appeler .trim() sur elle
        // Utilise l'opérateur optionnel ?. pour éviter les erreurs si la valeur est undefined
        return fieldValue?.trim() === '' && attemptedNavigation ? 'emptyinput' : 'classicinput';
      };
      
      

    const handleNavigateToPaymentSchedule = () => {
        // Vérifie si l'onglet actuel est le dernier ou si les conditions pour passer à l'onglet suivant sont remplies
        if (isStepTwoAvailable && tabIndex < 3 - 1) {
            setTabIndex(prevTabIndex => prevTabIndex + 1); // Naviguez vers l'onglet suivant
        } else {
            console.warn("Les champs requis pour passer à l'étape suivante ne sont pas tous remplis.");
            setAttemptedNavigation(true);
        }
    };


    return (
        <InvoiceDataContext.Provider value={{
            invoiceData,
            handleInvoiceDataChange,
            pdfInstance,
            setPdfInstance,
            startDate,
            setStartDate,
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
            attemptedNavigation,
            setAttemptedNavigation,
            handleNavigateToPaymentSchedule,
            getClassForField
        }}>
            {children}
        </InvoiceDataContext.Provider>
    );
};
