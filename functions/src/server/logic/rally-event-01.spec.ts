import assert from "assert";
import { getRallyEvent01 } from "../../firestore-data-access/rally-events-01";
import { RallyEvent01Data, RallyEvent01DataReceived } from "../../model/firestore/rally-event-01";
import { createNewEvent } from "./rally-event-01";

const organizer_user_id_test = "organizer_user_id_test"


export const test_rally_event_01: RallyEvent01Data = {
  name: "Evento de prueba",
  start_time: 1654910007000,
  end_time: 1654910007000,
  creation_time: 1654910007000, // in millis
  upload_deadline: 1654910007000, // in millis (activities upload deadline)
  place: "Ciudad de prueba",
  lat: null,
  lon: null,
  category: "category",
  organizer_user_id: "organizer_user_id",
  notes: "notes",
  distance: 0, // in miles
  speed: 0, // in miles per hour

  /* Handled by the system */
  nft_created_id: null, // ASA id, null if not created yet, 
  // this is the NFT created as reward for the organizer
  nft_transfer_time: null, // true if the NFT has been transferred to the organizer
  organizer_tokens_total: 0,
  organizer_tokens_balance: 0,
  participants_tokens_total: 0,

  place_id: null,
  zip_code: null,
  city: null,
  address_line_2: null,
};

export const test_rally_event_03_claimable: RallyEvent01Data = {
  ...test_rally_event_01,
  name: "Evento de prueba",
  start_time: 1654910007000,
  end_time: 1654910007000,
  creation_time: 1654910007000, // in millis
  upload_deadline: 1654910007000, // in millis (activities upload deadline)
  place: "Ciudad de prueba",
  lat: null,
  lon: null,
  category: "category",
  organizer_user_id: organizer_user_id_test,
  notes: "notes",
  distance: 0, // in miles
  speed: 0, // in miles per hour
  nft_created_id: 10, // ASA id, null if not created yet, 
  nft_transfer_time: null, // true if the NFT has been transferred to the organizer
};

export const test_rally_event_03_no_claimable: RallyEvent01Data = {
  ...test_rally_event_01,
  name: "Evento de prueba",
  start_time: 1654910007000,
  end_time: 1654910007000,
  creation_time: 1654910007000, // in millis
  upload_deadline: 1654910007000, // in millis (activities upload deadline)
  place: "Ciudad de prueba",
  lat: null,
  lon: null,
  category: "category",
  organizer_user_id: organizer_user_id_test,
  notes: "notes",
  distance: 0, // in miles
  speed: 0, // in miles per hour
  nft_created_id: null, // ASA id, null if not created yet, 
  nft_transfer_time: null, // true if the NFT has been transferred to the organizer
};


//crate now variable
const now = new Date().getTime();

//create dummy RallyEvent01DataReceived object with start_time tomorrow, end_time after start_time and upload_deadline after end_time
export const test_rally_event_01_valid: RallyEvent01DataReceived = {
  ...test_rally_event_01,
  name: "Evento de prueba",
  start_time: now + 86400000,
  end_time: now + 86400000 + 86400000,
  upload_deadline: now + 86400000 + 86400000 + 86400000,
  place: "Ciudad de prueba",
  lat: null,
  lon: null,
  category: "category",
  notes: "notes",
  distance: 0, // in miles
  speed: 0, // in miles per hour
};

//create dummy RallyEvent01DataReceived object with start_time after end_time
export const test_rally_event_01_invalid_start_time_after_end_time: RallyEvent01DataReceived = {
  ...test_rally_event_01_valid,
  start_time: now + 86400000 + 86400000,
  end_time: now + 86400000,
}

//create dummy RallyEvent01DataReceived object with end_time before now
export const test_rally_event_01_invalid_end_time_before_now: RallyEvent01DataReceived = {
  ...test_rally_event_01_valid,
  end_time: now - 86400000,
  start_time: now - 86400000 - 86400000,
}

//create dummy RallyEvent01DataReceived object with upload_deadline before end_time
export const test_rally_event_01_invalid_upload_deadline_before_end_time: RallyEvent01DataReceived = {
  ...test_rally_event_01_valid,
  upload_deadline: test_rally_event_01_valid.end_time - 86400000,
}

describe("rally_02_sprint_14_06_2022: create new event", () => {

  it("create new event tests", async () => {

    await assert.rejects(
      createNewEvent(test_rally_event_01_invalid_start_time_after_end_time, organizer_user_id_test), {
      message: `end_time must be after start_time`,
    });

    await assert.rejects(
      createNewEvent(test_rally_event_01_invalid_end_time_before_now, organizer_user_id_test), {
      message: `end_time must be after now`,
    });

    await assert.rejects(
      createNewEvent(test_rally_event_01_invalid_upload_deadline_before_end_time, organizer_user_id_test), {
      message: `upload_deadline must be after end_time`,
    });

    const { docId } = await createNewEvent(test_rally_event_01_valid, organizer_user_id_test);
    const r = await getRallyEvent01(docId);

    await createNewEvent(test_rally_event_01_valid, organizer_user_id_test);

    assert(r != null);
    assert(r.start_time === test_rally_event_01_valid.start_time);

  }).timeout(20 * 60 * 1000);
});