import { CustomToastersService } from './../../../core/services/custom-toasters.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private toast: CustomToastersService
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

  /**
   * réinitialise le formulaire du password
   */
  onCancel(): void {
    this.passwordForm.reset();
  }

  /**
   * test et soumet le password
   * en cas de succès envoie le password
   * au composant parent
   */
  onSubmit(): void {
    if (!this.passwordForm.valid) {
      this.toast.invalidPassword();
    } else if (
      this.testPassword(
        this.passwordForm.value.newPassword,
        this.passwordForm.value.confirmPassword
      )
    ) {
      this.submitted.emit(this.passwordForm.value.newPassword);
    } else {
      this.toast.passwordNotConfirmed();
    }
  }

  /**
   * test la validité du mot de passe et vérifie que les deux
   * mots de passe saisis sont identiques
   */
  testPassword(p1: string, p2: string): boolean {
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
