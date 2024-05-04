import React, { createContext, useContext, useState,useEffect } from 'react';
import { useAuth } from './AuthContext';

const InvoiceDataContext = createContext();

export const useInvoiceData = () => useContext(InvoiceDataContext);

export const InvoiceDataProvider = ({ children }) => {

    const { user } = useAuth();

    const [subject, setSubject] = useState("Votre Facture");
    const [message, setMessage] = useState("Voici votre facture");

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
        items: [{ description: 'TEST', quantity: 1, unitPrice: 1 }],
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
    
    const [pdfInstance, setPdfInstance] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [itemsnames, setItemsNames] = useState('');
    const [payments, setPayments] = useState([
        { percentage: 100, dueDate: new Date() },
    
    ]);

    const [isTotalPercentage100, setIsTotalPercentage100] = useState(false);
    const [remainingPercentage, setRemainingPercentage] = useState(100);

    const [attemptedNavigation, setAttemptedNavigation] = useState(false);

    const baseUrl = "http://localhost:8000";

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

 
    const getClassForField = (fieldValue, isQuantity = false) => {
        if (isQuantity) {
            // Pour les quantités, vérifiez directement la valeur numérique
            return fieldValue >= 1 ? 'classicinput' : 'emptyinput';
        } else {
            // Pour les chaînes, continuez avec la logique existante
            const valueAsString = typeof fieldValue === 'string' ? fieldValue : '';
            return valueAsString.trim() === '' && attemptedNavigation ? 'emptyinput' : 'classicinput';
        }
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
            getClassForField,
            baseUrl
        }}>
            {children}
        </InvoiceDataContext.Provider>
    );
};
