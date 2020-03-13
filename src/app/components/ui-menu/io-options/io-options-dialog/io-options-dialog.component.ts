import { Component, OnInit } from '@angular/core';
import { EventdisplayService } from 'src/app/services/eventdisplay.service';
import { MatDialogRef } from '@angular/material/dialog';
import {JiveXMLLoader} from '../../../../services/loaders/jivexml-loader';

@Component({
  selector: 'app-io-options-dialog',
  templateUrl: './io-options-dialog.component.html',
  styleUrls: ['./io-options-dialog.component.scss']
})
export class IOOptionsDialogComponent {

  constructor(private eventDisplay: EventdisplayService, public dialogRef: MatDialogRef<IOOptionsDialogComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleEventDataInput(files: any) {
    const callback = this.processEventData;
    this.handleFileInput(files, 'json', callback);
  }

  handleJiveXMLDataInput(files: any) {
    const callback = this.processJiveXML;
    this.handleFileInput(files, 'xml', callback);
  }

  handleOBJInput(files: any) {
    const callback = this.processOBJ;
    this.handleFileInput(files, 'obj', callback);
  }

  handleSceneInput(files: any) {
    const callback = this.processScene;
    this.handleFileInput(files, 'phnx', callback);
  }

  handleFileInput(files: any, extension: string, callback) {
    const file = files[0];
    const reader = new FileReader();
    if (file.name.split('.').pop() === extension) {
      reader.onload = () => {
        callback(reader.result.toString(), file.name.split('.')[0], this.eventDisplay);
      };
      reader.readAsText(file);
    } else {
      console.log('Error : ¡ Invalid file format !');
    }
  }

  processEventData(content: any, name: string, evDisplay: EventdisplayService) {
    const json = JSON.parse(content);
    evDisplay.loadEventsFromJSON(json);
    // this.events = this.eventDisplay.loadEventsFromJSON(json);
    // this.collections = this.eventDisplay.getCollections();
  }

  processJiveXML(content: any, name: string, evDisplay: EventdisplayService) {
    console.log("Got JiveXML.")
    let jiveloader = new JiveXMLLoader();
    jiveloader.process(content);
    const eventData = jiveloader.getEventData();
    evDisplay.buildEventDataFromJSON(eventData);
  }

  processOBJ(content: any, name: any, evDisplay: EventdisplayService) {
    evDisplay.loadGeometryFromOBJContent(content, name);
  }

  processScene(content: any, name: string, evDisplay: EventdisplayService) {
    evDisplay.loadDisplay(content);
  }



  handleGLTFInput(files: any) {
    const file = files[0];
    const reader = new FileReader();
    if (file.name.split('.').pop() === 'gltf') {
      reader.onload = () => {
        this.processGLTF(reader.result.toString());
      };
      reader.readAsText(file);
    } else {
      console.log('Error : ¡ Invalid file format !');
    }
  }

  processGLTF(content: any) {
    this.eventDisplay.loadGLTF(content);
  }

}