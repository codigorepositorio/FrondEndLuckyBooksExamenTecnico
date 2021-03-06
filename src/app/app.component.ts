import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'dashBoard';
  cssUrl: string;

  constructor(public sanitizer: DomSanitizer) {
    this.cssUrl = '/assets/style.css';
  }
}
