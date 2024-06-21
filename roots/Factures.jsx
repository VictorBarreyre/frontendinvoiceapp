import React, { useEffect, useState } from 'react';
import { useAuth } from '../src/context/AuthContext';
import {
  Button, Link as Chakralink, Box, Heading, Text, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Image, useDisclosure,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, useMediaQuery
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Factures = () => {
  const { fetchUserInvoices, user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [message, setMessage] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedInvoiceImage, setSelectedInvoiceImage] = useState('');
  const [isMobile] = useMediaQuery("(max-width: 768px)"); // Détecter les appareils mobiles

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

            {isMobile ? (
              <>
                <Flex justifyContent="space-between" mt="1rem">
                  <Text fontFamily="heading"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    textAlign="center"
                    mb={2}
                    pb={3} // padding-bottom: var(--chakra-space-3);
                    lineHeight="4"
                    fontSize="xs"
                    color="gray.600">Facture n°</Text>
                  <Text fontFamily="heading"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    textAlign="center"
                    mb={2}
                    pb={3} // padding-bottom: var(--chakra-space-3);
                    lineHeight="4"
                    fontSize="xs"
                    color="gray.600">Montant</Text>
                </Flex>
                {invoices.map(invoice => (
                  <Box key={invoice._id} borderBottom="1px solid #efefef" pt='1rem' pb='1rem' mb='1rem'>
                    <Flex justifyContent="space-between">
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
                      <Th>Numéro de Facture</Th>
                      <Th>Montant</Th>
                      <Th textAlign='end'>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {invoices.map(invoice => (
                      <Tr key={invoice._id}>
                        <Td>Facture n°{invoice.number}</Td>
                        <Td>{invoice.montant}{invoice.devise}</Td>
                        <Td textAlign='end'>
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
