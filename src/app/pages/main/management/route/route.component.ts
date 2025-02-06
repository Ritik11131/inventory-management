import { latLng } from 'leaflet';
import { Component, OnInit } from '@angular/core';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import * as turf from '@turf/turf';
import { routeColumns } from '../../../../shared/constants/columns';
import { GenericDrawerComponent } from "../../../../shared/components/generic-drawer/generic-drawer.component";
import { ButtonModule } from 'primeng/button';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { RouteService } from '../../../../core/services/route.service';
import { ToastService } from '../../../../core/services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [GenericTableComponent, GenericDrawerComponent, ButtonModule, LeafletModule, FormsModule],
  templateUrl: './route.component.html',
  styleUrl: './route.component.scss'
})
export class RouteComponent implements OnInit {

  columns = routeColumns;
  fields: any[] = []
  route!: any;
  routes: any[] = [];
  isLoading: boolean = false;
  routeDrawer: boolean = false;
  isEditing: boolean = false;
  private routeGeofenceLayer: L.Layer | null = null; 

  private map!: L.Map;
  private routingControl!: any;

  options = {
    layers: [L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' })],
    zoom: 10,
    center: L.latLng(28.6139, 77.2090) // Default center (Delhi)
  };

   // New properties for start and end points
   startPoint: string = '28.6231,77.1208';
   endPoint: string = '28.6665,77.2333';
   routeName: string = '';

  constructor(private routeService : RouteService, private toastService : ToastService) {
console.log(JSON.parse("{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"geometry\":{\"type\":\"LineString\",\"coordinates\":[[77.12149574355125,28.56503651361856],[77.12148574355126,28.565073604353543],[77.12146,28.56519],[77.12135,28.56563],[77.12137,28.56617],[77.12184,28.56636],[77.12242,28.56649],[77.12311,28.56653],[77.12415,28.56658],[77.1252,28.56664],[77.12611,28.56676],[77.12643,28.56678],[77.12688,28.56679],[77.12738,28.56692],[77.12792,28.56705],[77.12812,28.56654],[77.12788,28.56573],[77.12751,28.56489],[77.12735,28.56455],[77.12705,28.56376],[77.12672,28.56289],[77.12655,28.56244],[77.1265960934464,28.561745123097193],[77.12667973743442,28.56155586523201],[77.12742,28.56087],[77.12828297420504,28.560307410769727],[77.1286012774436,28.559869682995515],[77.12876757440252,28.55939144789913],[77.12872465905828,28.558684692547224],[77.12791364418031,28.55533884747334],[77.1277018650818,28.554639833460335],[77.12751337122108,28.554290450275346],[77.12701984476234,28.554083125818636],[77.12626781349181,28.554136337773052],[77.12509979629517,28.554406914229883],[77.12399906745914,28.554656338284985],[77.12299635581974,28.554934609850953],[77.1218863558197,28.555172881257146],[77.12127967857361,28.554920204267937],[77.1208209325409,28.553799423874036],[77.1205288989463,28.552876866336792],[77.12042291534422,28.552358800926786],[77.12022947486878,28.551796335469213],[77.1199809325409,28.550942879364175],[77.11965874603271,28.55002172736867],[77.11930078144738,28.549498617433755],[77.11893536441802,28.549260575720606],[77.11857956085204,28.54917874215135],[77.11786848183343,28.54923473786444],[77.11685650066376,28.54944690890289],[77.11514239021302,28.54984931832016],[77.11337781349184,28.55016460643559],[77.11114932429717,28.550656087708024],[77.11023781349182,28.550886910449346],[77.10879,28.55128],[77.10731,28.55161],[77.10587,28.55193],[77.10447,28.55226],[77.10310854232789,28.552512880066747],[77.10183708465574,28.55278403226922],[77.10058489814757,28.553074032450915],[77.09989587225316,28.553243901771324],[77.09936198280334,28.553411728278864],[77.09823198280333,28.553692304473937],[77.09709833862304,28.553925185272934],[77.0964434404755,28.55407691387543],[77.09591344047548,28.554234033177668],[77.09546615211485,28.554332304703074],[77.09460323677064,28.55452942380873],[77.09384,28.55413],[77.09299,28.5536],[77.09247,28.55328],[77.09207489814762,28.55304288030392],[77.09155093254091,28.55294115210082],[77.09049384788514,28.553180576071412],[77.08991001775422,28.553322682125128],[77.08919,28.55345],[77.08808,28.55371],[77.08699,28.55396],[77.08648035935866,28.55415057554786],[77.08631979629517,28.554367695297746],[77.08618,28.55488],[77.08591,28.55527],[77.08591,28.55528],[77.08551,28.5559],[77.0854160666662,28.556007051102295],[77.08535294477464,28.55613015179726],[77.0853148981476,28.556228372102126],[77.08520781349182,28.55638764408954],[77.08504953372956,28.556674711808224],[77.08504860403116,28.556826907723256],[77.08514784576471,28.556881093424405],[77.08559,28.55677],[77.08655,28.55655],[77.08699588777597,28.556449962943372],[77.08764,28.5563],[77.08881,28.55608],[77.0893096514511,28.55607538938618],[77.09007623309554,28.556009256178744],[77.09053667724608,28.55594596579103],[77.09110083693923,28.55581607064727],[77.09194463558195,28.555607593305595],[77.09303000000001,28.555368169480165],[77.09356985515596,28.55525999999999],[77.093801486276,28.555215171319524],[77.09397314765296,28.555290561267682],[77.09408043601356,28.555474324040176],[77.09420317790983,28.555864034198965],[77.09432291534425,28.556267593571427],[77.09425746180854,28.556430827650463],[77.09402142741523,28.55649208128017],[77.09389198698841,28.55653190045717],[77.0938124490738,28.55656288187924],[77.09348498561225,28.556628723864147],[77.0929924490738,28.55675288196434],[77.0925569412931,28.556803060696645],[77.0918924490738,28.55685817021372],[77.09110390674593,28.556818170194017],[77.09017244907382,28.556705763907487],[77.08975135066352,28.556671130147325],[77.08906244907378,28.556779322972062],[77.08847461917243,28.556930279284078],[77.08783991286275,28.557055212892376],[77.08749271696652,28.55713693565334],[77.0873196208668,28.557171027472958],[77.0871415889748,28.55721886184663],[77.08696139996529,28.557342205609633],[77.08702766864775,28.5574974940175],[77.08712525433148,28.55757159714715],[77.08723599269204,28.557496791233945],[77.08732450558954,28.55750503683343],[77.0874515165329,28.55761787091879],[77.08750979629515,28.557739099053105],[77.08759540870004,28.557816330747762],[77.08779413988115,28.557712006426797],[77.08787169080735,28.557609700194092],[77.08802,28.55735],[77.08832918518065,28.5571573690831],[77.08844414238905,28.557031494477293],[77.08878210072493,28.556946682184265],[77.08931972540817,28.556819805375856],[77.08941896714173,28.55679389046368],[77.08985307812145,28.556774317513728],[77.09006559755326,28.55678649131223],[77.09073734722135,28.55686293230069],[77.09125731779099,28.55693649128873],[77.09156393733028,28.556948872322995],[77.09202137870301,28.556955886988813],[77.0930450147152,28.55681531335708],[77.09374,28.55667],[77.0941831496334,28.55660355905918],[77.09437169012618,28.556595894952313],[77.0945379870851,28.556593539046432],[77.09465198096824,28.55651226026225],[77.09465734538627,28.55637326161631],[77.09451609325407,28.556246466129597],[77.09440694079557,28.5560855938796],[77.09432874603273,28.555851083860297],[77.0942260091521,28.555480408493008],[77.09422869136111,28.55523539140592],[77.09433300363541,28.555109525723402],[77.0946229760863,28.554950322731177],[77.09504976686478,28.554812932163074],[77.09567,28.55468],[77.09619,28.55456],[77.09719,28.55436],[77.09839,28.55411],[77.0995,28.55387],[77.10051,28.55365],[77.10113,28.55352],[77.10174,28.55338],[77.1026,28.55317],[77.10362,28.55292],[77.10458,28.5527],[77.10566,28.55248],[77.10674,28.55224],[77.1078,28.55197],[77.10887,28.5517],[77.10994,28.55146],[77.11101,28.55121],[77.11209,28.55096],[77.11269,28.55077],[77.11426,28.55061],[77.11534,28.55028],[77.11636,28.55],[77.11742,28.54974],[77.11853,28.54965],[77.11926,28.55049],[77.11954,28.55148],[77.11982,28.55246],[77.12008,28.55338],[77.12012,28.55353],[77.12032,28.55413],[77.12078,28.55503],[77.12181,28.55539],[77.12296,28.55514],[77.12407,28.55489],[77.12516,28.55465],[77.12627,28.55441],[77.12737,28.55459],[77.12781,28.55556],[77.12806,28.55656],[77.12801,28.56024],[77.12717,28.56085],[77.1267645457746,28.56120832633636],[77.12660897765174,28.56142388205367],[77.12650892165341,28.561602080857565],[77.12643247869649,28.561852972597084],[77.12642244907379,28.562003896677304],[77.12649341104505,28.562444856145117],[77.12670114052858,28.563005844347682],[77.12679877546313,28.563277210916844],[77.12698277247515,28.563771464333023],[77.12711658895492,28.564140047536327],[77.12729999999999,28.56460649008709],[77.12756,28.56551],[77.12766857202865,28.56580232239071],[77.12788031484274,28.56633665915148],[77.12789372588782,28.566509802063287],[77.12782398845343,28.566669988449135],[77.12755008829116,28.566726192074217],[77.1272611951065,28.566606443184895],[77.12696306091544,28.566485173075836],[77.12624609325408,28.566097644306858],[77.12543,28.56541],[77.12463183680534,28.564678798477825],[77.12394218650819,28.56412293278816],[77.12384935830119,28.564016490179537],[77.1236590085983,28.56387173108794],[77.12344241964341,28.56369117787353],[77.12332646003317,28.563599507797345],[77.1232,28.56349],[77.123,28.56329],[77.12278364276604,28.563154513405046],[77.12249973743435,28.56300350966434],[77.12236067833928,28.562872546178678],[77.12223851289748,28.562736490380093],[77.12196755092621,28.56239822112081],[77.12147291534424,28.561687644208156],[77.12118166950687,28.561290582868086],[77.12094857175829,28.561216344744473],[77.12056476143344,28.561314140873037],[77.12031367361068,28.56142581666608],[77.12027029006524,28.561559143812175],[77.12040523265586,28.561780588285693],[77.12061413988114,28.562020576862725],[77.12127793274993,28.56287693386299],[77.12143749206541,28.56316221055958],[77.12127367361069,28.56336000000001],[77.12121291534423,28.563576490248458],[77.12113536441804,28.563680672441702],[77.12106,28.56403],[77.12101,28.56444],[77.12096,28.56478],[77.12098,28.56494],[77.12097,28.56494]]},\"properties\":{}},{\"type\":\"Feature\",\"geometry\":{\"type\":\"Point\",\"coordinates\":[77.12149574355125,28.56503651361856]},\"properties\":{\"name\":\"Start Point\"}},{\"type\":\"Feature\",\"geometry\":{\"type\":\"Point\",\"coordinates\":[77.0859528682784,28.555208079153424]},\"properties\":{\"name\":\"T3\"}},{\"type\":\"Feature\",\"geometry\":{\"type\":\"Point\",\"coordinates\":[77.08743344681896,28.5576018181316]},\"properties\":{\"name\":\"T2\"}},{\"type\":\"Feature\",\"geometry\":{\"type\":\"Point\",\"coordinates\":[77.12097,28.56494]},\"properties\":{\"name\":\"End Point\"}}]}"))

  }



  // private initRoutingControl(): void {
  //   // Custom marker creation function
  //   this.routingControl = (L as any).Routing.control({
  //     waypoints: [
  //       L.latLng(51.5, -0.09), // Start point
  //       L.latLng(51.51, -0.1)  // End point
  //     ],
  //     routeWhileDragging: true,
  //     createMarker: (waypointIndex: any, waypoint: any, numberOfWaypoints: any) => {
  //       // Create custom markers only for the first and last waypoint
  //       console.log(waypointIndex, waypoint, numberOfWaypoints);
  //       return L.marker(waypoint.latLng, {
  //         icon: L.icon({
  //           iconSize: [25, 41],
  //           iconAnchor: [13, 41],
  //           iconUrl: 'assets/images/marker-icon.png',
  //           shadowUrl: 'assets/images/marker-shadow.png',
  //         }),
  //         draggable: true

  //       });


  //     },
  //   }).addTo(this.map);

  //   // Save route to local storage when the route is changed
  //   this.routingControl.on('routesfound', (e: any) => {
  //     console.log(e);
  //     // const routes = e.routes;
  //     // localStorage.setItem('savedRoute', JSON.stringify(routes));


  //     const route = e.routes[0]; // Get first route
  //     const coordinates = route.coordinates.map((c: any) => [c.lng, c.lat]); // Extract lat-lng
  
  //     // Store route in local storage
  //     localStorage.setItem('savedRoute', JSON.stringify(route));
  
  //     // Draw geofence around the route
  //     // this.createRouteGeofence(coordinates);


  //   });
  // }

  // public loadSavedRoute(): void {
  //   const savedRoute = localStorage.getItem('savedRoute');

  //   if (savedRoute) {
  //     const savedCoordinates = JSON.parse(savedRoute).coordinates.map((coord: any) => L.latLng(coord.lat, coord.lng));
  //     const savedWaypoints = JSON.parse(savedRoute).waypoints.map((coord: any) => coord.latLng);

  //     if (savedCoordinates.length > 0) {
  //       // Remove existing routing control if present
  //       if (this.routingControl) {
  //         this.map.removeControl(this.routingControl);
  //       }

  //       console.log('yeahh');


  //       // Custom routing control using your own waypoints
  //       this.routingControl = (L as any).Routing.control({
  //         waypoints: savedWaypoints, // This will be your custom waypoints
  //         createMarker: (waypointIndex: any, waypoint: any, numberOfWaypoints: any) => {
  //           console.log(waypointIndex, waypoint, numberOfWaypoints);

  //           // Create the marker for each waypoint
  //           const marker = L.marker(waypoint.latLng, {
  //             icon: L.icon({
  //               iconSize: [25, 41],
  //               iconAnchor: [13, 41],
  //               iconUrl: 'assets/images/marker-icon.png',
  //               shadowUrl: 'assets/images/marker-shadow.png',
  //             }),
  //             draggable: true, // Make the marker draggable
  //           });

  //           // Hide markers for intermediate waypoints (not the first and last)
  //           if (waypointIndex !== 0 && waypointIndex !== numberOfWaypoints - 1) {
  //             marker.options.icon = L.divIcon({
  //               className: 'hide-marker', // Apply a custom class for hiding
  //               iconSize: [0, 0], // Set icon size to zero for hiding
  //             });
  //           }

  //           return marker; // Return the marker
  //         },
  //       }).addTo(this.map);





  //       // Listen to the 'routesfound' event to detect when the route is newly created
  //       this.routingControl.on('routesfound', (event: any) => {
  //         // event.routes contains the route information
  //         // console.log('New route found:', event.routes);
  //         // const routes = event.routes;
  //         // localStorage.setItem('savedRoute', JSON.stringify(routes));
  //         const route = event.routes[0]; // Get first route
  //         const coordinates = route.coordinates.map((c: any) => [c.lng, c.lat]); // Extract lat-lng
      
  //         // Store route in local storage
  //         localStorage.setItem('savedRoute', JSON.stringify(route));
      
  //         // Draw geofence around the route
  //         // this.createRouteGeofence(coordinates);
  //       });
  //     }


  //   }


  // }

  ngOnInit(): void {
      this.fetchRoutes()
  }


  onMapReady(map: L.Map) {
    console.log('Leaflet Map is Ready', map);
    this.map = map;
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
    // this.initRoutingControl()
  }


  async onEditState(selectedRoute: any): Promise<void> {
    this.isEditing = true;
    this.routeDrawer = true;

    try {
      const response = await this.routeService.getRouteById(selectedRoute);
      console.log('Editing route:', response.data);
      const {id , userId, geometry, name} = response?.data
      this.routeName = name
      const modifiedroute = this.reverseGeoJSONToRoute(JSON.parse(geometry));
      console.log(this.route);
      

      if (modifiedroute) {
        const savedCoordinates = modifiedroute.coordinates.map((coord: any) => L.latLng(coord.lat, coord.lng));
        const savedWaypoints = modifiedroute.waypoints.map((coord: any) => coord.latLng);
        console.log(savedWaypoints);
        
  
        if (savedCoordinates.length > 0) {
          // Remove existing routing control if present
          // if (this.routingControl) {
          //   this.map.removeControl(this.routingControl);
          // }
  
          console.log('yeahh');
  
  
          // Custom routing control using your own waypoints
          this.routingControl = (L as any).Routing.control({
            waypoints: savedWaypoints, // This will be your custom waypoints
            createMarker: (waypointIndex: any, waypoint: any, numberOfWaypoints: any) => {
              console.log(waypointIndex, waypoint, numberOfWaypoints);
  
              // Create the marker for each waypoint
              const marker = L.marker(waypoint.latLng, {
                icon: L.icon({
                  iconSize: [25, 41],
                  iconAnchor: [13, 41],
                  iconUrl: 'assets/images/marker-icon.png',
                  shadowUrl: 'assets/images/marker-shadow.png',
                }),
                draggable: true, // Make the marker draggable
              });
  
              // Hide markers for intermediate waypoints (not the first and last)
              if (waypointIndex !== 0 && waypointIndex !== numberOfWaypoints - 1) {
                marker.options.icon = L.divIcon({
                  className: 'hide-marker', // Apply a custom class for hiding
                  iconSize: [0, 0], // Set icon size to zero for hiding
                });
              }
  
              return marker; // Return the marker
            },
          }).addTo(this.map);
  
  
  
  

          // Save route to local storage when the route is changed
          this.routingControl.on('routesfound', (e: any) => {
            console.log(e);
            // const routes = e.routes;
            // localStorage.setItem('savedRoute', JSON.stringify(routes));

            this.startPoint = e.waypoints[0].latLng.lat + ',' + e.waypoints[0].latLng.lng
            this.endPoint = e.waypoints[1].latLng.lat + ',' + e.waypoints[1].latLng.lng
            const route = e.routes[0]; // Get first route
            const coordinates = route.coordinates.map((c: any) => [c.lng, c.lat]); // Extract lat-lng

            // Store route in local storage
            localStorage.setItem('savedRoute', JSON.stringify(route));

            const geoJSON = this.convertToGeoJSON(route);
            this.route = { id: id, geometry: JSON.stringify(geoJSON) }
            console.log(this.route);
            


            // Draw geofence around the route
            // this.createRouteGeofence(coordinates);


          });
        }
  
  
      }


      console.log(this.route,'routeeeeeee');
      
    } catch (error:any) {
      this.toastService.showError('Error', 'Failed to get Route');
    }


  }


  async onDeleteState(event:any): Promise<any> {
    console.log(event);
    
    try {
      await this.routeService.deleteRoute(event.item);
      this.toastService.showSuccess('Success', 'Route Created Successfully!');
      await this.fetchRoutes();
    } catch (error) {
      this.toastService.showError('Error', `Failed to create Route!`);
    }
  }

  openNew(event: any) {
    this.isEditing = !event;
    this.route = this.resetRoute();
    this.routeDrawer = event;
  }

  resetRoute() {
    return {
      name: 'test',
      geometry: null
    };
  }

  async fetchRoutes(): Promise<any> {
    this.isLoading = true;
    try {
      const response = await this.routeService.getList();
      this.routes = response.data;
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error : any) {
      this.routes = [];
      this.toastService.showError('Error', error?.error?.data);
    } finally {
      this.isLoading = false;
    }
  }


  private createRouteGeofence(routeCoordinates: [number, number][]): void {  
    // Remove existing geofence if it exists
    if (this.routeGeofenceLayer) {
      this.map.removeLayer(this.routeGeofenceLayer);
    }
  
    // Create new geofence
    const line = turf.lineString(routeCoordinates);
    const buffered = turf.buffer(line, 50, { units: 'meters' });
  
    this.routeGeofenceLayer = L.geoJSON(buffered, {
      style: {
        color: '#4A90E2', // Nice blue shade
        fillColor: 'rgba(74, 144, 226, 0.4)', // Softer blue fill
        fillOpacity: 0.6, // Slightly transparent
        weight: 3, // Slightly thicker border
        dashArray: '5, 5' // Dashed border for a stylish effect
      }
    }).addTo(this.map);
  }










  plotStartPoint() {
    const [lat, lng] = this.startPoint.split(',').map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      // const marker = L.marker([lat, lng]).addTo(this.map);
      // marker.bindPopup('Start Point').openPopup();
    } else {
      this.toastService.showError('Error', 'Invalid Start Point');
    }
  }

