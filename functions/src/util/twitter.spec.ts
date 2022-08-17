import { getTwitterOauth2Url, getTwitterValidAccessToken, loginWithTwitterOauth2, tweetText } from "./twitter";

describe("Twitter API", () => {
  it("should generate an oauth2.0 link", async () => {
    const r = await getTwitterOauth2Url();
    console.log(r);
  });

  const enableFirstLogin = false;
  if (enableFirstLogin) {
    // don't wait too much after calling getTwitterOauth2Url to call this:
    it("should login given oauth2.0 tokens", async () => {
      const r = await loginWithTwitterOauth2(
        // code: get this from the redirect url query param after the user authorizes the app
        '',
        // codeVerifier: get this from the getTwitterOauth2Url method:
        ''
      );
      console.log(r);
    }).timeout(2 * 60 * 1000);
  }

  it("should get a valid access token after login", async () => {
    const r = await getTwitterValidAccessToken();
    console.log(r);
  }).timeout(2 * 60 * 1000);

  const enableTweetTest = false;
  if (enableTweetTest) {
    it.only("should tweet", async () => {
      const at = await getTwitterValidAccessToken();
      const r = await tweetText("sup", at.accessToken);
      console.log(r);
    }).timeout(2 * 60 * 1000);
  }
});