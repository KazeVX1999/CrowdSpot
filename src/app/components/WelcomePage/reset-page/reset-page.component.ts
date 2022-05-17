import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CrowdSpotService } from 'src/app/components/Service/crowd-spot.service';
import { LoaderService } from '../../Loader/loader.service';

@Component({
  selector: 'app-reset-page',
  templateUrl: './reset-page.component.html',
  styleUrls: ['./reset-page.component.css']
})
export class ResetPageComponent implements OnInit {
  @Input() showResetPage: boolean = false;
  @Output() closeReset = new EventEmitter<boolean>();
  @Output() resetComplete = new EventEmitter<boolean>();

  constructor(public loaderService: LoaderService, private resetService: CrowdSpotService){  }

  resetProcess1Succeed: boolean = false;
  resetProcess2Succeed: boolean = false;
  resetProcess3Succeed: boolean = false;
  resetEmail: string = "";
  messageOK?: string;
  messageERR?: string;
  
  ngOnInit(): void {
    this.resetVar();
  }

  ngOnDestroy(): void{
    this.resetVar();
  }

  closeMessage(){
    this.messageOK = "";
    this.messageERR = "";
  }

  checkForm(){
    try{
      if (this.resetProcess3Succeed){
        return false;
      } else if (this.resetProcess1Succeed || this.resetProcess2Succeed){
        return true;
      } else{
        var userResetEmailInput = (<HTMLInputElement>document.getElementById("resetEmail")).value;
        if (userResetEmailInput != ""){
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

  updateResetButton(){
    // Check for 3rd Process
    if (this.resetProcess2Succeed){
      var passwordResetInput1 = (<HTMLInputElement>document.getElementById("passwordResetInput1"));
      var passwordResetInput2 = (<HTMLInputElement>document.getElementById("passwordResetInput2"));
      var submitButton = document.getElementsByClassName("resetSubmitButton")[0];
      if (passwordResetInput1 != null && passwordResetInput2 != null && submitButton != null){
        if (passwordResetInput1.validity.valid && passwordResetInput2.validity.valid){
          submitButton.classList.remove("disabledButton");
        } else {
          submitButton.classList.add("disabledButton");
        }
          
        var passwordLabel1 = document.getElementsByClassName("lightLabel")[0];
        if (passwordLabel1 != null){
          if (passwordResetInput1.validity.valid){
            passwordLabel1.innerHTML = "PASSWORD - VALID"
            passwordLabel1.classList.add("lightLabelGreen")
            passwordLabel1.classList.remove("lightLabelRed")          
          } else {
            if (passwordResetInput1.value == ""){
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

        var passwordLabel2 = document.getElementsByClassName("lightLabel")[1];
        if (passwordLabel2 != null){
          if (passwordResetInput2.value == passwordResetInput1.value && passwordResetInput1.value != ""){
            passwordLabel2.innerHTML = "CONFIRMATION PASSWORD - MATCHED"
            passwordLabel2.classList.add("lightLabelGreen")
            passwordLabel2.classList.remove("lightLabelRed")          
          } else {
            if (passwordResetInput2.value == ""){
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
    } else if (this.resetProcess1Succeed){
      // Check for 2nd Process
      var userResetCodeInput = (<HTMLInputElement>document.getElementById("resetCode"));
      var submitButton = document.getElementsByClassName("resetSubmitButton")[0];
      if (userResetCodeInput.value != "" && userResetCodeInput.validity.valid){
        submitButton.classList.remove("disabledButton");
      } else {
        submitButton.classList.add("disabledButton");
      }    
    } else if (this.resetProcess1Succeed == false){
      // Check for 1st Process
      var userResetEmailInput = (<HTMLInputElement>document.getElementById("resetEmail")).value;
      var submitButton = document.getElementsByClassName("resetSubmitButton")[0];
      if (userResetEmailInput != ""){
        submitButton.classList.remove("disabledButton");
      } else {
        submitButton.classList.add("disabledButton");
      }    
    }
}

  resetProcess1(){
    try{
      var userResetEmailInput = (<HTMLInputElement>document.getElementById("resetEmail")).value;
      this.resetService.ResetProcess1(userResetEmailInput).subscribe((result)=>{
        this.resetEmail = userResetEmailInput;
        this.resetProcess1Succeed = true;
        this.messageOK = result.body;
        this.messageERR = "";
      }, (requestError)=>{
        if (requestError.status == 0){
          this.messageERR = "- Server connection Failed -";
          this.messageOK = "";
        } else {
          this.messageERR = requestError.error;
          this.messageOK = "";
        }
      });
    } catch{

    }   
  }

  resendCode(){
    this.resetService.ResetProcess1(this.resetEmail).subscribe((result)=>{
      this.messageOK = "- New Code has been sent -";
      this.messageERR = "";
    }, (requestError)=>{
      if (requestError.status == 0){
        this.messageERR = "- Server connection Failed -";
        this.messageOK = "";
      } else {
        this.messageERR = requestError.error;
        this.messageOK = "";
      }
    });
  }

  resetProcess2(){
    try{
      var userResetCode = (<HTMLInputElement>document.getElementById("resetCode")).value.toUpperCase();
      this.resetService.ResetProcess2(this.resetEmail, userResetCode).subscribe((result)=>{
        this.resetProcess2Succeed = true;
        this.messageOK = result.body;
        this.messageERR = "";
      }, (requestError)=>{
        if (requestError.status == 0){
          this.messageERR = "- Server connection Failed -";
          this.messageOK = "";
        } else {
          this.messageERR = requestError.error;
          this.messageOK = "";
        }
      });
    } catch{

    }    
  }

  resetProcess3(){
    try{
      var passwordResetInput = (<HTMLInputElement>document.getElementById("passwordResetInput1")).value;
      this.resetService.ResetProcess3(this.resetEmail, passwordResetInput).subscribe((result)=>{
        this.resetProcess3Succeed = true;
        this.messageOK = result.body;
        this.messageERR = "";
      }, (requestError)=>{
        if (requestError.status == 0){
          this.messageERR = "- Server connection Failed -";
          this.messageOK = "";
        } else {
          this.messageERR = requestError.error;
          this.messageOK = "";
        }
      });
    } catch{          
    }    
  }

  completeProcess(){
    this.resetVar();
    this.resetComplete.emit(true);
  }

  resetVar(){
    this.resetProcess1Succeed = false;
    this.resetProcess2Succeed = false;
    this.resetProcess3Succeed = false;
    this.resetEmail = "";
    this.messageOK = "";
    this.messageERR = "";
  }

  closeResetFunc(){ 
    this.resetVar();
    this.closeReset.emit(false);    
  }
}
