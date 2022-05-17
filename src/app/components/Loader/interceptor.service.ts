import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{

  constructor(public loaderService: LoaderService) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if (req.url.includes("CheckServerStatus") || req.url.includes("RefreshLocations") || req.url.includes("RefreshCameras") 
      || req.url.includes("CameraStream") || req.url.includes("GetCamera") || req.url.includes("GetStreamInput")){
        // No Intercepts
        return next.handle(req).pipe(
          finalize(
          () => {
            this.loaderService.isLoading.next(false);
          }
          )
        );
      } else {
        // Intercepting
        this.loaderService.isLoading.next(true);
        return next.handle(req).pipe(
          finalize(
          () => {
            this.loaderService.isLoading.next(false);
          }
          )
        );
      }
      
  }
}
