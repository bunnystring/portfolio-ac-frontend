import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuHeaderComponent } from "./components/shared/menu-header/menu-header/menu-header.component";
import { FooterComponent } from "./components/shared/footer/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuHeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portfolio-ac';
}
