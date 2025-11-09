declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions);
      setCenter(latlng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      fitBounds(bounds: LatLngBounds): void;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      addListener(eventName: string, handler: () => void): void;
    }

    namespace marker {
      class AdvancedMarkerElement {
        constructor(opts?: AdvancedMarkerElementOptions);
        map: Map | null;
        position?: LatLng | LatLngLiteral;
        content?: HTMLElement | null;
        title?: string;
      }

      interface AdvancedMarkerElementOptions {
        map?: Map | null;
        position?: LatLng | LatLngLiteral;
        content?: HTMLElement | null;
        title?: string;
      }
    }

    class LatLngBounds {
      extend(point: LatLng | LatLngLiteral): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
    }

    class Size {
      constructor(width: number, height: number);
    }

    class Point {
      constructor(x: number, y: number);
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
      mapId?: string;
      styles?: MapTypeStyle[];
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon | Symbol;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface Icon {
      url: string;
      scaledSize?: Size;
      anchor?: Point;
    }

    interface Symbol {
      path: string;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      scale?: number;
    }

    interface MapTypeStyle {
      featureType?: string;
      elementType?: string;
      stylers?: Array<{ [key: string]: string | number | boolean }>;
    }

    interface MapsLibrary {
      Map: typeof Map;
    }

    function importLibrary(libraryName: string): Promise<MapsLibrary>;
  }
}

declare global {
  interface Window {
    google: typeof google;
  }
}
