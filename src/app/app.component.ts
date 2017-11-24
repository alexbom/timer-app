import {Component} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/timer';

@Component({
  moduleId:    module.id,
  selector:    'app-root',
  templateUrl: 'app.component.html',
  styleUrls:   ['app.component.css']
})
export class AppComponent {

  timeSubscribe: Subscription;
  waitSubscribe: Subscription;

  hours     = '00';
  minutes   = '00';
  seconds   = '00';
  time      = 0;     // time from last start
  stopTime  = 0;     // time from last stop
  isStarted = false; // check if timer is started or stopped

  private startTimer() {
    const timer = Observable.timer(1, 1000);

    this.isStarted = true;
    this.timeSubscribe = timer.subscribe(
      t => {
        this.time    = this.stopTime + t;
        this.seconds = this.getSeconds(this.time) + '';
        this.minutes = this.getMinutes(this.time) + '';
        this.hours   = this.getHours(this.time) + '';
      }
    );
  }

  private stopTimer() {
    this.stopTime  = this.time;
    this.isStarted = false;

    this.timeSubscribe.unsubscribe();
  }

  private toggleTimer() {
    if (this.isStarted) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  private waitTimer() {
    if ( ! this.isStarted) return;

    const timer = Observable.timer(1, 300);

    this.stopTimer();
    this.waitSubscribe = timer.subscribe(() => {
      this.waitSubscribe.unsubscribe();
      this.startTimer();
    });
  }

  private resetTimer() {
    this.stopTimer();

    this.hours    = '00';
    this.minutes  = '00';
    this.seconds  = '00';
    this.time     = 0;
    this.stopTime = 0;
  }

  private getHours(time: number) {
    return this.getPad(Math.floor((time / 60) / 60));
  }

  private getMinutes(time: number) {
    return this.getPad((Math.floor(time / 60)) % 60);
  }

  private getSeconds(time: number) {
    return this.getPad(time % 60);
  }

  private getPad(value: number) {
    return value < 10 ? '0' + value : value;
  }

}
