import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';

import {map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private api_key = 'AIzaSyAAXAruLoC8MQkqQ3Eeo7h0r_Z8-7YElQQ';
  userToken: string;

  constructor(private http: HttpClient) { 
    this.leerToken();
   }

  logout(){
    localStorage.removeItem("token")
  }

  login(usuario:UsuarioModel){
    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    }
    
    return this.http.post(
      `${this.url}signInWithPassword?key=${this.api_key}`,
      authData
    ).pipe(
      map( resp => {
        this.guardarToken(resp['idToken']);
        return resp;
      })
    ); 
  }

  nuevoUsuario(usuario:UsuarioModel){
    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    }

     return this.http.post(
       `${this.url}signUp?key=${this.api_key}`,
       authData
     ).pipe(
       map( resp => {
         this.guardarToken(resp['idToken']);
         return resp;
       })
     );
  }

  private guardarToken(idToken:string){
    this.userToken = idToken;
    localStorage.setItem("token", idToken);

    let hoy = new Date();
    hoy.setSeconds(3600)
    localStorage.setItem("expira",hoy.getTime().toString())
  }

  leerToken(){
    if(localStorage.getItem("token")){
      this.userToken = localStorage.getItem("token")
    }else{
      this.userToken = ""
    }
  }

  estaAutenticado(){

    if(this.userToken.length < 3){
      return false;
    }
    
    const expira = Number(localStorage.getItem("expira"));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if(expiraDate > new Date() ){
      return true;
    }else{
      return false;
    }
  }

  
}
