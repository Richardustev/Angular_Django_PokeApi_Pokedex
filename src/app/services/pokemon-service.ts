import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) { }

  getPokemonsFromUrl(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  getPokemonByName(name: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/${name}`);
  }

  searchPokemonByName(name: string): Observable<any> {
    // La API devuelve un error 404 si el Pokémon no existe
    return this.http.get<any>(`${this.apiUrl}/${name.toLowerCase()}`);
  }

  // Nuevo método para obtener los detalles de un Pokémon
  getPokemonDetails(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  getPokemonEncounters(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/encounters`);
  }
  
  // Nuevo método para obtener detalles de un ataque
  getPokemonMoveDetails(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  getPokemonDetailsById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon/${id}`);
  }
}