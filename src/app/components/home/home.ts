import { Component } from '@angular/core';
import { GetAllPackages } from '../../components/Packages/get-all-packages/get-all-packages';
@Component({
  selector: 'app-home',
  imports: [GetAllPackages],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
