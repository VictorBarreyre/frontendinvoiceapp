import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Stack, Text } from '@chakra-ui/react';

const PaymentScheduleForm = ({ onSubmit }) => {
  const [payments, setPayments] = useState([{ amount: '', dueDate: '' }]);

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
    <Box p={4} borderWidth="1px" borderRadius="md">
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {payments.map((payment, index) => (
            <Stack direction="row" key={index} alignItems="center" spacing={4}>
              <FormControl>
                <FormLabel>Montant</FormLabel>
                <Input
                  type="number"
                  value={payment.amount}
                  onChange={(e) => handleChange(index, 'amount', e.target.value)}
                  placeholder="Montant"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Date d'échéance</FormLabel>
                <Input
                  type="date"
                  value={payment.dueDate}
                  onChange={(e) => handleChange(index, 'dueDate', e.target.value)}
                />
              </FormControl>
              <Button onClick={() => removePayment(index)}>Supprimer</Button>
            </Stack>
          ))}
          <Button onClick={addPayment}>Ajouter une échéance</Button>
          <Button type="submit">Enregistrer les échéances</Button>
        </Stack>
      </form>
    </Box>
  );
};

export default PaymentScheduleForm;
