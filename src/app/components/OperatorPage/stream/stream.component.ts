import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { CrowdSpotService } from '../../Service/crowd-spot.service';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css']
})
export class StreamComponent implements OnInit {

  constructor(private service: CrowdSpotService, private route: ActivatedRoute) { }
  @Input() cameraID?: number | null;
  ngOnInit(): void {
    this.route.paramMap.subscribe( params =>
      this.cameraID = +params.get('cameraID')! 
    ) 
    
    this.service.OnCameraStream(this.cameraID).subscribe((succeed)=>{})
    setInterval(() =>{
      this.readStream();
    }, 1000); 

    this.readStream();
  }

  readStream(){    
    var theStream = <HTMLImageElement>document.getElementById("bg");
    this.service.GetStreamInput(this.cameraID).subscribe((reqSucceed)=>{
      try {
        let objectURL = 'data:image/jpeg;base64,' + reqSucceed.body;

        theStream.src = objectURL;
        console.log(reqSucceed.body)
        
      } catch {
      }   
    })
  }

}
