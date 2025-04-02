/// <reference lib="webworker" />
import { FFmpeg } from '@ffmpeg/ffmpeg';

const ffmpeg = new FFmpeg();

self.onmessage = async (event) => {
  const { action, data } = event.data;

  if (action === 'loadFFmpeg') {
    try {
      await ffmpeg.load({
        coreURL: 'assets/ffmpeg/ffmpeg-core.js',
        wasmURL: 'assets/ffmpeg/ffmpeg-core.wasm'
      });
      postMessage({ status: 'loaded' });
    } catch (error) {
      postMessage({ status: 'error', message: error });
    }
  }

  if (action === 'trimVideo') {
    try {
      const { file, startTime, endTime } = data;
      const fileData = new Uint8Array(await file.arrayBuffer());

      await ffmpeg.writeFile('input.mp4', fileData);

      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-ss', startTime.toString(),
        '-to', endTime.toString(),
        '-c', 'copy',
        'output.mp4'
      ]);

      const trimmedFileData = await ffmpeg.readFile('output.mp4');
      postMessage({ status: 'trimmed', file: trimmedFileData });
    } catch (error) {
      postMessage({ status: 'error', message: error });
    }
  }

  if (action === 'mergeVideos') {
    try {
      const { files } = data;

      if (files.length < 2) {
        postMessage({ status: 'error', message: 'Select at least two videos to merge.' });
        return;
      }

      // Write input files to FFmpeg memory
      const fileNames = [];
      for (let i = 0; i < files.length; i++) {
        const fileData = new Uint8Array(await files[i].arrayBuffer());
        const fileName = `input${i}.mp4`;
        await ffmpeg.writeFile(fileName, fileData);
        fileNames.push(fileName);
      }

      // Create a text file with the list of videos
      const fileListContent = fileNames.map(name => `file '${name}'`).join('\n');
      await ffmpeg.writeFile('fileList.txt', new TextEncoder().encode(fileListContent));

      // Merge videos using FFmpeg concat demuxer
      await ffmpeg.exec([
        '-f', 'concat',
        '-safe', '0',
        '-i', 'fileList.txt',
        '-c', 'copy',
        'merged.mp4'
      ]);

      const mergedFileData = await ffmpeg.readFile('merged.mp4');
      postMessage({ status: 'merged', file: mergedFileData });
    } catch (error) {
      postMessage({ status: 'error', message: error });
    }
  }
};