  plotEndPoint() {
    const [lat, lng] = this.endPoint.split(',').map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      // const marker = L.marker([lat, lng]).addTo(this.map);
      // marker.bindPopup('End Point').openPopup();
      this.initializeRoutingControl();
    } else {
      this.toastService.showError('Error', 'Invalid End Point');
    }
  }

  private initializeRoutingControl() {
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
    }
    const startLatLng = this.startPoint.split(',').map(Number);
    const endLatLng = this.endPoint.split(',').map(Number);
    this.routingControl = (L as any).Routing.control({
      waypoints: [
        L.latLng(startLatLng[0], startLatLng[1]),
        L.latLng(endLatLng[0], endLatLng[1])
      ],
      routeWhileDragging: true,
      createMarker: (waypointIndex: any, waypoint: any, numberOfWaypoints: any) => {
        // Create custom markers only for the first and last waypoint
        console.log(waypointIndex, waypoint, numberOfWaypoints);
        return L.marker(waypoint.latLng, {
          icon: L.icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: 'assets/images/marker-icon.png',
            shadowUrl: 'assets/images/marker-shadow.png',
          }),
          draggable: true

        });
      },
    }).addTo(this.map);


     // Save route to local storage when the route is changed
     this.routingControl.on('routesfound', (e: any) => {
      console.log(e);
      // const routes = e.routes;
      // localStorage.setItem('savedRoute', JSON.stringify(routes));

      this.startPoint = e.waypoints[0].latLng.lat + ',' + e.waypoints[0].latLng.lng
      this.endPoint = e.waypoints[1].latLng.lat + ',' + e.waypoints[1].latLng.lng
      const route = e.routes[0]; // Get first route
      const coordinates = route.coordinates.map((c: any) => [c.lng, c.lat]); // Extract lat-lng
  
      // Store route in local storage
      localStorage.setItem('savedRoute', JSON.stringify(route));

      const geoJSON = this.convertToGeoJSON(route);
      this.route = {geometry: JSON.stringify(geoJSON) }
      
  
      // Draw geofence around the route
      // this.createRouteGeofence(coordinates);


    });
  }

  resetInputs() {
    // this.startPoint = '';
    // this.endPoint = '';
    this.routeName = '';
    this.routingControl = null
  }

  hideDrawer(e:any) {
    this.routeDrawer = e;
    this.resetInputs();
    
  }

  async createUpdateRoute(): Promise<any> {
    console.log(this.route,'apiiiiiiiiiiiiiii')
    try {
      const response = this.isEditing ? await this.routeService.updateRoute({name: this.routeName,...this.route}) :  await this.routeService.createRoute({name: this.routeName,...this.route});
      console.log(response);
      this.routeDrawer = false;
      await this.fetchRoutes()
      this.toastService.showSuccess('Success', 'Route Created Successfully!');
    } catch (error) {
      this.toastService.showError('Error', `Failed to create Route!`);
    }
  }


  reverseGeoJSONToRoute(geoJSON: any) {
    const route: any = {
      name: "",  // Add a name if you have it
      coordinates: [],
      instructions: [],
      summary: {
        totalDistance: 0,  // You'll need logic to calculate distance
        totalTime: 0       // You'll need logic to calculate time
      },
      waypointIndices: [],
      inputWaypoints: [],
      waypoints: [],
      properties: {
        isSimplified: true
      },
      routesIndex: 0
    };

    // Convert LineString coordinates back to the 'coordinates' array
    geoJSON.features.forEach((feature: any) => {
      if (feature.geometry.type === "LineString") {
        feature.geometry.coordinates.forEach((coord: any) => {
          route.coordinates.push({
            lat: coord[1],
            lng: coord[0]
          });
        });
      }

      // Convert Point features back to waypoints
      if (feature.geometry.type === "Point") {
        route.waypoints.push({
          options: {
            allowUTurn: false
          },
          latLng: {
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0]
          },
          name: feature.properties.name || ""
        });
      }
    });

    // You can calculate totalDistance and totalTime from the coordinates if needed
    // (this would require logic to calculate distance and time based on the route)

    // Example: Setting dummy distance and time (you should replace this with actual calculations)
    route.summary.totalDistance = 3996.7;  // Update with actual logic
    route.summary.totalTime = 373.5;       // Update with actual logic

    // For simplicity, let's assume the waypointIndices are [0, 1]
    route.waypointIndices = [0, 1];

    return route;

  };

  convertToGeoJSON(data:any) {
    const features = [];

    // Convert coordinates to LineString geometry
    const coordinates = data.coordinates.map((coord:any) => [coord.lng, coord.lat]);

    features.push({
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: coordinates
        },
        properties: {}
    });

    // Only consider waypoints for Point geometry
    data.waypoints.forEach((waypoint:any) => {
        features.push({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [waypoint.latLng.lng, waypoint.latLng.lat]
            },
            properties: {
                name: waypoint.name || "Unknown"
            }
        });
    });

    return {
        type: "FeatureCollection",
        features: features
    };
}




}
