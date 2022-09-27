import { Courrier } from './courrier-model';
import { Statut } from '../../courriers/models/statuts-model';

export interface DetailsCourrier {
  courrier: Courrier;
  statuts: Statut[];
}
