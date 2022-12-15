import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  contactEmail = 'blom@step.eco';
  contactPhone = '05 64 27 01 05';

  constructor() {}

  ngOnInit(): void {}
}
