import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  private apiKey = 'pk.438866f6b71c5d5a638c9ca0ffba04b8';
  private apiUrl = 'https://us1.locationiq.com/v1/search.php';

  constructor(private http: HttpClient) { }

   getSuggestions(query: string): Observable<any> {
    const url = `${this.apiUrl}?key=${this.apiKey}&q=${query}&format=json`;
    return this.http.get(url);
  }
}
