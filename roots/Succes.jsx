
import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
    return (
        <div style={{ marginTop: '50px', textAlign: 'center' }}>
            <h1>Facture Créée et Envoyée avec Succès!</h1>
            <p>Votre facture a été envoyée avec succès à l'adresse email du destinataire.</p>
            <Link to="/">Retour à la page d'accueil</Link>
        </div>
    );
}

export default SuccessPage;
