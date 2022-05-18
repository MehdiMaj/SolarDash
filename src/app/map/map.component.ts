import { environment } from '../../environments/environment';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import * as L from 'leaflet';
import * as mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  @Output() markerEmitter = new EventEmitter();
  marker: any;
  map: mapboxgl.Map;
  style = 'mapbox://styles/mehdi12/cl2bh4ogn000c15pbonlvuctj';
  lat = 33.886917;
  lng = 9.537499;
  constructor() {}
  ngOnInit() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: 5,
      center: [this.lng, this.lat],
    });
    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.on('click', (e) => {
      if (this.marker) this.marker.remove();
      this.marker = new mapboxgl.Marker()
        .setLngLat(e['lngLat'])
        .addTo(this.map);
      this.markerEmitter.emit(this.marker);
    });
  }
}
