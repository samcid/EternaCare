import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    FormsModule,
    RouterModule,
  ],
  providers: [
    provideFirebaseApp(() => initializeApp({"projectId":"astaswiss-firebase","appId":"1:587196675785:web:c7ca0d1670e5d388a43f18","storageBucket":"astaswiss-firebase.appspot.com","apiKey":"AIzaSyBy5FUck_qLIU-SWEdurzMv3zSvVQFj1pQ","authDomain":"astaswiss-firebase.firebaseapp.com","messagingSenderId":"587196675785","measurementId":"G-9MNGN2TQXT"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
