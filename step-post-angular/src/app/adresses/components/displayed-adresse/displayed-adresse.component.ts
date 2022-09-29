import { Component, Input, OnInit } from '@angular/core';
import { Destinataire } from '../../models/Destinataire.model';

@Component({
  selector: 'app-displayed-adresse',
  templateUrl: './displayed-adresse.component.html',
})
export class DisplayedAdresseComponent implements OnInit {
  @Input() adresse!: Destinataire; //  adresse à afficher
  @Input() infos?: any; //  informations optionnelles telles que des instructions de livraison etc
  @Input() isExp!: boolean; //  teste si l'adresse à afficher est celle de l'expediteur ou du destinataire

  ngOnInit(): void {}
}
