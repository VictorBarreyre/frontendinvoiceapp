import React, { useState, useEffect, useRef } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, Box, Input, InputGroup, InputRightElement, Button, Heading, Text, VStack, HStack, IconButton, Flex, Link } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomInput from './CustomIpunt';
import InvoicePDF from './InvoicePDF';



const InvoiceCreator = () => {

 //importer l'envoie de facture après implementation de la facture d'envoie par mail avec le context
 const [subject, setSubject] = useState("Votre Facture");
 const [message, setMessage] = useState("Voici votre facture");


//partie facture
  const [startDate, setStartDate] = useState(new Date());
  const [showIbanField, setShowIbanField] = useState(false);
  const [buttonLabel, setButtonLabel] = useState(null);
  const [invoiceData, setInvoiceData] = useState({
    number: '',
    date: new Date().toISOString().split('T')[0], // Date d'aujourd'hui par défaut
    issuer: { name: '', adresse: '', siret: '', email: '', iban: ''  },
    client: { name: '', siret: '', adresse: '', email: '' },
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    vatRate: 20,
    total: 0,
  });
  const [requiredFieldsValid, setRequiredFieldsValid] = useState({
    number: false,
    issuerName: false,
    clientName: false,
    // Ajoutez d'autres champs obligatoires ici selon vos besoins
  });
  const [attemptedDownloadWithoutRequiredFields, setAttemptedDownloadWithoutRequiredFields] = useState(false);
  const [showErrorMessage,setShowErrorMessage]= useState('')


  //fonction pour definir le contour rouge si l'input est pas rempli
  const requiredClassnameField = (attemptedDownloadWithoutRequiredFields, requiredFieldsValid) => {
    if (attemptedDownloadWithoutRequiredFields === false && requiredFieldsValid['issuer.name'] === false) {
      return 'emptyinput';
    } else {
      return 'classicinput';
    }
  };


//useeffect pour afficher ou pas le message d'erreur
useEffect(() => {
  if (attemptedDownloadWithoutRequiredFields === false && requiredFieldsValid['issuer.name'] === false) {
    setShowErrorMessage('Veuillez renseigner les champs obligatoires'); 
  }
}, [attemptedDownloadWithoutRequiredFields, requiredFieldsValid]);


//useeffect qui met à jour le calcul de la tva et du total
  useEffect(() => {
    const subtotal = invoiceData.items.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0);
    const vatAmount = subtotal * (invoiceData.vatRate / 100); // Calcul du montant de la TVA
    const total = subtotal + vatAmount;
    setInvoiceData((prevState) => ({ ...prevState, vatAmount, total })); // Mise à jour de l'état pour inclure vatAmount
  }, [invoiceData.items, invoiceData.vatRate]);


//fonction afin de savoir si le mail est validegui
  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };


  //fonction pour remplir les inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(`Nom de la donnée: ${name}, Valeur: ${value}`);
    // Cas où le champ appartient à l'array des items
    if (name.startsWith('items.')) {
      const [_, index, field] = name.split('.');
      setInvoiceData(prevState => {
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
        setInvoiceData(prevState => ({
          ...prevState,
          [section]: {
            ...prevState[section],
            [field]: value,
          },
        }));
        setRequiredFieldsValid(true)
      } else {
        // Gestion des champs simples
        setInvoiceData(prevState => ({ ...prevState, [name]: value }));
      }
    }
  };

  //fonction pour ajouter un item à la facture
  const handleAddItem = () => {
    const items = [...invoiceData.items, { description: '', quantity: 1, unitPrice: 0 }];
    setInvoiceData(prevState => ({ ...prevState, items }));
  };

  //fonction pour enelever un item à la facture
  const handleRemoveItem = (index) => {
    const items = [...invoiceData.items];
    items.splice(index, 1);
    setInvoiceData(prevState => ({ ...prevState, items }));
  };

  //fonction pour set la TVA  
  const handleVatChange = (e) => {
    setInvoiceData(prevState => ({ ...prevState, vatRate: parseFloat(e.target.value) || 0 }));
  };


