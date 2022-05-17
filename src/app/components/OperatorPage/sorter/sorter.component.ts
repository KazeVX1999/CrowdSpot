import { Component, Input, OnInit, EventEmitter, Output, AfterViewChecked } from '@angular/core';


@Component({
  selector: 'app-sorter',
  templateUrl: './sorter.component.html',
  styleUrls: ['./sorter.component.css']
})
export class SorterComponent implements AfterViewChecked {
  sortLabel?: string = undefined;
  sortSave: string = "";
  @Input() type!: number;
  constructor() { }
  @Output() sortEmitter = new EventEmitter<any>();

  ngAfterViewChecked(): void {    
    this.updateSavedSorter();
  }
  
  updateSavedSorter(){
    if (this.type == 1){
      var updatedSort: any = localStorage.getItem("sorter"); 
    } else if (this.type == 2){
      var updatedSort: any = localStorage.getItem("sorterCamera"); 
    }
    var theSorts = document.getElementsByClassName("sortChoice");
    try{
      if (this.type == 1){
        if (updatedSort == "1"){
          this.sortSave = "Alphabetic / A -> Z";
          theSorts[0].classList.add("sortChoiceActive");
        } else  if (updatedSort == "2"){
          this.sortSave = "Alphabetic / Z -> A";
          theSorts[1].classList.add("sortChoiceActive");
        } else  if (updatedSort == "3"){
          this.sortSave = "People Count / Low -> High";
          theSorts[2].classList.add("sortChoiceActive");
        } else  if (updatedSort == "4"){
          this.sortSave = "People Count / High -> Low";
          theSorts[3].classList.add("sortChoiceActive");
        } else {
          this.sortSave = "Alphabetic / A -> Z";
          theSorts[0].classList.add("sortChoiceActive");
        }
      } else if (this.type == 2){
        if (updatedSort == "1"){
          this.sortSave = "Alphabetic / A -> Z";
          theSorts[0].classList.add("sortChoiceActive2");
        } else  if (updatedSort == "2"){
          this.sortSave = "Alphabetic / Z -> A";
          theSorts[1].classList.add("sortChoiceActive2");
        } else  if (updatedSort == "3"){
          this.sortSave = "Operating / ON -> OFF";
          theSorts[2].classList.add("sortChoiceActive2");
        } else  if (updatedSort == "4"){
          this.sortSave = "Operating / OFF -> ON";
          theSorts[3].classList.add("sortChoiceActive2");
        } else {
          this.sortSave = "Alphabetic / A -> Z";
          theSorts[0].classList.add("sortChoiceActive2");
        }
      } 
    } catch{

    }
    
    
  }

  clickSort(input: string){
    if (this.type == 1){
      if (input == "1"){
        localStorage.setItem("sorter", "1");
      } else  if (input == "2"){
        localStorage.setItem("sorter", "2");
      } else  if (input == "3"){
        localStorage.setItem("sorter", "3");
      } else  if (input == "4"){
        localStorage.setItem("sorter", "4");
      } 
    } else if (this.type == 2){
      if (input == "1"){
        localStorage.setItem("sorterCamera", "1");
      } else  if (input == "2"){
        localStorage.setItem("sorterCamera", "2");
      } else  if (input == "3"){
        localStorage.setItem("sorterCamera", "3");
      } else  if (input == "4"){
        localStorage.setItem("sorterCamera", "4");
      } 
    }
    
    this.sortEmitter.emit("Activate");
    this.sortHoverOUT();
    this.updateSavedSorter();
  }

  sortHoverIN(input: string){
    var theSorts: HTMLCollectionOf<Element> = document.getElementsByClassName("sortChoice");
    if (this.type == 1){
      if (input == "1"){
        this.sortLabel = "Alphabetic / A -> Z";
        theSorts[0].classList.add("sortChoiceActive");
      } else  if (input == "2"){
        this.sortLabel = "Alphabetic / Z -> A";
        theSorts[1].classList.add("sortChoiceActive");
      } else  if (input == "3"){
        this.sortLabel = "People Count / Low -> High";
        theSorts[2].classList.add("sortChoiceActive");
      } else  if (input == "4"){
        this.sortLabel = "People Count / High -> Low";
        theSorts[3].classList.add("sortChoiceActive");
      } 
    } else if (this.type == 2){
      if (input == "1"){
        this.sortLabel = "Alphabetic / A -> Z";
        theSorts[0].classList.add("sortChoiceActive2");
      } else  if (input == "2"){
        this.sortLabel = "Alphabetic / Z -> A";
        theSorts[1].classList.add("sortChoiceActive2");
      } else  if (input == "3"){
        this.sortLabel = "Operating / ON -> OFF";
        theSorts[2].classList.add("sortChoiceActive2");
      } else  if (input == "4"){
        this.sortLabel = "Operating / OFF -> ON";
        theSorts[3].classList.add("sortChoiceActive2");
      } 
    }
    
  }

  sortHoverOUT(){
    var theSorts = document.getElementsByClassName("sortChoice");
    if (this.type == 1){
      theSorts[0].classList.remove("sortChoiceActive");
      theSorts[1].classList.remove("sortChoiceActive");
      theSorts[2].classList.remove("sortChoiceActive");
      theSorts[3].classList.remove("sortChoiceActive");
      
    } else if (this.type == 2){
      theSorts[0].classList.remove("sortChoiceActive2");
      theSorts[1].classList.remove("sortChoiceActive2");
      theSorts[2].classList.remove("sortChoiceActive2");
      theSorts[3].classList.remove("sortChoiceActive2");
    }
    this.sortLabel = undefined;
    this.updateSavedSorter();
    
  }

}
