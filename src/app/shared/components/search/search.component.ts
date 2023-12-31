import { Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/core/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  selectedIndex: number = -1;
  @ViewChild('resultsList') resultsList!: ElementRef;
  @ViewChildren('resultItems') resultItems!: QueryList<ElementRef>;

  //Lo que traemos de Algolia
  results: any[] = [];

  constructor(
    private searchService: SearchService,
    private router: Router
    )
    {

  }

  @ViewChild('searchContainer') searchContainer!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;
  // ...

  // Escuchar por clics en todo el documento
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Verificar si el clic fue fuera del contenedor del input y la lista
    const isClickInside = this.searchContainer.nativeElement.contains(event.target);
    if (!isClickInside) {
      // Cerrar la lista si el clic fue fuera
      this.closeResultsList();
    }
  }

    // Escuchar por tecla Esc en todo el documento
    @HostListener('document:keydown.escape', ['$event'])
    onKeydownHandler(event: KeyboardEvent): void {
      // Si el foco está en el input de búsqueda, solo se cerrará la lista de resultados
      if (document.activeElement === this.searchInput.nativeElement) {
        event.stopPropagation(); // Detener la propagación para evitar que se reabra la lista
        this.searchInput.nativeElement.blur(); // Opcional: quitar el foco del input
      }
      this.closeResultsList();
    }

  onContainerClick(event: MouseEvent): void {
    // Prevenir que el evento de clic se propague hasta el document
    event.stopPropagation();
  }

  closeResultsList(): void {
    // Lógica para cerrar la lista de resultados
    this.results = [];
    this.selectedIndex = -1; // Restablecer el índice seleccionado si es necesario

  }

  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        this.navigateResults(1);
        break;
      case 'ArrowUp':
        this.navigateResults(-1);
        break;
      case 'Enter':
        if (this.selectedIndex !== -1) {
          this.navigate(this.results[this.selectedIndex]);
        }
        break;
    }
  }

  navigateResults(direction: number): void {
    this.selectedIndex += direction;
    if (this.selectedIndex < 0) {
      this.selectedIndex = 0; // No ir más arriba de la lista
    } else if (this.selectedIndex > this.results.length - 1) {
      this.selectedIndex = this.results.length - 1; // No ir más abajo de la lista
    }
    this.ensureVisible();
  }

  ensureVisible(): void {
    this.resultItems.changes.subscribe(() => {
      const activeItem = this.resultItems.toArray()[this.selectedIndex];
      if (activeItem) {
        const container = this.resultsList.nativeElement;
        const itemElement = activeItem.nativeElement;

        // Verificar si el ítem está fuera de la vista
        const itemTop = itemElement.offsetTop;
        const itemBottom = itemTop + itemElement.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.offsetHeight;

        if (itemTop < containerTop) {
          // Si el ítem está por encima de la vista
          container.scrollTop = itemTop;
        } else if (itemBottom > containerBottom) {
          // Si el ítem está por debajo de la vista
          container.scrollTop = itemBottom - container.offsetHeight;
        }
      }
    });
  }


  onSearch($event: any) {
    // Obtiene el valor del input y verifica que no sea una cadena vacía
    const query = $event.target?.value;
    if (query) {
      // Si hay una consulta, llama al servicio de búsqueda para Prestadores
      this.searchService.search(query).then(res => {
        this.results = res.hits;
        console.log(this.results);
      }).catch(error => {
        console.error('Error en la búsqueda:', error);
      });

      // Llama al servicio de búsqueda para Atractivos
      this.searchService.search2(query).then(res => {
        // Asumiendo que quieres combinar los resultados de ambos servicios
        this.results = [...this.results, ...res.hits];
        console.log(this.results);
      }).catch(error => {
        console.error('Error en la búsqueda:', error);
      });
    } else {
      // Si la consulta está vacía, puedes optar por limpiar los resultados existentes
      this.results = [];
    }
  }

  //? Método para Navegar al detalle de Municipio
  navigate(item: any) {
    //Validamos hacia qué componente deseamos direccionar
    if ('servicios' in item) { //*Validación para Prestadores
      this.router.navigate(['prestadores', this.capitalizeFirstLetter(item.municipio), this.capitalizeFirstLetter(item.name)]);
    } else if ('bienOLugar' in item) { //*Validación para Atractivos
      this.router.navigate(['atractivos', this.capitalizeFirstLetter(item.municipio), this.capitalizeFirstLetter(item.name)]);
    }
  }

  capitalizeFirstLetter(inputString: string): string {
    if (inputString.length === 0) {
      return inputString;
    }
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
  }


}
