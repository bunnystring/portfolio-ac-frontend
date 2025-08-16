import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectCardServices {

  constructor(private http: HttpClient) { }

   /**
   * Obtiene la lista de proyectos desde el backend.
   * @returns Observable con el array de proyectos.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/project`);
  }

}
