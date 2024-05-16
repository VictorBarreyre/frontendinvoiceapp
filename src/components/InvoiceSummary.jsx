import React, { useState, useEffect } from 'react';
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
import { useTheme } from '@chakra-ui/react';


const InvoiceSummary = () => {
    const { invoiceData, payments } = useInvoiceData();
    const theme = useTheme();
    // Accéder au point de rupture 'md' à partir du thème
    const breakpointMd = parseInt(theme.breakpoints.md, 10);

    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpointMd);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < breakpointMd);
        };

        // Ajoute l'écouteur d'événement
        window.addEventListener('resize', handleResize);

        console.log(invoiceData)

        // Nettoie l'écouteur d'événement lors du démontage du composant
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpointMd]); // S'exécute à nouveau seulement si breakpointMd change

    // Styles directement inspirés du composant InvoicePDF adaptés pour Chakra UI
    const styleProps = {
        container: {
            borderRadius: "10px",
            backgroundColor: "white",
            borderColor: "#d9d9d9",
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
            color: "#4A5568",
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
            flexDirection: isMobile ? 'column' : 'row',
            paddingTop: '0px',
            backgroundColor: '#fdfdfd',
            borderWidth: '1px',
            pl: "20px",
            pr: "20px",
            pb: "20px",
            borderRadius: "5px",
            marginY: "20px",
            width: '100%'
        },
        totalSection: {
            marginTop: "20px",
            marginBottom: "20px"
            ,
        },
    };



    return (<>
        <Heading size='md'>Votre facture</Heading>
        <Box {...styleProps.container}>
            <VStack spacing={6} align="start">
                <Flex justifyContent={isMobile ? "start" : "end"} width='100%' alignItems={isMobile ? "start" : "end"}>

                    <Flex pl={isMobile ? '20px' : '0px'} pt={isMobile ? '20px' : '0px'} alignItems={isMobile ? "start" : "end"} alignContent='end' direction='column'>
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
                    <Flex flexDirection='column' alignItems={isMobile ? "start" : "end"}>
                        <Text {...styleProps.subHeadingem}>À destination de</Text>
                        <Text {...styleProps.text}>{invoiceData.client.name}</Text>
                        <Text {...styleProps.text}> {invoiceData.client.adresse}</Text>
                        <Text {...styleProps.text}> {invoiceData.client.siret}</Text>
                        <Text {...styleProps.text}> {invoiceData.client.email}</Text>
                    </Flex>
                </Flex>

                <Flex direction='column' width='100%' mb="2rem">
                    <Heading {...styleProps.subHeading} ml='2.5vh' mb='2vh' size="md">Articles / Services</Heading>
                    {isMobile ? (
                        <>
                            {/* En-têtes des colonnes à redéfinir car trop longues */}
                            <Flex justify="space-between">
                                {["Description", "Quantité", "Prix/U", "Total HT"].map(header => (
                                    <Text
                                        key={header}
                                        fontFamily="heading"
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        textAlign="center"
                                        p={3}
                                        lineHeight="4"
                                        fontSize="xs"
                                        backgroundColor='#f7f7f7'
                                        color="gray.600"
                                        borderBottom="1px"
                                        borderColor="gray.100"
                                        w='25%' // Assume 4 columns so each gets 25%
                                    >
                                        {header}
                                    </Text>
                                ))}
                            </Flex>

                            {/* Détails des items */}
                            {invoiceData.items.map((item, index) => (
                                <Flex key={index} justify="space-between" pb='1rem' pt='1rem' borderBottomWidth='1px'>
                                    <Text w='25%' textAlign="center" >{item.description}</Text>
                                    <Text w='25%' textAlign="center" >{item.quantity}</Text>
                                    <Text w='25%' textAlign="center" >{item.unitPrice}</Text>
                                    <Text w='25%' textAlign="center" >{item.quantity * item.unitPrice}</Text>
                                </Flex>
                            ))}
                        </>
                    ) : (
                        <>
                            <Heading {...styleProps.subHeading} ml='2.5vh' mb='2vh' size="md">Articles / Services</Heading>
                            <Table {...styleProps.table}>
                                <Thead {...styleProps.thead}>
                                    <Tr>
                                        <Th {...styleProps.th}>Description</Th>
                                        <Th {...styleProps.th}>Quantité</Th>
                                        <Th {...styleProps.th}>Prix/U</Th>
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
                        </>
                    )}
                </Flex>


                {isMobile ? (
                    <>
                        {payments.length > 0 && (
                            <Box pb="1rem" mb="2rem" w='100%'>
                                <Heading {...styleProps.subHeading} ml='2.5vh' mb='2vh' size="md">Échéances de paiement</Heading>
                                {/* En-têtes des colonnes */}
                                <Flex justify="space-between" w='100%'>
                                    <Text
                                        fontFamily="heading"
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        textAlign="center"
                                        p={3}
                                        lineHeight="4"
                                        fontSize="xs"
                                        backgroundColor='#f7f7f7'
                                        color="gray.600"
                                        borderBottom="1px"
                                        borderColor="gray.100"
                                        minW='33.333%'  // Three columns, so each gets about one-third
                                    >
                                        %
                                    </Text>
                                    <Text
                                        fontFamily="heading"
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        textAlign="center"
                                        p={3}
                                        lineHeight="4"
                                        fontSize="xs"
                                        backgroundColor='#f7f7f7'
                                        color="gray.600"
                                        borderBottom="1px"
                                        borderColor="gray.100"
                                        minW='33.333%'
                                    >
                                        Date
                                    </Text>
                                    <Text
                                        fontFamily="heading"
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        textAlign="center"
                                        p={3}
                                        lineHeight="4"
                                        fontSize="xs"
                                        backgroundColor='#f7f7f7'
                                        color="gray.600"
                                        borderBottom="1px"
                                        borderColor="gray.100"
                                        minW='33.333%'
                                    >
                                        Montant
                                    </Text>
                                </Flex>

                                {/* Détails des échéances pour chaque paiement */}
                                {payments.map((payment, index) => (
                                    <Flex key={index} pb='1rem' pt='1rem' borderBottomWidth='1px' justify="space-between">
                                        <Text w='33.333%' textAlign="center">{payment.percentage}%</Text>
                                        <Text w='33.333%' textAlign="center">{payment.dueDate.toLocaleDateString()}</Text>
                                        <Text w='33.333%' textAlign="center">{payment.amount} {invoiceData.devise}</Text>
                                    </Flex>
                                ))}
                            </Box>
                        )}
                    </>
                ) : (
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
                )}
                <Text p='0' color='#4A5568' w='97%' mt={isMobile ? "0rem" : "1rem"}> Si toutes les informations sont correctes vous pouvez envoyer la facture, {invoiceData.client.name} recevra un email avec celle-ci en pièce jointe.</Text>
                <Flex width='100%' alignItems='end' direction='column'  {...styleProps.totalSection}>
                    <Text {...styleProps.subHeading}>Sous-total HT : {invoiceData.subtotal} {invoiceData.devise}</Text>
                    <Text {...styleProps.subHeading}>
                        TVA : {invoiceData.vatRate} % ({invoiceData.vatAmount.toFixed(2)} {invoiceData.devise})
                    </Text>                    
                    <Text {...styleProps.heading}>Total TTC : {invoiceData.total} {invoiceData.devise}</Text>
                </Flex>

            </VStack>

        </Box>
    </>
    );
};

export default InvoiceSummary;
