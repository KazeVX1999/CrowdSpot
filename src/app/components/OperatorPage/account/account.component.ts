import { Component, Input, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { User } from 'src/app/DataClasses';
import { CrowdSpotService } from '../../Service/crowd-spot.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  @Input() userAuthorized?: User = undefined;
  messageOK?: string = "";
  messageERR?: string = "";
  constructor(public app: AppComponent, private service: CrowdSpotService) { }

  ngOnInit(): void {
    this.userAuthorized = this.app.user;    
  }

  logOut(){
    localStorage.removeItem('currentUser');
    this.app.user = undefined;    
  }

  clickUpdateChangePasswordContainer(){
    var currentPassword = (<HTMLInputElement>document.getElementById("currentPassword"));
    var passwordSignUp1 = (<HTMLInputElement>document.getElementById("password1"));
    var passwordSignUp2 = (<HTMLInputElement>document.getElementById("password2"));
    currentPassword.value = "";
    passwordSignUp1.value = "";
    passwordSignUp2.value = "";
    var passwordLabel1 = document.getElementsByClassName("lightLabel")[0];
    var passwordLabel2 = document.getElementsByClassName("lightLabel")[1];
    passwordLabel1.innerHTML = "NEW PASSWORD"
    passwordLabel1.classList.remove("lightLabelRed")
    passwordLabel1.classList.remove("lightLabelGreen")
    passwordLabel2.innerHTML = "CONFIRMATION NEW PASSWORD"
    passwordLabel2.classList.remove("lightLabelRed")
    passwordLabel2.classList.remove("lightLabelGreen")
  
    
    var clickToShow = document.getElementsByClassName("clickToShow")[0];
    var clickLabel = document.getElementsByClassName("clickLabel")[0];
    var changePassword = document.getElementsByClassName("changePassword")[0];

    clickToShow.classList.toggle("clickToShowActive");
    clickLabel.classList.toggle("clickLabelActive");
    changePassword.classList.toggle("changePasswordActive");

    
  }

  changePasswordAPI(){    
    var currentPassword = (<HTMLInputElement>document.getElementById("currentPassword")).value;
    var passwordSignUp1 = (<HTMLInputElement>document.getElementById("password1")).value;
    var passwordSignUp2 = (<HTMLInputElement>document.getElementById("password2")).value;
    this.service.ChangePassword(this.userAuthorized?.userID, currentPassword, passwordSignUp2).subscribe((succeed)=>{
      this.messageOK = succeed.body;
      this.messageERR = "";
      currentPassword = '';
      passwordSignUp1 = '';
      passwordSignUp2 = '';
      this.updateSubmitButton();     
    }, (reqError)=>{
      if (reqError.status == 0){
        this.messageERR = "- Server connection Failed -";
        this.messageOK = "";
      } else {
        this.messageERR = reqError.error;
        this.messageOK = "";
      }
    })
  }

  updateSubmitButton(){
    var currentPassword = (<HTMLInputElement>document.getElementById("currentPassword"));
    var passwordSignUp1 = (<HTMLInputElement>document.getElementById("password1"));
    var passwordSignUp2 = (<HTMLInputElement>document.getElementById("password2"));
    var submitButton = document.getElementsByClassName("submitButton")[0];
    if (currentPassword != null && passwordSignUp1 != null && passwordSignUp2 != null && submitButton != null){
      if (currentPassword.validity.valid && passwordSignUp1.validity.valid && passwordSignUp2.validity.valid){
        submitButton.classList.remove("disabledButton");
      } else {
        submitButton.classList.add("disabledButton");
      }
        
      var passwordLabel1 = document.getElementsByClassName("lightLabel")[0];
      if (passwordLabel1 != null){
        if (passwordSignUp1.validity.valid){
          passwordLabel1.innerHTML = "NEW PASSWORD - VALID"
          passwordLabel1.classList.add("lightLabelGreen")
          passwordLabel1.classList.remove("lightLabelRed")          
        } else {
          if (passwordSignUp1.value == ""){
            passwordLabel1.innerHTML = "NEW PASSWORD"
            passwordLabel1.classList.remove("lightLabelRed")
            passwordLabel1.classList.remove("lightLabelGreen")
          } else {
            passwordLabel1.innerHTML = "NEW PASSWORD - INVALID"
            passwordLabel1.classList.add("lightLabelRed")
            passwordLabel1.classList.remove("lightLabelGreen")
          }          
        }
      }
  
      var passwordLabel2 = document.getElementsByClassName("lightLabel")[1];
      if (passwordLabel2 != null){
        if (passwordSignUp2.value == passwordSignUp1.value && passwordSignUp1.value != ""){
          passwordLabel2.innerHTML = "CONFIRMATION NEW PASSWORD - MATCHED"
          passwordLabel2.classList.add("lightLabelGreen")
          passwordLabel2.classList.remove("lightLabelRed")          
        } else {
          if (passwordSignUp2.value == ""){
            passwordLabel2.innerHTML = "CONFIRMATION NEW PASSWORD"
            passwordLabel2.classList.remove("lightLabelRed")
            passwordLabel2.classList.remove("lightLabelGreen")
          } else {
            passwordLabel2.innerHTML = "CONFIRMATION NEW PASSWORD - NOT MATCHED"
            passwordLabel2.classList.add("lightLabelRed")
            passwordLabel2.classList.remove("lightLabelGreen")
          }          
        }
      }
    }
    
  }

  showLogOutFinalContainer(){
    var finalLogOut = document.getElementsByClassName("finalLogOut")[0];
    var finalBG = document.getElementsByClassName("finalBG")[0];
    finalLogOut.classList.add("finalLogOutActive");
    finalBG.classList.add("finalBGActive");
    var clickToShow = document.getElementsByClassName("clickToShow")[0];
    var clickLabel = document.getElementsByClassName("clickLabel")[0];
    var changePassword = document.getElementsByClassName("changePassword")[0];
    clickToShow.classList.remove("clickToShowActive");
    clickLabel.classList.remove("clickLabelActive");
    changePassword.classList.remove("changePasswordActive");
    window.scrollTo(0, 0);
  }

  closeLogOutFinalContainer(){
    var finalLogOut = document.getElementsByClassName("finalLogOut")[0];
    var finalBG = document.getElementsByClassName("finalBG")[0];
    finalLogOut.classList.remove("finalLogOutActive");
    finalBG.classList.remove("finalBGActive");
  }

}
