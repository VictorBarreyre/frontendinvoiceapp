import React, { useEffect, useState } from 'react';
import { useAuth } from '../src/context/AuthContext';
import {
  Button, Link as Chakralink, Box, Heading, Text, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Image, useDisclosure,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, useMediaQuery, Checkbox
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Factures = () => {
  const { fetchUserInvoices, user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [message, setMessage] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedInvoiceImage, setSelectedInvoiceImage] = useState('');
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const loadInvoices = async () => {
      if (user) {
        const { invoices, message } = await fetchUserInvoices();
        setInvoices(invoices);
        setMessage(message);
        console.log(invoices);
      }
    };

    loadInvoices();
  }, [fetchUserInvoices, user]);

  const handlePreviewClick = (urlImage) => {
    setSelectedInvoiceImage(urlImage);
    onOpen();
  };

  const handleSelectInvoice = (invoiceId) => {
    setSelectedInvoices((prevSelected) =>
      prevSelected.includes(invoiceId)
        ? prevSelected.filter(id => id !== invoiceId)
        : [...prevSelected, invoiceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === invoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(invoices.map(invoice => invoice._id));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/delete-invoices`, { invoiceIds: selectedInvoices }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      // Filtrer les factures supprimées de l'état local
      setInvoices(prevInvoices => prevInvoices.filter(invoice => !selectedInvoices.includes(invoice._id)));
      setSelectedInvoices([]);
      console.log('Selected invoices deleted:', selectedInvoices);
    } catch (error) {
      console.error('Error deleting invoices:', error);
    }
  };

  const handleMarkAsPaid = async () => {
    try {
      await axios.post('/api/mark-invoices-paid', { invoiceIds: selectedInvoices }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      // Mettre à jour l'état local pour refléter le changement de statut
      setInvoices(prevInvoices => prevInvoices.map(invoice => {
        if (selectedInvoices.includes(invoice._id)) {
          return { ...invoice, status: 'paid' };
        }
        return invoice;
      }));
      setSelectedInvoices([]);
      console.log('Selected invoices marked as paid:', selectedInvoices);
    } catch (error) {
      console.error('Error marking invoices as paid:', error);
    }
  };

  return (
    <div className='flex-stepper'>
      <div className="stepper-container">
        <div className="tabs-container">
          <Flex direction='column' h={{ base: 'content', lg: 'content' }}>
            <Heading pb='1rem' mb={{ base: '0rem', lg: '2rem' }} borderBottom={{ base: 'unset', lg: '2px solid #efefef' }} fontSize={{ base: '22px', lg: '26px' }}>Vos factures</Heading>
            {message && <Text>{message}</Text>}

            {selectedInvoices.length > 0 && (
              <Flex mb="1rem">
                <Button colorScheme="red" onClick={handleDeleteSelected} mr="1rem">Supprimer les factures sélectionnées</Button>
                <Button colorScheme="green" onClick={handleMarkAsPaid}>Marquer comme payées</Button>
              </Flex>
            )}

            {isMobile ? (
              <>
                <Flex justifyContent="space-between" mt="1rem">
                  <Checkbox isChecked={selectedInvoices.length === invoices.length} onChange={handleSelectAll} />
                  <Text fontFamily="heading"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    textAlign="center"
                    mb={2}
                    pb={3}
                    lineHeight="4"
                    fontSize="xs"
                    color="gray.600">Facture n°</Text>
                  <Text fontFamily="heading"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    textAlign="center"
                    mb={2}
                    pb={3}
                    lineHeight="4"
                    fontSize="xs"
                    color="gray.600">Montant</Text>
                </Flex>
                {invoices.slice().reverse().map(invoice => (
                  <Box key={invoice._id} borderBottom="1px solid #efefef" pt='1rem' pb='1rem' mb='1rem'>
                    <Flex justifyContent="space-between">
                      <Checkbox isChecked={selectedInvoices.includes(invoice._id)} onChange={() => handleSelectInvoice(invoice._id)} />
                      <Text>Facture n°{invoice.number}</Text>
                      <Text>{invoice.montant}{invoice.devise}</Text>
                    </Flex>
                    <Flex justifyContent="space-between">
                      <Chakralink color="#745FF2" onClick={() => handlePreviewClick(invoice.urlImage)}>
                        Voir la facture
                      </Chakralink>
                    </Flex>
                  </Box>
                ))}
              </>
            ) : (
              <TableContainer>
                <Table variant='simple'>
                  <Thead>
                    <Tr>
                      <Th pl='0rem'><Checkbox isChecked={selectedInvoices.length === invoices.length} onChange={handleSelectAll} /></Th>
                      <Th>Numéro de Facture</Th>
                      <Th>Montant</Th>
                      <Th pr='0rem' textAlign='end'>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {invoices.slice().reverse().map(invoice => (
                      <Tr key={invoice._id}>
                        <Td pl='0rem'><Checkbox isChecked={selectedInvoices.includes(invoice._id)} onChange={() => handleSelectInvoice(invoice._id)} /></Td>
                        <Td>Facture n°{invoice.number}</Td>
                        <Td>{invoice.montant}{invoice.devise}</Td>
                        <Td pr='0rem' textAlign='end'>
                          <Chakralink color="#745FF2" onClick={() => handlePreviewClick(invoice.urlImage)}>
                            Voir la facture
                          </Chakralink>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
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
