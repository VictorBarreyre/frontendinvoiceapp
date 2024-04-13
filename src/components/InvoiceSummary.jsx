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
import InvoicePDF from './InvoicePDF';
import { pdf, PDFViewer } from '@react-pdf/renderer';
import { useTheme } from '@chakra-ui/react';

const InvoiceSummary = () => {
    const { invoiceData, payments, isValidEmail } = useInvoiceData();

    const [subject, setSubject] = useState("Votre Facture");
    const [message, setMessage] = useState("Voici votre facture");

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
        },
    };


 //fonction à deplacer dans le component Invoice Summary
 const handleInvoiceAction = async () => {
    const { number, issuer, client, total } = invoiceData;
    const areAllRequiredFieldsValid = number !== '' && issuer.name !== '' && client.name !== '';

    const baseUrl = "http://localhost:8000";

    if (!areAllRequiredFieldsValid) {
        console.log('Champs requis manquants ou invalides');
        return;
    }

    try {
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

            const formData = new FormData();
            formData.append('file', pdfBlob, `Facture-${number}.pdf`);
            formData.append('email', client.email);
            formData.append('subject', 'Votre Facture');
            formData.append('message', messageEmail);
            formData.append('montant', total);
            formData.append('emetteur', JSON.stringify(issuer));
            formData.append('destinataire', JSON.stringify(client));
            formData.append('factureId', factureId); // Assurez-vous d'inclure le factureId généré

            // Deuxième requête pour créer la facture et envoyer l'email
            const createAndSendEmailResponse = await fetch(`${baseUrl}/email/sendEmail`, {
                method: "POST",
                body: formData,
            });

            if (createAndSendEmailResponse.ok) {
                console.log("Facture créée et email envoyé avec succès !");
                // Appel à la création de PaymentIntent
                const paymentIntentData = {
                    amount: total * 100,  // Convertissez le total en centimes pour Stripe
                    currency: "eur",      // ou la devise appropriée
                    emetteur: JSON.stringify(issuer),  // Convertir l'objet en chaîne JSON
                    destinataire: JSON.stringify(client)  // Convertir l'objet en chaîne JSON
                };

                const response = await fetch(`${baseUrl}/paiement/create-payment-intent`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(paymentIntentData)
                });

                if (response.ok) {
                    const paymentIntentResult = await response.json();
                    console.log("PaymentIntent créé avec succès !", paymentIntentResult);
                } else {
                    const errorText = await response.text();
                    console.error('Erreur lors de la création du PaymentIntent', errorText);
                }
            } else {
                console.log('Erreur lors de la création de la facture et de l’envoi de l’email', await createAndSendEmailResponse.text());
            }
        } else {
            console.log('Email invalide ou absent, téléchargement de la facture...');
            // Logique de téléchargement de la facture
        }
    } catch (error) {
        console.error('Erreur lors de la génération ou de l’envoi du PDF', error);
    }
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

                <Flex direction='column' width='100%'>
                    {isMobile ? (
                        <>
                            {invoiceData.items.map((item, index) => (
                                <Box key={index} borderBottom="1px solid #f2f2f2"  pb="1rem" mb="1rem">
                                    <Heading {...styleProps.subHeading} ml='2.5vh'  mb='2vh' size="md">Articles / Services</Heading>
                                    <Flex  >
                                        <Flex direction="column" >
                                            <Text
                                                fontFamily="heading"
                                                fontWeight="bold"
                                                textTransform="uppercase"
                                                letterSpacing="wider"
                                                textAlign="center"
                                                mb="1rem"
                                                p={3}
                                                lineHeight="4"
                                                fontSize="xs"
                                                backgroundColor='#f7f7f7'
                                                color="gray.600"
                                                borderBottom="1px"
                                                borderColor="gray.100"
                                                w='max-content'
                                            >
                                                Description
                                            </Text>
                                            <Text ml='1.5vh'>{item.description}</Text>
                                        </Flex>

                                        <Flex direction="column" >
                                            <Text
                                                fontFamily="heading"
                                                fontWeight="bold"
                                                textTransform="uppercase"
                                                letterSpacing="wider"
                                                textAlign="center"
                                                mb="1rem"
                                                p={3}
                                                lineHeight="4"
                                                fontSize="xs"
                                                backgroundColor='#f7f7f7'
                                                color="gray.600"
                                                borderBottom="1px"
                                                borderColor="gray.100"
                                                w='max-content'
                                            >
                                                Quantité
                                            </Text>
                                            <Text ml='1.5vh'>{item.quantity}</Text>
                                        </Flex>

                                        <Flex direction="column" >
                                            <Text
                                                fontFamily="heading"
                                                fontWeight="bold"
                                                textTransform="uppercase"
                                                letterSpacing="wider"
                                                textAlign="center"
                                                mb="1rem"
                                                p={3}
                                                lineHeight="4"
                                                fontSize="xs"
                                                backgroundColor='#f7f7f7'
                                                color="gray.600"
                                                borderBottom="1px"
                                                borderColor="gray.100"
                                                w='max-content'
                                            >
                                                Prix/U
                                            </Text>
                                            <Text ml='1.5vh'>{item.unitPrice}</Text>
                                        </Flex>

                                        <Flex direction="column" >
                                            <Text
                                                fontFamily="heading"
                                                fontWeight="bold"
                                                textTransform="uppercase"
                                                backgroundColor='#f7f7f7'
                                                letterSpacing="wider"
                                                textAlign="center"
                                                mb="1rem"
                                                p={3}
                                                lineHeight="4"
                                                fontSize="xs"
                                                color="gray.600"
                                                borderBottom="1px"
                                                borderColor="gray.100"
                                                w='max-content'
                                            >
                                                Total HT
                                            </Text>
                                            <Text ml='1.5vh'>{item.quantity * item.unitPrice}</Text>
                                        </Flex>
                                    </Flex>
                                </Box>
                            ))}
                            {/* Ajoutez ici le code pour gérer les paiements mobiles */}
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
    {payments.map((payment, index) => (
      <Box key={index} borderBottom="1px solid #f2f2f2" pb="1rem" mb="1rem">
        <Heading {...styleProps.subHeading} ml='2.5vh' mb='2vh' size="md">Échéances de paiement</Heading>
        <Flex >
          <Flex direction="column" justifyContent="space-between">
            <Text
              fontFamily="heading"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
              textAlign="center"
              mb="1rem"
              p={3}
              lineHeight="4"
              fontSize="xs"
              backgroundColor='#f7f7f7'
              color="gray.600"
              borderBottom="1px"
              borderColor="gray.100"
              w='max-content'
            >
              Pourcentage %
            </Text>
            <Text ml='1.5vh'>{payment.percentage}%</Text>
          </Flex>

          <Flex direction="column" justifyContent="space-between">
            <Text
               fontFamily="heading"
               fontWeight="bold"
               textTransform="uppercase"
               letterSpacing="wider"
               textAlign="center"
               mb="1rem"
               p={3}
               lineHeight="4"
               fontSize="xs"
               backgroundColor='#f7f7f7'
               color="gray.600"
               borderBottom="1px"
               borderColor="gray.100"
               w='max-content'
            >
              Date d'échéance
            </Text>
            <Text ml='1.5vh'>{payment.dueDate.toLocaleDateString()}</Text>
          </Flex>

          <Flex direction="column" justifyContent="space-between">
            <Text
                fontFamily="heading"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="wider"
                textAlign="center"
                mb="1rem"
                p={3}
                lineHeight="4"
                fontSize="xs"
                backgroundColor='#f7f7f7'
                color="gray.600"
                borderBottom="1px"
                borderColor="gray.100"
                w='max-content'
            >
              Montant
            </Text>
            <Text ml='1.5vh'>{payment.amount} {invoiceData.devise}</Text>
          </Flex>
        </Flex>
      </Box>
    ))}
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

    <Text color='#4A5568' w='97%' mt='3rem' ml='1rem'> Si toutes les informations sont correctes vous pouvez envoyer la facture, {invoiceData.client.name} recevra un email avec celle-ci en pièce jointe et sera redirigé sur une page de paiement afin de sécuriser vos fonds. </Text>
  </Flex>
)}
                <Button w={isMobile ? '100%' : 'unset'} onClick={() => handleInvoiceAction(invoiceData)} color='white' borderRadius='30px' backgroundColor='black' mt="4" colorScheme="gray">
                    Envoyer ma facture et recevoir le paiement
                </Button>
            </VStack>

        </Box>
    </>
    );
};

export default InvoiceSummary;
