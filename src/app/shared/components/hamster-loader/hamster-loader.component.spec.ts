import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HamsterLoaderComponent } from './hamster-loader.component';

describe('HamsterLoaderComponent', () => {
  let component: HamsterLoaderComponent;
  let fixture: ComponentFixture<HamsterLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HamsterLoaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HamsterLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
