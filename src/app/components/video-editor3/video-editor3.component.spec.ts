import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoEditor3Component } from './video-editor3.component';

describe('VideoEditor3Component', () => {
  let component: VideoEditor3Component;
  let fixture: ComponentFixture<VideoEditor3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoEditor3Component]
    });
    fixture = TestBed.createComponent(VideoEditor3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
