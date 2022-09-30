import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
})
export class NewPasswordComponent implements OnInit {
  @Output() submitted: EventEmitter<string> = new EventEmitter<string>(); //  envoie le nouveau mot de passe confirmé au composant parent
  passwordForm!: FormGroup; //  formulaire
  newError!: boolean; // utilisé par la directive testLoginForm pour modifier le dom si le format du password est valide ou non
  confirmError!: boolean; // utilisé par la directive testLoginForm pour modifier le dom si le format du password est valide ou non
  loader: boolean = false; // true : affiche le loader
  passwordMatch!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      newPassword: [
        null,
        [
          Validators.required,
          Validators.pattern(environment.regex.passwordRegex),
        ],
      ],
      confirmPassword: [
        null,
        [
          Validators.required,
          Validators.pattern(environment.regex.passwordRegex),
        ],
      ],
    });
    this.passwordForm
      .get('newPassword')
      ?.valueChanges.pipe(
        tap((value) => {
          this.passwordMatch = this.testPassword(
            value,
            this.passwordForm.value.confirmPassword
          );
        })
      )
      .subscribe();
    this.passwordForm
      .get('confirmPassword')
      ?.valueChanges.pipe(
        tap((value) => {
          this.passwordMatch = this.testPassword(
            value,
            this.passwordForm.value.newPassword
          );
        })
      )
      .subscribe();
  }

  onCancel(): void {
    this.passwordForm.reset();
  }

  onSubmit(): void {
    if (!this.passwordForm.valid) {
      this.toaster.error(
        'Le mot de passe doit avoir une longueur minimum de 8 caractères, il doit comporter une majuscule, une minuscule, un chiffre et un caractère spécial',
        '',
        { timeOut: 10000, positionClass: 'toast-bottom-center' }
      );
    } else if (
      this.testPassword(
        this.passwordForm.value.newPassword,
        this.passwordForm.value.confirmPassword
      )
    ) {
      this.submitted.emit(this.passwordForm.value.newPassword);
    } else {
      this.toaster.warning(
        'les deux mots de passe doivent être identiques',
        'Mot de passe',
        { positionClass: 'toast-bottom-center' }
      );
    }
  }

  testPassword(p1: string, p2: string): boolean {
    console.log('p1', p1);
    console.log('p2', p2);

    if (
      environment.regex.passwordRegex.test(p1) &&
      environment.regex.passwordRegex.test(p2) &&
      p1 === p2
    ) {
      return true;
    } else {
      return false;
    }
  }
}
