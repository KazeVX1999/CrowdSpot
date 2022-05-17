import { Component, Input, OnInit } from '@angular/core';
import { UserCameraTables } from 'src/app/DataClasses';

@Component({
  selector: 'app-light-status2',
  templateUrl: './light-status2.component.html',
  styleUrls: ['./light-status2.component.css']
})
export class LightStatus2Component implements OnInit {
  @Input() theCamera?: UserCameraTables;
  @Input() numberOfLight!: number;


  constructor() { }

  ngOnInit(): void {
    var light = <HTMLElement>document.getElementsByClassName("light2")[this.numberOfLight];
    light.style.transform = "scale(0.5)";
    if(this.theCamera?.operatingStatus == 1){        
      light.classList.add("lightGreen");
      light.classList.remove("lightRed");
    } else {
      light.classList.remove("lightGreen");
      light.classList.add("lightRed"); 
    }
  }

}