//fonction qui nous sert à envoyer ou à download la facture, à modifier car il faut qu'elle génére le pdf en attachement
const handleInvoiceAction = async () => {
  const { number, issuer, client } = invoiceData;
  const areAllRequiredFieldsValid = number !== '' && issuer.name !== '' && client.name !== '';

  // url qui sera à redéfinir en fonction le backend sera mis en prod
  const baseUrl = "http://localhost:8000";

  // Vérification des champs requis
  if (!areAllRequiredFieldsValid) {
    setRequiredFieldsValid({
      number: number !== '',
      'issuer.name': issuer.name !== '',
      'client.name': client.name !== '',
    });
    console.log('Champs requis manquants ou invalides');
    return; // Arrête l'exécution si les champs requis ne sont pas valides
  }

  // Génération du PDF (le contenu réel de cette étape dépend de votre implémentation)
 try {
    const file = <InvoicePDF invoiceData={invoiceData} />;
    const asPDF = pdf([]); // Crée une instance vide de PDF
    asPDF.updateContainer(file); // Met à jour le conteneur PDF avec le document JSX
    const pdfBlob = await asPDF.toBlob(); // Convertit le document en blob

  if (client.email && isValidEmail(client.email)) {
    console.log(`Tentative d'envoi de la facture à ${client.email}`);

    const formData = new FormData();
    formData.append('file', pdfBlob, `Facture-${number}.pdf`);
    formData.append('email', client.email);
    formData.append('subject', "Votre Facture");
    formData.append('message', "Voici votre facture.");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
  
  }
  
    try {     
      const res = await fetch(`${baseUrl}/email/sendEmail`,
       {
        method: "POST",
        body: formData, // FormData contenant le PDF et les informations de l'email
        
      });

      if (res.status >= 200 && res.status < 300) {
        alert("Facture envoyée avec succès !");
      } else {
        console.log('Erreur lors de l\'envoi de la facture', res);
      }
    } catch (error) {
      console.error('Erreur lors de la tentative d\'envoi de la facture', error);
    }
  } else {
    // Téléchargement du PDF si l'email n'est pas valide ou absent
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
  console.error('Erreur lors de la génération du PDF', error);
}
};



  
  //useeffect qui se charge d'update le texte dans le button fianal  
  useEffect(() => {
    const updateButtonLabel = () => {
      const email = invoiceData.client.email;
      if (email && isValidEmail(email)) {
        setButtonLabel('Envoyer la facture par email');
      } else {
        setButtonLabel('Télécharger la facture');
      }
    };

    updateButtonLabel();
  }, [invoiceData.client.email]);


  //* Prendre la fonction du MyForm.jsx et l'adapter ici pour l'envoie de mail
  //*définir les slugs obligatoires pour la création de facture (car si exemple pas de num de facture pas de facture téléchargeable)
  return (
    <Flex mt="5rem" alignContent='center' alignItems="center" direction='column' >
      <Flex direction='column' textAlign='center' alignContent='center' alignItems="center" mb='8'w='45vw' >
        <Heading color='black' mb="4">
          Votre facture
        </Heading>
        <Text fontSize="lg" color="#4A5568">
          Bring blockchain to the people. Solana supports experiences for power users,
          new consumers, and everyone in between.
        </Text>
      </Flex>
      <Box mb='2rem' backgroundColor='white' p='3rem' maxWidth='80vw' borderRadius="1vw" className='neue-up'>
        <VStack w='70vw' boxShadow=' 1px solid black' spacing={6} align="start">
          <Flex w='25vw' justifyContent='space-between' width='-webkit-fill-available'>
            <Flex direction='column' justifyContent='space-between' pb="2rem" >
              <Heading mb='1rem' size="md">Facture n° :</Heading>
              <Input
                className={requiredClassnameField(attemptedDownloadWithoutRequiredFields, requiredFieldsValid)}
                placeholder="Numéro de facture*" name="number" value={invoiceData.number} onChange={handleChange} />
            </Flex>
            <Box direction='column' w='25vw' justifyContent='space-between' pb="2rem" >
              <Heading mb='1rem' size="sm">Date :</Heading>
              <DatePicker
                className='neue-down'
                boxShadow='rgba(174, 174, 192, 0.4) -1.5px -1.5px 3px 0px, rgb(255, 255, 255) 1.5px 1.5px 3px 0px !important'
                position='static !important'
                backgroundColor='white'
                color="#0B3860"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                minDate={new Date()}
                maxDate={new Date().setFullYear(new Date().getFullYear() + 1)}
                dateFormat="dd/MM/yyyy"
                customInput={<CustomInput />}
              />
            </Box>
          </Flex>
          <Flex w='25vw' justifyContent='space-between' width='-webkit-fill-available' pb="2rem" >
            <Flex direction="column" alignItems='start'>
              <Heading mb='1rem' size="sm">Informations sur l'émetteur :</Heading>
              <Input className={requiredClassnameField(attemptedDownloadWithoutRequiredFields, requiredFieldsValid)}
                      placeholder="Nom et Prénom / Société*" 
                      name="issuer.name" 
                      value={invoiceData.issuer.name} 
                      onChange={handleChange}/>
              <Input className={requiredClassnameField(attemptedDownloadWithoutRequiredFields, requiredFieldsValid)}
                     placeholder="Adresse*" name="issuer.adresse" value={invoiceData.issuer.company} onChange={handleChange} />
              <Input className='classicinput' placeholder="N° Siret" name="issuer.siret" value={invoiceData.issuer.siret} onChange={handleChange} />
              <Input className='classicinput' placeholder="Email de l'émetteur" name="issuer.email" value={invoiceData.issuer.email} onChange={handleChange} />
            </Flex>


            <Flex w='25vw' mt='5rem' direction="column" alignItems='start'>
              <Heading mb='1rem' size="sm">Informations sur le client :</Heading>
              <Input className={requiredClassnameField(attemptedDownloadWithoutRequiredFields, requiredFieldsValid)}
                     placeholder="Nom et Prénom / Société*" name="client.name" value={invoiceData.client.name} onChange={handleChange} />
              <Input className={requiredClassnameField(attemptedDownloadWithoutRequiredFields, requiredFieldsValid)} 
                     placeholder="Adresse*" name="client.adresse" value={invoiceData.client.company} onChange={handleChange} />
              <Input className='classicinput' placeholder="N° Siret" name="client.siret" value={invoiceData.client.siret} onChange={handleChange} />
              <Input className='classicinput' placeholder="Email du client " name="client.email" value={invoiceData.client.email} onChange={handleChange} />
            </Flex>
          </Flex>


          <Flex direction='column' className='neue-up' borderRadius='10px' pl='2rem' pr='2rem' pb='1rem' pt='1rem'>

            <Heading size="sm"> Article</Heading>
            <Table variant="simple" borderRadius='10px' pb='1rem'>
              <Thead>
                <Tr>
                  <Th className='head-tab' pl='0'>Description</Th>
                  <Th className='head-tab'>Quantité</Th>
                  <Th className='head-tab'>Prix ht</Th>
                  <Th className='head-tab'>TVA (%)</Th>
                  <Th className='head-tab'>Total/ht</Th>
                </Tr>
              </Thead>
              <Tbody>
                {invoiceData.items.map((item, index) => (
                  <Tr key={index}>
                    <Td pl='0'>
                      <Input
                       className={requiredClassnameField(attemptedDownloadWithoutRequiredFields, requiredFieldsValid)}
                        placeholder="Description*"
                        name={`items.${index}.description`}
                        value={item.description}
                        onChange={handleChange}
                      />
                    </Td>
                    <Td >
                      <InputGroup>
                        <Input
                          className='classicinput'
                          boxShadow='rgba(174, 174, 192, 0.4) -1.5px -1.5px 3px 0px, rgb(255, 255, 255) 1.5px 1.5px 3px 0px;'
                          placeholder="Quantité"
                          name={`items.${index}.quantity`}
                          type="number"
                          value={item.quantity}
                          onChange={handleChange}
                        />
                        <InputRightElement children={
                          <IconButton
                            aria-label="Supprimer l'article"
                            icon={<DeleteIcon />}
                            size="sm"
                            backgroundColor="transparent"
                            onClick={() => handleRemoveItem(index)}
                          />
                        } />
                      </InputGroup>
                    </Td>
                    <Td>
                      <Input
                        className={requiredClassnameField(attemptedDownloadWithoutRequiredFields, requiredFieldsValid)}
                        alignItems='end'
                        placeholder="Prix unitaire*"
                        name={`items.${index}.unitPrice`}
                        type="number"
                        value={item.unitPrice}
                        onChange={handleChange}
                      />
                    </Td>
                    <Td>
                      <Input
                        className='classicinput'
                        type="number"
                        value={invoiceData.vatRate}
                        onChange={handleVatChange}
                      />
                    </Td>
                    <Td>
                      {item.quantity * item.unitPrice} {/* Calcul du total pour chaque article */}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Td pl='0' colSpan="5" borderBottom="none">
                    <Link onClick={handleAddItem} display='flex' alignItems='center' color="blue.500" >
                      Ajouter un article
                      <AddIcon w='2.5' ml="2" />
                    </Link>
                  </Td>
                </Tr>

                <Tr alignContent='center' alignItems='center'>
                  <Td colSpan={4} style={{ textAlign: 'end' }}> <Heading size='md'>Total TTC : </Heading></Td>
                  <Td style={{ textAlign: 'end' }}> <Heading size='md'>{invoiceData.total} </Heading></Td>
                </Tr>
              </Tfoot>
            </Table>

          </Flex>

          <Flex direction="column" alignItems='start' mb="4">
                <Heading mb='1rem' size="sm">Saisissez un IBAN si vous voulez recevoir le paiement</Heading>
                {showIbanField && (
                    <Input
                        placeholder="IBAN"
                        name="issuer.iban"
                        value={invoiceData.issuer.iban}
                        onChange={(e) => setInvoiceData({
                            ...invoiceData,
                            issuer: { ...invoiceData.issuer, iban: e.target.value }
                        })}
                    />
                )}
                {!showIbanField && (
                    <Link color="blue.500" onClick={() => setShowIbanField(true)}>
                        Ajouter votre IBAN
                    </Link>
                )}
            </Flex>
            <Text color='red' >{showErrorMessage}</Text>
          <Button color='white' borderRadius='30px' backgroundColor='black' mt="4" colorScheme="gray"  onClick={() => handleInvoiceAction(invoiceData)}>
          {buttonLabel}
          </Button>
        </VStack>
      </Box>
    </Flex>

  );
};

export default InvoiceCreator;
