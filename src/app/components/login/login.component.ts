import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    // Validación simulada
    if (this.email === 'admin' && this.password === '123') {
      this.loginError = false;
      this.router.navigate(['/menu']);
    } else {
      this.loginError = true;
    }
  }

}
