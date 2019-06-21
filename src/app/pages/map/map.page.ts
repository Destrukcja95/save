import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { secrets } from '../../../environments/secrets';


@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements AfterViewInit {
  @ViewChild('mapCanvas') mapElement: ElementRef;

  constructor() {
  }

  async ngAfterViewInit() {
    const googleMaps = await this.getGoogleMaps(secrets.googleMapsApiKey);

    const mapEle = this.mapElement.nativeElement;

    const map = new googleMaps.Map(mapEle, {
      center: await this.getCurrentPosition(),
      zoom: 16
    });

    googleMaps.event.addListenerOnce(map, 'idle', () => {
      mapEle.classList.add('show-map');
    });
  }

 async getCurrentPosition() {
   const {coords} = await  new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));

   return {
     lat: coords.latitude,
     lng: coords.longitude
   };
  }

  getGoogleMaps(apiKey: string): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${ apiKey }`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const googleModule2 = win.google;
        if (googleModule2 && googleModule2.maps) {
          resolve(googleModule2.maps);
        } else {
          reject('google maps not available');
        }
      };
    });
  }
}
