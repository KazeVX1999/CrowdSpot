
import { AfterViewChecked, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserCameraTables } from 'src/app/DataClasses';
import { CrowdSpotService } from '../../Service/crowd-spot.service';

@Component({
  selector: 'app-light-status',
  templateUrl: './light-status.component.html',
  styleUrls: ['./light-status.component.css']
})
export class LightStatusComponent implements OnInit {
  
  // 1 = Page Light, 2 = Surveillance Light, 3 = Camera Light
  @Input() lightType?: number;
  @Input() numberOfLight!: number;
  @Input() theCamera?: UserCameraTables;
  @Output() refreshSignal = new EventEmitter<boolean>();
  constructor(private service: CrowdSpotService) { }

  ngOnInit(): void {
    // 1 = Page Signal, 2 = Camera Operation Signal, 3 = Camera Operating Signal;
    try{
      if (this.numberOfLight == 0){
        this.checkPageOnline();
      } else {
        var light = <HTMLElement>document.getElementsByClassName("light")[this.numberOfLight];
        light.style.transform = "scale(0.5)";
        light.style.marginLeft = "-3px";
        if(this.theCamera?.operationStatus == 1){        
          light.classList.add("lightGreen");
          light.classList.remove("lightRed");
        } else {
          light.classList.remove("lightGreen");
          light.classList.add("lightRed"); 
        }
      } 
    } catch {

    }
    
    
  }

  checkPageOnline(){
    var light = <HTMLElement>document.getElementsByClassName("light")[0];
    localStorage.setItem("pageOnline", "On");
    this.service.CheckServerStatus().subscribe((reqSucceed)=>{
      light.classList.add("lightGreen");
      light.classList.remove("lightRed");
      }, (reqError)=>{
      light.classList.remove("lightGreen");
      light.classList.add("lightRed");        
    });


    // Check Server Status every 10 seconds 
    setInterval(() =>{
      var pageOnline = localStorage.getItem("pageOnline"); 
      if(pageOnline == "On"){
        this.service.CheckServerStatus().subscribe((reqSucceed)=>{
          light.classList.add("lightGreen");
          light.classList.remove("lightRed");
          }, (reqError)=>{
            light.classList.remove("lightGreen");
            light.classList.add("lightRed");   
        });
      } else {
        light.classList.remove("lightGreen");
        light.classList.add("lightRed"); 
      }
    }, 10000); 
  }

  cameraOperation(input: number){
    this.service.ToggleCameraOperation(this.theCamera?.cameraID, input).subscribe((reqSucceed)=>{      
      var light = <HTMLElement>document.getElementsByClassName("light")[this.numberOfLight];
      if(input == 1){
        light.classList.remove("lightRed");
        light.classList.add("lightGreen");
        alert("Camera " + this.theCamera?.cameraName + " will now 'RUNNING'.");        
      } else {
        light.classList.add("lightRed");
        light.classList.remove("lightGreen");
        alert("Camera " + this.theCamera?.cameraName + " will now 'STOP RUNNING'.");        
      }
      this.refreshSignal.emit(true);
    })
  }



  toggleLight(){
    if (this.lightType == 1){    
      var pageOnline = localStorage.getItem("pageOnline"); 
      var light = <HTMLElement>document.getElementsByClassName("light")[this.numberOfLight];
      if (pageOnline == "On"){
        localStorage.setItem("pageOnline", "Off");
        light.classList.add("lightRed");
        light.classList.remove("lightGreen");
        alert("Page will now 'STOP RUNNING'.");        
      } else {
        localStorage.setItem("pageOnline", "On");
        light.classList.remove("lightRed");
        light.classList.add("lightGreen");
        alert("Page will now 'RUNNING'.");        
      }
    } else if (this.lightType == 2){
      if (this.theCamera?.operationStatus == 1){
        this.cameraOperation(0);
      } else {
        this.cameraOperation(1);
      }
    }
  }
  


}
