import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Menu } from './components/Menu/menu/menu';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule,Menu],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Client-ChineseAuction');
}
