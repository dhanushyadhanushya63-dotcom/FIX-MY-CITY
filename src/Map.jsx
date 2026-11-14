import { useEffect, useRef } from 'react';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon URL resolution in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Guaranteed crisp SVG Pin Icon for draggable marker (never fails to render)
const customPinIcon = L.divIcon({
  className: 'custom-map-pin',
  html: `<div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);filter:drop-shadow(0 4px 8px rgba(0,0,0,0.4));cursor:grab;">
    <svg width="34" height="44" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 0C7.611 0 0 7.611 0 17C0 28.5 14.5 42.5 16.2 43.8C16.7 44.1 17.3 44.1 17.8 43.8C19.5 42.5 34 28.5 34 17C34 7.611 26.389 0 17 0Z" fill="#e11d48"/>
      <circle cx="17" cy="16" r="7" fill="white"/>
      <circle cx="17" cy="16" r="4" fill="#e11d48"/>
    </svg>
  </div>`,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

const TONES = { red: '#e11d48', amber: '#d97706', blue: '#087f8c', green: '#16a34a' };
const TILES = {
  map: ['https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', '&copy; OpenStreetMap contributors'],
  satellite: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 'Tiles &copy; Esri'],
};

// Leaflet + OpenStreetMap / Esri imagery. No Google Maps API key is required.
export default function Map({ items = [], pin, onPick, onSelect, focus, selected, height = 360, satellite = false, label = 'Map of complaints' }) {
  const el = useRef(null);
  const map = useRef(null);
  const markers = useRef(null);
  const tileLayer = useRef(null);
  const pick = useRef(onPick);
  const choose = useRef(onSelect);
  pick.current = onPick;
  choose.current = onSelect;

  useEffect(() => {
    if (!el.current || map.current) return;
    const instance = L.map(el.current, {
      center: [13.0418, 80.2341],
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: true,
    });
    map.current = instance;
    markers.current = L.layerGroup().addTo(instance);
    instance.on('click', (event) => {
      pick.current?.({ lat: event.latlng.lat, lng: event.latlng.lng });
    });

    // Leaflet sometimes initializes before its responsive card has its final size.
    const refresh = () => instance.invalidateSize({ pan: false });
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(refresh) : null;
    observer?.observe(el.current);
    requestAnimationFrame(refresh);
    const refreshTimer = window.setTimeout(refresh, 250);

    return () => {
      window.clearTimeout(refreshTimer);
      observer?.disconnect();
      instance.off();
      instance.remove();
      map.current = null;
      markers.current = null;
      tileLayer.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;
    tileLayer.current?.remove();
    const [url, attribution] = TILES[satellite ? 'satellite' : 'map'];
    tileLayer.current = L.tileLayer(url, {
      maxZoom: 19,
      attribution,
      crossOrigin: true,
      updateWhenIdle: false,
      keepBuffer: 3,
    }).addTo(map.current);
    tileLayer.current.on('tileerror', () => {
      el.current?.classList.add('map-tiles-warning');
    });
    tileLayer.current.on('tileload', () => el.current?.classList.remove('map-tiles-warning'));
    map.current.invalidateSize({ pan: false });
  }, [satellite]);

  useEffect(() => {
    if (!map.current || !markers.current) return;
    markers.current.clearLayers();
    items.forEach((item) => {
      if (Number.isFinite(Number(item.lat)) && Number.isFinite(Number(item.lng))) {
        L.circleMarker([Number(item.lat), Number(item.lng)], {
          radius: item.id === selected ? 13 : 9,
          color: '#fff', weight: 2,
          fillColor: TONES[item.tone] || TONES.blue,
          fillOpacity: 0.96,
        }).on('click', () => choose.current?.(item.id))
          .bindTooltip(`${item.id} · ${(item.desc || '').slice(0, 40)}`)
          .addTo(markers.current);
      }
    });
    if (pin && Number.isFinite(Number(pin.lat)) && Number.isFinite(Number(pin.lng))) {
      L.marker([Number(pin.lat), Number(pin.lng)], {
        icon: customPinIcon,
        draggable: !!onPick,
        autoPan: true,
      })
        .bindTooltip('Your selected location (drag to adjust)', { permanent: false, direction: 'top', offset: [0, -42] })
        .on('dragend', (event) => {
          const point = event.target.getLatLng();
          pick.current?.({ lat: point.lat, lng: point.lng });
        })
        .addTo(markers.current);
    }
  }, [items, pin?.lat, pin?.lng, selected, !!onPick]);

  useEffect(() => {
    if (pin && map.current) {
      map.current.flyTo([Number(pin.lat), Number(pin.lng)], 16, { duration: 0.6 });
      setTimeout(() => map.current?.invalidateSize(), 300);
    }
  }, [pin?.lat, pin?.lng]);

  useEffect(() => {
    if (focus && map.current) {
      map.current.flyTo([Number(focus.lat), Number(focus.lng)], 15, { duration: 0.5 });
      setTimeout(() => map.current?.invalidateSize(), 300);
    }
  }, [focus?.lat, focus?.lng]);

  return <div ref={el} className="map" style={{ height, minHeight: 280, width: '100%' }} role="region" aria-label={label} />;
}
