import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css']
})
export class MainContentComponent {
  allVideos: { id: number; name: string; src: string }[] = [
    { id: 1, name: 'video1', src: 'assets/video1.mp4' },
    { id: 2, name: 'video2', src: 'assets/video2.mp4' },
    { id: 3, name: 'video3', src: 'assets/video3.mp4' },
    { id: 4, name: 'video4', src: 'assets/video4.mp4' },
    { id: 5, name: 'video5', src: 'assets/video5.mp4' },
    { id: 6, name: 'video6', src: 'assets/video6.mp4' },
    { id: 7, name: 'video7', src: 'assets/video7.mp4' },
    // { id: 8, name: 'video8', src: 'assets/video8.mp4' },
    { id: 9, name: 'video9', src: 'assets/video9.mp4' },
    { id: 10, name: 'video10', src: 'assets/video10.mp4' },
  ];

  videos: { name: string; src: string }[] = [];
  isLoading: boolean = false;

  generateVideos() {
    this.isLoading = true;

    setTimeout(() => {
      this.videos = this.getRandomVideos(5);
      this.isLoading = false;
    }, 1000);
  }

  getRandomVideos(count: number): { name: string; src: string }[] {
    let shuffled = [...this.allVideos].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  deleteVideo(index: number) {
    this.videos.splice(index, 1);
  }

  constructor(private router: Router) {}
  
  openVideoEditor2() {
    this.router.navigate(['/editor2/']);
  }
}
