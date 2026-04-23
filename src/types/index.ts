/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Station {
  id: string;
  nameAr: string;
  nameEn: string;
  owner?: string;
  latitude: number;
  longitude: number;
  region: 'Central' | 'North' | 'South' | 'East' | 'West';
  status: 'Planning' | 'Designing' | 'Construction' | 'Operational' | 'Expansion';
  completionPercentage: number;
  images?: string[];
  documents?: StationDocument[];
  updatedAt: any;
  updatedBy: string;
}

export interface StationDocument {
  id: string;
  name: string;
  url: string;
  type: 'license' | 'plan' | 'image' | 'other';
  expiryDate?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  displayName: string;
  photoURL?: string;
  lastLogin: string;
}

export interface StationLog {
  id: string;
  stationId: string;
  userId: string;
  action: string;
  timestamp: string;
  details: string;
}
