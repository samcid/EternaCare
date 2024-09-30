export default interface User {
    id?: string;
    nom?: string;
    prenom?: string;
    adresse?: string;
    codePostal: number;
    ville: string;
    email: string;
    password: string;
    telephone?: string;
}