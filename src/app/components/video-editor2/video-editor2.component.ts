import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-editor',
  templateUrl: './video-editor2.component.html',
  styleUrls: ['./video-editor2.component.css']
})
export class VideoEditor2Component implements OnInit {
  private worker!: Worker;
  isFFmpegLoaded = false;
  trimmedVideoUrl: string | null = null;
  mergedVideoUrl: string | null = null;
  selectedVideoFile: File | null = null;
  selectedVideos: File[] = [];
  selectedVideoUrl: string | null = null;
  message: string = '';

  constructor() {}

  ngOnInit() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('../../app.worker', import.meta.url), { type: 'module' });

      this.worker.onmessage = (event) => {
        if (event.data.status === 'loaded') {
          this.isFFmpegLoaded = true;
          console.log('FFmpeg loaded successfully in worker');
        } else if (event.data.status === 'trimmed') {
          this.trimmedVideoUrl = URL.createObjectURL(new Blob([event.data.file]));
          this.message = 'Video trimmed successfully!';
          console.log('Video trimmed successfully');
        } else if (event.data.status === 'merged') {
          this.mergedVideoUrl = URL.createObjectURL(new Blob([event.data.file]));
          this.message = 'Videos merged successfully!';
          console.log('Videos merged successfully');
        } else if (event.data.status === 'error') {
          console.error('Worker error:', event.data.message);
          this.message = 'Error processing video.';
        }
      };

      // Load FFmpeg in worker
      this.worker.postMessage({ action: 'loadFFmpeg' });
    } else {
      console.error('Web Workers are not supported in this browser.');
    }
  }

  onFileSelected(event: any) {
    console.log(event);
    if (event.target.files.length > 0) {
      this.selectedVideoFile = event.target.files[0];
      console.log("the selectedVideoFile",this.selectedVideoFile);
      if (this.selectedVideoFile) {
        const fileURL = URL.createObjectURL(this.selectedVideoFile);
        this.selectedVideoUrl = fileURL;
      } else {
        console.error('No video file selected.');
      }
    }
  }

  onMultipleFilesSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedVideos = Array.from(event.target.files);
    }
  }

  trimVideo(startTime: number, endTime: number) {
    console.log("trim called")
    console.log(this.selectedVideoFile);
    if (!this.selectedVideoFile || !this.isFFmpegLoaded) {
      console.log('Please select a video and wait for FFmpeg to load.');
      this.message = 'Please select a video and wait for FFmpeg to load.';
      return;
    }

    this.worker.postMessage({
      action: 'trimVideo',
      data: {
        file: this.selectedVideoFile,
        startTime,
        endTime
      }
    });
  }

  mergeVideos() {
    console.log("selectedVideos", this.selectedVideos);
    console.log("merge called")
    if (!this.isFFmpegLoaded) {
      this.message = 'Please wait for FFmpeg to load before merging videos.';
      return;
    }

    if (this.selectedVideos.length < 2) {
      this.message = 'Please select at least two videos.';
      return;
    }

    this.worker.postMessage({
      action: 'mergeVideos',
      data: {
        files: this.selectedVideos
      }
    });
  }
}
