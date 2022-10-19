import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export let slideIn = trigger('slideIn', [
  state('closed', style({ top: '-100%' })),
  state('open', style({ top: '0%' })),
  transition('closed <=> open', [animate(500)]),
]);
