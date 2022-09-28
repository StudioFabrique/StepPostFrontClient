import { Destinataire } from './Destinataire.model';

export interface Bordereau {
  dest: Destinataire;
  type: number;
  instructions?: string;
  telephone?: string;
}
