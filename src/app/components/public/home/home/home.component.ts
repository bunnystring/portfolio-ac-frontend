import { WheelTimelineComponent } from './../../../shared/wheel-timeline/wheel-timeline.component';
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
import { ReflectorBulbComponent } from "../../../shared/reflector-bulb/reflector-bulb.component";
import { mouseEffectMotion } from '../../../../utils/mouse-effects/mouse-effects';

@Component({
  selector: 'app-home',
  imports: [
    NgIcon,
    FlexLayoutModule,
    ReflectorBulbComponent,
    WheelTimelineComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  viewProviders: [provideIcons({ lucideExternalLink })],
})
export class HomeComponent implements OnInit, OnDestroy {
  colors = ['white', 'red', 'black'];
  insertHtml: any;

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    //this.insertHtml = mouseEffectMotion(event, this.colors);
  }

  ngOnDestroy() {
    // Remover el listener del elemento del DOM cuando el componente se destruye
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  onMovemouse() {}
}
