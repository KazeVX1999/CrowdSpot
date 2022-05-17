import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { SupportComponent } from './components/support/support.component';
import { AboutComponent } from './components/about/about.component';
import appRoutes from './routerConfig';

import { LogInPageComponent } from './components/WelcomePage/log-in-page/log-in-page.component';
import { SignUpPageComponent } from './components/WelcomePage/sign-up-page/sign-up-page.component';
import { ResetPageComponent } from './components/WelcomePage/reset-page/reset-page.component';
import { ParticlesComponent } from './components/particles/particles.component';

import { CrowdSpotService } from './components/Service/crowd-spot.service';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './components/Loader/interceptor.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavigationComponent } from './components/OperatorPage/navigation/navigation.component';
import { GuideComponent } from './components/guide/guide.component';
import { AccountComponent } from './components/OperatorPage/account/account.component';
import { SurveillanceComponent } from './components/OperatorPage/surveillance/surveillance.component';
import { HomeComponent } from './components/OperatorPage/home/home.component';
import { SorterComponent } from './components/OperatorPage/sorter/sorter.component';
import { SurveillanceSettingComponent } from './components/OperatorPage/surveillance-setting/surveillance-setting.component';
import { LightStatusComponent } from './components/OperatorPage/light-status/light-status.component';
import { CameraSettingComponent } from './components/OperatorPage/camera-setting/camera-setting.component';
import { StreamComponent } from './components/OperatorPage/stream/stream.component';
import { LightStatus2Component } from './components/OperatorPage/light-status2/light-status2.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    LogInPageComponent,
    SignUpPageComponent,
    ResetPageComponent,
    ParticlesComponent,
    NavigationComponent,
    SupportComponent,
    AboutComponent,
    GuideComponent,
    AccountComponent,
    SurveillanceComponent,
    HomeComponent,
    SorterComponent,
    SurveillanceSettingComponent,
    LightStatusComponent,
    CameraSettingComponent,
    StreamComponent,
    LightStatus2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,  
    MatProgressSpinnerModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    CrowdSpotService,
    HttpClient, 
    HttpClientModule,
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
