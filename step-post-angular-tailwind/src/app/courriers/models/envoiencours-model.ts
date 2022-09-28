import { Courrier } from '../../core/models/courrier-model';

export interface EnvoiEnCours {
  courrier: Courrier;
  date: Date;
  etat: number;
  active: boolean;
}
