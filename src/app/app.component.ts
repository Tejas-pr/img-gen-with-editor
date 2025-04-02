import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isEditorPage = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isEditorPage = this.router.url.startsWith('/editor');
    });
  }

  isSidebarOpen = window.innerWidth >= 768;
  mode: 'over' | 'side' = window.innerWidth >= 768 ? 'side' : 'over';

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth >= 768) {
      this.isSidebarOpen = true;
      this.mode = 'side';
    } else {
      this.isSidebarOpen = false;
      this.mode = 'over';
    }
  }
}

if (typeof Worker !== 'undefined') {
  // Create a new
  const worker = new Worker(new URL('./app.worker', import.meta.url));
  worker.onmessage = ({ data }) => {
    console.log(`page got message: ${data}`);
  };
  worker.postMessage('hello');
} else {
  // Web Workers are not supported in this environment.
  // You should add a fallback so that your program still executes correctly.
}