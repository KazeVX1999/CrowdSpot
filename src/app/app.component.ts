import { ChangeDetectorRef, Component, EventEmitter, HostListener, Injectable, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CrowdSpotService } from './components/Service/crowd-spot.service';
import { User } from './DataClasses';
import { LoaderService } from './components/Loader/loader.service';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { __values } from 'tslib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', 
  './app.component.scss', 
  './app.componentWelcomePageCSS.css', 
  './app.componentOperatorPageCSS.css'],
  providers: [CrowdSpotService]
})

export class AppComponent implements OnInit{

  constructor(public loaderService: LoaderService, private logInService: CrowdSpotService, private router: Router, private route: ActivatedRoute){}
  title = 'CrowdSpot';
  user?: User;
  @ViewChild('logInPage', {static: false}) logInPageChild: any;
  @ViewChild('signUpPage', {static: false}) signUpPageChild: any;
  @ViewChild('resetPage', {static: false}) resetPageChild: any; 
  @ViewChild('supportPage', {static: false}) supportPageChild: any; 
  skipLoginAlert = false;

  stream: string | null | undefined;
  ngOnInit(): void{
    this.authenticateUser(); 
    var theSort = localStorage.getItem("sorter");
    if (theSort == null){
      localStorage.setItem("sorter", "1");
    } 

    var reset = localStorage.getItem("reset");
    if (reset != "no"){
      this.router.navigate(['']);
    } else {
      localStorage.setItem('reset', 'yes');
    }

    localStorage.setItem("pageOnline", "On");
    
    
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });

    var element = <HTMLElement>document.getElementsByClassName("loaderContainer")[0];
    
    
    

  }
  
  
  

  updateUserAuthentication(authenticationCode: string){
    localStorage.setItem('currentUser', authenticationCode); 
    this.authenticateUser();
    this.clickLoginPage = false;

  }

  authenticateUser(){
    var theCode = localStorage.getItem("currentUser");
    if (theCode == null || theCode == ""){
      // Do nothing
    } else {
      this.logInService.AutoLogin(theCode.toString()).subscribe((userFound)=>{
        this.user = userFound.body;
      }, (_errorRequest)=>{
        this.user = undefined;
      })
    }
  }

  // ---------- Alert before Refresh  ----------
  @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHandler(event: any) {
    window.scrollTo(0, 0);

    event.preventDefault();
    try{
      if (this.clickLoginPage && this.logInPageChild.checkForm() && this.skipLoginAlert == false){
        event.returnValue = "Alert";
      } else if (this.clickSignupPage && this.signUpPageChild.checkForm()){
        event.returnValue = "Alert";
      } else if (this.clickResetPage && this.resetPageChild.checkForm()){
        event.returnValue = "Alert";
      }
    } catch {
      
    }
    

  }

  // ---------- Pre-Loader Section  ----------
  @HostListener('window:load', ['$event'])
  
    loadHandler(){
      window.scrollTo(0, 0);

      var pageLoader = document.getElementById("pageLoader");
      
      if (pageLoader != null){
        pageLoader.style.display = "none";
      }



    }
  

  // ---------------  Welcome Page Section  ---------------
  clickLoginPage: boolean = false;
  clickSignupPage: boolean = false;
  clickResetPage: boolean = false;
  showSupportPage: boolean = false;
  showAboutPage: boolean = false;
  autoClickCounter: boolean = false;
  autoClickBypass: boolean = false;
  signUpProcessing: boolean = false;
  tempInput: boolean = false;
  tempPageNumber: number = 0;
  tempAlertPageNumber: number = 0;
  autoResetBypass: boolean = false;
  alertLabel: string = "";
  alertDescription1: string = "";
  alertDescription2: string = "";

  
  
  resetToLogin(){
    this.autoResetBypass = true;
    this.activatePage(true, 1);
  }

  
  // PageNumber, 0 = Logo, 1 = Login, 2 = Sign Up, 3 = Reset, 4 = Support, 5 = About.
  checkAlertPage(input: boolean, pageNumber: number){    
    // Check if Any Alert is needed to show first

    // Do nothing if same inputs (to counter some bug issue)
    if (this.clickLoginPage == input && pageNumber == 1){
      // Do nothing
    } else if (this.clickSignupPage == input && pageNumber == 2){
      // Do nothing
    } else if (this.clickResetPage == input && pageNumber == 3){
      // Do nothing

    } else {
      // Alert for Log In Page
      if (this.clickLoginPage && this.logInPageChild.checkForm()){
        // Show Alert
        this.tempInput = input;
        this.tempPageNumber = pageNumber;
        this.tempAlertPageNumber = 1;
        this.showAlertSignUp(true, this.tempAlertPageNumber);  

      // Alert for Sign Up Page
      } else if (this.clickSignupPage && this.signUpPageChild.checkForm()){
        // Show Alert
        this.tempInput = input;
        this.tempPageNumber = pageNumber;
        this.tempAlertPageNumber = 2;
        this.showAlertSignUp(true, this.tempAlertPageNumber);

      // Alert for Reset Page
      
      } else if (this.clickResetPage && this.resetPageChild.checkForm()){
        // Show Alert
        this.tempInput = input;
        this.tempPageNumber = pageNumber;
        this.tempAlertPageNumber = 3;
        this.showAlertSignUp(true, this.tempAlertPageNumber);    

      } else if (this.showSupportPage && this.supportPageChild.checkForm()){
        this.tempInput = input;
        this.tempPageNumber = pageNumber;
        this.tempAlertPageNumber = 4;
        this.showAlertSignUp(true, this.tempAlertPageNumber); 
      } else {
        // When no alerts required to show, proceed to click page.
        this.activatePage(input, pageNumber);
      }
    }
  }  

  activatePage(input: boolean, pageNumber: number){
    input = this.autoClickChecker(input);  
    this.resetTempVar();
    try{
      this.resetPageChild.resetVar();
      this.signUpPageChild.resetVar();
    } catch{

    }
    
    switch (pageNumber){
      case 0: // Logo
        this.clickLoginPage = false;
        this.clickSignupPage = false;
        this.clickResetPage = false;
        this.showSupportPage = false;
        this.showAboutPage = false;
        var welcomePage = document.getElementById("welcomePage");
        if (welcomePage != null){
          welcomePage.classList.remove("hide");
        }
        break;
      case 1: // Log In        
        this.clickLoginPage = input;
        this.clickSignupPage = false;
        this.clickResetPage = false; 
        this.showSupportPage = false;
        this.showAboutPage = false;
        var welcomePage = document.getElementById("welcomePage");
        if (welcomePage != null){
          welcomePage.classList.remove("hide");
        }
        break;
      case 2: // Sign Up     
        if (this.autoResetBypass){
          this.autoResetBypass = false;
        } else {
          this.clickLoginPage = false;
          this.clickSignupPage = input;
          this.clickResetPage = false;  
          this.showSupportPage = false;
          this.showAboutPage = false;
          var welcomePage = document.getElementById("welcomePage");
          if (welcomePage != null){
            welcomePage.classList.remove("hide");
          }
        }             
        break;
      case 3: // Reset        
      if (this.autoResetBypass){
        this.autoResetBypass = false;
      } else {
        this.clickLoginPage = false;
        this.clickSignupPage = false;
        this.clickResetPage = input;
        this.showSupportPage = false;
        this.showAboutPage = false;
        var welcomePage = document.getElementById("welcomePage");
        if (welcomePage != null){
          welcomePage.classList.remove("hide");
        }
      }
      break;
      case 4:
        this.clickLoginPage = false;
        this.clickSignupPage = false;
        this.clickResetPage = false;
        this.showSupportPage = input;
        this.showAboutPage = false;
        var welcomePage = document.getElementById("welcomePage");
        if (welcomePage != null){
          welcomePage.classList.add("hide");
        }
        break;
      case 5:
        this.clickLoginPage = false;
        this.clickSignupPage = false;
        this.clickResetPage = false;
        this.showSupportPage = false;
        this.showAboutPage = input;
        var welcomePage = document.getElementById("welcomePage");
        if (welcomePage != null){
          welcomePage.classList.add("hide");
        }
        break;
    }
    this.updateWelcomePage();
  }

  resetTempVar(){
    this.tempInput = false;
    this.tempPageNumber = 0;
    this.showAlertSignUp(false, this.tempAlertPageNumber);
    this.tempAlertPageNumber = 0;
  }
  
  updateLoginPage(){
    if (this.clickLoginPage == false){
      try{
        this.logInPageChild.message = "";
      } catch{
      }
  
    }
    try{
      var element = document.getElementsByClassName("LoginContainer")
      if (element != null){
        if (this.clickLoginPage == true){
          element[0].classList.add("LoginContainerActive");
        } else {
          element[0].classList.remove("LoginContainerActive");
        }
      }
    } catch {

    }
    
  }  

  updateSignUpPage(){
    if (this.clickSignupPage == false){
      try{
        this.signUpPageChild.message = "";
      } catch{
      }
    }
    try{
      var element = document.getElementsByClassName("SignUpContainer")
      if (element != null){
        if (this.clickSignupPage == true){
          element[0].classList.add("SignUpContainerActive");
        } else {
          element[0].classList.remove("SignUpContainerActive");
        }    
      }
    }catch{
      
    }
  }

  

  updateResetPage(){
    if (this.clickResetPage == false){
      try{
        this.resetPageChild.resetProcess1Succeed = false;
        this.resetPageChild.resetProcess2Succeed = false;
        this.resetPageChild.resetEmail = "";
        this.resetPageChild.message = "";
      } catch{
      }
          
    }
    try{
    var element = document.getElementsByClassName("ResetContainer")
    var element2 = document.getElementsByClassName("LogoContainerW")
    if (element != null && element2 != null){
      if (this.clickResetPage == true){
        element[0].classList.add("ResetContainerActive");
        element2[0].classList.add("LogoContainerActive");
      } else {
        element[0].classList.remove("ResetContainerActive");
        element2[0].classList.remove("LogoContainerActive");
      }    
    }
    }catch{

    }
  }
  
  clickedLogo(){
    this.clickLoginPage = false;
    this.clickSignupPage = false;
    this.clickResetPage = false;
    this.updateWelcomePage();
  }

  updateMiddlePage(){
    if (this.clickLoginPage){
      // Change Middle Container when Login Clicked

    } else if (this.clickSignupPage){
      // Change Middle Container when Sign Up Clicked

    } else if (this.clickResetPage){
      // Change Middle Container when Register Clicked

    } else {
      // Else Change Middle Container back to default
    }
    
  }

  updateWelcomePage(){
    this.updateMiddlePage();
    this.updateLoginPage();
    this.updateResetPage();
    this.updateSignUpPage();
  }

  autoClickChecker(input: boolean){
    /* -- ONLY NEEDED WHEN FALSE ARE CALLED --
    To fix issue where when the CHILD Component Emit Output "False"
    after that the app-root recognized that False but then will also 
    automatically call the clickedPages(input as true) again, this solution
    is to counter this auto clickpage which causes the pages to stay TRUE the whole time.
    */

    // Input False/Close Incoming = Counter +1
    if (input == false && this.autoClickCounter == false && this.autoClickBypass == false){
      this.autoClickCounter = true;            
    }

    // If Input True and Counter =1, input remains false and reset counter
    // Auto click page counter
    if (input == true && this.autoClickCounter == true){
      this.autoClickCounter = false;
      input = false;
    } 
    return input
  }

  showAlertSignUp(input: boolean, pageAlert: number){
    switch (pageAlert){ 
      case 1:
        this.alertLabel = "LOG IN - CANCELLATION";
        this.alertDescription1 = "Confirm to close the Log In Form?"
        this.alertDescription2 = "*If closed, you will have to re-fill in the form next time you logging in.*"
        break;
      case 2:
        this.alertLabel = "SIGN UP - CANCELLATION";
        this.alertDescription1 = "Confirm to close the Sign Up Form?"
        this.alertDescription2 = "*If closed, you will have to re-fill in the form next time you signing up*"
        break;
      case 3:  
        this.alertLabel = "Reset Password - CANCELLATION";
        this.alertDescription1 = "Confirm to close the Reset Form?"
        this.alertDescription2 = "*If closed, you will have to re-fill in the form next time you resetting your account.*"
        break;
      case 4:  
        this.alertLabel = "SUPPORT ENQUIRY - CANCELLATION";
        this.alertDescription1 = "Confirm to close the Support Form?"
        this.alertDescription2 = "*If closed, you will have to re-fill in the form next time.*"
        break;
    }
    var element = document.getElementsByClassName("alert");
    if (element != null){
      if (input){
        element[0].classList.add("alertActive");  
        this.autoClickBypass = true;
      } else {
        element[0].classList.remove("alertActive");   
        this.autoClickBypass = false;

      }
    }
    
  }

  logoEmitterFunction(input: boolean){
    if (!input){
      window.scrollTo(0, 0);
      this.checkAlertPage(true, 0);
    }    
  }

  accountEmitterFunction(input: boolean){
    if (!input){
      window.scrollTo(0, 0);
      this.checkAlertPage(true, 1);
      this.logInPageChild.message = "- Login are required -";  
    }
  }
  surveillanceEmitterFunction(input: boolean){
    if (!input){
      window.scrollTo(0, 0);
      this.checkAlertPage(true, 1);
      this.logInPageChild.message = "- Login are required -"; 
    }
  }

  supportEmitterFunction(input: boolean){
    if (!input){
      window.scroll(0, 0);
      this.checkAlertPage(true, 4);
    }
  }

  closeSupportAbout(){
    window.scroll(0, 0);
    this.checkAlertPage(true, 0);
  }

  aboutEmitterFunction(input: boolean){
    if (!input){
      window.scroll(0, 0);
      this.checkAlertPage(true, 5);
    }
  }

  
    


}
function ngOnInit() {
  throw new Error('Function not implemented.');
}

