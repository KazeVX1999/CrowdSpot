import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Observable } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { CrowdSpotService } from 'src/app/components/Service/crowd-spot.service';
import { User } from 'src/app/DataClasses';
import { LoaderService } from '../../Loader/loader.service';
@Component({
  selector: 'app-log-in-page',
  templateUrl: './log-in-page.component.html',
  styleUrls: ['./log-in-page.component.css'],
  providers: [CrowdSpotService]
})
export class LogInPageComponent implements OnInit {
  @Input() showLoginPage: boolean = false;
  @Output() closeLogin = new EventEmitter<boolean>();
  @Output() userLoggedIn = new EventEmitter<number>();
  @Output() userLogin = new EventEmitter<string>();
  message?: string;
  constructor(public loaderService: LoaderService, private logInService: CrowdSpotService){  }

  ngOnInit(): void {    
    this.message = "";
  }
  
  ngOnDestroy(){
    this.message = "";
  }

  closeMessage(){
    this.message = "";
  }


  updateButton(){
    var userForm = (<HTMLFormElement>document.getElementById("LoginForm"));
    var submitButton = document.getElementsByClassName("submitLoginButton")[0];
    if (userForm.checkValidity()){
      submitButton.classList.remove("disabledButton");
    } else {
      submitButton.classList.add("disabledButton");
    }
  }

  
  submit(){
    var userLoginEmailInput = (<HTMLInputElement>document.getElementById("emailLoginInput")).value;
    var userPasswordLoginInput = (<HTMLInputElement>document.getElementById("passwordLoginInput")).value;
    this.logInService.LogIn(userLoginEmailInput, userPasswordLoginInput).subscribe((requestSucceed)=>{
      this.showLoginPage = false;
      this.userLogin.emit(requestSucceed.body); 
      }, (requestError)=>{
        if (requestError.status == 0){
          this.message = "- Server connection Failed -";
        } else {
          this.message = requestError.error;
        }
      }
    );
  }
    //this.userLoggedIn.emit(theUser);
  

  checkForm(){
    try{
      var userLoginEmailInput = (<HTMLInputElement>document.getElementById("emailLoginInput")).value;
      var userPasswordLoginInput = (<HTMLInputElement>document.getElementById("passwordLoginInput")).value;
      if (userLoginEmailInput != "" || userPasswordLoginInput != ""){
        // Return True if any one of the input is filled.
        return true;
      } else {
        return false;
      }   
    } catch {
      return false;
    }
    
  }

  closeLoginFunc(){
    this.closeLogin.emit(false);
  }

  
  
    
}
