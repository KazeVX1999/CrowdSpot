import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/DataClasses';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  // Welcome Page
  @Input() userAuthorized?: User;
  @Output() logoEmitter = new EventEmitter<boolean>();
  @Output() accountEmitter = new EventEmitter<boolean>();
  @Output() surveillanceEmitter = new EventEmitter<boolean>();
  @Output() supportEmitter = new EventEmitter<boolean>();
  @Output() aboutEmitter = new EventEmitter<boolean>();

  constructor(private router: Router) { }
  reset: string | null = "";
  ngOnInit(): void {
    this.reset = localStorage.getItem("reset");

  }

  logoTrigger(){
    window.scrollTo(0,0);
    if (this.userAuthorized == undefined){
      this.logoEmitter.emit(false);
    } else {
      this.logoEmitter.emit(true);
    }
  }

  accountTrigger(){
    if (this.userAuthorized == undefined){
      this.accountEmitter.emit(false);
    } else {
      this.accountEmitter.emit(true);
    }
  }  

  surveillanceTrigger(){
    if (this.userAuthorized == undefined){
      this.surveillanceEmitter.emit(false);
    } else {
      this.surveillanceEmitter.emit(true);
    }
  }  

  supportTrigger(){
    if (this.userAuthorized == undefined){
      this.supportEmitter.emit(false);
    } else {
      this.supportEmitter.emit(true);
    }
  }  

  aboutTrigger(){
    if (this.userAuthorized == undefined){
      this.aboutEmitter.emit(false);
    } else {
      this.aboutEmitter.emit(true);
    }
  }  
  
  updateLogoContainer(){
    var logoContainer = document.getElementsByClassName("logoContainer")[0];
    logoContainer?.classList.toggle("logoActive");
  }

  updateAccountContainer(){
    var accountContainer = document.getElementById("accountContainer");
    accountContainer?.classList.toggle("top2Active");
  }

  updateSurveillanceContainer(){
    var surveillanceContainer = document.getElementById("surveillanceContainer");
    surveillanceContainer?.classList.toggle("top2Active");
  }

  updateSupportContainer(){
    var supportContainer = document.getElementById("supportContainer");
    supportContainer?.classList.toggle("top2Active");
  }

  updateAboutContainer(){
    var aboutContainer = document.getElementById("aboutContainer");
    aboutContainer?.classList.toggle("top2Active");
  }

  scrollUp(){
    window.scrollTo(0,0);
  }

}
