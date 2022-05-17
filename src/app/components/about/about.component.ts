import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { User } from 'src/app/DataClasses';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  @Output() backHomeWelcomePage = new EventEmitter<boolean>();
  @Input() userAuthorized?: User = undefined;
  constructor(public app: AppComponent) { }

  ngOnInit(): void {
    this.userAuthorized = this.app.user;    
  }

  backtoHomeWelcomePageFunction(){
    this.backHomeWelcomePage.emit(true);
  }

}
