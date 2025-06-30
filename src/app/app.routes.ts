import { Routes } from '@angular/router';
import { HomeComponent } from './components/public/home/home/home.component';
import { AboutItComponent } from './components/public/about-it/about-it-component';
import { ContactMe } from './components/public/contact-me/contact-me';


export const routes: Routes = [
  // path default home
  {path: "", component: HomeComponent},
  {path: "home", component: HomeComponent},
  {path: "about-it", component: AboutItComponent},
  {path: "contact-me", component: ContactMe},

];
