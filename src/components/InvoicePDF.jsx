import React from 'react';
import { Text, View, Document, StyleSheet, Page } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'blue',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: 'black',
  },
});

const InvoicePDF = ({ invoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.title}>Facture N°: {invoiceData.number}</Text>
        <Text style={styles.text}>Date: {invoiceData.date}</Text>
        <Text>Émetteur: {invoiceData.issuer.name} - {invoiceData.issuer.company}, Siret: {invoiceData.issuer.siret}, Email: {invoiceData.issuer.email} Iban:{invoiceData.issuer.iban} </Text>
        <Text>Client: {invoiceData.client.name}  - {invoiceData.client.company},Siret: {invoiceData.client.siret},  Email: {invoiceData.client.email}</Text>
        {invoiceData.items.map((item, index) => (
          <View key={index}>
            <Text>Description: {item.description}</Text>
            <Text>Quantité: {item.quantity}</Text>
            <Text>Prix unitaire: {item.unitPrice}</Text>
            <Text>Total HT: {item.quantity * item.unitPrice}</Text>
          </View>
        ))}
        <Text>TVA: {invoiceData.vatAmount}</Text> 
        <Text>Total TTC: {invoiceData.total}</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
