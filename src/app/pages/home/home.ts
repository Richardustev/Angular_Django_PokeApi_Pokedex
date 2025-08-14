import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from '../../components/modal/modal';
import { forkJoin  } from 'rxjs';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule,Modal],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  pokemons: any[] = [];
  filteredPokemons: any[] = [];
  loading = true;
  error: string | null = null;
  searchTerm: string = '';

  // Variables para la paginación
  currentPageUrl: string | null = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=18';
  nextPageUrl: string | null = null;
  previousPageUrl: string | null = null;

  // Lista completa de nombres para la búsqueda (se carga una sola vez)
  private allPokemonNames: { name: string, url: string }[] = [];
  private allPokemonNamesLoaded = false;

  showModal = false;
  loadingModal = false;
  selectedPokemon: any = null;
  pokemonLocations: any[] = [];

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    // Al iniciar, cargamos la primera página de Pokémon
    this.loadPokemons(this.currentPageUrl!);
    // También precargamos la lista completa de nombres para la búsqueda.
    this.loadAllPokemonNames();
  }

  // Nuevo método para precargar la lista de nombres.
  loadAllPokemonNames(): void {
    this.pokemonService.getPokemonsFromUrl('https://pokeapi.co/api/v2/pokemon?offset=0&limit=1025')
      .subscribe({
        next: (data) => {
          this.allPokemonNames = data.results;
          this.allPokemonNamesLoaded = true;
        },
        error: (err) => {
          console.error('Error al precargar la lista de nombres de Pokémon:', err);
        }
      });
  }

  loadPokemons(url: string): void {
    if (!url) {
      return;
    }
    this.loading = true;
    this.pokemonService.getPokemonsFromUrl(url).subscribe({
      next: (data) => {
        this.pokemons = data.results;
        this.filteredPokemons = data.results;
        this.nextPageUrl = data.next;
        this.previousPageUrl = data.previous;
        this.loading = false;
        this.error = null; // Limpiamos el error
      },
      error: (err) => {
        this.error = 'Hubo un error al obtener los Pokémon.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // Lógica de búsqueda híbrida
  onSearch(): void {
    const term = this.searchTerm.trim().toLowerCase();

    // Si la búsqueda está vacía, volvemos al modo de paginación
    if (term === '') {
      this.filteredPokemons = this.pokemons;
      // Restauramos las URLs de paginación de la página actual
      this.loadPokemons(this.currentPageUrl!);
      return;
    }

    this.loading = true;
    this.nextPageUrl = null; // Oculta los botones de paginación
    this.previousPageUrl = null;

    if (this.allPokemonNamesLoaded) {
      const matchingPokemons = this.allPokemonNames.filter(p => p.name.toLowerCase().includes(term));
      
      if (matchingPokemons.length > 0) {
        const pokemonDetailObservables = matchingPokemons.map(p =>
          this.pokemonService.getPokemonDetails(p.url)
        );

        forkJoin(pokemonDetailObservables).subscribe({
          next: (results) => {
            this.filteredPokemons = results;
            this.loading = false;
            this.error = null;
          },
          error: (err) => {
            this.error = 'Error al obtener los detalles de los Pokémon.';
            this.loading = false;
            console.error(err);
          }
        });
      } else {
        this.filteredPokemons = [];
        this.error = 'No se encontraron Pokémon que coincidan.';
        this.loading = false;
      }
    } else {
      this.error = 'La lista de Pokémon aún no ha sido cargada. Inténtalo de nuevo en unos segundos.';
      this.loading = false;
    }
  }

  openModal(pokemon: any): void {
    let pokemonUrl: string | undefined = pokemon.url;
    let id: string | undefined;

    // Si el objeto tiene una URL, la usamos para obtener el ID.
    if (pokemonUrl) {
      id = pokemonUrl.split('/').filter(part => part !== '').pop();
    } else if (pokemon.id) {
      // Si no tiene URL, es un objeto de detalle, usamos su ID.
      id = pokemon.id;
      // Reconstruimos la URL para la llamada a getPokemonDetails.
      pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
    }

    if (!pokemonUrl || !id) {
      console.error('ID o URL de Pokémon no válidos.');
      return;
    }

    this.loadingModal = true;
    
    const details$ = this.pokemonService.getPokemonDetails(pokemonUrl);
    const encounters$ = this.pokemonService.getPokemonEncounters(id);
    
    forkJoin({ details: details$, encounters: encounters$ }).subscribe({
      next: (results) => {
        this.selectedPokemon = results.details;
        this.pokemonLocations = results.encounters;
        this.showModal = true;
        this.loadingModal = false;
      },
      error: (err) => {
        console.error('Error al obtener datos para la modal:', err);
        this.loadingModal = false;
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedPokemon = null;
    this.pokemonLocations = [];
  }

  goToNextPage(): void {
    if (this.nextPageUrl) {
      this.currentPageUrl = this.nextPageUrl; // Actualizamos la URL actual
      this.loadPokemons(this.nextPageUrl);
    }
  }

  goToPreviousPage(): void {
    if (this.previousPageUrl) {
      this.currentPageUrl = this.previousPageUrl; // Actualizamos la URL actual
      this.loadPokemons(this.previousPageUrl);
    }
  }

  getPokemonImageUrl(pokemon: any): string {
    let id: string | undefined;

    // Si el objeto tiene una URL, extraemos el ID de ahí.
    if (pokemon.url) {
        id = pokemon.url.split('/').filter((part: string) => part !== '').pop();
    } 
    // Si no tiene URL, asumimos que es un objeto de detalle y usamos su 'id'.
    else if (pokemon.id) {
        id = pokemon.id;
    }

    if (id) {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    }
    return 'https://via.placeholder.com/150';
  }
}