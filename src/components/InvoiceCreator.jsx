import React, { useState, useEffect } from 'react';
import { pdf, PDFViewer } from '@react-pdf/renderer';
import {
  Stack,
  Table, Thead, Tbody, Tfoot, Tr, Th, Td, Box, Input, InputGroup, InputRightElement, Button, Heading, Text, VStack, IconButton, Flex, Link,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomInput from './CustomIpunt';
import InvoicePDF from './InvoicePDF';
import { useInvoiceData } from '../context/InvoiceDataContext';
import PaymentScheduleForm from './PaymentScheduleForm';
import Stepper from './Stepper';


const InvoiceCreator = ({steps}) => {

  const [subject, setSubject] = useState("Votre Facture");
  const [message, setMessage] = useState("Voici votre facture");


  const {
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
  } = useInvoiceData();



  //fonction pour ajouter un item à la facture
  const handleAddItem = () => {
    const items = [...invoiceData.items, { description: '', quantity: 1, unitPrice: 0 }];
    handleInvoiceDataChange(prevState => ({ ...prevState, items }));
  };

  //fonction pour enelever un item à la facture
  const handleRemoveItem = (index) => {
    const items = [...invoiceData.items];
    items.splice(index, 1);
    handleInvoiceDataChange(prevState => ({ ...prevState, items }));
  };

  //fonction pour set la TVA  
  const handleVatChange = (e) => {
    handleInvoiceDataChange(prevState => ({ ...prevState, vatRate: parseFloat(e.target.value) || 0 }));
  };

  //fonction pour definir le contour rouge si l'input est pas rempli
  const requiredClassnameField = (attemptedDownloadWithoutRequiredFields, requiredFieldsValid) => {
    if (attemptedDownloadWithoutRequiredFields === false && requiredFieldsValid['issuer.name'] === false) {
      return 'emptyinput';
    } else {
      return 'classicinput';
    }
  };

  useEffect(() => {
    const generatePdfDocument = async () => {
      const doc = <InvoicePDF invoiceData={invoiceData} />;
      const instance = pdf([]); // Crée une instance de PDF vide
      instance.updateContainer(doc);
      const blob = await instance.toBlob();
      setPdfInstance(URL.createObjectURL(blob));
    };
    generatePdfDocument();
  }, [invoiceData]);


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
    handleInvoiceDataChange((prevState) => ({ ...prevState, subtotal, vatAmount, total })); // Mise à jour de l'état pour inclure vatAmount
  }, [invoiceData.items, invoiceData.vatRate]);


  useEffect(() => {
    const updateItemsNames = () => {
      const items = invoiceData.items;
      if ((items.length > 1)) {
        setItemsNames('Articles / Services');
      } else {
        setItemsNames('Article / Service');
      }
    };

    updateItemsNames();
  }, [invoiceData.items]);

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


  const handleInvoiceAction = async () => {
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







  //*définir les slugs obligatoires pour la création de facture (car si exemple pas de num de facture pas de facture téléchargeable)
  return (
    <Flex mt="5rem" alignContent='center' alignItems="center" direction='column' >
      <Flex direction='column' textAlign='center' alignContent='center' alignItems="center" mb='8' w='45vw' >
        <Heading color='black' mb="4">
          Votre facture
        </Heading>
        <Text fontSize="lg" color="#4A5568">
        Créez votre facture numérique en suivant trois étapes simples, intègrant également un processus de paiement automatique pour plus d'efficacité et de rapidité.
        </Text>
      </Flex>

      <Stepper steps={steps} />

      <Box borderWidth="1px" mb='2rem' backgroundColor='white' p='3rem' maxWidth='70vw' borderRadius="1vw" className='neue-up'>
        <VStack w='60vw' boxShadow=' 1px solid black' spacing={6} align="start">
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
                onChange={handleChange} />
              <Input className={requiredClassnameField(attemptedDownloadWithoutRequiredFields, requiredFieldsValid)}
                placeholder="Adresse*" name="issuer.adresse" value={invoiceData.issuer.adresse} onChange={handleChange} />
              <Input className='classicinput' placeholder="N° Siret" name="issuer.siret" value={invoiceData.issuer.siret} onChange={handleChange} />
              <Input className='classicinput' placeholder="Email de l'émetteur" name="issuer.email" value={invoiceData.issuer.email} onChange={handleChange} />
            </Flex>


            <Flex w='25vw' mt='5rem' direction="column" alignItems='start'>
              <Heading mb='1rem' size="sm">Informations sur le client :</Heading>
              <Input className={requiredClassnameField(attemptedDownloadWithoutRequiredFields, requiredFieldsValid)}
                placeholder="Nom et Prénom / Société*" name="client.name" value={invoiceData.client.name} onChange={handleChange} />
              <Input className={requiredClassnameField(attemptedDownloadWithoutRequiredFields, requiredFieldsValid)}
                placeholder="Adresse*" name="client.adresse" value={invoiceData.client.adresse} onChange={handleChange} />
              <Input className='classicinput' placeholder="N° Siret" name="client.siret" value={invoiceData.client.siret} onChange={handleChange} />
              <Input className='classicinput' placeholder="Email du client " name="client.email" value={invoiceData.client.email} onChange={handleChange} />
            </Flex>
          </Flex>


          <Flex direction='column' className='neue-up' borderRadius='10px' pl='2rem' pr='2rem' pb='1rem' pt='1rem' w='100%'>

            <Heading size="sm">{itemsnames}</Heading>
            <Table variant="simple" borderRadius='10px' pb='1rem'>
              <Thead>
                <Tr>
                  <Th className='head-tab' pl='0'>Description</Th>
                  <Th className='head-tab'>Quantité</Th>
                  <Th className='head-tab'>Prix ht</Th>
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
                    <Td textAlign='end'>
                      {item.quantity * item.unitPrice} {/* Calcul du total pour chaque article */}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Td pl='0' colSpan="4" borderBottom="none">
                    <Link onClick={handleAddItem} display='flex' alignItems='center' color="blue.500" >
                      Ajouter un article
                      <AddIcon w='2.5' ml="2" />
                    </Link>
                  </Td>
                </Tr>

                <Tr>
                  <Td colSpan={3} style={{ paddingLeft: '0', textAlign: 'end' }}><Heading size='sm'>Sous-total HT :</Heading></Td>
                  <Td style={{ textAlign: 'end' }}><Heading size='sm'>{invoiceData.subtotal}{invoiceData.devise}</Heading></Td>
                </Tr>
                <Tr>
                  <Td colSpan={3} style={{ paddingLeft: '0', textAlign: 'end' }}><Heading size='sm'>TVA (%):</Heading></Td>
                  <Td style={{ textAlign: 'end' }}>
                    <Input
                      w='10vh'
                      textAlign='end'
                      className='neue-down'
                      type="number"
                      value={invoiceData.vatRate}
                      onChange={handleVatChange} // Assurez-vous d'implémenter cette fonction pour mettre à jour le taux de TVA
                      placeholder="Taux de TVA"

                    />
                  </Td>
                </Tr>

                <Tr alignContent='center' alignItems='center'>
                  <Td colSpan={3} style={{ paddingLeft: '0', textAlign: 'end' }}><Heading size='md'>Total TTC :</Heading></Td>
                  <Td style={{ textAlign: 'end' }}><Heading size='md'>{invoiceData.total}{invoiceData.devise}</Heading></Td>
                </Tr>
              </Tfoot>
            </Table>

          </Flex>
          <Flex direction="column" alignItems='start' mt="4">
            <Heading mb='1rem' size="sm">Saisissez un IBAN si vous voulez recevoir le paiement</Heading>
            {showIbanField && (
              <Input
                className='neue-down'
                placeholder="IBAN"
                name="issuer.iban"
                value={invoiceData.issuer.iban}
                onChange={(e) => {
                  const newIban = e.target.value;
                  handleInvoiceDataChange({
                    ...invoiceData,
                    issuer: { ...invoiceData.issuer, iban: newIban }
                  });
                }}
              />

            )}
            {!showIbanField && (
              <Link color="blue.500" onClick={() => setShowIbanField(true)}>
                Ajouter votre IBAN
              </Link>
            )}
          </Flex>
          <Text color='red' >{showErrorMessage}</Text>
          <Button color='white' borderRadius='30px' backgroundColor='black' mt="4" colorScheme="gray" onClick={() => handleInvoiceAction(invoiceData)}>
            {buttonLabel}
          </Button>
        </VStack>
      </Box>

      <PaymentScheduleForm />

      {pdfInstance && (
        <PDFViewer style={{ width: '100%', height: '180vh' }}>
          <InvoicePDF invoiceData={invoiceData} />
        </PDFViewer>
      )}

    </Flex>

  );
};

export default InvoiceCreator;
