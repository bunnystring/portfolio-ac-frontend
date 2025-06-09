import { ReflectorBulbServices } from './../../../services/reflector-bulb-services/reflector-bulb-services';
import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
} from '@angular/core';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideExternalLink } from '@ng-icons/lucide';
import { ReflectorBulbComponent } from '../../../shared/reflector-bulb/reflector-bulb.component';
import {
  mouseEffectSnake,
} from '../../../../utils/mouse-effects/mouse-effects';


@Component({
  selector: 'app-home',
  imports: [NgIcon, FlexLayoutModule, ReflectorBulbComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  viewProviders: [provideIcons({ lucideExternalLink })],
})
export class HomeComponent implements OnInit, OnDestroy {
  insertHtml: any;
  @Output() pasarDatos = new EventEmitter<any>();

  constructor(
    private reflectorBulbServices: ReflectorBulbServices) {
    // Aquí puedes inicializar cualquier cosa que necesites al cargar el componente
  }

  ngOnDestroy() {
    // Remover el listener del elemento del DOM cuando el componente se destruye
  }
  ngOnInit(): void {
    this.insertHtml = mouseEffectSnake();
    console.log('insertHtml', this.insertHtml);

    this.validateReflectorBulb();

  }

  validateReflectorBulb(){
    console.log('Validating reflector bulb...');
    this.reflectorBulbServices.reflectorBulbEvent.subscribe((event) => {
      if (!event) {
        throw new Error('Reflector bulb is not defined');
      } else {
        console.log('Reflector bulb is defined', event);
        this.pasarDatos = event;
      }
    });
  }

}
