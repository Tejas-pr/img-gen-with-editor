import { Component } from '@angular/core';

@Component({
  selector: 'app-video-editor3',
  templateUrl: './video-editor3.component.html',
  styleUrls: ['./video-editor3.component.css']
})
export class VideoEditor3Component {}
// export class VideoEditor3Component {
//   selectedVideos: File[] = [];
//   startTime: number = 0;
//   endTime: number = 0;

//   onVideoSelect(event: any): void {
//     this.selectedVideos = Array.from(event.target.files);
//   }

//   mergeVideos(): void {
//     if (this.selectedVideos.length < 2) {
//       console.error('Please select at least two videos to merge.');
//       return;
//     }
//     // Placeholder logic for merging videos
//     console.log('Merging videos:', this.selectedVideos);
    
//   }

//   trimVideo(): void {
//     if (this.selectedVideos.length !== 1) {
//       console.error('Please select a single video to trim.');
//       return;
//     }
//     if (this.startTime >= this.endTime) {
//       console.error('Start time must be less than end time.');
//       return;
//     }
//     // Placeholder logic for trimming video
//     console.log(`Trimming video from ${this.startTime} to ${this.endTime}`);
//     alert(`Video trimmed from ${this.startTime} to ${this.endTime} (placeholder logic).`);
//   }
// }
