import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { User, UserCameraTables, UserLocationSurveillanceTables } from 'src/app/DataClasses';
import { CrowdSpotService } from '../../Service/crowd-spot.service';
import { Location } from '@angular/common';
declare function generateChart(theGraphElement: any, locationName: string, peopleCount: any, Time: any, day: any): any;

@Component({
  selector: 'app-surveillance-setting',
  templateUrl: './surveillance-setting.component.html',
  styleUrls: ['./surveillance-setting.component.css']
})
export class SurveillanceSettingComponent implements OnInit {
  @Input() userAuthorized?: User = undefined;
  messageOK?: string = "";
  messageERR?: string = "";
  messageOKADD?: string = "";
  messageERRADD?: string = "";
  messageERRDEL?: string = "";
  messageSend?: string;

  topToggled: boolean = false;
  nameFocus?: boolean = false;
  @Input() locationID?: number | null;
  theLocation?: [UserLocationSurveillanceTables, number, number, number] = undefined;
  theCamera?: UserCameraTables[];
  count: number = 3;
  currentLocationName: any = "";
  currentLocationDesc: any = "";
  currentPeopleCount: any = "";
  messageReceived?: string;
  loadAPI: Promise<any> | undefined;
  currentShowGraph: number = 0;
  timeForGraph = [];
  locationRecordExtraction: any | undefined = [];

  constructor(public app: AppComponent, private service: CrowdSpotService, private route: ActivatedRoute, private _location: Location, private router: Router) { }

  ngOnInit(): void {
    this.userAuthorized = this.app.user;
    this.route.paramMap.subscribe( params =>
      this.locationID = +params.get('locationID')!
    )
    var theSort = localStorage.getItem("sorterCamera");
    if (theSort == null){
      localStorage.setItem("sorterCamera", "1");
    }   
    this.route.paramMap.subscribe( params =>
      this.messageReceived = params.get('message')!
    )  
    if (this.messageReceived != "0"){
      this.messageOK = "- " + this.messageReceived + " has successfully been removed -"
    }
    this.updatePage();    
    setInterval(() =>{
      var pageOnline = localStorage.getItem("pageOnline"); 
      if (pageOnline == "On" && this.theCamera?.length != 0){
        this.refreshCameras();   
      }
    }, 3000); 

    this.loadAPI = new Promise((resolve)=>{
      let node = document.createElement('script');
      node.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js';
      node.type = 'text/javascript';
      node.async = true;
      document.getElementsByTagName('head')[0].appendChild(node);
    })

    this.loadAPI = new Promise((resolve)=>{
      let node = document.createElement('script');
      node.src = "https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.bundle.min.js";
      node.type = 'text/javascript';
      node.async = true;
      document.getElementsByTagName('head')[0].appendChild(node);
    })
  }

  ngOnDestroy(){
    this.theCamera = [];
  }

  showLocationSetting(){
    this.updateSurveillance();
    var surveillanceTopContainer = document.getElementsByClassName("surveillanceTopContainer")[0];
    var surveillanceTopController = document.getElementsByClassName("surveillanceTopController")[0];
    var surveillanceTopControllerLabel1 = document.getElementsByClassName("surveillanceTopControllerLabel1")[0];
    var surveillanceTopControllerLabel2 = document.getElementsByClassName("surveillanceTopControllerLabel2")[0];
    var surveillanceTopControllerArrow = document.getElementsByClassName("surveillanceTopControllerArrow")[0];
    surveillanceTopContainer.classList.toggle("surveillanceTopContainerActive");
    surveillanceTopController.classList.toggle("surveillanceTopControllerActive");
    surveillanceTopControllerLabel1.classList.toggle("surveillanceTopControllerLabel1Active");
    surveillanceTopControllerLabel2.classList.toggle("surveillanceTopControllerLabel2Active");
    surveillanceTopControllerArrow.classList.toggle("surveillanceTopControllerArrowActive");

    if (this.topToggled){
      var removeButton = document.getElementsByClassName("removeContainer")[0];
      var removeWP = document.getElementsByClassName("removeWP")[0];
      var counter = (<HTMLElement>document.getElementsByClassName("counter")[0]);
      removeButton.classList.add("disabledButton");
      removeWP.classList.add("disabledWP");
      counter.style.display = "block";
      this.topToggled = false;
    } else {
      this.topToggled = true;
      this.count = 3;
      // Code Adapted from Тимофей Сосновский, 2020; Nimer Esam, 2019.
      var timer = setInterval(() =>{
        this.count -= 1;
      }, 1000);    
      // End of Code Adapted.

      setTimeout(()=>{
          clearInterval(timer);
          var removeButton = document.getElementsByClassName("removeContainer")[0];
          var removeWP = document.getElementsByClassName("removeWP")[0];
          var counter = (<HTMLElement>document.getElementsByClassName("counter")[0]);
          removeButton.classList.remove("disabledButton");
          removeWP.classList.remove("disabledWP");
          counter.style.display ="none";
      }, 3000);
    }
    
  }


    
  // Code Adapted from K. Vaishnav, 2020; A. Sasson, 2016
  goBack(){
    this._location.back();
  }
  // End of Code Adapted

