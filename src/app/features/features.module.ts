import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [SidebarComponent],
  imports: [CommonModule, MatSidenavModule],
  exports: [SidebarComponent],
})
export class FeaturesModule {}
