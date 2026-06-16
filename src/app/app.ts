
import { Component, signal } from '@angular/core';

import { NavBar } from "./components/nav-bar/nav-bar";
import { Home } from "./components/home/home";
import { Footer } from "./components/footer/footer";


@Component({
  selector: 'app-root',
  imports: [ NavBar, Home, Footer, ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('landing_page');
}
