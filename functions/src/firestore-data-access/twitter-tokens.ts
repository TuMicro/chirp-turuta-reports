import { FS_twitter_access_tokens } from "../constants/firestore";
import { fdb } from "../firestore-init";

// store the refresh token and access token for an id (maybe the username
// we can decide this later) in firestore
export async function setTwitterAccessTokens(docId: string, tokens: TwitterAccessTokens) {
  await fdb.collection(FS_twitter_access_tokens).doc(docId).set(tokens);
}

// get the refresh token and access token for an id
export async function getTwitterAccessTokens(docId: string) {
  const doc = await fdb.collection(FS_twitter_access_tokens).doc(docId).get();
  return doc.data() as TwitterAccessTokens | undefined;
}

export interface TwitterAccessTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // number of seconds until expiration
  lastTimeUpdated: number; // timestamp in millis
  scope: string[];
}
