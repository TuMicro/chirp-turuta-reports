import { storeRallyEvent01 } from "../../firestore-data-access/rally-events-01";
import { RallyEvent01Data, RallyEvent01DataReceived } from "../../model/firestore/rally-event-01";

// function to validate and create a Rally event
export async function createNewEvent(
  dataReceived: RallyEvent01DataReceived,
  organizer_user_id: string) {

  //getting now
  const now = Date.now();

  //end_time must be after start_time
  if (dataReceived.end_time <= dataReceived.start_time) {
    throw new Error("end_time must be after start_time");
  }

  //end_time must be after now
  if (dataReceived.end_time < now) {
    throw new Error("end_time must be after now");
  }

  //upload_dealine must be after end_time
  if (dataReceived.upload_deadline < dataReceived.end_time) {
    throw new Error("upload_deadline must be after end_time");
  }

  // creating RallyEvent01Data object from dataReceived
  const eventData: RallyEvent01Data = {
    ...dataReceived,
    organizer_user_id: organizer_user_id,
    nft_created_id: null,
    nft_transfer_time: null,
    organizer_tokens_total: 0,
    organizer_tokens_balance: 0,
    participants_tokens_total: 0,
    creation_time: now,
  }

  //store eventData using storeRallyEvent01 function
  const docId = await storeRallyEvent01(eventData);

  return {
    docId,
    eventData,
  };
}