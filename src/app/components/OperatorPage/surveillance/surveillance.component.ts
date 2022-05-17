import { Component, Injectable, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { User, UserLocationSurveillanceTables } from 'src/app/DataClasses';
import { LoaderService } from '../../Loader/loader.service';
import { CrowdSpotService } from '../../Service/crowd-spot.service';
import { SorterComponent } from '../sorter/sorter.component';

@Component({
  selector: 'app-surveillance',
  templateUrl: './surveillance.component.html',
  styleUrls: ['./surveillance.component.css']
})
export class SurveillanceComponent implements OnInit {

  @Input() userAuthorized?: User = undefined;
  messageOK?: string = "";
  messageERR?: string = "";
  messageOKADD?: string = "";
  messageERRADD?: string = "";
  userLocations?: any[];
  messageReceived?: string;
  constructor(public app: AppComponent, private service: CrowdSpotService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.userAuthorized = this.app.user;
    this.route.paramMap.subscribe( params =>
      this.messageReceived = params.get('message')!
    )  
    if (this.messageReceived != "0"){
      this.messageOK = "- " + this.messageReceived + " has successfully been removed -"
    }
    this.refreshLocations();

    setInterval(() =>{
      var pageOnline = localStorage.getItem("pageOnline"); 
      if (pageOnline == "On" && this.userLocations?.length != 0){
        this.refreshLocations();
      }
    }, 3000); 
    
    var theSort = localStorage.getItem("sorter");
    if (theSort == null){
      localStorage.setItem("sorter", "1");
    }       

  }

  ngOnDestroy(){
    this.userLocations = [];
  }
  
  refreshLocations(){
    var updatedSort: any = localStorage.getItem("sorter"); 
    this.service.RefreshLocations(this.userAuthorized?.userID, updatedSort).subscribe((reqSucceed)=>{
      this.userLocations = reqSucceed.body;      
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

  
  AddPopUp(){
    var MainContainer = (<HTMLElement>document.getElementById("MainContainer"));
    var popup = (<HTMLElement>document.getElementsByClassName("AddPopUpBG")[0]);
    var AddPopUpContainer = (<HTMLElement>document.getElementsByClassName("AddPopUpContainer")[0]);
    popup.style.height = MainContainer.offsetHeight + "px";
    popup.classList.add("AddPopUpBGActive"); 
    AddPopUpContainer.classList.add("AddPopUpContainerActive"); 
    this.messageOKADD = "";
    this.messageERRADD = "";
    window.scrollTo(0,0);
  }

  turnOffAdd(){
    try{
      var locationName = (<HTMLInputElement>document.getElementById("locationName"));
      var locationDescription = (<HTMLInputElement>document.getElementById("locationDescription"));
      locationName.value = '';
      locationDescription.value = '';
      var popup = document.getElementsByClassName("AddPopUpBG")[0];
      var AddPopUpContainer = document.getElementsByClassName("AddPopUpContainer")[0];
      popup.classList.remove("AddPopUpBGActive"); 
      AddPopUpContainer.classList.remove("AddPopUpContainerActive"); 
      this.messageOKADD = "";
      this.messageERRADD = "";   
    } catch{

    } 
    
  }

  updateSubmitADDButton(){
    var locationName = (<HTMLInputElement>document.getElementById("locationName")).value;
    var buttonAdd = document.getElementsByClassName("buttonAdd")[0];
    if (locationName != ""){
      buttonAdd.classList.remove("disabled");
    } else {
      buttonAdd.classList.add("disabled");
    }
  }

  addNewLocationAPI(){
    var userTempID = this.userAuthorized?.userID;
    var locationName = (<HTMLInputElement>document.getElementById("locationName"));
    var locationDescription = (<HTMLInputElement>document.getElementById("locationDescription"));
    if (locationDescription.value == "" || locationDescription.value == null){
      locationDescription.value = "...";
    }
    this.service.AddNewLocation(userTempID, locationName.value, locationDescription.value).subscribe((succeedReq)=>{
      this.messageOKADD = succeedReq.body;
      this.refreshLocations();
      this.messageERRADD = "";
      locationName.value = '';
      locationDescription.value = '';
      this.updateSubmitADDButton()
    }, (errorReq)=>{
      if (errorReq.status == 0){
        this.messageERRADD = "- Server connection Failed -";
        this.messageOKADD = "";
      } else {
        this.messageERRADD = errorReq.error;
        this.messageOKADD = "";
      }
    })
  }

  SurveillanceDataLabelAnimation(theOne: number, run: boolean){
    try{      
      var name = (<HTMLElement>document.getElementsByClassName("surveillanceName")[theOne]);
      var nameContainer = (<HTMLElement>document.getElementsByClassName("surveillanceNameContainer")[theOne]);
      var desc = (<HTMLElement>document.getElementsByClassName("surveillanceDescription")[theOne]);
      var descContainer = (<HTMLElement>document.getElementsByClassName("surveillanceBottomContainer")[theOne]);
      name.style.overflow = "visible";
      desc.style.overflow = "visible";
      name.style.width = "max-content";
      desc.style.width = "max-content";
      var nameWidth = name.offsetWidth * -1 + (nameContainer.offsetWidth * 60 / 100 );
      var descWidth = desc.offsetWidth * -1 + 300;

      // Code Adapted from developer.mozilla.org, n.d.
      if (name.offsetWidth > nameContainer.offsetWidth){
        var nameTiming = (name.offsetWidth * 0.6 / 100) * 1000
        var nameAnimator = name.animate([
          { left: "0"},
          { left: +nameWidth+"px"}]
        , 
        {duration: nameTiming, 
        iterations: Infinity,
        direction: 'alternate'
        });     
        if (!run){
          nameAnimator.pause();
          name.style.overflow = "hidden";
          name.style.left = "0";
          name.style.width = "auto";
        }
      }


      if (desc.offsetWidth > descContainer.offsetWidth){
        var descTiming = (desc.offsetWidth * 0.6 / 100) * 1000
        var descAnimator = desc.animate([
          { left: "0"},
          { left: +descWidth+"px"}]
        , 
        {duration: descTiming, 
        iterations: Infinity,
        direction: 'alternate'
        });     
        if (!run){
          descAnimator.pause();
          desc.style.overflow = "hidden";
          desc.style.left = "0";
          desc.style.width = "auto";
        }
      }
    } catch{
      
    }
  }

  closeMessage(){
    this.messageOK = "";
    this.messageERR = "";
  }

  closeAddMessage(){
    this.messageOKADD = "";
    this.messageERRADD = "";
  }

}