  preventEmptyInputSave(){
    var surveillanceName = (<HTMLInputElement>document.getElementById("surveillanceName")).value;
    var surveillanceDesc = (<HTMLInputElement>document.getElementById("surveillanceDesc")).value;
    var saveButton = document.getElementsByClassName("saveContainer")[0];
    var saveWP = document.getElementsByClassName("saveWP")[0];
  
    if (surveillanceName != ""){
      if (surveillanceName != this.currentLocationName || surveillanceDesc != this.currentLocationDesc){
        saveButton.classList.remove("disabledButton");
        saveWP.classList.remove("disabledWP");
      }else {
        saveButton.classList.add("disabledButton");
        saveWP.classList.add("disabledWP");
      }      
    } else {
      saveButton.classList.add("disabledButton");
      saveWP.classList.add("disabledWP");
    }
  }

  saveSurveillance(){
    var surveillanceName = (<HTMLInputElement>document.getElementById("surveillanceName")).value;
    var surveillanceDesc = (<HTMLInputElement>document.getElementById("surveillanceDesc")).value;
    if (surveillanceDesc == ""){
      surveillanceDesc = "...";
    }
    this.service.UpdateSurveillance(this.locationID, surveillanceName, surveillanceDesc).subscribe((reqSucceed)=>{
      this.messageOK = reqSucceed.body;
      this.messageERR = "";
      var saveWP = document.getElementsByClassName("saveWP")[0];
      var saveButton = document.getElementsByClassName("saveContainer")[0];
      saveButton.classList.add("disabledButton");
      saveWP.classList.add("disabledWP");
      this.updateSurveillance();
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

  

  updatePage(){
    this.updateSurveillance();
    this.refreshCameras();
  }

  updateSurveillance(){
    this.service.GetSurveillance(this.userAuthorized?.userID, this.locationID).subscribe((reqSucceed)=>{
      this.theLocation = reqSucceed.body;
      this.currentLocationName = this.theLocation?.[0].locationName;
      this.currentLocationDesc = this.theLocation?.[0].locationDescription;
      this.currentPeopleCount = this.theLocation?.[3];
      try{
        var surveillanceName = (<HTMLInputElement>document.getElementById("surveillanceName"));
        var surveillanceDesc = (<HTMLInputElement>document.getElementById("surveillanceDesc"));
        surveillanceName.value = this.theLocation?.[0].locationName!;
        surveillanceDesc.value = this.theLocation?.[0].locationDescription!;
      } catch{

      }      
    }, (reqError)=>{
      this._location.back();
    })
  } 

  refreshCameras(){
    var updatedSort: any = localStorage.getItem("sorterCamera"); 
    this.service.RefreshCameras(this.locationID, updatedSort).subscribe((reqSucceed)=>{
      this.theCamera = reqSucceed.body as UserCameraTables[];  
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

  showDeleteAlert(){
    var MainContainer = (<HTMLElement>document.getElementById("MainContainer"));
    var popup = (<HTMLElement>document.getElementsByClassName("DelPopUpBG")[0]);
    var DelPopUpContainer = document.getElementsByClassName("DelPopUpContainer")[0];
    popup.style.height = MainContainer.offsetHeight + "px";
    popup.classList.add("DelPopUpBGActive"); 
    DelPopUpContainer.classList.add("DelPopUpContainerActive"); 
    this.messageERRDEL = "";
    window.scrollTo(0,0);
  }

  turnOffDelete(){
    var popup = (<HTMLElement>document.getElementsByClassName("DelPopUpBG")[0]);
    var DelPopUpContainer = (<HTMLElement>document.getElementsByClassName("DelPopUpContainer")[0]);
    popup.classList.remove("DelPopUpBGActive"); 
    DelPopUpContainer.classList.remove("DelPopUpContainerActive"); 
    this.messageERRDEL = "";  
  }

  DeleteIcon(hoverIN: boolean){
    // Code Adapted Nitzan Tomer, 2016.
    var img = (<HTMLImageElement>document.getElementById("deleteConfirmIcon"));
    // End of Code Adapted.
    if (hoverIN){
      img.src = "../../../../assets/Images/removeIcon2.png";
    } else {
      img.src = "../../../../assets/Images/removeIcon1.png";
    }
  }


  Delete(){
    this.service.DeleteSurveillance(this.userAuthorized?.userID, this.locationID).subscribe((reqSucceed)=>{
      /* Code Adapted from Parth Ghiya, 2017. */
      this.router.navigate(['/SurveillanceOverview/' + reqSucceed.body]);
      /* End of Code Adapted. */
    }, (reqError)=>{
      if (reqError.status == 0){
        this.messageERRDEL = "- Server connection Failed -";
      } else {
        this.messageERRDEL = reqError.error;
      }
    })
  }

  AddPopUp(){
    this.service.GetNewCameraCode().subscribe((reqSucceed)=>{
      var MainContainer = (<HTMLElement>document.getElementById("MainContainer"));
      var addCameraCode = (<HTMLInputElement>document.getElementById("addCameraCode"));
      var popup = (<HTMLElement>document.getElementsByClassName("AddPopUpBG")[0]);
      var AddPopUpContainer = (<HTMLElement>document.getElementsByClassName("AddPopUpContainer")[0]);
      popup.style.height = MainContainer.offsetHeight + "px";
      popup.classList.add("AddPopUpBGActive"); 
      AddPopUpContainer.classList.add("AddPopUpContainerActive"); 
      this.messageOKADD = "";
      this.messageERRADD = "";
      addCameraCode.value = reqSucceed.body;
      window.scrollTo(0,0);
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

  turnOffAdd(){
    try{
      var addCameraName = (<HTMLInputElement>document.getElementById("addCameraName"));
      var addCameraDescription = (<HTMLInputElement>document.getElementById("addCameraDescription"));
      addCameraName.value = '';
      addCameraDescription.value = '';
    } catch{

    }

    var popup = document.getElementsByClassName("AddPopUpBG")[0];
    var AddPopUpContainer = document.getElementsByClassName("AddPopUpContainer")[0];
    popup.classList.remove("AddPopUpBGActive"); 
    AddPopUpContainer.classList.remove("AddPopUpContainerActive"); 
    this.messageOKADD = "";
    this.messageERRADD = "";   
  }

  stream(cameraID: any){
    localStorage.setItem("reset", "no");
    this.service.OnCameraStream(cameraID);
    // Code adapted from Javascript.info, 2020.
    var newWin = window.open("/Stream/" + cameraID, "StreamingCamera:" + cameraID, "width=640,height=480,scrollbars=no");
    // End of code adapted.
  }

  AddCamera(){
    try{
      var addCameraName = (<HTMLInputElement>document.getElementById("addCameraName")).value;
      var addCameraDescription = (<HTMLInputElement>document.getElementById("addCameraDescription")).value;
      var addCameraCode = (<HTMLInputElement>document.getElementById("addCameraCode")).value;
      if (addCameraDescription == ""){
        addCameraDescription = "...";
      }
      var status = 1;
      try{
        // Code adapted from Russ Cam, 2009.
        var Online = (<HTMLInputElement>document.getElementById("Online"));
        var Offline = (<HTMLInputElement>document.getElementById("Offline"));
        if (Online.checked){
          status = 1;
        } else if (Offline.checked){
          status = 0;
        } 
        // End of code adapted.
      } catch{

      }
      
      this.service.AddCamera(this.userAuthorized?.userID, this.locationID, addCameraName, addCameraDescription, addCameraCode, status).subscribe((reqSucceed)=>{
        this.messageERRADD = "";
        this.messageOKADD = reqSucceed.body;
        this.updatePage();
      }, (reqError)=>{
        if (reqError.status == 0){
          this.messageERRADD = "- Server connection Failed -";
          this.messageOKADD = "";
        } else {
          this.messageERRADD = reqError.error;
          this.messageOKADD = "";
        }
      })
    } catch{

    }
    
  }

  copy(){
    // Code Adapted from W3Schools, n.d.
    var addCameraCode = (<HTMLInputElement>document.getElementById("addCameraCode"));
    navigator.clipboard.writeText(addCameraCode.value);

    // For Mobile Devices
    //addCameraCode.select();
    //addCameraCode.setSelectionRange(0, 99999);
    // End of Code Adapted

    this.messageOKADD = "- Camera Code Copied -";
  }

  refreshCode(){
    this.service.GetNewCameraCode().subscribe((reqSucceed)=>{
      var addCameraCode = (<HTMLInputElement>document.getElementById("addCameraCode"));
      this.messageOKADD = "- New Code Generated -";
      this.messageERRADD = "";
      addCameraCode.value = reqSucceed.body;
    }, (reqError)=>{
      if (reqError.status == 0){
        this.messageERRADD = "- Server connection Failed -";
        this.messageOKADD = "";
      } else {
        this.messageERRADD = reqError.error;
        this.messageOKADD = "";
      }
    })
  }

  updateAddSubmitButton(){
    var addCameraName = (<HTMLInputElement>document.getElementById("addCameraName"));
    var buttonAdd = document.getElementsByClassName("buttonAdd")[0];
    if (addCameraName.value != ""){
      buttonAdd.classList.remove("disabled");
    } else {
      buttonAdd.classList.add("disabled");
    }

  }

  SurveillanceDataLabelAnimation(theOne: number, run: boolean){
    try{      
      var cameraName = (<HTMLElement>document.getElementsByClassName("cameraName")[theOne]);
      var cameraNameContainer = (<HTMLElement>document.getElementsByClassName("cameraNameContainer")[theOne]);
      var cameraDesc = (<HTMLElement>document.getElementsByClassName("cameraDesc")[theOne]);
      var cameraDescContainer = (<HTMLElement>document.getElementsByClassName("cameraDescContainer")[theOne]);
      cameraName.style.overflow = "visible";
      cameraDesc.style.overflow = "visible";
      cameraName.style.width = "max-content";
      cameraDesc.style.width = "max-content";
      var nameWidth = cameraName.offsetWidth * -1 + (cameraNameContainer.offsetWidth * 90 / 100 );
      var descWidth = cameraDesc.offsetWidth * -1 + 200 ;

      // Code Adapted from developer.mozilla.org, n.d.
      if (cameraName.offsetWidth > cameraNameContainer.offsetWidth){
        var nameTiming = (cameraName.offsetWidth * 0.6 / 100) * 1000
        var nameAnimator = cameraName.animate([
          { left: "0"},
          { left: +nameWidth+"px"}]
        , 
        {duration: nameTiming, 
        iterations: Infinity,
        direction: 'alternate'
        });     
        if (!run){
          nameAnimator.pause();
          cameraName.style.overflow = "hidden";
          cameraName.style.left = "0";
          cameraName.style.width = "auto";
        }
      }


      if (cameraDesc.offsetWidth > cameraDescContainer.offsetWidth){
        var descTiming = (cameraDesc.offsetWidth * 0.6 / 100) * 1000
        var descAnimator = cameraDesc.animate([
          { left: "0"},
          { left: +descWidth+"px"}]
        , 
        {duration: descTiming, 
        iterations: Infinity,
        direction: 'alternate'
        });     
        if (!run){
          descAnimator.pause();
          cameraDesc.style.overflow = "hidden";
          cameraDesc.style.left = "0";
          cameraDesc.style.width = "auto";
        }
      }
    } catch{
      
    }
  }



  closeMessage(){
    this.messageOK = "";
    this.messageERR = "";
  }

  closeMessageAdd(){
    this.messageOKADD = "";
    this.messageERRADD = "";
  }

  closeMessageDel(){
    this.messageERRDEL = "";
  }

  toggleAddCameraOpStatus(){
    var Online = (<HTMLInputElement>document.getElementById("Online"));
    var Offline = (<HTMLInputElement>document.getElementById("Offline"));
    if (Online.checked){
      Offline.checked = true;
    } else{
      Online.checked = true;
    }
  }

  showGraph(){
    var GraphContainerDisabled = <HTMLElement>document.getElementsByClassName("GraphContainerDisabled")[0];
    var graphDisabled = <HTMLCanvasElement>document.getElementsByClassName("graphDisabled")[0];
    var graphDataDisabled = <HTMLElement>document.getElementsByClassName("graphDataDisabled")[0];
    var middleHint = <HTMLElement>document.getElementById("middleHint");

    if (this.currentShowGraph == 1){
      this.currentShowGraph = 0;
      GraphContainerDisabled.classList.remove("GraphContainerActive")
      graphDisabled.classList.remove("graphActive")
      graphDataDisabled.classList.remove("graphData")
      middleHint.innerHTML = "Press To Show Graph";
    } else {
      this.service.GetLocationRecords(this.locationID).subscribe((reqSuceed)=>{ 
        this.locationRecordExtraction = reqSuceed.body;
        var records = this.locationRecordExtraction[1];
        var time = []
        var pCount = []
        var day = new Date(Date.now());
        for (var i = 0; i < records.length; i++){
          var t = new Date(records[i].timeRecorded)
          time.push(t.getHours() + ":" + t.getMinutes());
          pCount.push(records[i].PeopleCount as number)
        }
        var date = day.getDate() + "-" + day.getMonth() + "-" + day.getFullYear();
        generateChart(graphDisabled, this.locationRecordExtraction[0], time, pCount, date);
        this.currentShowGraph = 1;
        GraphContainerDisabled.classList.add("GraphContainerActive")
        graphDisabled.classList.add("graphActive")
        graphDataDisabled.classList.add("graphData")
        middleHint.innerHTML = "Press To Hide Graph";
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
  }

}
