import { Routes } from '@angular/router';
import { HomeComponent } from './components/public/home/home/home.component';
import { AboutItComponent } from './components/public/about-it/about-it-component';
import { ContactComponent } from './components/public/contact/contact/contact.component';

export const routes: Routes = [
  // path default home
  {path: "", component: HomeComponent},
  {path: "home", component: HomeComponent},
  {path: "about-it", component: AboutItComponent},
  {path: "contact", component: ContactComponent},
  
];
