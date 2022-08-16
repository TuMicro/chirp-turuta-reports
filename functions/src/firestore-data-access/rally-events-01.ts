import { FS_rally_events_01 } from "../constants/firestore";
import { fdb } from "../firestore-init";
import { RallyEvent01Data } from "../model/firestore/rally-event-01";


// store one event in firestore and returns the id of the document
export async function storeRallyEvent01(event: RallyEvent01Data) {
  const s = await fdb.collection(FS_rally_events_01).add(event);
  return s.id;
}

// set Rally event
export async function setRallyEvent01(id: string, event: RallyEvent01Data) {
  await fdb.collection(FS_rally_events_01).doc(id).set(event);
}

// query event from firestore by id
export async function getRallyEvent01(id: string) {
  const s = await fdb.collection(FS_rally_events_01).doc(id).get();
  const r = s.data() as RallyEvent01Data | undefined; // undefined when doc not found
  if (r != null) {
    return {
      id: id,
      ...r,
    };
  }
  return r;
}
