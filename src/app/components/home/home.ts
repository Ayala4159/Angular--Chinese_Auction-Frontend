import { Component } from '@angular/core';
import { GetAllPackages } from '../Packages/get-all-packages/get-all-packages';
@Component({
  selector: 'app-home',
  imports: [GetAllPackages],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
