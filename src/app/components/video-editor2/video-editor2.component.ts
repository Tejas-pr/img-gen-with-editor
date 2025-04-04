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
  startTime: number = 0;
  endTime: number = 10;
  maxDuration: number = 0;
  sliderRange: [number, number] = [0, 10];
  previousSliderRange: [number, number] = [0, 10];

  videos: string[] = [
    'assets/video1.mp4',
    'assets/video2.mp4',
    'assets/video3.mp4',
    'assets/video4.mp4',
    'assets/video5.mp4',
    'assets/video6.mp4',
    'assets/video7.mp4',
    'assets/video9.mp4',
    'assets/video10.mp4'
  ];

  onStartThumbInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const newStart = parseFloat(input.value);
    this.sliderRange[0] = newStart;
    console.log('Live Start Value:', newStart);
  }
  
  onEndThumbInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const newEnd = parseFloat(input.value);
    this.sliderRange[1] = newEnd;
    console.log('Live End Value:', newEnd);
  }

  onRangeChange(newRange: any) {
    this.sliderRange = newRange;
  }

  onLoadedMetadata(event: Event) {
    const video = event.target as HTMLVideoElement;
    this.maxDuration = Math.floor(video.duration);
    console.log("maxDuration", this.maxDuration);
    this.sliderRange[1] = this.maxDuration;
  }  

  getVideoUrl(video: string | File): string {
    if (typeof video === 'string') {
      return video;
    } else {
      return URL.createObjectURL(video);
    }
  }
  async trimVideoBtn(video: string) {
    console.log(this.startTime);
    console.log(this.endTime);
    try {
      console.log("Selected video for trimming:", video);
      
      // Fetch the video file from the URL
      const response = await fetch(video);
      const blob = await response.blob();
  
      // Convert the Blob into a File object
      const file = new File([blob], video.split('/').pop() || 'video.mp4', { type: 'video/mp4' });
  
      // Assign the file to selectedVideoFile
      this.selectedVideoFile = file;
      this.selectedVideoUrl = video; // Update the preview URL
  
      console.log("Selected video file:", this.selectedVideoFile);
    } catch (error) {
      console.error("Error loading video file:", error);
    }
  }
  
  /** Select a video to preview */
  selectVideo(videoUrl: string) {
    this.selectedVideoUrl = videoUrl;
  }

  /** Add a video to the merge queue */
  async addToQueue(videoUrl: string) {
    if (this.selectedVideos.some(video => video.name === videoUrl.split('/').pop())) {
      console.log('Video already in queue:', videoUrl);
      return; // Prevent duplicate selections
    }
  
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const file = new File([blob], videoUrl.split('/').pop() || 'video.mp4', { type: 'video/mp4' });
  
      this.selectedVideos.push(file);
      console.log('Added to merge queue:', file);
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  }  

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

  trimVideo() {
    const [startTime, endTime] = this.sliderRange;
    console.log("trim called")
    console.log(this.selectedVideoFile);
    this.endTime = endTime;
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

  reloadPage() {
    window.location.reload();
  }  
}
