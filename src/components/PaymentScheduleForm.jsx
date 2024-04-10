import React, { useState, useEffect } from 'react';
import { Flex, Box, Button, InputGroup, InputRightElement, Input, Text, IconButton, Heading, Link, Table, Thead, Tbody, Tfoot, Tr, Th, Td, } from '@chakra-ui/react';
import { AddIcon, DeleteIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';
import { useInvoiceData } from '../context/InvoiceDataContext';
import CustomInput from './CustomIpunt';
import { useTheme } from '@chakra-ui/react';

const PaymentScheduleForm = ({ onSubmit, handleNavigateToInvoiceConfirn }) => {
  const { invoiceData,
    setStartDate,
    startDate,
    payments,
    setPayments,
    isTotalPercentage100,
    setIsTotalPercentage100,
    remainingPercentage,
    setRemainingPercentage
  } = useInvoiceData();

  const [showText, setShowText] = useState('');

  const theme = useTheme();
  // Accéder au point de rupture 'md' à partir du thème
  const breakpointMd = parseInt(theme.breakpoints.md, 10);

  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpointMd);

  useEffect(() => {
    // Assurez-vous que le total de invoiceData est défini avant de procéder
    if (invoiceData.total) {
      // Calculez les montants initiaux des paiements basés sur les pourcentages
      const initialPaymentsWithAmounts = payments.map(payment => ({
        ...payment,
        // Utilisez parseFloat pour s'assurer que les valeurs sont traitées correctement comme des nombres
        amount: ((parseFloat(invoiceData.total) * parseFloat(payment.percentage)) / 100).toFixed(2),
      }));

      // Mettez à jour l'état des paiements avec ces nouveaux montants
      setPayments(initialPaymentsWithAmounts);
    }
  }, []); // Un tableau de dépendances vide signifie que cet effet s'exécutera une seule fois au montage


  useEffect(() => {
    let shouldUpdate = false;
    const updatedPayments = payments.map((payment, index) => {
      if ('percentage' in payment && payment.percentage !== "") {
        const newAmount = (invoiceData.total * payment.percentage) / 100;
        if (payment.amount !== newAmount.toFixed(2)) {
          shouldUpdate = true; // Seulement si le nouveau montant diffère
          return { ...payment, amount: newAmount.toFixed(2) };
        }
      }
      return payment;
    });

    if (shouldUpdate) {
      setPayments(updatedPayments);
    }
  }, [payments, invoiceData.total]); // Assurez-vous que `invoiceData.total` est stable


  const updatePayment = (index, key, value) => {
    // Calculer le total actuel des pourcentages avant la mise à jour
    const totalPercentageBeforeUpdate = payments.reduce((acc, curr, i) => {
      return acc + (i === index ? 0 : parseFloat(curr.percentage));
    }, 0);

    // Calculer le nouveau total en prenant en compte la valeur mise à jour
    const newTotalPercentage = totalPercentageBeforeUpdate + parseFloat(value);

    // Vérifier si le nouveau total ne dépasse pas 100% avant de procéder à la mise à jour
    if (key === 'percentage' && newTotalPercentage <= 100) {
      setPayments(currentPayments => {
        return currentPayments.map((payment, i) => {
          if (i === index) {
            const updatedPayment = { ...payment, [key]: Math.round(value) }; // Arrondir à l'entier le plus proche
            if (key === 'percentage') {
              const newAmount = (invoiceData.total * parseFloat(Math.round(value))) / 100; // Utiliser la valeur arrondie pour le calcul du montant
              updatedPayment.amount = newAmount.toFixed(2);
            }
            return updatedPayment;
          }
          return payment;
        });
      });
    } else if (key !== 'percentage') {
      // Si la clé mise à jour n'est pas 'percentage', procéder à la mise à jour sans vérifier le total
      setPayments(currentPayments => {
        return currentPayments.map((payment, i) => i === index ? { ...payment, [key]: value } : payment);
      });
    } else {
      // Optionnel : gérer le cas où la mise à jour dépasse 100%
      console.log("La mise à jour du pourcentage dépasse 100%.");
    }
  };


  const addMonths = (date, months) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  };


  const addPaymentWithCalculatedPercentage = () => {
    const totalPercentageUsed = payments.reduce((acc, curr) => acc + Number(curr.percentage), 0);
    let newPercentage = 100 - totalPercentageUsed;

    // Si le total des pourcentages est déjà égal à 100%, ajustez la répartition des nouveaux pourcentages
    if (totalPercentageUsed === 100) {
      // Répartissez les nouveaux pourcentages de manière égale entre les paiements existants
      const newPercentagePerPayment = Math.round(100 / (payments.length + 1)); // Arrondir à l'entier le plus proche

      // Mettez à jour tous les paiements existants avec le nouveau pourcentage équitable
      const updatedPayments = payments.map(payment => ({
        ...payment,
        percentage: newPercentagePerPayment
      }));

      // Ajoutez un nouveau paiement avec le pourcentage restant
      const newPayment = {
        percentage: newPercentagePerPayment,
        amount: ((invoiceData.total * newPercentagePerPayment) / 100).toFixed(2),
        dueDate: addMonths(startDate, payments.length)
      };

      setPayments([...updatedPayments, newPayment]);
    } else {
      // Si le total des pourcentages est inférieur à 100%, procédez normalement
      if (payments.length > 0) {
        const lastPaymentPercentage = Number(payments[payments.length - 1].percentage);
        if (lastPaymentPercentage > 25) {
          newPercentage *= 0.75; // Ajustez cette partie selon votre logique spécifique
        }
      }

      newPercentage = Math.max(0, newPercentage); // Assurez-vous que le nouveau pourcentage n'est pas négatif
      newPercentage = Math.round(newPercentage); // Arrondit à l'entier le plus proche

      const newPayment = {
        percentage: newPercentage,
        amount: ((invoiceData.total * newPercentage) / 100).toFixed(2),
        dueDate: new Date()
      };

      setPayments([...payments, newPayment]);
    }
  };



  useEffect(() => {
    const totalPercentageUsed = payments.reduce((acc, curr) => acc + Number(curr.percentage), 0);
    const remaining = 100 - totalPercentageUsed;

    // Mise à jour pour indiquer si le total atteint ou dépasse 100%
    setIsTotalPercentage100(totalPercentageUsed >= 100);

    // Mise à jour du pourcentage restant
    setRemainingPercentage(remaining);
  }, [payments]);

  const removePayment = (index) => {
    let newPayments = [...payments];
    newPayments.splice(index, 1);

    const totalPercentage = newPayments.reduce((acc, curr) => acc + Number(curr.percentage), 0);

    // Si la somme des pourcentages est inférieure à 100%, ajustez le dernier paiement pour compenser
    if (totalPercentage < 100) {
      const lastIndex = newPayments.length - 1;
      newPayments[lastIndex].percentage += 100 - totalPercentage;
    }

    // Si la somme des pourcentages est supérieure à 100%, répartissez proportionnellement
    if (totalPercentage > 100) {
      const excess = totalPercentage - 100;
      newPayments = newPayments.map(payment => ({
        ...payment,
        percentage: Math.floor((payment.percentage / totalPercentage) * (100 - excess))
      }));
    }

    // Arrondir tous les pourcentages à des nombres entiers
    newPayments = newPayments.map(payment => ({
      ...payment,
      percentage: Math.round(payment.percentage)
    }));

    setPayments(newPayments);
  };


  const showTextDate = () => {
    if (showText) {
      return (
        <Text mt={2} fontSize="sm" color="gray.500">
          L'échéance ajoutée est configurée un paiement 1 mois après la précédente. Vous pouvez bien sûr modifier cette date en cliquant sur le calendrier.
        </Text>
      );
    }
  };

  useEffect(() => {
    // Vérifiez si le tableau des paiements contient plus d'un paiement
    if (payments.length > 1) {
      setShowText(true);
    } else {
      // Optionnel : Réinitialiser `showText` à `false` s'il y a zéro ou une seule échéance
      setShowText(false);
    }
  }, [payments]); // Ce useEffect s'exécutera chaque fois que le tableau `payments` change




  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(payments);
  };

  const paymentScheduleText = payments.length > 1 ? (
    <Text mt={1} color="#4A5568">
      L'échéance ajoutée est configurée un paiement 1 mois après la précédente.<br /> Vous pouvez bien sûr modifier cette date en cliquant sur le calendrier.
    </Text>
  ) : null;

  return (
    <>
      {paymentScheduleText}

      {isMobile ? (
        <>
          {payments.map((payment, index) => (
            <Box key={index} borderBottom="1px solid #f2f2f2" pt='1rem' pb='1rem' mb='1rem'>
              <Flex gap='10px'>
                <Flex direction='column' justifyContent='space-between'>
                  <Text
                    fontFamily="heading"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    textAlign="center"
                    mb='1rem'
                    pb={3}
                    lineHeight="4"
                    fontSize="xs"
                    color="gray.600"
                    borderBottom="1px"
                    borderColor="gray.100"
                  >
                    Date d'échéance
                  </Text>
                  <DatePicker
                    selected={payment.dueDate}
                    onChange={(date) => updatePayment(index, 'dueDate', date)}
                    customInput={<CustomInput />}
                  />
                </Flex>

                <Flex justifyContent='space-between' w='40vw' direction='column'>
                  <Text
                    fontFamily="heading"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    textAlign="center"
                    mb='1rem'
                    pb={3}
                    lineHeight="4"
                    fontSize="xs"
                    color="gray.600"
                    borderBottom="1px"
                    borderColor="gray.100"
                  >
                    %
                  </Text>
                  <InputGroup>
                    <Input
                      _focus={{ borderColor: "#745FF2", boxShadow: "none" }}
                      className='neue-down'
                      type="number"
                      value={payment.percentage}
                      onChange={(e) => updatePayment(index, 'percentage', e.target.value)}
                    />
                    <InputRightElement pointerEvents="none" children="%" />
                  </InputGroup>
                </Flex>


                <Flex alignItems='end'>
                  <Flex h='100%' justifyContent='space-between' direction='column'>
                    <Text
                      fontFamily="heading"
                      fontWeight="bold"
                      textTransform="uppercase"
                      letterSpacing="wider"
                      textAlign="center"
                      mb='1rem'
                      pb={3}
                      lineHeight="4"
                      fontSize="xs"
                      color="gray.600"
                      borderBottom="1px"
                      borderColor="gray.100"
                    >
                      Montant
                    </Text>
                    <Text textAlign="center" mb={2}>{payment.amount} {invoiceData.devise}</Text>
                  </Flex>

                </Flex>
              </Flex>
              {payments.length > 1 && (
                <Link onClick={() => removePayment(index)} display='flex' alignItems='center' color="#745FF2" mt={4}>
                  Supprimer cette échéance <DeleteIcon w='2.5' ml="2" />
                </Link>
              )}
            </Box>
          ))}
          <Link onClick={addPaymentWithCalculatedPercentage} display='flex' alignItems='center' color="#745FF2" mt={4}>
            Ajouter cette échéance <AddIcon w='2.5' ml="2" />
          </Link>
          {remainingPercentage > 0 ? (
            <Button w='100%' borderRadius='30px' mt="4" color="#FB7575" isDisabled={remainingPercentage <= 0}>Pourcentage restant à attribuer : {remainingPercentage}%</Button>
          ) : (
            <Button w='100%' onClick={handleNavigateToInvoiceConfirn} rightIcon={<ArrowForwardIcon />} color='white' borderRadius='30px' backgroundColor='black' mt="4">
              Vérifier les informations de facturation
            </Button>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <Table variant="simple" className='neue-up' mt='2rem' mb='1rem' borderWidth='1px' pt='1rem' pl='2rem' pr='2rem' pb='1rem' w='100%' borderRadius='10px'>
            <Thead>
              <Tr>
                <Th className='head-tab' pl='0'>Pourcentage %</Th>
                <Th className='head-tab'>Date d'échéance</Th>
                <Th w='content' className='head-tab'>Montant</Th>
              </Tr>
            </Thead>
            <Tbody>
              {payments.map((payment, index) => (
                <Tr key={index}>
                  <Td pl='0'>
                    <InputGroup>
                      <Input
                        _focus={{ borderColor: "#745FF2", boxShadow: "none" }}
                        className='neue-down'
                        type="number"
                        value={payment.percentage}
                        onChange={(e) => updatePayment(index, 'percentage', e.target.value)}
                      />
                      <InputRightElement pointerEvents="none" children="%" />
                    </InputGroup>
                  </Td>
                  <Td>
                    <DatePicker
                      selected={payment.dueDate}
                      onChange={(date) => updatePayment(index, 'dueDate', date)}
                      customInput={<CustomInput />}
                    />
                  </Td>
                  <Td pr='0'>
                    <Heading w='max-content' size='sm'>
                      {payment.amount} {invoiceData.devise}
                    </Heading>
                  </Td>
                  {payments.length > 1 && (
                    <Td>
                      <IconButton
                        background='none'
                        aria-label="Supprimer le paiement"
                        icon={<DeleteIcon />}
                        onClick={() => removePayment(index)}
                      />
                    </Td>
                  )}

                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Td pl='0' colSpan={4}>
                  <Link onClick={addPaymentWithCalculatedPercentage} display='flex' alignItems='center' color="#745FF2">
                    Ajouter une échéance <AddIcon w='2.5' ml="2" />
                  </Link>
                </Td>
              </Tr>
            </Tfoot>
          </Table>
          {remainingPercentage > 0 ? (
            <Button pt='12px' pb='12px' pl='24px' pr='24px' borderRadius='30px' mt="4" color="#FB7575" isDisabled={remainingPercentage <= 0}>Pourcentage restant à attribuer : {remainingPercentage}%</Button>
          ) : (
            <Button pt='12px' pb='12px' pl='24px' pr='24px' onClick={handleNavigateToInvoiceConfirn} rightIcon={<ArrowForwardIcon />} color='white' borderRadius='30px' backgroundColor='black' mt="4">
              Vérifier les informations de facturation
            </Button>
          )}
        </form>
      )}
    </>
  );
};


export default PaymentScheduleForm;
