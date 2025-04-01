import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoEditor2Component } from './video-editor2.component';

describe('VideoEditor2Component', () => {
  let component: VideoEditor2Component;
  let fixture: ComponentFixture<VideoEditor2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoEditor2Component]
    });
    fixture = TestBed.createComponent(VideoEditor2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
