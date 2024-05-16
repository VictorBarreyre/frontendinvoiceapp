import React, { createContext, useContext, useState } from 'react';
import InvoicePDF from '../components/InvoicePDF'
import { pdf, PDFViewer } from '@react-pdf/renderer';

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
    const [buttonLabel, setButtonLabel] = useState(null);
    const [attemptedDownloadWithoutRequiredFields, setAttemptedDownloadWithoutRequiredFields] = useState(false);
    const [attemptedNavigation, setAttemptedNavigation] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState('');
    const [itemsnames, setItemsNames] = useState('');
    const [payments, setPayments] = useState([
        { percentage: 100, dueDate: new Date() },
      ]);
      const [isTotalPercentage100, setIsTotalPercentage100] = useState(false);
      const [remainingPercentage, setRemainingPercentage] = useState(100);


    const handleInvoiceDataChange = (newData) => {
        setInvoiceData(newData);
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


    // déplacer l'aspect back dans le back
    const handleInvoiceActionSendMail = async () => {
        const { number, issuer, client } = invoiceData;
        const areAllRequiredFieldsValid = number !== '' && issuer.name !== '' && client.name !== '';
    
        const baseUrl = "http://localhost:8000";
    
        if (!areAllRequiredFieldsValid) {
          setRequiredFieldsValid({
            number: number !== '',
            'issuer.name': issuer.name !== '',
            'client.name': client.name !== '',
          });
          console.log('Champs requis manquants ou invalides');
          return;
        }
    
        try {
          const file = <InvoicePDF invoiceData={invoiceData} />;
          const asPDF = pdf([]);
          asPDF.updateContainer(file);
          const pdfBlob = await asPDF.toBlob();
    
          if (client.email && isValidEmail(client.email)) {
            const formData = new FormData();
            formData.append('file', pdfBlob, `Facture-${number}.pdf`);
            formData.append('email', client.email);
            formData.append('montant', invoiceData.total);
            formData.append('emetteur', JSON.stringify(invoiceData.issuer));
            formData.append('destinataire', JSON.stringify(invoiceData.client));
    
            // Première requête pour créer la facture et récupérer le factureId
            const createResponse = await fetch(`${baseUrl}/email/sendEmail`, {
              method: "POST",
              body: formData,
            });
    
            if (createResponse.status >= 200 && createResponse.status < 300) {
              const createData = await createResponse.json();
              const factureId = createData.factureId;
              const confirmationLink = `http://localhost:5173/confirmation?facture=${factureId}&montant=${invoiceData.total}`;
    
              // Construction du messageEmail avec le factureId
              const messageEmail = `Cher ${client.name},
      
      Veuillez trouver ci-joint votre facture n° ${number}.
      
      ...
      
      Pour confirmer votre accord et signer électroniquement le contrat, veuillez cliquer sur le lien ci-dessous :
      
      ${confirmationLink}
      
      Nous vous remercions pour votre confiance et restons à votre disposition pour toute information complémentaire.
      
      Cordialement,
      ${issuer.name}`;
    
              // Ajout de subject et messageEmail pour l'envoi de l'email
              formData.append('subject', 'Votre Facture'); // Assurez-vous d'avoir défini un sujet approprié
              formData.append('message', messageEmail); // Ajoutez le messageEmail
    
              // Deuxième requête pour envoyer l'email avec le messageEmail inclus
              const emailResponse = await fetch(`${baseUrl}/email/sendEmail`, {
                method: "POST",
                body: formData, // Réutilisation de formData avec les données ajoutées
              });
    
              if (emailResponse.status >= 200 && emailResponse.status < 300) {
                alert("Facture envoyée avec succès !");
              } else {
                console.log('Erreur lors de l\'envoi de la facture', emailResponse.statusText);
              }
            } else {
              console.log('Erreur lors de la création de la facture', createResponse.statusText);
            }
          } else {
            console.log('Email invalide ou absent, téléchargement de la facture...');
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Facture-${number}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } catch (error) {
          console.error('Erreur lors de la génération ou de l’envoi du PDF', error);
        }
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
            getClassForField
        }}>
            {children}
        </InvoiceDataContext.Provider>
    );
};
