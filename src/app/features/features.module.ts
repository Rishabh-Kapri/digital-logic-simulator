import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [SidebarComponent],
  imports: [CommonModule, MatSidenavModule, MatButtonModule],
  exports: [SidebarComponent],
})
export class FeaturesModule {}
