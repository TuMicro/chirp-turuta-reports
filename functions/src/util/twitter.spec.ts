import { ApiResponseError } from "twitter-api-v2";
import { getTwitterOauth2Url, getTwitterValidAccessToken, loginWithTwitterOauth2 } from "./twitter";

describe("TwitterAccess API", () => {
  it("should generate an oauth2.0 link", async () => {
    const r = await getTwitterOauth2Url();
    console.log(r);
  });

  const enableFirstLogin = false;
  if (enableFirstLogin) {
    // don't wait too much after calling getTwitterOauth2Url to call this:
    it("should login given oauth2.0 tokens", async () => {
      try {
        const r = await loginWithTwitterOauth2(
          // code: get this from the redirect url query param after the user authorizes the app
          '',
          // codeVerifier: get this from the getTwitterOauth2Url method:
          ''
        );
        console.log(r);

      } catch (e) {
        console.log(e);
        if (e instanceof ApiResponseError) {
          console.log(JSON.stringify(e.data, null, 2));
          console.log("isAuthError", e.isAuthError);
        }
        throw e;
      }
    }).timeout(2 * 60 * 1000);
  }

  it("should get a valid access token after login", async () => {
    const r = await getTwitterValidAccessToken();
    console.log(r);
  }).timeout(2 * 60 * 1000);
});