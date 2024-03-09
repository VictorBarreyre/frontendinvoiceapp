// InvoiceProvider.js
import React, { createContext, useContext, useState } from 'react';
import nodemailer from 'nodemailer'; // Importer nodemailer pour l'envoi d'email

const InvoiceContext = createContext();

export const useInvoiceContext = () => useContext(InvoiceContext);

export const InvoiceProvider = ({ children }) => {
  const [isSending, setIsSending] = useState(false);

  const sendInvoiceByEmail = async (email, invoiceData) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'votre-email@gmail.com',
        pass: 'votre-mot-de-passe',
      },
    });

    const mailOptions = {
      from: 'votre-email@gmail.com',
      to: email,
      subject: 'Votre facture',
      text: 'Veuillez trouver votre facture en pièce jointe.',
      attachments: [
        {
          filename: `Facture-${invoiceData.number}.pdf`,
          content: '<Contenu de votre fichier PDF>',
        },
      ],
    };

    try {
      setIsSending(true); // Mettre à jour l'état pour indiquer que l'envoi est en cours
      const info = await transporter.sendMail(mailOptions);
      console.log('Email envoyé : ', info.response);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email : ', error);
    } finally {
      setIsSending(false); // Mettre à jour l'état pour indiquer que l'envoi est terminé
    }
  };

  return (
    <InvoiceContext.Provider value={{ sendInvoiceByEmail, isSending }}>
      {children}
    </InvoiceContext.Provider>
  );
};
