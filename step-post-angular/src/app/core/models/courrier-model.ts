export interface Courrier {
  id: number;
  type: number;
  bordereau: number;
  civilite?: string;
  prenom?: string;
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  telephone?: string;
  email?: string;
}
