import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PipeOperations';

  ruppes:any=50;

  student:any={
    "name":"Bhushan",
    "age":21
  }

  gender='male';

  gendermapping:any={
    "male":'mr',
    "female":'mrs'
  }
}
