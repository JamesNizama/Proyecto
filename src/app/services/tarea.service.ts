import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VistaActividad } from '../models/VistaActividad';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  private url: string = 'http://localhost:5130/api/VistaActividadesUsuario';

  constructor(private http:HttpClient) { }

  getAll():Observable<VistaActividad[]>{
    return this.http.get<VistaActividad[]>(this.url);
  }

}
