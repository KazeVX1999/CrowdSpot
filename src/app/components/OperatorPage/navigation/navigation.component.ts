import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { User } from 'src/app/DataClasses';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  @Input() userAuthorized? : User = undefined;
  currentHighlight?: string;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.updateLogo(true);
    this.currentHighlight = "Logo";
    // Code adapted from community wiki, 2022; Ludohen, 2015 & Marco, 2020.
    this.router.events.subscribe((val)=>{
      this.offEverything();
      if (this.router.url.includes("SurveillanceOverview")){
        this.updateSurveillanceContainer(true);  
        this.currentHighlight = "Surveillance";
      } else if (this.router.url.includes("Support")){
        this.updateSupportContainer(true);  
        this.currentHighlight = "Support";
      } else if (this.router.url.includes("About")){
        this.updateAboutContainer(true);  
        this.currentHighlight = "About";  
      } else if (this.router.url.includes("Account")){
        this.userContainerUpdateBorder(true);  
        this.currentHighlight = "User";
      } else {
        if (this.router.url.length == 1){
          this.updateLogo(true);
          this.currentHighlight = "Logo";
        } else {
          this.currentHighlight = "";
        }        
      }
    })
    // End of Code Adapted
  }

  

  updateLogo(input: boolean){
    var Logo = document.getElementsByClassName("Logo")[0];    
    if(input){
      Logo?.classList.add("LogoActive");
    } else {
      if (this.currentHighlight != "Logo"){
        Logo?.classList.remove("LogoActive");
      }
    }
  }

  userContainerUpdateBorder(input: boolean){
    var userContainer = document.getElementsByClassName("userContainer")[0];   
    if(input){
      userContainer?.classList.add("userContainerActive");
    } else {
      if (this.currentHighlight != "User"){
        userContainer?.classList.remove("userContainerActive");
      }
    }
  }

  updateSurveillanceContainer(input: boolean){
    var surveillanceContainer = document.getElementsByClassName("surveillanceContainer")[0]; 
    if(input){
      surveillanceContainer?.classList.add("middleContainerActive");
    } else {
      if (this.currentHighlight != "Surveillance"){
        surveillanceContainer?.classList.remove("middleContainerActive");
      }
    }
  }

  updateSupportContainer(input: boolean){
    var supportContainer = document.getElementsByClassName("supportContainer")[0];  
    if(input){
      supportContainer?.classList.add("middleContainerActive");
    } else {
      if (this.currentHighlight != "Support"){
        supportContainer?.classList.remove("middleContainerActive");
      }
    }
  }

  updateAboutContainer(input: boolean){
    var aboutContainer = document.getElementsByClassName("aboutContainer")[0]; 
    if(input){
      aboutContainer?.classList.add("middleContainerActive");
    } else {
      if (this.currentHighlight != "About"){
        aboutContainer?.classList.remove("middleContainerActive");
      }
    }
  }

  offEverything(){
    this.updateLogo(false);
    this.userContainerUpdateBorder(false);
    this.updateSurveillanceContainer(false);
    this.updateSupportContainer(false);
    this.updateAboutContainer(false);
  }

}
