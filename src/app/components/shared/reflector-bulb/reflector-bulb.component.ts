import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-reflector-bulb',
  imports: [],
  templateUrl: './reflector-bulb.component.html',
  styleUrl: './reflector-bulb.component.scss',
})
export class ReflectorBulbComponent {
  @ViewChild('lamp') lamp: ElementRef;
  turnOnLamp: boolean = true;
  constructor() {}

  ngOninit() {}

  onClickLamp(event: any) {
    console.log('event', event);
    console.log("lamp" ,this.turnOnLamp);

    if (this.turnOnLamp) {
      this.lamp.nativeElement.style.animation = '';
      this.turnOnLamp = false;
    } else {
      const rs = ["move 5s infinite ease"]
      this.lamp.nativeElement.style.animation = rs ;
    }
  }
}
