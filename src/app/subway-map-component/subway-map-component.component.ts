import { Component, OnInit } from '@angular/core';
import {Http, Headers} from '@angular/http';
//import * as jQuery from 'jquery';
declare var jQuery: any;

@Component({
  selector: 'app-subway-map-component',
  templateUrl: './subway-map-component.component.html',
  styleUrls: ['./subway-map-component.component.scss']
})
export class SubwayMapComponentComponent implements OnInit {
aProperty = true;
alertStations: string [] = [];

isStationSyntax: string = 'line';
clearSyntax: string = 'clear';
alertSyntax: string[] = ['medical', 'emergency','holding','alarm'];
subwayStations: string[] = ['downsview','wilson','yorkdale','glencairn','west','dupont','spadina','stgeorge', 'museum',
'queens','stpatrick','osgoode','standrew','union', 'king','queen','dundas','college','wellesley', 'blooryonge',
'rosedale', 'summerhill', 'stclair', 'davisville','eglinton', 'lawrence', 'york','sheppardyonge','centre','finch'];
tweetsdata: string;


  ngOnInit() {
    this.makecall();
    this.searchcall();
    
  }

  constructor(private http:Http) {

  }
  makecall() {
    var headers = new Headers();
    headers.append('Content-Type', 'application/X-www-form-urlencoded');
    this.http.post('http://localhost:3000/authorize', {headers: headers}).subscribe((res) => {
      console.log(res);
    })
  }

  searchcall() {
    var headers = new Headers();
    var query = 'query=' + 'TTCNotices'
    var unFilteredData;

    headers.append('Content-Type', 'application/X-www-form-urlencoded');
    this.http.post('http://localhost:3000/search',{headers: headers}).subscribe((res) => {
      //this.tweetsdata = res.json().data.statuses;
    console.log(res.json().data);
    unFilteredData = res.json().data[0].text;
    this.tweetsdata = (unFilteredData.replace(/[^a-zA-Z ]/g, "")).toLowerCase();
     //this.tweetsdata = 'wilson clear on line 1';
      console.log(this.tweetsdata);
      //console.log(this.tweetsdata)
      this.checkForAlerts(this.tweetsdata);
    })
  }

  checkForAlerts(tweetData){
    console.log ('IN check for alerts: ' + tweetData);
    var wordsArray = this.splitSentence(tweetData);
    var subwayAlert = this.isSubwayAlert(wordsArray);
  
    console.log('Is it a subway alert: ' + subwayAlert);
    if(!subwayAlert) {
      return null;
    }

    var subwayStation = this.getSubwayName(wordsArray);
    console.log ('This is subway station ' + subwayStation);
    console.log ('Before clear alert' + wordsArray);
    var isClearAlert = this.isClearOrAlert(wordsArray);
    

    if(!isClearAlert) {
      this.alertStations.push(subwayStation);
    }
    else {
      this.clearSubwayStation(subwayStation);
    }
  }

  getSubwayName(wordsArray) {
    for (var i=0; i < wordsArray.length; i++) {
      if (this.subwayStations.indexOf(wordsArray[i]) > -1) {
        return (wordsArray[i]);
      }
    }
  }

  splitSentence(aSentence) {
    console.log('Splitting before: ' + aSentence);
    console.log('Splitting: ' + aSentence.split(/\s+/));
    return aSentence.split(/\s+/);
  }

  isSubwayAlert(wordsArray) {
    console.log ("This is in subway alert check: " + wordsArray);
    return (wordsArray.indexOf(this.isStationSyntax) > -1);
  }

  isClearOrAlert(wordsArray) {
    if(wordsArray.indexOf(this.clearSyntax) > -1) {
      return true;
    }

    else {
      return false;
    }

  }

  clearSubwayStation(subwayName) {
    var index = this.alertStations.indexOf(subwayName);
    if (index != -1) {
      this.alertStations.splice(index,1);
    }
  }

  isStationClear(aStation) {
    console.log('In stationClear:'+ this.alertStations);
    if(this.alertStations.indexOf(aStation) > -1) {
       return true; 
    }
    else {
      return false;
    }
   

  }


}

