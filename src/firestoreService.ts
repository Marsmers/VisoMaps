import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

interface MarkerData {
  lat: number;
  lng: number;
  label: string;
}

const markersCollection = collection(db, "markers");

const addMarker = async (marker: MarkerData) => {
  try {
    const docRef = await addDoc(markersCollection, marker);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const updateMarker = async (id: string, marker: MarkerData) => {
  try {
    const docRef = doc(db, "markers", id);
    await updateDoc(docRef, { ...marker });
    console.log("Document updated with ID: ", id);
  } catch (e) {
    console.error("Error updating document: ", e);
  }
};

const deleteMarker = async (id: string) => {
  try {
    const docRef = doc(db, "markers", id);
    await deleteDoc(docRef);
    console.log("Document deleted with ID: ", id);
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
};

const getMarkers = async () => {
  const querySnapshot = await getDocs(markersCollection);
  const markers: { id: string; data: MarkerData }[] = [];
  querySnapshot.forEach((doc) => {
    markers.push({ id: doc.id, data: doc.data() as MarkerData });
  });
  return markers;
};

export { addMarker, updateMarker, deleteMarker, getMarkers };
