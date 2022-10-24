export interface RetourCourrier {
  id: number;
  type: number;
  bordereau: number;
  civilite?: string;
  prenom?: string;
  nom: string;
  etat: number;
  date: Date;
  active: boolean;
}
