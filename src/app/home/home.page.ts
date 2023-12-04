import { Component, OnInit } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import { Geolocation } from '@capacitor/geolocation';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery.js'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  mapView!: MapView | any;
  userLocationGraphic: Graphic | any;
  basemapGallery: BasemapGallery | any;

  constructor() {}

  async ngOnInit() {
    const map = new Map({
      basemap: 'topo-vector'})

    this.mapView = new MapView({
      container: "container",
      map: map,
      zoom: 8
    });

    const basemapGallery = new BasemapGallery({
      view: this.mapView,
    });

    this.mapView.ui.add(basemapGallery, 'top-right');

    let weatherServiceFL = new ImageryLayer({ url: WeatherServiceUrl });
    map.add(weatherServiceFL);

    await this.updateUserLocationOnMap();
    this.mapView.center = this.userLocationGraphic.geometry as Point;
    setInterval(this.updateUserLocationOnMap.bind(this), 1000);
  }
  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      });
    });
  }

  async updateUserLocationOnMap() {
    let latLng = await this.getLocationService();
    //let geom = new Point({ latitude: latLng[0], longitude: latLng[1] });
    let geom = new Point({ latitude: 38.910308771994124, longitude: -77.05708929084646 }); 
    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = geom;
    } else {
      this.userLocationGraphic = new Graphic({
        symbol: new SimpleMarkerSymbol(),
        geometry: geom,
      });
      this.mapView.graphics.add(this.userLocationGraphic);
    }
  }
}

const WeatherServiceUrl =
'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer'
//export class HomePage implements OnInit{

  //latitude!: number;
  //longitude!: number;

  //constructor() {}
  //public async ngOnInit() {
    //throw new Error("Method not implemented.")

    /*this.longitude = 110.37403094707646;
    this.latitude = -7.7750324067247005;*/

    //const position = await Geolocation.getCurrentPosition();
    //this.latitude = position.coords.latitude;
    //this.longitude = position.coords.longitude;

    //const map = new Map ({
      //basemap: "topo-vector" 
    //});

    //const view = new MapView ({
      //container: "container",
      //map: map,
      //zoom: 4,
      //center: [this.longitude, this.latitude]
    //});
  //}

//}