import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  title: string;

  constructor() {
    this.title = 'Inicio';
  }

  ngOnInit() {
  }

}
