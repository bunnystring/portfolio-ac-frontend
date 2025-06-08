import { Component, OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { featherAirplay, featherFacebook } from '@ng-icons/feather-icons';
import {lucideFacebook, lucideLinkedin, lucideGithub, lucideInstagram, lucideGamepad2} from '@ng-icons/lucide'
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import {stopMouseEffectSnake } from '../../../../utils/mouse-effects/mouse-effects';

@Component({
  selector: 'app-menu-header',
  imports: [FlexLayoutModule ],
  templateUrl: './menu-header.component.html',
  styleUrl: './menu-header.component.scss',
  viewProviders: [provideIcons({ featherAirplay,lucideFacebook, lucideLinkedin, lucideGithub, lucideInstagram, lucideGamepad2})]
})
export class MenuHeaderComponent implements OnInit{
  insertHtml: any;
  constructor() {}

  ngOnInit(): void {
    // Aquí puedes inicializar cualquier cosa que necesites al cargar el componente

    //stop mouse effect
    this.insertHtml = stopMouseEffectSnake();

    // remove the mouse effect from the header
  }

  onClickMenu() {
    const menu = document.querySelector('.menu');
    if (menu) {
      menu.classList.toggle('active');
    }
  }
}
