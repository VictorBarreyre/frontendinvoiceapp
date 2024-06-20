import React, { useEffect, useState } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { Button, Link as Chakralink, Box, Heading, Text, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Image, useDisclosure } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Factures = () => {
  const { fetchUserInvoices, user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [message, setMessage] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedInvoiceImage, setSelectedInvoiceImage] = useState('');

  useEffect(() => {
    const loadInvoices = async () => {
      if (user) {
        const { invoices, message } = await fetchUserInvoices();
        setInvoices(invoices);
        setMessage(message);
        console.log(invoices)
      }
    };

    loadInvoices();
  }, [fetchUserInvoices, user]);

  const handlePreviewClick = (urlImage) => {
    setSelectedInvoiceImage(urlImage);
    onOpen();
  };

  return (
    <div className='flex-stepper'>
      <div className="stepper-container">
        <div className="tabs-container">
          <Flex direction='column' h={{ base: '100vh', lg: 'content' }}>
            <Heading pb='1rem' mb={{ base: '0rem', lg: '2rem' }} borderBottom={{ base: 'unset', lg: '2px solid #efefef' }} fontSize={{ base: '22px', lg: '26px' }}>Vos Factures</Heading>
            {message && <Text>{message}</Text>}
            {invoices.map(invoice => (
              <Flex pb='1rem' pt='1rem' borderBottom='1px solid #efefef' justifyContent='space-between' w='100%' key={invoice._id}>
                <Flex width='100%'>
                  <Text>
                    Facture n°{invoice.number} - Montant: {invoice.montant}
                  </Text>
                </Flex>
                <Chakralink w='100%' textAlign='end' color="#745FF2" onClick={() => handlePreviewClick(invoice.urlImage)} ml="4">
                  Voir la facture
                </Chakralink>
              </Flex>
            ))}
          </Flex>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Prévisualisation de la facture</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedInvoiceImage && <Image src={selectedInvoiceImage} alt="Invoice preview" />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Factures;
