import { Component, Input, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { User } from 'src/app/DataClasses';
import { CrowdSpotService } from '../../Service/crowd-spot.service';

// Code adapted from arunraj6, 2021.
declare function generateChart(theGraphElement: any, locationName: string, peopleCount: any, Time: any, day: any): any;
// End of code adapted.

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  @Input() userAuthorized?: User = undefined;
  messageOK?: string = "";
  messageERR?: string = "";
  messageOKADD?: string = "";
  messageERRADD?: string = "";
  userLocations?: any[];
  currentShowGraph: number = 0;
  timeForGraph = [];
  locationRecordExtraction: any | undefined = [];
  loadAPI: Promise<any> | undefined;


  constructor(public app: AppComponent, private service: CrowdSpotService) {  }

  ngOnInit(): void {
    this.userAuthorized = this.app.user;  
    this.refreshLocations();


    // Code adapted from ng-darren (2016) and K. Rahul (2017).
    this.loadAPI = new Promise((resolve)=>{
      let node = document.createElement('script');
      node.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js';
      node.type = 'text/javascript';
      node.async = true;
      document.getElementsByTagName('head')[0].appendChild(node);
    })
    // End of Code Adapted.

    this.loadAPI = new Promise((resolve)=>{
      let node = document.createElement('script');
      node.src = "https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.bundle.min.js";
      node.type = 'text/javascript';
      node.async = true;
      document.getElementsByTagName('head')[0].appendChild(node);
    })
  
    setInterval(() =>{
      var pageOnline = localStorage.getItem("pageOnline"); 
      if (pageOnline == "On" && this.userLocations?.length != 0){
        this.refreshLocations();
      }
    }, 3000); 
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


      // End of Code Adapted
    } catch {

    }
  }

  showGraph(input: number){
    var surveillanceMainContainer = <HTMLElement>document.getElementsByClassName("surveillanceMainContainer")[0];
    var GraphContainerDisabled = <HTMLElement>document.getElementsByClassName("GraphContainerDisabled")[0];
    var graphDisabled = <HTMLCanvasElement>document.getElementsByClassName("graphDisabled")[0];
    var graphDataDisabled = <HTMLElement>document.getElementsByClassName("graphDataDisabled")[0];
    // Same input disable Graph Container
    if (input == this.currentShowGraph){
      this.currentShowGraph = 0;
      surveillanceMainContainer.classList.remove("surveillanceMainContainerActive")
      GraphContainerDisabled.classList.remove("GraphContainerActive")
      graphDisabled.classList.remove("graphActive")
      graphDataDisabled.classList.remove("graphData")
    } else {
      // Else Activates the Graph
      this.service.GetLocationRecords(input).subscribe((reqSuceed)=>{ 
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
        this.currentShowGraph = input;
        surveillanceMainContainer.classList.add("surveillanceMainContainerActive")
        GraphContainerDisabled.classList.add("GraphContainerActive")
        graphDisabled.classList.add("graphActive")
        graphDataDisabled.classList.add("graphData")

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
