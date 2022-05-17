import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { User } from 'src/app/DataClasses';
import { LoaderService } from '../Loader/loader.service';
import { CrowdSpotService } from '../Service/crowd-spot.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {
  @Input() userAuthorized?: User = undefined;
  @Output() backEmitter = new EventEmitter<boolean>();
  messageOK?: string = "";
  messageERR?: string = "";
  constructor(public loaderService: LoaderService, private enquiryService: CrowdSpotService, public app: AppComponent) { }

  ngOnInit(): void {
    this.userAuthorized = this.app.user;    
  }

  closeMessage(){
    this.messageOK = "";
    this.messageERR = "";
  }

  backToMainWelcomePage(){
    this.backEmitter.emit(true);
  }

  updateSubmitButton(){
    if (this.userAuthorized == undefined){
      var emailSupport = (<HTMLInputElement>document.getElementById("emailWelcomeSupport"));
      var subjectSupport = (<HTMLInputElement>document.getElementById("subjectWelcomeSupport"));
      var submitButton = document.getElementsByClassName("submitLoginButton")[0];
      if (emailSupport.validity.valid && subjectSupport.value != ""){
        submitButton.classList.remove("disabledButton");
      } else {
        submitButton.classList.add("disabledButton");
      }
    } else {
      var emailSupport = (<HTMLInputElement>document.getElementById("emailOperatorSupport"));
      var subjectSupport = (<HTMLInputElement>document.getElementById("subjectOperatorSupport"));
      var submitButton = document.getElementsByClassName("submitLoginButton")[0];
      if (emailSupport.validity.valid && subjectSupport.value != ""){
        submitButton.classList.remove("disabledButton");
      } else {
        submitButton.classList.add("disabledButton");
      }
    }
  }

  checkForm(){
    try{
      if (this.userAuthorized == undefined || null){
        var userEmail = (<HTMLInputElement>document.getElementById("emailWelcomeSupport"));
        var subjectSupport = (<HTMLInputElement>document.getElementById("subjectWelcomeSupport"));
        var userMessage = (<HTMLInputElement>document.getElementById("messageWelcomeSupport"));
        if (userEmail.value != "" || subjectSupport.value != "" || userMessage.value != "" ){
          return true;
        } else {
          return false;
        }
      } else{
        var userEmail = (<HTMLInputElement>document.getElementById("emailOperatorSupport"));
        var subjectSupport = (<HTMLInputElement>document.getElementById("subjectOperatorSupport"));
        var userMessage = (<HTMLInputElement>document.getElementById("messageOperatorSupport"));
        if (userEmail.value != "" || subjectSupport.value != "" || userMessage.value != ""){
          return true;
        } else {
          return false;
        }
      }
    }catch{
      return false;
    }
    
  }

  submit(){
    if (this.userAuthorized == undefined){
      var emailSupport = (<HTMLInputElement>document.getElementById("emailWelcomeSupport"));
      var subjectSupport = (<HTMLInputElement>document.getElementById("subjectWelcomeSupport"));
      var userMessage = (<HTMLInputElement>document.getElementById("messageWelcomeSupport"));
      this.enquiryService.UserEnquiry(emailSupport.value, subjectSupport.value, userMessage.value).subscribe((requestSucceed)=>{
        this.messageOK = requestSucceed.body;
        this.messageERR = "";
        emailSupport.value = '';
        subjectSupport.value = '';
        userMessage.value = '';
        this.updateSubmitButton()      
      }, (requestError)=>{
        if (requestError.status == 0){
          this.messageERR = "- Server connection Failed -";
          this.messageOK = "";
        } else {
          this.messageERR = requestError.error;
          this.messageOK = "";
        }
      });
    } else {
      var emailSupport = (<HTMLInputElement>document.getElementById("emailOperatorSupport"));
      var subjectSupport = (<HTMLInputElement>document.getElementById("subjectOperatorSupport"));
      var userMessage = (<HTMLInputElement>document.getElementById("messageOperatorSupport"));
      this.enquiryService.UserEnquiry(emailSupport.value, subjectSupport.value, userMessage.value).subscribe((requestSucceed)=>{
        this.messageOK = requestSucceed.body;
        this.messageERR = "";
        subjectSupport.value = '';
        userMessage.value = '';
        this.updateSubmitButton()
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
  }
}
