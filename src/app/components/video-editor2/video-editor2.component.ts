import { Component, ElementRef, ViewChild } from '@angular/core';
import { FFmpeg } from '@ffmpeg/ffmpeg';

@Component({
  selector: 'app-video-editor',
  templateUrl: './video-editor2.component.html',
  styleUrls: ['./video-editor2.component.css']
})
export class VideoEditor2Component {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  @ViewChild('processedVideoPlayer') processedVideoPlayer!: ElementRef;
  
  ffmpeg: FFmpeg;
  isFFmpegLoaded: boolean = false;
  selectedVideoFile: File | null = null;
  trimmedVideoUrl: string | null = null;
  mergedVideoUrl: string | null = null;
  message: string = '';
  selectedVideos: File[] = [];

  constructor() {
    this.ffmpeg = new FFmpeg();
    this.loadFFmpeg();
  }

  async loadFFmpeg() {
    // const workerURL = './assets/worker/worker.js';
    // const workerURL = '../../../assets/worker/worker.js';
    try {
      // await this.ffmpeg.load();
      await this.ffmpeg.load({
        workerURL: 'assets/worker/worker.js'
      });
      this.isFFmpegLoaded = true;
      console.log('FFmpeg loaded successfully');
    } catch (error) {
      console.error('Error loading FFmpeg:', error);
      this.message = 'Failed to load FFmpeg.';
    }
  }


  onFileSelected(event: any) {
    console.log(event);
    if (event.target.files.length > 0) {
      this.selectedVideoFile = event.target.files[0];
      if (this.selectedVideoFile) {
        this.trimmedVideoUrl = URL.createObjectURL(this.selectedVideoFile);
        console.log('Trimmed video URL:', this.trimmedVideoUrl);
      }
    }
  }

  async trimVideo(startTime: number, endTime: number) {
    console.log("trim is called!")
    console.log(this.selectedVideoFile)
    console.log(this.isFFmpegLoaded)
    if (!this.selectedVideoFile || !this.isFFmpegLoaded) {
      console.log("Please select a video and wait for FFmpeg to load. from trimVideo");
      this.message = 'Please select a video and wait for FFmpeg to load.';
      return;
    }

    try {
      console.log("Trimming video...");
      const inputFileName = 'input.mp4';
      const outputFileName = 'trimmed.mp4';

      const fileData = new Uint8Array(await this.selectedVideoFile.arrayBuffer());
      await this.ffmpeg.writeFile(inputFileName, fileData);

      await this.ffmpeg.exec([
        '-i', inputFileName,
        '-ss', startTime.toString(),
        '-to', endTime.toString(),
        '-c', 'copy',
        outputFileName
      ]);

      const trimmedFileData = await this.ffmpeg.readFile(outputFileName);
      this.trimmedVideoUrl = URL.createObjectURL(new Blob([trimmedFileData]));

      this.message = 'Video trimmed successfully!';
      console.log("Video trimmed successfully!");
    } catch (error) {
      console.error('Error trimming video:', error);
      this.message = 'Error trimming video.';
    }
  }

  onMultipleFilesSelected(event: any) {
    console.log(event);
    if (event.target.files.length > 0) {
      this.selectedVideos = Array.from(event.target.files);
      console.log('Selected videos:', this.selectedVideos);
    }
  }

  async mergeVideos() {
    if (!this.isFFmpegLoaded) {
      console.log("Please wait for FFmpeg to load before merging videos.");
      this.message = 'Please wait for FFmpeg to load before merging videos.';
      return;
    }
  
    if (this.selectedVideos.length < 2) {
      this.message = 'Please select at least two videos.';
      return;
    }
  
    try {
      // Prepare video file list for ffmpeg concat
      const fileList = await Promise.all(this.selectedVideos.map(async (file, index) => {
        const fileName = `video${index}.mp4`;
        const fileData = new Uint8Array(await file.arrayBuffer());
        await this.ffmpeg.writeFile(fileName, fileData);
        return `file '${fileName}'\n`;
      }));
  
      // Write the list to an input file
      await this.ffmpeg.writeFile('input.txt', new TextEncoder().encode(fileList.join('')));
  
      // Execute ffmpeg to merge videos
      await this.ffmpeg.exec(['-f', 'concat', '-safe', '0', '-i', 'input.txt', '-c', 'copy', 'merged.mp4']);
  
      // Read and create URL for the merged video
      const mergedFileData = await this.ffmpeg.readFile('merged.mp4');
      this.mergedVideoUrl = URL.createObjectURL(new Blob([mergedFileData]));
  
      this.message = 'Videos merged successfully!';
    } catch (error) {
      console.error('Error merging videos:', error);
      this.message = 'Error merging videos.';
    }
  }  
}
