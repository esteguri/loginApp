import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel;
  recordarme = false;

  constructor( private auth: AuthService, private router:Router ) { 

  }

  ngOnInit() {
    this.usuario = new UsuarioModel();
    this.usuario.email = "estebangutierrez.ri@gmail.com";
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
     return this.auth.nuevoUsuario(this.usuario).subscribe( response => {
       Swal.close();
       this.router.navigateByUrl('/home')
     }, (err) => {
      Swal.fire({
        type:'error',
        title: 'Error al autenticar',
        text: err.error.error.message
      })
     })
  }

}
