/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  serverTimestamp,
  orderBy
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Station, StationLog } from "../types";

export const subscribeToStations = (callback: (stations: Station[]) => void) => {
  const q = query(collection(db, "stations"), orderBy("nameEn", "asc"));
  return onSnapshot(q, (snapshot) => {
    const stations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Station[];
    callback(stations);
  });
};

export const upsertStation = async (station: Partial<Station>, userId: string) => {
  const data = {
    ...station,
    updatedAt: serverTimestamp(),
    updatedBy: userId,
  };
  
  if (station.id) {
    const stationDoc = doc(db, "stations", station.id);
    await updateDoc(stationDoc, data);
    await logAction(station.id, userId, "Modified station details");
  } else {
    const docRef = await addDoc(collection(db, "stations"), data);
    await logAction(docRef.id, userId, "Created new station");
  }
};

export const deleteStation = async (stationId: string) => {
  await deleteDoc(doc(db, "stations", stationId));
};

const logAction = async (stationId: string, userId: string, action: string) => {
  await addDoc(collection(db, "stations", stationId, "logs"), {
    stationId,
    userId,
    action,
    timestamp: serverTimestamp(),
    details: "",
  });
};

export const subscribeToLogs = (stationId: string, callback: (logs: StationLog[]) => void) => {
  const q = query(collection(db, "stations", stationId, "logs"), orderBy("timestamp", "desc"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as StationLog[]);
  });
};
