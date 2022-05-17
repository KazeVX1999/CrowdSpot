import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-particles',
  templateUrl: './particles.component.html',
  styleUrls: ['./particles.component.scss']
})
export class ParticlesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  // Code Adapted from Pankajc Parkar, 2016
  createMultipleParticles(input: number){
    var duplicates: number[] = [];
    for (var i=0; i<input; i++){
      duplicates.push(i);
    }
    return new Array(input);
  } // End of Code Adapted
}
