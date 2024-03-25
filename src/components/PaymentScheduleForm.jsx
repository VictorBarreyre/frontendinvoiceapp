import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Stack, IconButton, Link, Heading, Table, Thead, Tbody, Tfoot, Tr, Th, Td, } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';
import { useInvoiceData } from '../context/InvoiceDataContext';
import CustomInput from './CustomIpunt';

const PaymentScheduleForm = ({ onSubmit }) => {
  const [payments, setPayments] = useState([{ amount: '', dueDate: '' }]);

  const {
    startDate,
    setStartDate,
  } = useInvoiceData();

  const handleChange = (index, key, value) => {
    const updatedPayments = [...payments];
    updatedPayments[index][key] = value;
    setPayments(updatedPayments);
  };

  const addPayment = () => {
    setPayments([...payments, { amount: '', dueDate: '' }]);
  };

  const removePayment = (index) => {
    const updatedPayments = [...payments];
    updatedPayments.splice(index, 1);
    setPayments(updatedPayments);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(payments);
  };

  return (
    <Box w='65vw' p='3rem' backgroundColor='white' className='neue-up' borderWidth="1px" borderRadius="md">
      <Heading mb='1rem' size="md">Définissez vos échéances de paiement</Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {payments.map((payment, index) => (
          <Table variant="simple" borderRadius='10px' >
          <Thead>
            <Tr>
              <Th pl='0'>Montant</Th>
              <Th>Date d'échéance</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr key={index}>
              <Td pl='0'>
                <FormControl>
                  <Input
                    className='neue-down'
                    type="number"
                    value={payment.amount}
                    onChange={(e) => handleChange(index, 'amount', e.target.value)}
                    placeholder="Montant"
                  />
                </FormControl>
              </Td>
              <Td>
                <FormControl>
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
                </FormControl>
              </Td>
              <Td>
                <IconButton
                  aria-label="Supprimer l'article"
                  icon={<DeleteIcon />}
                  size="sm"
                  backgroundColor="transparent"
                  onClick={() => removePayment(index)}
                />
              </Td>
            </Tr>
          </Tbody>
        </Table>
          ))}
          <Link color="blue.500" onClick={addPayment}>Ajouter une échéance  <AddIcon w='2.5' ml="2" /></Link>
          <Button color='white' borderRadius='30px' backgroundColor='black' mt="4" colorScheme="gray" type="submit">Enregistrer les échéances</Button>
        </Stack>
      </form>
    </Box>
  );
};

export default PaymentScheduleForm;
