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

const InvoiceCreator = ({ navigateToPaymentSchedule }) => {

  const {
    invoiceData,
    handleInvoiceDataChange,
    getClassForField,
    pdfInstance,
    setPdfInstance,
    startDate,
    setStartDate,
    itemsnames,
    setItemsNames,
    handleChange,
    isValidEmail,
  } = useInvoiceData();

  const [issuerEmailValid, setIssuerEmailValid] = useState(true);
  const [issuerEmailTouched, setIssuerEmailTouched] = useState(false);
  const [clientEmailValid, setClientEmailValid] = useState(true);
  const [clientEmailTouched, setClientEmailTouched] = useState(false);

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


  const handleIssuerEmailChange = (e) => {
    handleChange(e);
    setIssuerEmailTouched(true);
    setIssuerEmailValid(isValidEmail(e.target.value));
  };

  // Fonction de validation d'e-mail pour le client
  const handleClientEmailChange = (e) => {
    handleChange(e);
    setClientEmailTouched(true);
    setClientEmailValid(isValidEmail(e.target.value));
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



  //*définir les slugs obligatoires pour la création de facture (car si exemple pas de num de facture pas de facture téléchargeable)
  return ( <> 
    <Heading size='md'>Entrez les informations de facturation </Heading>
      <VStack mt='2rem' boxShadow=' 1px solid black' spacing={6} align="start">
        <Flex w='100%' justifyContent='space-between' >
          <Flex direction='column' justifyContent='space-between' pb="2rem" >
            <Heading mb='1rem' size="sm">Facture n° :</Heading>
            <Input
             _focus={{ borderColor: "#745FF2", boxShadow: "none" }}
              className={getClassForField(invoiceData.number)} // Assurez-vous que le nom du champ correspond exactement à la clé dans invoiceData
              placeholder="Numéro de facture" name="number" value={invoiceData.number} onChange={handleChange} />
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
        <Flex flexDirection={{ base: 'column', lg: 'row' }} justifyContent='space-between'w='100%' pb="2rem" >
          <Flex direction="column" w={{ base: 'unset', lg: '25vw' }} alignItems='start'>
            <Heading mb='1rem' size="sm">Informations sur l'émetteur :</Heading>
            <Input 
               _focus={{ borderColor: "#745FF2", boxShadow: "none" }}
              className={getClassForField(invoiceData.issuer.name)}
              placeholder="Nom et Prénom / Société"
              name="issuer.name"
              value={invoiceData.issuer.name}
              onChange={handleChange} />
            <Input 
              _focus={{ borderColor: "#745FF2", boxShadow: "none" }}
              className={getClassForField(invoiceData.issuer.adresse)}
              placeholder="Adresse" name="issuer.adresse" value={invoiceData.issuer.adresse} onChange={handleChange} />
            <Input 
              _focus={{ borderColor: "#745FF2", boxShadow: "none" }}
            className={getClassForField(invoiceData.issuer.siret)} placeholder="N° Siret" name="issuer.siret" value={invoiceData.issuer.siret} onChange={handleChange} />
            <Input
                _focus={{ borderColor: "#745FF2", boxShadow: "none" }}
              className={getClassForField(invoiceData.issuer.email)}
              placeholder="Email de l'émetteur"
              name="issuer.email"
              value={invoiceData.issuer.email}
              onChange={handleIssuerEmailChange} 
            />
             {issuerEmailTouched && !issuerEmailValid && (
            <Text color="#FB7575" fontSize="sm">
              L'adresse e-mail de l'émetteur n'est pas valide.
            </Text>
          )}
          </Flex>




          <Flex w={{ base: 'unset', lg: '25vw' }} mt={{ base: '3rem', lg: '5rem' }} direction="column" alignItems='start'>
            <Heading mb='1rem' size="sm">Informations sur le client :</Heading>
            <Input _focus={{ borderColor: "#745FF2", boxShadow: "none" }} className={getClassForField(invoiceData.client.name)}
              placeholder="Nom et Prénom / Société" name="client.name" value={invoiceData.client.name} onChange={handleChange} />
            <Input   _focus={{ borderColor: "#745FF2", boxShadow: "none" }} className={getClassForField(invoiceData.client.adresse)}
              placeholder="Adresse" name="client.adresse" value={invoiceData.client.adresse} onChange={handleChange} />
            <Input   _focus={{ borderColor: "#745FF2", boxShadow: "none" }} className={getClassForField(invoiceData.client.siret)} placeholder="N° Siret" name="client.siret" value={invoiceData.client.siret} onChange={handleChange} />
        
            <Input
              _focus={{ borderColor: "#745FF2", boxShadow: "none" }}
              className={getClassForField(invoiceData.client.email)}
              placeholder="Email du client"
              name="client.email"
              value={invoiceData.client.email}
              onChange={handleClientEmailChange} 
            />
           {clientEmailTouched && !clientEmailValid && (
            <Text color="#FB7575" fontSize="sm">
              L'adresse e-mail du client n'est pas valide.
            </Text>
          )}
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
                       _focus={{ borderColor: "#745FF2", boxShadow: "none" }}
                      className={getClassForField(item.description)}
                      placeholder="Description"
                      name={`items.${index}.description`}
                      value={item.description}
                      onChange={handleChange}
                    />
                  </Td>
                  <Td >
                    <InputGroup>
                      <Input
                        _focus={{ borderColor: "#745FF2", boxShadow: "none" }}
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
                      _focus={{ borderColor: "#745FF2", boxShadow: "none" }}
                      className={getClassForField(item.description)}
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
                     _focus={{ borderColor: "#745FF2", boxShadow: "none" }}
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
          <Heading mb='1rem' size="sm">Saisissez un IBAN pour recevoir le paiement</Heading>
          <Input
            _focus={{ borderColor: "#745FF2", boxShadow: "none" }}
            className={getClassForField(invoiceData.issuer.iban)}
            placeholder="Votre IBAN"
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
        </Flex>
        <Button onClick={navigateToPaymentSchedule} rightIcon={<ArrowForwardIcon />} color='white' borderRadius='30px' backgroundColor='black' mt="4" colorScheme="gray" >
          Définir les échéances de paiement
        </Button>
      </VStack>
    </>
  );
};

export default InvoiceCreator;
