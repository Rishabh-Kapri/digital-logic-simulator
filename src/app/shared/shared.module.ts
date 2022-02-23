import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './components/dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [DialogComponent],
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule],
  exports: [],
})
export class SharedModule {}
