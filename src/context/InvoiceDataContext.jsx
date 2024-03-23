import React, { createContext, useContext, useState } from 'react';

const InvoiceDataContext = createContext();

export const useInvoiceData = () => useContext(InvoiceDataContext);

export const InvoiceDataProvider = ({ children }) => {


    const [subject, setSubject] = useState("Votre Facture");
    const [message, setMessage] = useState("Voici votre facture");

    //partie facture // changer les data en : '', quand on veut rendre les champs vident
    const [invoiceData, setInvoiceData] = useState({
        number: '000243',
        date: new Date().toISOString().split('T')[0],
        issuer: {
            name: 'Jean Dupont',
            adresse: '43 rue de La Paix 75001 Paris',
            siret: '761289800089',
            email: 'jeandupont@gmail.com',
            iban: 'FR76 1020 4000 4533 3444 5678'
        },
        client: {
            name: 'Victor Barreyre',
            adresse: '43 grande rue 91450 Étiolles',
            siret: '761289800089',
            email: 'barreyrevictor.contact@gmail.com',
            iban:'',
        },
        items: [{ description: 'test', quantity: 1, unitPrice: 0 }],
        subtotal: 0,
        vatRate: 20,
        total: 0,
        devise: '€',
    });


    const [requiredFieldsValid, setRequiredFieldsValid] = useState({
        number: false,
        issuerName: false,
        clientName: false,
        // Ajoutez d'autres champs obligatoires ici selon vos besoins
    });
    const [pdfInstance, setPdfInstance] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [showIbanField, setShowIbanField] = useState(false);
    const [buttonLabel, setButtonLabel] = useState(null);
    const [attemptedDownloadWithoutRequiredFields, setAttemptedDownloadWithoutRequiredFields] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState('');
    const [itemsnames, setItemsNames] = useState('');


    const handleInvoiceDataChange = (newData) => {
        setInvoiceData(newData);
    };


    //fonction pour remplir les inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Cas où le champ appartient à l'array des items
        if (name.startsWith('items.')) {
            const [_, index, field] = name.split('.');
            handleInvoiceDataChange(prevState => {
                const newItems = [...prevState.items];
                const newItem = { ...newItems[index], [field]: value };
                newItems[index] = newItem;
                return { ...prevState, items: newItems };
            });
        } else {
            // Cas pour les champs simples et les champs d'objets comme issuer et client
            // Sépare le nom du champ pour identifier les objets imbriqués
            const keys = name.split('.');
            if (keys.length === 2) {
                // Gestion des champs d'objets imbriqués comme issuer.name
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
                // Gestion des champs simples
                handleInvoiceDataChange(prevState => ({ ...prevState, [name]: value }));
            }
        }
    };


    //fonction afin de savoir si le mail est validegui
    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };



    return (
        <InvoiceDataContext.Provider value={{
            invoiceData,
            handleInvoiceDataChange,
            requiredFieldsValid,
            setRequiredFieldsValid,
            pdfInstance,
            setPdfInstance,
            startDate,
            setStartDate,
            showIbanField,
            setShowIbanField,
            buttonLabel,
            setButtonLabel,
            attemptedDownloadWithoutRequiredFields,
            setAttemptedDownloadWithoutRequiredFields,
            showErrorMessage,
            setShowErrorMessage,
            itemsnames,
            setItemsNames,
            handleChange,
            isValidEmail,

        }}>
            {children}
        </InvoiceDataContext.Provider>
    );
};
