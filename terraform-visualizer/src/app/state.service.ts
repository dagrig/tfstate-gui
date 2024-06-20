import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private apiUrl = '/api/state';

  constructor(private http: HttpClient) { }

  getState(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}