import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import {UserService} from '../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
operation: string = 'login';
email: string = null;
password: string = null;
name: string = null;
  constructor(private authenticateService: AuthenticationService, 
    private userService: UserService, private router: Router) { }

  ngOnInit() {
  }
  
  login() {
    this.authenticateService.loginWithEmail(this.email, this.password).then( 
      (data) => {
        alert('Loggeado correctamente');
        console.log(data);
        this.router.navigate(['home']);
      }).catch( (error) => {
        alert('Ocurrio un error');
        console.log(error);
      });
  }
  loginWithFB() {
    this.authenticateService.loginWithFacebook().then( 
      (data) => {
        alert('Loggeado correctamente');
        console.log(data);
      }).catch( (error) => {
        alert('Ocurrio un error');
        console.log(error);
      });
  }

  register() {
    this.authenticateService.registerWithEmail(this.email, this.password).then( 
      (data) => {
        const user = {
          uid: data.user.uid,
          email: this.email,
          name: this.name 
        };
        this.userService.createUser(user).then((data2) => {
          alert('Registrado correctamente');
          console.log(data);
          console.log(data2);
        }).catch( (error) => {
          alert('Ocurrio un error');
          console.log(error);
        });
      }).catch( (error) => {
        alert('Ocurrio un error');
        console.log(error);
      });
  }

}
