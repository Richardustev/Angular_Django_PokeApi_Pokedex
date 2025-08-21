import { Component, Input, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { PokemonService } from '../../services/pokemon-service';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-modal',
  imports: [CommonModule, NgClass],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class Modal implements OnChanges {
  @Input() pokemon: any;
  @Input() pokemonLocations: any[] = [];
  @Output() close = new EventEmitter<void>();

  activeSection: 'moves' | 'locations' | null = null;
  movesByLevelUp: any[] = [];
  loadingMoves = false;

  constructor(private pokemonService: PokemonService) {}

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['pokemon'] && this.pokemon) {
          this.getMovesData(this.pokemon);
      }
  }

  getMovesData(pokemon: any): void {
    this.loadingMoves = true;
    const levelUpMoves = pokemon.moves
      .filter((move: any) => 
        move.version_group_details.some((detail: any) => 
          detail.move_learn_method.name === 'level-up' && detail.level_learned_at > 0
        )
      )
      .map((move: any) => ({
        name: move.move.name,
        level: move.version_group_details.find((detail: any) => 
          detail.move_learn_method.name === 'level-up'
        ).level_learned_at,
        url: move.move.url,
        type: ''
      }));

    if (levelUpMoves.length > 0) {
      const moveDetailsObservables = levelUpMoves.map((move: any) => 
        this.pokemonService.getPokemonMoveDetails(move.url)
      );

      // Corregimos la sintaxis y el tipado aquí:
      forkJoin(moveDetailsObservables as Observable<any>[]).subscribe({
        next: (results: any[]) => {
          this.movesByLevelUp = levelUpMoves.map((move: any, index: number) => {
            const moveDetail = results[index];
            return {
              ...move,
              type: moveDetail.type.name
            };
          }).sort((a: any, b: any) => a.level - b.level);
          this.loadingMoves = false;
        },
        error: (err: any) => {
          console.error('Error al obtener los detalles de los ataques:', err);
          this.loadingMoves = false;
        }
      });
    } else {
      this.movesByLevelUp = [];
      this.loadingMoves = false;
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  toggleSection(section: 'moves' | 'locations'): void {
      this.activeSection = this.activeSection === section ? null : section;
  }
  
  // Este es el método que faltaba en tu código
  getMoveLevel(move: any): string {
      return `Nv. ${move.level}`;
  }

  getPokemonImageUrl(pokemon: any): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  }

  getStatPercentage(value: number): number {
    const maxStat = 255;
    return (value / maxStat) * 100;
  }

  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      fire: '#FD7D24', water: '#4592C4', grass: '#9BCC50', bug: '#729F3F', normal: '#A4ACAF',
      poison: '#B97FC9', electric: '#FEE539', ground: '#F7DE3F', fairy: '#FDB9E9',
      fighting: '#D56723', psychic: '#F366B9', rock: '#A38C21', steel: '#9EB7B8',
      ice: '#51C4E7', ghost: '#7B62A3', dragon: '#53A4CF', dark: '#707070', flying: '#A890F0',
    };
    return colors[type] || '#ccc';
  }
}
