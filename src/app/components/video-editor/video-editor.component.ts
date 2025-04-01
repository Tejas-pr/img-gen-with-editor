import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

interface VideoClip {
  id: number;
  name: string;
  url: string;
  duration: number;
  startTime: number;
  endTime: number;
}

interface AudioTrack {
  name: string;
  url: string;
}

@Component({
  selector: 'app-video-editor',
  templateUrl: './video-editor.component.html',
  styleUrls: ['./video-editor.component.css']
})
export class VideoEditorComponent implements OnInit {
  @ViewChild('videoPreview') videoPreview!: ElementRef<HTMLVideoElement>;

  // Video pool
  videoPool: VideoClip[] = [
    { id: 1, name: 'moon.jpg', url: 'assets/images/moon.jpg', duration: 5, startTime: 0, endTime: 5 },
    { id: 2, name: 'trees.jpg', url: 'assets/images/trees.jpg', duration: 5, startTime: 0, endTime: 5 },
    { id: 3, name: 'massive_w.mp4', url: 'assets/videos/massive_w.mp4', duration: 10, startTime: 0, endTime: 10 }
  ];

  // Timeline
  timelineClips: VideoClip[] = [];
  backgroundMusic: AudioTrack | null = null;
  availableAudio: AudioTrack[] = [
    { name: 'background1.mp3', url: 'assets/audio/background1.mp3' }
  ];

  // Preview
  currentTime: number = 0;
  totalDuration: number = 0;
  isPlaying: boolean = false;

  ngOnInit() {
    this.calculateTotalDuration();
  }

  // Drag and drop to timeline
  drop(event: CdkDragDrop<VideoClip[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const clip = { ...event.previousContainer.data[event.previousIndex] };
      this.timelineClips.push(clip);
      this.calculateTotalDuration();
    }
  }

  // Calculate total duration of timeline
  calculateTotalDuration() {
    this.totalDuration = this.timelineClips.reduce((total, clip) => total + (clip.endTime - clip.startTime), 0);
  }

  // Play/Pause video
  togglePlay() {
    if (this.isPlaying) {
      this.videoPreview.nativeElement.pause();
    } else {
      this.videoPreview.nativeElement.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  // Update current time
  onTimeUpdate() {
    this.currentTime = this.videoPreview.nativeElement.currentTime;
  }

  // Seek to a specific time
  seekTo(time: number) {
    this.videoPreview.nativeElement.currentTime = time;
    this.currentTime = time;
  }

  // Trim video clip
  trimClip(clip: VideoClip, start: number, end: number) {
    clip.startTime = start;
    clip.endTime = end;
    this.calculateTotalDuration();
  }

  // Add background music
  addBackgroundMusic(audio: AudioTrack) {
    this.backgroundMusic = audio;
  }

  // Export video (simulated)
  exportVideo() {
    // In a real app, this would use a library like FFmpeg.js to merge videos and audio
    console.log('Exporting video...');
    console.log('Timeline Clips:', this.timelineClips);
    console.log('Background Music:', this.backgroundMusic);
    alert('Video exported successfully! (Simulated)');
  }

  // Format time for display
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}