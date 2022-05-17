import { Routes } from '@angular/router';
import { HomeComponent  } from './components/OperatorPage/home/home.component';
import { AccountComponent } from './components/OperatorPage/account/account.component';
import { SurveillanceComponent } from './components/OperatorPage/surveillance/surveillance.component';
import { SurveillanceSettingComponent } from './components/OperatorPage/surveillance-setting/surveillance-setting.component';
import { CameraSettingComponent } from './components/OperatorPage/camera-setting/camera-setting.component';
import { SupportComponent } from './components/support/support.component';
import { AboutComponent } from './components/about/about.component';
import { StreamComponent } from './components/OperatorPage/stream/stream.component';

const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'Account',
        component: AccountComponent
    }, 
    {
        /* Code Adapted from Parth Ghiya, 2017. */      
        path: 'SurveillanceOverview/:message', /* End of Code Adapted. */
        component: SurveillanceComponent
    }, 
    {
        path: 'Surveillance/:locationID/:message',
        component: SurveillanceSettingComponent
    },
    {
        path: 'Camera/:locationID/:cameraID',
        component: CameraSettingComponent
    }, 
    {
        path: 'Stream/:cameraID',
        component: StreamComponent
    }, 
    {
        path: 'Support',
        component: SupportComponent
    }, 
    {
        path: 'About',
        component: AboutComponent
    }, 
];
export default appRoutes;