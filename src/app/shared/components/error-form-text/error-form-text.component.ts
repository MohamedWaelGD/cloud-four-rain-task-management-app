import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ErrorTextComponent } from "./components/error-text/error-text.component";

@Component({
  selector: 'app-error-form-text',
  imports: [ErrorTextComponent],
  templateUrl: './error-form-text.component.html',
  styleUrl: './error-form-text.component.scss'
})
export class ErrorFormTextComponent {

  public formControl = input.required<AbstractControl>({ 'alias': 'formControlInp' });
  public errorKey = input.required<string>();
  public errorMessage = input.required<string>();

}
