import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cameraMarksCoordinates, UserCameraTables } from 'src/app/DataClasses';
import { CrowdSpotService } from '../../Service/crowd-spot.service';
import { Location } from '@angular/common';
import { Binary, CastExpr } from '@angular/compiler';
import { DomSanitizer } from '@angular/platform-browser';
import { Byte } from '@angular/compiler/src/util';

@Component({
  selector: 'app-camera-setting',
  templateUrl: './camera-setting.component.html',
  styleUrls: ['./camera-setting.component.css']
})
export class CameraSettingComponent implements OnInit {
  @Input() locationID?: number | null | undefined;
  @Input() cameraID?: number | null | undefined;
  currentCameraName?: string;
  currentCameraDesc?: string;
  currentCameraCode?: string;
  currentCameraOperationStatus?: number;
  messageOK?: string = "";
  messageERR?: string = "";
  messageERRDEL?: string = "";
  messageOKED?: string = "";
  messageERRED?: string = "";
  theCamera?: UserCameraTables;
  count: number = 3;
  toggled = false;
  currentEditor = 5;
  painting = false;
  streamImage: string = "../../../../assets/Images/NoStream.png";

  cordsEnterStorage?: string;
  cordsExitStorage?: string;

  prevEnter?: string;
  prevExit?: string;
  constructor(private service: CrowdSpotService, private route: ActivatedRoute, private _location: Location, private router: Router,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( params =>
      this.locationID = +params.get('locationID')!
    )
    this.route.paramMap.subscribe( params =>
      this.cameraID = +params.get('cameraID')!
    )

    
    var timer = setInterval(() =>{
      this.count -= 1;
    }, 1000);    



    setTimeout(()=>{
        clearInterval(timer);
        var removeButton = document.getElementsByClassName("removeContainer")[0];
        var removeWP = document.getElementsByClassName("removeWP")[0];
        var counter = (<HTMLElement>document.getElementsByClassName("counter")[0]);
        removeButton.classList.remove("disabledButton");
        removeWP.classList.remove("disabledWP");
        counter.style.display ="none";
    }, 3000);

    setInterval(() =>{
      var pageOnline = localStorage.getItem("pageOnline"); 
      if (pageOnline == "On"){
        this.updateCamera();   
      }
    }, 3000); 

    this.updateCamera();
  }

  ngOnDestroy(){
    this.service.OffCameraStream(this.cameraID).subscribe((reqSucceed)=>{
    });
  }

  goBack(){
    this._location.back();
  }

  updateCamera(){
    this.service.GetCamera(this.cameraID).subscribe((reqSucceed)=>{
      this.theCamera = reqSucceed.body;
      this.currentCameraName = this.theCamera?.cameraName;
      this.currentCameraDesc = this.theCamera?.cameraDescription;
      this.currentCameraCode = this.theCamera?.cameraCode;
      this.currentCameraOperationStatus = this.theCamera?.operationStatus;
    }, (reqError)=>{
      this._location.back();
      this._location.back();
    })
  }

