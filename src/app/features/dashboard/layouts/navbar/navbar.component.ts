import { Component, effect, inject, signal } from '@angular/core';
import { AuthenticationService } from '../../../../core/services/authentication/authentication.service';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    MenuModule,
    UpperCasePipe
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  private _auth = inject(AuthenticationService);
  private _router = inject(Router);

  protected user = this._auth.currentUser;
  protected firstUserLetter = signal<string>('U');

  protected randomColor = getRandomColor();

  protected items: MenuItem[] = [
    {
      label: 'Logout',
      command: () => {
        this._auth.logout().then(() => {
          this._router.navigate(['/auth/login']);
        })
      }
    }
  ]

  constructor() {
    effect(() => {
      if (this.user()) {
        this.setFirstLetter();
      }
    })
  }


  private setFirstLetter() {
    this.firstUserLetter.set(this.user()?.displayName ? this.user()?.displayName![0]! : 'U');
  }
}

function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}