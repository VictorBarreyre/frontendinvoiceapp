import React, { useState } from 'react';
import { Flex, Box, Heading, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom'; // Pour la navigation
import InvoiceCreator from '../src/components/InvoiceCreator'; // Assurez-vous que le chemin d'importation est correct
import InvoicePDF from '../src/components/InvoicePDF';
import { PDFViewer } from '@react-pdf/renderer';


const CustomSection = () => {
    // État local pour gérer l'affichage de InvoiceCreator
    const [showInvoiceCreator, setShowInvoiceCreator] = useState(false);


    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
             // Ajustez le padding selon vos besoins
        // Couleur de fond légère
        >
            {/* Conditionnellement masquer cette Box si InvoiceCreator est affiché */}
            {!showInvoiceCreator && (
                <Box m="10rem 30vh" textAlign="center" mb="2rem">
                    <Heading color='black' mb="4">
                    Simple pour les Pros<br />Automatique pour Tous.
                    </Heading>
                    <Text w='90vh' fontSize="lg" color="#4A5568">
                    AutoBillEase révolutionne la facturation et les paiements, offrant automatisation et sécurité pour tous, des professionnels aguerris aux nouveaux utilisateurs.
                    </Text>

                    <Flex justifyContent='center' alignContent='center' alignItems='center' gap="20px" mt="4">
                        <Button backgroundColor='black' color='white' borderRadius='30px' size="lg" onClick={() => setShowInvoiceCreator(true)}>
                            Créer ma facture
                        </Button>

                        <Button backgroundColor='white' color='black' border='1px solid black' borderRadius='30px' as={Link} to="/about" size="lg">
                            Notre solution
                        </Button>
                    </Flex>
                </Box>
            )}
            {showInvoiceCreator && (
                   
                   <InvoiceCreator />
                    
            )}
        </Flex>
    );
};

export default CustomSection;
