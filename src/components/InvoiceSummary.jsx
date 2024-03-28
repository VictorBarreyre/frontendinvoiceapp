import React from 'react';
import {
    Box,
    Flex,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    VStack,
    Button,
} from '@chakra-ui/react';
import { useInvoiceData } from '../context/InvoiceDataContext';

const InvoiceSummary = () => {
    const { invoiceData, payments } = useInvoiceData();

    // Styles directement inspirés du composant InvoicePDF adaptés pour Chakra UI
    const styleProps = {
        container: {
            borderWidth: "1px",
            pt:'2rem', pl:'3rem',pr:'3rem', pb:'2rem',
            borderRadius: "10px",
            backgroundColor: "white",
            borderColor: "#d9d9d9",
            width: '60vw',
            className: 'neue-up',
            marginBottom: '3vh',
        },
        heading: {
            marginRight: '1vh',
            marginTop: '2vh',
            fontSize: "24px",
            fontWeight: "bold",
            color: "black",
        },
        subHeading: {
            marginRight: '1vh',
            marginTop: '2vh',
            fontSize: "16px",
            fontWeight: "600",

        },
        subHeadingem: {
            marginTop: '2vh',
            fontSize: "16px",
            fontWeight: "600",

        },

        textFact: {
            fontSize: "18px",

        },

        text: {
            fontSize: "16px",
            color: "grey",
        },
        table: {
            variant: "simple",
            colorScheme: "gray",
            size: "sm",
        },
        thead: {
            bg: "gray.100",
        },
        th: {
            fontFamily: 'SF Pro Display',
            textAlign: 'left',
            backgroundColor: '#f7f7f7',
            fontSize: "14px",
            textTransform: "uppercase",
        },
        thend: {
            fontFamily: 'SF Pro Display',
            textAlign: 'end',
            backgroundColor: '#f7f7f7',
            fontSize: "14px",
            textTransform: "uppercase",
        },
        td: {
            fontSize: "14px",
        },
        tdend: {
            fontSize: "14px",
            textAlign: 'end'
        },
        issuerAndClient: {
            bg: "#f7f7f7",
            p: "20px",
            borderRadius: "5px",
            marginY: "20px",
            width: '100%'
        },
        totalSection: {
            marginTop: "20px",
        },
    };

    return (
        <Box {...styleProps.container}>
            <VStack spacing={6} align="start">
                <Flex justifyContent='space-between' width='100%' alignItems='baseline'>
                    <Heading {...styleProps.heading}>Résumé de la Facture</Heading>
                    <Flex alignItems='end' alignContent='end' direction='column'>
                        <Text {...styleProps.textFact}><strong>n°</strong> {invoiceData.number}</Text>
                        <Text {...styleProps.text}><strong>Date d'émission:</strong> {invoiceData.date}</Text>
                    </Flex>
                </Flex>

                <Flex {...styleProps.issuerAndClient} justifyContent="space-between">
                    <Flex flexDirection='column' align="start">
                        <Text {...styleProps.subHeading}>Émise par</Text>
                        <Text {...styleProps.text}>{invoiceData.issuer.name}</Text>
                        <Text {...styleProps.text}> {invoiceData.issuer.adresse}</Text>
                        <Text {...styleProps.text}> {invoiceData.issuer.siret}</Text>
                        <Text {...styleProps.text}> {invoiceData.issuer.email}</Text>
                    </Flex>
                    <Flex flexDirection='column' align="end">
                        <Text {...styleProps.subHeadingem}>À destination de</Text>
                        <Text {...styleProps.text}>{invoiceData.client.name}</Text>
                        <Text {...styleProps.text}> {invoiceData.client.adresse}</Text>
                        <Text {...styleProps.text}> {invoiceData.client.siret}</Text>
                        <Text {...styleProps.text}> {invoiceData.client.email}</Text>
                    </Flex>
                </Flex>

                <Flex direction='column' width='100%'>
                    <Heading {...styleProps.subHeading} ml='2.5vh' mb='2vh' size="md">Articles / Services</Heading>
                    <Table {...styleProps.table}>
                        <Thead {...styleProps.thead}>
                            <Tr>
                                <Th {...styleProps.th}>Description</Th>
                                <Th {...styleProps.th}>Quantité</Th>
                                <Th {...styleProps.th}>Prix Unit.</Th>
                                <Th {...styleProps.thend}>Total HT</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {invoiceData.items.map((item, index) => (
                                <Tr key={index}>
                                    <Td {...styleProps.td}>{item.description}</Td>
                                    <Td {...styleProps.td}>{item.quantity}</Td>
                                    <Td {...styleProps.td}>{item.unitPrice}</Td>
                                    <Td {...styleProps.tdend}>{item.quantity * item.unitPrice}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Flex>



                <Flex direction='column' width='100%'>
                    <Heading {...styleProps.subHeading} ml='2.5vh' mb='2vh' size="md">Échéances de paiement</Heading>
                    <Table {...styleProps.table}>
                        <Thead {...styleProps.thead}>
                            <Tr>
                                <Th {...styleProps.th}>Pourcentage %</Th>
                                <Th {...styleProps.th}>Date d'échéance</Th>
                                <Th {...styleProps.thend}>Montant</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {payments.map((payment, index) => (
                                <Tr key={index}>
                                    <Td {...styleProps.td}>{payment.percentage}%</Td>
                                    <Td {...styleProps.td}>{payment.dueDate.toLocaleDateString()}</Td>
                                    <Td {...styleProps.tdend}>{payment.amount} {invoiceData.devise}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Flex>

                <Flex width='100%' alignItems='end' direction='column'  {...styleProps.totalSection}>
                    <Text {...styleProps.subHeading}>Sous-total HT: {invoiceData.subtotal} {invoiceData.devise}</Text>
                    <Text {...styleProps.subHeading}>TVA: {invoiceData.vatRate}% ({invoiceData.vatAmount} {invoiceData.devise})</Text>
                    <Text {...styleProps.heading}>Total TTC: {invoiceData.total} {invoiceData.devise}</Text>
                </Flex>
                <Button color='white' borderRadius='30px' backgroundColor='black' mt="4" colorScheme="gray">
                    Envoyer ma facture et recevoir le paiement
                </Button>
            </VStack>

        </Box>
    );
};

export default InvoiceSummary;
