import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule,
         MatListModule,
         MatIconModule,
         MatInputModule,
         MatButtonModule,
         MatSelectModule,
         MatRadioModule,
         MatCardModule,
         MatTableModule } from '@angular/material';

import { AppComponent } from './app.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainInfoComponent } from './user-create/main-info/main-info.component';
import { CommonInfoComponent } from './user-create/common-info/common-info.component';
import { AddressInfoComponent } from './user-create/address-info/address-info.component';
import { MainInfoSharingService } from 'src/services/main-info-sharing.service';

const appRoutes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'search-user', component: UserSearchComponent },
  { path: 'create-user', component: MainInfoComponent },
  { path: 'create-user/address-info', component: AddressInfoComponent },
  { path: 'create-user/common-info', component: CommonInfoComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    UserSearchComponent,
    UserCreateComponent,
    DashboardComponent,
    MainInfoComponent,
    CommonInfoComponent,
    AddressInfoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterModule.forRoot(appRoutes),
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatTableModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [MainInfoSharingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
