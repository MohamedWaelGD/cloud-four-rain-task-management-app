import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertWorkspaceComponent } from './upsert-workspace.component';

describe('UpsertWorkspaceComponent', () => {
  let component: UpsertWorkspaceComponent;
  let fixture: ComponentFixture<UpsertWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertWorkspaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
