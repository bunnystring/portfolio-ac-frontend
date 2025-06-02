import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { featherAirplay, featherFacebook } from '@ng-icons/feather-icons';
import {lucideFacebook, lucideLinkedin, lucideGithub, lucideInstagram, lucideGamepad2} from '@ng-icons/lucide'
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

@Component({
  selector: 'app-menu-header',
  imports: [FlexLayoutModule ],
  templateUrl: './menu-header.component.html',
  styleUrl: './menu-header.component.scss',
  viewProviders: [provideIcons({ featherAirplay,lucideFacebook, lucideLinkedin, lucideGithub, lucideInstagram, lucideGamepad2})]
})
export class MenuHeaderComponent {

}
