import { Component } from '@angular/core';
import { AuthlayoutComponent } from '../../shared/layouts/authlayout/authlayout.component';

@Component({
  selector: 'app-login',
  imports: [AuthlayoutComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginPage {}
