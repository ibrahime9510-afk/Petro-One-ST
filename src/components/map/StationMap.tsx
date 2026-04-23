/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin,
  InfoWindow
} from '@vis.gl/react-google-maps';
import { MapPin, Map as MapIcon, Plus, Info, X } from 'lucide-react';
import { Station } from '../../types';
import { cn, formatPercent } from '../../lib/utils';

export const StationMap: React.FC<{ stations: Station[], lang: 'ar' | 'en' }> = ({ stations, lang }) => {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const isAr = lang === 'ar';

  const defaultProps = {
    center: {
      lat: 24.7136, // Riyadh
      lng: 46.6753
    },
    zoom: 6
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  const mapId = "DEMO_MAP_ID";

  return (
    <div className="glass-panel h-[calc(100vh-12rem)] relative overflow-hidden">
      {!apiKey && (
        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] z-20 flex items-center justify-center p-6 text-center">
           <div className="glass-panel max-w-sm p-8 flex flex-col items-center">
              <MapIcon className="w-12 h-12 text-slate-400 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">Maps API Required</h4>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Please add your Google Maps API Key to the .env file as <code className="bg-slate-100 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> to enable the interactive map.
              </p>
           </div>
        </div>
      )}

      {apiKey && (
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
            mapId={mapId}
            reuseMaps={true}
          >
            {stations.map(station => (
              <AdvancedMarker
                key={station.id}
                position={{ lat: station.latitude, lng: station.longitude }}
                onClick={() => setSelectedStation(station)}
              >
                <div className="group relative">
                  <div className={cn(
                    "w-10 h-10 rounded-xl shadow-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                    station.status === 'Operational' ? 'bg-brand-primary' : 'bg-amber-500'
                  )}>
                    <div className="w-6 h-6 bg-white flex items-center justify-center rounded-lg">
                       <span className="font-extrabold text-[12px] text-slate-900">P</span>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-full ml-2 translate-y-[-50%] bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold pointer-events-none">
                     {isAr ? station.nameAr : station.nameEn}
                  </div>
                </div>
              </AdvancedMarker>
            ))}

            {selectedStation && (
              <InfoWindow
                position={{ lat: selectedStation.latitude, lng: selectedStation.longitude }}
                onCloseClick={() => setSelectedStation(null)}
              >
                <div className={cn("p-2 min-w-48", isAr && "arabic")} dir={isAr ? 'rtl' : 'ltr'}>
                   <h4 className="font-bold text-brand-primary mb-2">
                     {isAr ? selectedStation.nameAr : selectedStation.nameEn}
                   </h4>
                   <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400 font-bold uppercase">Status</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded font-bold",
                          selectedStation.status === 'Operational' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        )}>
                          {selectedStation.status}
                        </span>
                      </div>
                      <div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-primary" 
                            style={{ width: `${selectedStation.completionPercentage}%` }} 
                          />
                        </div>
                        <p className="text-[10px] font-bold text-slate-900 mt-1">{selectedStation.completionPercentage}% Complete</p>
                      </div>
                   </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      )}
    </div>
  );
};

