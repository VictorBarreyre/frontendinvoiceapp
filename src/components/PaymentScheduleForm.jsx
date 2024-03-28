import React, {  useEffect } from 'react';
import { Box, Button, InputGroup, InputRightElement, Input, Text, IconButton, Heading, Link, Table, Thead, Tbody, Tfoot, Tr, Th, Td, } from '@chakra-ui/react';
import { AddIcon, DeleteIcon, ArrowForwardIcon} from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';
import { useInvoiceData } from '../context/InvoiceDataContext';
import CustomInput from './CustomIpunt';

const PaymentScheduleForm = ({ onSubmit }) => {
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
            const updatedPayment = { ...payment, [key]: value };
            if (key === 'percentage') {
              const newAmount = (invoiceData.total * parseFloat(value)) / 100;
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


  const addPaymentWithCalculatedPercentage = () => {
    const totalPercentageUsed = payments.reduce((acc, curr) => acc + Number(curr.percentage), 0);
    let newPercentage = 100 - totalPercentageUsed;

    if (payments.length > 0) {
      const lastPaymentPercentage = Number(payments[payments.length - 1].percentage);
      if (lastPaymentPercentage > 25) {
        newPercentage *= 0.75; // Ajustez cette partie selon votre logique spécifique
      }
    }

    newPercentage = Math.max(0, newPercentage); // Assurez-vous que le nouveau pourcentage n'est pas négatif
    newPercentage = Math.round(newPercentage); // Arrondit à l'entier le plus proche

    // Vérifier si le total des pourcentages dépasse déjà 100%
    if (totalPercentageUsed >= 100) {
      alert("Le total des pourcentages est déjà de 100%, vous ne pouvez plus ajouter d'échéances.");
      return; // Arrête l'exécution de la fonction si le total est déjà à 100%
    }

    const newPayment = {
      percentage: newPercentage, // Utilisez le pourcentage arrondi sans .toFixed(2) pour garder un entier
      amount: ((invoiceData.total * newPercentage) / 100).toFixed(2),
      dueDate: new Date()
    };

    setPayments([...payments, newPayment]);
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
    setPayments(newPayments);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(payments);
  };

  return (
    <Box className='neue-up' width='60vw' pt='2rem' pl='3rem'pr='3rem' pb='2rem' backgroundColor='white' borderWidth="1px" borderRadius="1vw" mb='4vh'>  
      <Heading mb='2rem' fontSize='24px'>Définissez vos échéances de paiement</Heading>
      <form onSubmit={handleSubmit}>
        <Table variant="simple" borderRadius='10px' pb='1rem'>
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
                <Td>
                  <Heading size='sm'>
                    {payment.amount} {invoiceData.devise}
                  </Heading>
                </Td>
                <Td>
                  <IconButton
                    background='none'
                    aria-label="Supprimer le paiement"
                    icon={<DeleteIcon />}
                    onClick={() => removePayment(index)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Td pl='0' colSpan={4}>
                {
                  isTotalPercentage100 ? (
                    <p color="red">Somme totale égale à 100%</p>
                  ) : (
                    <Link onClick={addPaymentWithCalculatedPercentage} display='flex' alignItems='center' color="blue.500">
                      Ajouter une échéance <AddIcon w='2.5' ml="2" />
                    </Link>
                  )
                }
              </Td>
            </Tr>
          </Tfoot>
        </Table>
        {remainingPercentage > 0 ? (
          <Button borderRadius='30px' color="red" isDisabled={remainingPercentage <= 0}>Pourcentage restant à attribuer : {remainingPercentage}%</Button>
        ) : (
          <Button onClick={handleSubmit} rightIcon={<ArrowForwardIcon />} color='white' borderRadius='30px' backgroundColor='black' mt="4" colorScheme="gray">
            Vérifier les informations de facturation
          </Button>
        )}
      </form>

    </Box>
  );
};

export default PaymentScheduleForm;