  preventEmptyInputSave(){
    var cameraName = (<HTMLInputElement>document.getElementById("cameraName")).value;
    var cameraDesc = (<HTMLInputElement>document.getElementById("cameraDesc")).value;
    var cameraCode = (<HTMLInputElement>document.getElementById("cameraCode")).value;
    var Online = (<HTMLInputElement>document.getElementById("Online"));
    var saveButton = document.getElementsByClassName("saveContainer")[0];
    var saveWP = document.getElementsByClassName("saveWP")[0];
  
    if (cameraName != ""){
      var checkStat = 0;
      if(Online.checked){
        checkStat = 1;
      }
      if (cameraName != this.currentCameraName || cameraDesc != this.currentCameraDesc || cameraCode != this.currentCameraCode || this.currentCameraOperationStatus != checkStat){
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

  toggleCameraOpStatus(){
    var Online = (<HTMLInputElement>document.getElementById("Online"));
    var Offline = (<HTMLInputElement>document.getElementById("Offline"));
    if (Online.checked){
      Offline.checked = true;
    } else{
      Online.checked = true;
    }
    this.preventEmptyInputSave();
  }

  refreshCode(){
    this.service.GetNewCameraCode().subscribe((reqSucceed)=>{
      this.messageOK = "- New Code Generated -";
      this.messageERR = "";     
      var cameraCode = (<HTMLInputElement>document.getElementById("cameraCode"));
      cameraCode.value = reqSucceed.body;
      this.preventEmptyInputSave();
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

  saveCamera(){
    var cameraName = (<HTMLInputElement>document.getElementById("cameraName")).value;
    var cameraDesc = (<HTMLInputElement>document.getElementById("cameraDesc")).value;
    var cameraCode = (<HTMLInputElement>document.getElementById("cameraCode")).value;
    var Online = (<HTMLInputElement>document.getElementById("Online"));

    if (cameraDesc == ""){
      cameraDesc = "...";
    }
    var status = 0;
    if(Online.checked){
      status = 1;
    }
    this.service.UpdateCamera(this.theCamera?.cameraID, cameraName, cameraDesc, cameraCode, status).subscribe((reqSucceed)=>{
      this.messageOK = reqSucceed.body;
      this.messageERR = "";
      var saveWP = document.getElementsByClassName("saveWP")[0];
      var saveButton = document.getElementsByClassName("saveContainer")[0];
      saveButton.classList.add("disabledButton");
      saveWP.classList.add("disabledWP");
      this.updateCamera();
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

  copy(){
    var cameraCode = (<HTMLInputElement>document.getElementById("cameraCode"));
    navigator.clipboard.writeText(cameraCode.value);
    this.messageOK = "- Camera Code Copied -";
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
    this.service.DeleteCamera(this.locationID, this.cameraID).subscribe((reqSucceed)=>{
      this.router.navigate(['/Surveillance/' + this.locationID + '/' + reqSucceed.body]);
    }, (reqError)=>{
      if (reqError.status == 0){
        this.messageERRDEL = "- Server connection Failed -";
      } else {
        this.messageERRDEL = reqError.error;
      }
    })
  }

  closeMessage(){
    this.messageOK = "";
    this.messageERR = "";
  }

  closeMessageDel(){
    this.messageERRDEL = "";
  }

  closeMessageED(){
    this.messageOKED = "";
    this.messageERRED = "";
  }

  showEditSpace(){
    var theToggler = (<HTMLElement>document.getElementsByClassName("theToggler")[0]);
    var theTogglerLabel = (<HTMLElement>document.getElementsByClassName("theTogglerLabel")[0]);
    var EditorContainer = (<HTMLElement>document.getElementsByClassName("EditorContainer")[0]);
    var canvasDisabled = (<HTMLElement>document.getElementsByClassName("canvasDisabled")[0]);
    this.closeMessageED();
    var pageOnline = localStorage.getItem("pageOnline"); 
    setInterval(() =>{
      if (pageOnline == "On" && this.toggled){
        this.readStream();   
      }
    }, 1000); 

    
    if (!this.toggled){
      this.toggled = true;
      theToggler.classList.add("theTogglerActive");
      theTogglerLabel.innerText = "Press to Close Point Edit Space";
      theTogglerLabel.classList.add("theTogglerLabelActive");
      EditorContainer.classList.add("EditorContainerActive");
      canvasDisabled.classList.add("canvasActive");
      this.service.OnCameraStream(this.cameraID).subscribe((reqSucceed)=>{
      });
      this.readStream();
      try{
        var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementsByClassName("canvasDisabled")[0];
        canvas.height = 480;
        canvas.width = 640;
      } catch{
  
      }
      this.readStream();
      this.readMark();    
    } else {
      this.toggled = false;
      theTogglerLabel.innerText = "Press to Show Point Edit Space";
      theTogglerLabel.classList.remove("theTogglerLabelActive");
      theToggler.classList.remove("theTogglerActive");
      EditorContainer.classList.remove("EditorContainerActive")
      canvasDisabled.classList.remove("canvasActive");
      this.service.OffCameraStream(this.cameraID).subscribe((reqSucceed)=>{
      });
      this.clearMark();

    } 
  }

  lineDown(ctx: CanvasRenderingContext2D, event: MouseEvent){
    this.painting = true;
    if (this.currentEditor == 3){
      this.painting = false;
    } else {
      ctx!.beginPath();
      ctx!.moveTo(event.offsetX, event.offsetY);
      if (this.currentEditor == 0){
        if (this.prevEnter != event.offsetX + " " + event.offsetY + " "){
          this.prevEnter = event.offsetX + " " + event.offsetY + " ";
          this.cordsEnterStorage += event.offsetX + " " + event.offsetY + " ";
        }
        
      } else if (this.currentEditor == 1){
        if (this.prevExit != event.offsetX + " " + event.offsetY + " "){
          this.prevExit = event.offsetX + " " + event.offsetY + " ";
          this.cordsExitStorage += event.offsetX + " " + event.offsetY + " ";
        }
      }
    } 
  }
  
  lineUp(ctx: CanvasRenderingContext2D, event: MouseEvent){
    this.painting = false;  
    ctx!.lineTo(event.offsetX, event.offsetY);
    ctx!.stroke();
    if (this.currentEditor == 0){
      if (this.prevEnter != event.offsetX + " " + event.offsetY + ","){
        this.prevEnter = event.offsetX + " " + event.offsetY + ",";
        this.cordsEnterStorage += event.offsetX + " " + event.offsetY + ",";
      }
      
    } else if (this.currentEditor == 1){
      if (this.prevExit != event.offsetX + " " + event.offsetY + ","){
        this.prevExit = event.offsetX + " " + event.offsetY + ",";
        this.cordsExitStorage += event.offsetX + " " + event.offsetY + ",";
      }
    }
    ctx!.closePath(); 
  }


  resetLeftEditor(){
    try{
      var leftEdit: HTMLCollectionOf<Element> = document.getElementsByClassName("leftEdit");
      var bg: HTMLCollectionOf<Element> = document.getElementsByClassName("bg");
      var editorLabel: HTMLCollectionOf<Element> = document.getElementsByClassName("editorLabel");
      for (var a = 0; a<leftEdit.length; a++){
        leftEdit[a].classList.remove("leftActive");
        bg[a].classList.remove("leftImageActive");
        editorLabel[a].classList.remove("leftLabelActive");
      }
    } catch {

    }
    

  }

  leftEditActivate(input: number){
    try{
      this.resetLeftEditor();
      var leftEdit: HTMLCollectionOf<Element> = document.getElementsByClassName("leftEdit");
      var bg: HTMLCollectionOf<Element> = document.getElementsByClassName("bg");
      var editorLabel: HTMLCollectionOf<Element> = document.getElementsByClassName("editorLabel");
      leftEdit[input].classList.add("leftActive");
      bg[input].classList.add("leftImageActive");
      editorLabel[input].classList.add("leftLabelActive");
      var canvas = <HTMLCanvasElement>document.getElementsByClassName("canvasDisabled")[0];
      var ctx = canvas.getContext("2d");
      ctx!.lineWidth = 10;
      ctx!.lineCap = "round";
      // Color in RGB
      //var enterColor =  (26, 181, 42);
      //var exitColor =  (233, 23, 16);
      if (this.currentEditor == input){
        // No Edits        
        this.resetLeftEditor();
        this.currentEditor = 3;
      } else {
        if (input == 0){
          this.currentEditor = 0;            
          ctx!.strokeStyle = "rgb(26, 181, 42)";
        } else if (input == 1){
          this.currentEditor = 1;
          ctx!.strokeStyle = "rgb(233, 23, 16)";          
        } 
        // Code adapted from W3Schools.com.
        canvas.addEventListener("mousedown", (event)=>this.lineDown(ctx!, event), false);
        canvas.addEventListener("mouseup", (event)=>this.lineUp(ctx!, event), false);
        // End of code adapted.
      }    
    } catch{

    }    
  }

  rightEdit1Activate(input: number){
    var rightEdit1 = document.getElementsByClassName("rightEdit1");
    var rightLabel1 = document.getElementsByClassName("markLabel");
    var canvas = <HTMLCanvasElement>document.getElementsByClassName("canvasDisabled")[0];
    // 0 = ShowMarks, 1 = HideMarks
    if (input == 0){
      rightEdit1[1].classList.remove("right1Active");
      rightLabel1[1].classList.remove("rightLabelActive");
      rightEdit1[0].classList.add("right1Active");
      rightLabel1[0].classList.add("rightLabelActive");
      canvas.style.opacity = "1";
    } else {
      rightEdit1[1].classList.add("right1Active");
      rightLabel1[1].classList.add("rightLabelActive");
      rightEdit1[0].classList.remove("right1Active");
      rightLabel1[0].classList.remove("rightLabelActive");
      canvas.style.opacity = "0";
    }
  }

  rightEdit2Activate(input: number){
    var rightEdit2 = document.getElementsByClassName("rightEdit2");
    var rightLabel2 = document.getElementsByClassName("markLabel");
    var theStreamClassActive = document.getElementsByClassName("theStreamClassActive")[0];  


    // 0 = ShowBackground, 1 = HideBackground
    if (input == 0){
      rightEdit2[1].classList.remove("right2Active");
      rightLabel2[1+2].classList.remove("rightLabelActive");
      rightEdit2[0].classList.add("right2Active");
      rightLabel2[0+2].classList.add("rightLabelActive");
      theStreamClassActive.classList.remove("theStreamClass");
    } else {
      rightEdit2[1].classList.add("right2Active");
      rightLabel2[1+2].classList.add("rightLabelActive");
      rightEdit2[0].classList.remove("right2Active");
      rightLabel2[0+2].classList.remove("rightLabelActive");
      theStreamClassActive.classList.add("theStreamClass");
    }
  }

  readStream(){    
    var theStream = <HTMLImageElement>document.getElementById("theStream");
    this.service.GetStreamInput(this.cameraID).subscribe((reqSucceed)=>{
      try {
        let objectURL = 'data:image/jpeg;base64,' + reqSucceed.body;

        theStream.src = objectURL;
        
      } catch {
      }   
    }, (reqError)=>{
      if (reqError.status == 0){
        this.messageERRED = "- Server connection Failed -";
        this.messageOKED = "";
      } else {
        this.messageERRED = reqError.error;
        this.messageOKED = "";
      }
    })
  }

  readMark(){
    var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementsByClassName("canvasDisabled")[0];
    var ctx = canvas.getContext("2d");
    this.service.RetrieveMarks(this.cameraID).subscribe((reqSucceed)=>{
      try {
        if (reqSucceed.body.length == 21){
          this.messageERRED = "";
          this.messageOKED = reqSucceed.body;
        } else {
          var canvas = <HTMLCanvasElement>document.getElementsByClassName("canvasDisabled")[0];
          var ctx = canvas.getContext("2d");
          ctx!.lineWidth = 10;
          ctx!.lineCap = "round";

          var extractedCords: cameraMarksCoordinates[] = reqSucceed.body;
          for (var i = 0; i < extractedCords.length; i++){
            if(extractedCords[i].markType == 0){
              ctx!.strokeStyle = "rgb(233, 23, 16)";
              this.cordsEnterStorage += extractedCords[i].cordXStart + " " + extractedCords[i].cordYStart + " " + extractedCords[i].cordXEnd + " " + extractedCords[i].cordYEnd + ",";
            } else {
              ctx!.strokeStyle = "rgb(26, 181, 42)";
              this.cordsExitStorage += extractedCords[i].cordXStart + " " + extractedCords[i].cordYStart + " " + extractedCords[i].cordXEnd + " " + extractedCords[i].cordYEnd + ",";
            }
            ctx!.beginPath()
            ctx!.moveTo(extractedCords[i].cordXStart, extractedCords[i].cordYStart);
            ctx!.lineTo(extractedCords[i].cordXEnd, extractedCords[i].cordYEnd);
            ctx!.stroke();
            ctx!.closePath();
          }         

          this.messageERRED = "";
          this.messageOKED = "- Marks retrieved successfully -";
        }        
      } catch {
        this.messageERRED = "- Marks can't be retrieved -";
        this.messageOKED = "";
      }   
    }, (reqError)=>{
      if (reqError.status == 0){
        this.messageERRED = "- Server connection Failed -";
        this.messageOKED = "";
      } else {
        this.messageERRED = reqError.error;
        this.messageOKED = "- Please Do Add Marks";
      }
    })
  }

  saveMark(){
    var formData = new FormData()

    // Code adapted from Mixalloff, 2018.
    formData.append("cordsEnter", new Blob( [ JSON.stringify( this.cordsEnterStorage ) ], { type : 'application/json' } ) );
    formData.append("cordsExit", new Blob( [ JSON.stringify( this.cordsExitStorage ) ], { type : 'application/json' } ) );
    // End of code adapted.
    this.service.UploadMarks(this.cameraID, formData).subscribe((reqSucceed)=>{
      this.messageOKED = reqSucceed.body;
      this.messageERRED = "";
    }, (reqError)=>{
      if (reqError.status == 0){
        this.messageERRED = "- Server connection Failed -";
        this.messageOKED = "";
      } else {
        this.messageERRED = reqError.error;
        this.messageOKED = "";
      }
    })

  }

  clearMark(){
    var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementsByClassName("canvasDisabled")[0];
    var new_canvas = canvas.cloneNode(true);
    canvas!.parentNode!.replaceChild(new_canvas, canvas);    
    this.resetLeftEditor();
    this.currentEditor = 3;
    this.cordsEnterStorage = "";
    this.cordsExitStorage = "";

  }


}
