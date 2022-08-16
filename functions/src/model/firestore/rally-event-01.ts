export interface RallyEvent01DataReceived { // received from frontend
  name: string;
  start_time: number; // in millis
  end_time: number; // in millis
  upload_deadline: number; // in millis (activities upload deadline)
  place: string;
  lat: number | null;
  lon: number | null;
  category: string;
  notes: string;
  distance: number; // in miles
  speed: number; // in miles per hour
  place_id: string | null;
  zip_code: string | null;
  city: string | null;
  address_line_2: string | null;
}

export interface RallyEvent01Data extends RallyEvent01DataReceived {
  creation_time: number; // in millis
  organizer_user_id: string;

  /* Handled by the system */
  nft_created_id: number | null; // ASA id, null if not created yet, 
  // this is the NFT created as reward for the organizer
  nft_transfer_time: number | null; // null if not transferred yet

  organizer_tokens_total: number; // total tokens of the organizer ever generated
  organizer_tokens_balance: number; // current balance (after claiming)
  participants_tokens_total: number; // total tokens awarded to participants
}

export interface RallyEvent01DataDoc extends RallyEvent01Data {
  id: string;
}

export interface RallyEvent01DataClaimable extends RallyEvent01DataDoc {
  nft_created_id: number;
  nft_transfer_time: null;
}