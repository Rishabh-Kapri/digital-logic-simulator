import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeaturesModule } from './features/features.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReteEditorModule } from './rete/rete.module';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { CircuitModuleState } from './core/store/circuit.state';
import { AppState } from './core/store/app.state';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgxsModule.forRoot([CircuitModuleState, AppState], {
      developmentMode: !environment.production,
    }),
    NgxsLoggerPluginModule.forRoot({
      disabled: !environment.production,
    }),
    NgxsStoragePluginModule.forRoot({
      key: 'circuit',
    }),
    SharedModule,
    FeaturesModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatCardModule,
    DragDropModule,
    MatButtonModule,
    ReteEditorModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
