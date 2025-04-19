import { Component, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-modal',
  imports: [
    DialogModule,
    FormsModule
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  public header = input('');
  public maxHeight = input('500px');

  protected displayModal = signal(false);

  showModal() {
    this.displayModal.set(true);
  }

  hideModal() {
    this.displayModal.set(false);
  }

}
