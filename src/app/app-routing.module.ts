import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContentComponent } from './components/main-content/main-content.component';
import { VideoEditorComponent } from './components/video-editor/video-editor.component';
import { VideoEditor2Component } from './components/video-editor2/video-editor2.component';

const routes: Routes = [
  {path: '', component: MainContentComponent},
  // {path: 'editor/:videoName', component: VideoEditorComponent},
  { path: 'editor', component: VideoEditorComponent },
  { path: 'editor2', component: VideoEditor2Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
