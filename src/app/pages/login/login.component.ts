import { Component, OnInit } from '@angular/core';
import { NgForm, EmailValidator } from '@angular/forms';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel;
  recordarme = false;

  constructor(private auth:AuthService, private router:Router) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
    if(localStorage.getItem("email")){
      this.usuario.email = localStorage.getItem("email")
      this.recordarme = true;
    }
  }

  onSubmit(form:NgForm){
    if(form.invalid){return;}

    if(this.recordarme){
      localStorage.setItem("email", this.usuario.email)
    }

    Swal.fire({
      allowOutsideClick:false,
      type: 'info',
      text:"Espere por favor"
    })
    Swal.showLoading();

    this.auth.login(this.usuario).subscribe(response => {
      Swal.close();
      this.router.navigateByUrl('/home')
    }, (errr)=>{
      Swal.fire({
        type:'error',
        title: 'Error al autenticar',
        text: errr.error.error.message
      })
    })
  }
}
