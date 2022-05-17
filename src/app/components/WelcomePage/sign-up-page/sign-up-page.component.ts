import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { CrowdSpotService } from 'src/app/components/Service/crowd-spot.service';
import { LoaderService } from '../../Loader/loader.service';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.css']
})
export class SignUpPageComponent implements OnInit {
  @Input() showSignUpPage: boolean = false;
  @Output() closeSignUp = new EventEmitter<boolean>();
  @Output() signUpComplete = new EventEmitter<boolean>();

  signUpProcess1Succeed: boolean = false;
  signUpProcess2Succeed: boolean = false;
  signUpEmail: string = "";
  messageOK?: string;
  messageERR?: string;
  constructor(public loaderService: LoaderService, private signUpService: CrowdSpotService){  }

  ngOnInit(): void {    
    this.resetVar();
  }
  
  ngOnDestroy(){
    this.resetVar();
  }

  closeMessage(){
    this.messageOK = "";
    this.messageERR = "";
  }

  updateSubmitButton(){
    if (this.signUpProcess1Succeed == false && this.signUpProcess2Succeed == false){
      var emailSignUp = (<HTMLInputElement>document.getElementById("emailSignUpInput"));
      var passwordSignUp1 = (<HTMLInputElement>document.getElementById("passwordSignUpInput1"));
      var passwordSignUp2 = (<HTMLInputElement>document.getElementById("passwordSignUpInput2"));
      var submitButton = document.getElementsByClassName("submitSignUpButton")[0];
      if (emailSignUp != null && passwordSignUp1 != null && passwordSignUp2 != null && submitButton != null){
        if (emailSignUp.validity.valid && passwordSignUp1.validity.valid && passwordSignUp2.validity.valid){
          submitButton.classList.remove("disabledButton");
        } else {
          submitButton.classList.add("disabledButton");
        }
        
        var passwordLabel1 = document.getElementsByClassName("lightLabel")[1];
        if (passwordLabel1 != null){
          if (passwordSignUp1.validity.valid){
            passwordLabel1.innerHTML = "PASSWORD - VALID"
            passwordLabel1.classList.add("lightLabelGreen")
            passwordLabel1.classList.remove("lightLabelRed")          
          } else {
            if (passwordSignUp1.value == ""){
              passwordLabel1.innerHTML = "PASSWORD"
              passwordLabel1.classList.remove("lightLabelRed")
              passwordLabel1.classList.remove("lightLabelGreen")
            } else {
              passwordLabel1.innerHTML = "PASSWORD - INVALID"
              passwordLabel1.classList.add("lightLabelRed")
              passwordLabel1.classList.remove("lightLabelGreen")
            }          
          }
        }
  
        var passwordLabel2 = document.getElementsByClassName("lightLabel")[2];
        if (passwordLabel2 != null){
          if (passwordSignUp2.value == passwordSignUp1.value && passwordSignUp1.value != ""){
            passwordLabel2.innerHTML = "CONFIRMATION PASSWORD - MATCHED"
            passwordLabel2.classList.add("lightLabelGreen")
            passwordLabel2.classList.remove("lightLabelRed")          
          } else {
            if (passwordSignUp2.value == ""){
              passwordLabel2.innerHTML = "CONFIRMATION PASSWORD"
              passwordLabel2.classList.remove("lightLabelRed")
              passwordLabel2.classList.remove("lightLabelGreen")
            } else {
              passwordLabel2.innerHTML = "CONFIRMATION PASSWORD - NOT MATCHED"
              passwordLabel2.classList.add("lightLabelRed")
              passwordLabel2.classList.remove("lightLabelGreen")
            }          
          }
        }
      }
    } else if (this.signUpProcess1Succeed && this.signUpProcess2Succeed == false){
      var codeInput = (<HTMLInputElement>document.getElementById("validateCode"));
      var submitButton = document.getElementsByClassName("submitSignUpButton")[0];
      if (codeInput.validity.valid){
        submitButton.classList.remove("disabledButton");
      } else {
        submitButton.classList.add("disabledButton");
      }
    }  
  }

  signUpProcess1(){
    var emailSignUp = (<HTMLInputElement>document.getElementById("emailSignUpInput")).value;
    var passwordSignUp2 = (<HTMLInputElement>document.getElementById("passwordSignUpInput2")).value;
    this.signUpService.SignUpProcess1(emailSignUp, passwordSignUp2).subscribe((requestSuccess)=>{
      this.signUpProcess1Succeed = true;
      this.signUpEmail = emailSignUp;
      this.messageOK = requestSuccess.body;
      this.messageERR = "";
    }, (requestError)=>{
      if (requestError.status == 0){
        this.messageERR = "- Server connection Failed -";
        this.messageOK = "";
      } else {
        this.messageERR = requestError.error;
        this.messageOK = "";
      }
    })    
  }

  signUpProcess2(){
    try{
      var validateCode = (<HTMLInputElement>document.getElementById("validateCode")).value;
      this.signUpService.SignUpProcess2(this.signUpEmail, validateCode).subscribe((requestSuccess)=>{
        this.signUpProcess2Succeed = true;
        this.messageOK = requestSuccess.body;
        this.messageERR = "";
      }, (requestError)=>{
        if (requestError.status == 0){
          this.messageERR = "- Server connection Failed -";
          this.messageOK = "";
        } else {
          this.messageERR = requestError.error;
          this.messageOK = "";
        }
      })    
    } catch{

    }    
  }

  resendCode(){
    this.signUpService.SignUpResendCode(this.signUpEmail).subscribe((requestSucceed)=>{
      this.messageOK = requestSucceed.body;
      this.messageERR = "";
    }, (requestError)=>{
      if (requestError.status == 0){
        this.messageERR = "- Server connection Failed -";
        this.messageOK = "";
      } else {
        this.messageERR = requestError.error;
        this.messageOK = "";
      }
    })
  }

  checkForm(){
    try{
      if (this.signUpProcess2Succeed){
        return false;
      } else if (this.signUpProcess1Succeed){
        return true;
      } else {
        var userSignUpEmailInput = (<HTMLInputElement>document.getElementById("emailSignUpInput")).value;
        var userPasswordSignUpInput1 = (<HTMLInputElement>document.getElementById("passwordSignUpInput1")).value;
        var userPasswordSignUpInput2 = (<HTMLInputElement>document.getElementById("passwordSignUpInput2")).value;
        if (userSignUpEmailInput != "" || userPasswordSignUpInput1 != "" || userPasswordSignUpInput2 != ""){
          // Return True if any one of the input is filled.
          return true;
        } else {
          return false;
        }   
      }      
    } catch {
      return false;
    }
    
  }

  completeProcess(){
    this.resetVar();
    this.signUpComplete.emit(true);
  }

  resetVar(){
    this.signUpProcess1Succeed = false;
    this.signUpProcess2Succeed = false;
    this.signUpEmail = "";
    this.messageOK = "";
    this.messageERR = "";
  }

  closeSignUpFunc(){ 
    this.resetVar();
    this.closeSignUp.emit(false);    
  }

  
}
