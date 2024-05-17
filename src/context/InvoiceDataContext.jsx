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

    const baseUrl = "http://localhost:8000";

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

    const handleInvoiceActionSendMail = async (invoiceData, onSuccess, onError) => {
      const { number, issuer, client, total } = invoiceData;
      const areAllRequiredFieldsValid = number !== '' && issuer.name !== '' && client.name !== '';
  
      if (!areAllRequiredFieldsValid) {
          console.log('Champs requis manquants ou invalides');
          return;
      }
  
      try {
          // Génération du PDF de la facture
          const file = <InvoicePDF invoiceData={invoiceData} />;
          const asPDF = pdf([]);
          asPDF.updateContainer(file);
          const pdfBlob = await asPDF.toBlob();
  
          if (client.email && isValidEmail(client.email)) {
              // Première requête pour générer factureId
              const factureIdResponse = await fetch(`${baseUrl}/email/generateFactureId`, {
                  method: "GET",
              });
              if (!factureIdResponse.ok) throw new Error("Erreur lors de la génération du factureId.");
  
              const factureIdData = await factureIdResponse.json();
              const factureId = factureIdData.factureId;
  
              const confirmationLink = `http://localhost:5173/confirmation?facture=${factureId}&montant=${total}`;
              const messageEmail = `Cher ${client.name},
  
              Veuillez trouver ci-joint votre facture n° ${number}.
  
              Pour confirmer votre accord et signer électroniquement le contrat, veuillez cliquer sur le lien ci-dessous :
  
              ${confirmationLink}
  
              Nous vous remercions pour votre confiance et restons à votre disposition pour toute information complémentaire.
  
              Cordialement,
              ${issuer.name}`;
  
              // Préparation du formulaire pour l'envoi de l'email
              const formData = new FormData();
              formData.append('file', pdfBlob, `Facture-${number}.pdf`);
              formData.append('email', client.email);
              formData.append('subject', 'Votre Facture');
              formData.append('message', messageEmail);
              formData.append('montant', total);
              formData.append('emetteur', JSON.stringify(issuer));
              formData.append('destinataire', JSON.stringify(client));
              formData.append('factureId', factureId);
  
              // Deuxième requête pour créer la facture et envoyer l'email
              const createAndSendEmailResponse = await fetch(`${baseUrl}/email/sendEmail`, {
                  method: "POST",
                  body: formData,
              });
  
              if (createAndSendEmailResponse.ok) {
                  console.log("Facture créée et email envoyé avec succès !");
                  onSuccess();
              } else {
                  console.log('Erreur lors de la création de la facture et de l’envoi de l’email', await createAndSendEmailResponse.text());
                  onError();
              }
          } else {
              console.log('Email invalide ou absent, téléchargement de la facture...');
              // Logique de téléchargement de la facture
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
            getClassForField
        }}>
            {children}
        </InvoiceDataContext.Provider>
    );
};
