import { TwitterApi, TwitterApiOAuth2Init } from 'twitter-api-v2';
import { getTwitterAccessTokens, setTwitterAccessTokens, TwitterAccessTokens } from '../firestore-data-access/twitter-tokens';

// Must match exactly the callback URL in the Twitter app settings.
// I was getting "You weren’t able to give access to the App. Go back and try logging in again."
// because it was different by one trailing slash.
const CALLBACK_URL = 'https://turuta.pe';

// Only for identification in the firestore collection.
// We only have this id at the moment anyway.
const TWITTER_USER_ID_USED_INTERNALLY = 'turuta_reportes';

function getPartialClientForAuthLinks() {
  const initParams: TwitterApiOAuth2Init = {
    clientId: process.env.TWITTER_OAUTH2_CLIENT_ID ?? "",
    clientSecret: process.env.TWITTER_OAUTH2_CLIENT_SECRET ?? "",
  };
  if (initParams.clientId === "" || initParams.clientSecret === "") {
    throw new Error("TWITTER_OAUTH2_CLIENT_ID and TWITTER_OAUTH2_CLIENT_SECRET must be set");
  }
  // Create a partial client for auth links
  return new TwitterApi(initParams);
}

export async function getTwitterOauth2Url() {
  const client = getPartialClientForAuthLinks();
  const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
    CALLBACK_URL,
    {
      scope: [
        // for being able to tweet on the user's behalf
        // https://developer.twitter.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/post-tweets
        'tweet.read', 'users.read', 'tweet.write',
        // for being able to refresh the access token
        'offline.access'
      ]
    });
  // Redirect your client to {url}
  console.log('Please go to', url);
  return { url, codeVerifier, state };
}

export async function loginWithTwitterOauth2(code: string, codeVerifier: string) {
  const client = getPartialClientForAuthLinks();
  const { accessToken, refreshToken, expiresIn, scope } = await client.loginWithOAuth2({
    code,
    codeVerifier,
    redirectUri: CALLBACK_URL
  });
  // {loggedClient} is an authenticated client in behalf of some user
  // Store {accessToken} somewhere, it will be valid until {expiresIn} is hit.
  // If you want to refresh your token later, store {refreshToken} (it is 
  // present if 'offline.access' has been given as scope)
  console.log('logged in!!, access token valid during ', expiresIn, 'seconds');

  const tokens: TwitterAccessTokens = {
    accessToken,
    refreshToken: refreshToken ?? "",
    expiresIn,
    lastTimeUpdated: Date.now(),
    scope,
  };

  // storing the tokens in firestore
  await setTwitterAccessTokens(TWITTER_USER_ID_USED_INTERNALLY, tokens);

  return tokens;
}


export async function getTwitterValidAccessToken() {
  const x = await getTwitterAccessTokens(TWITTER_USER_ID_USED_INTERNALLY);
  if (x === undefined) {
    throw new Error("No previous twitter tokens found, please login with twitter first and store the tokens");
  }
  // check if token is expired (10 seconds before it is considered expired)
  if ((x.expiresIn - 10) * 1000 < Date.now() - x.lastTimeUpdated) {
    // refresh the tokens
    const client = getPartialClientForAuthLinks();
    const { accessToken, refreshToken, expiresIn, scope } = await client.refreshOAuth2Token(x.refreshToken);
    const tokens: TwitterAccessTokens = {
      accessToken,
      refreshToken: refreshToken ?? "",
      expiresIn,
      lastTimeUpdated: Date.now(),
      scope,
    };
    // storing the tokens in firestore
    await setTwitterAccessTokens(TWITTER_USER_ID_USED_INTERNALLY, tokens);
    console.log('token refreshed!!, access token valid during ', expiresIn, 'seconds');
    return tokens;
  }
  return x;
}

export async function tweetText(text: string, accessToken: string) {
  const client = new TwitterApi(accessToken);
  // Tell typescript the type of client
  const readWriteClient = client.readWrite;
  const r = await readWriteClient.v2.tweet({
    text: text,
  });
  console.log(JSON.stringify({
    action: 'tweet',
    ...r,
  }));
  return r;
}

