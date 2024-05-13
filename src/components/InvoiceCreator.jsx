import React, { useState, useEffect } from 'react';
import { pdf, PDFViewer } from '@react-pdf/renderer';
import {
  Stack,
  Table, Thead, Tbody, Tfoot, Tr, Th, Td, Box, Input, InputGroup, InputRightElement, Button, Heading, Text, VStack, IconButton, Flex, Link,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomInput from './CustomIpunt';
import InvoicePDF from './InvoicePDF';
import { useInvoiceData } from '../context/InvoiceDataContext';
import PaymentScheduleForm from './PaymentScheduleForm';
import Stepper from './Stepper';
import InvoiceSummary from './InvoiceSummary';


const InvoiceCreator = ({ handleNavigateTo }) => {

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
    buttonLabel,
    setButtonLabel,
    attemptedDownloadWithoutRequiredFields,
    setAttemptedDownloadWithoutRequiredFields,
    attemptedNavigation,
    setAttemptedNavigation,
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
        setButtonLabel("Voir ma facture et l'envoyer");
      } else {
        setButtonLabel('Télécharger la facture');
      }
    };

    updateButtonLabel();
  }, [invoiceData.client.email]);



  //*définir les slugs obligatoires pour la création de facture (car si exemple pas de num de facture pas de facture téléchargeable)
  return (

    <>
     
        <VStack mt='2rem' boxShadow=' 1px solid black' spacing={6} align="start">
          <Flex w='25vw' justifyContent='space-between' width='-webkit-fill-available'>
            <Flex w={{ base: 'unset', lg: '25vw' }} direction='column' justifyContent='space-between' pb="2rem" >
              <Heading mb='1rem' size="sm">Facture n° :</Heading>
              <Input
                className={requiredClassnameField(attemptedDownloadWithoutRequiredFields, requiredFieldsValid)}
                placeholder="Numéro de facture*" name="number" value={invoiceData.number} onChange={handleChange} />
            </Flex>
            <Flex direction='column' w='25vw' >
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
            </Flex>
          </Flex>
          <Flex flexDirection={{ base: 'column', lg: 'row' }} w='25vw' justifyContent='space-between' width='-webkit-fill-available' pb="2rem" >
            <Flex direction="column" w={{ base: 'unset', lg: '25vw' }} alignItems='start'>
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


            <Flex w={{ base: 'unset', lg: '25vw' }} mt={{ base: '3rem', lg: '5rem' }} direction="column" alignItems='start'>
              <Heading mb='1rem' size="sm">Informations sur le client :</Heading>
              <Input className={requiredClassnameField(attemptedDownloadWithoutRequiredFields, requiredFieldsValid)}
                placeholder="Nom et Prénom / Société*" name="client.name" value={invoiceData.client.name} onChange={handleChange} />
              <Input className={requiredClassnameField(attemptedDownloadWithoutRequiredFields, requiredFieldsValid)}
                placeholder="Adresse*" name="client.adresse" value={invoiceData.client.adresse} onChange={handleChange} />
              <Input className='classicinput' placeholder="N° Siret" name="client.siret" value={invoiceData.client.siret} onChange={handleChange} />
              <Input className='classicinput' placeholder="Email du client " name="client.email" value={invoiceData.client.email} onChange={handleChange} />
            </Flex>
          </Flex>


          <Flex direction='column' className='neue-up' borderWidth='1px' borderRadius='10px' pt='1rem' pl='2rem' pr='2rem' pb='1rem' w='100%'>
            <Heading mb='1rem' mt='1rem' size="md">{itemsnames}</Heading>
            <Table variant="simple" borderRadius='10px'>
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
                    <Link onClick={handleAddItem} display='flex' alignItems='center' color="#745FF2" >
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
        
          <Text color='red' >{showErrorMessage}</Text>
          <Button onClick={handleNavigateTo} rightIcon={<ArrowForwardIcon />} color='white' borderRadius='30px' backgroundColor='black' mt="4" colorScheme="gray" >
            {buttonLabel}
          </Button>
        </VStack>
    </>
  );
};

export default InvoiceCreator;
