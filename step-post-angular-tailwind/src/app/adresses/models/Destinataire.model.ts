export interface Destinataire {
  id?: number;
  civilite?: string;
  prenom?: string;
  nom: string;
  adresse: string;
  complement?: string;
  codePostal: string;
  ville: string;
  telephone?: string;
  email?: string;
}
