import {
  Component,
  OnInit,
  ElementRef,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideExternalLink } from '@ng-icons/lucide';
import { ReflectorBulbComponent } from '../../../shared/reflector-bulb/reflector-bulb.component';
import {
  mouseEffectMotion,
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

  ngOnDestroy() {
    // Remover el listener del elemento del DOM cuando el componente se destruye
  }
  ngOnInit(): void {
    this.insertHtml = mouseEffectSnake();
    console.log('insertHtml', this.insertHtml);

  }

  onMovemouse() {}

}
