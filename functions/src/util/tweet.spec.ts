import { ApiResponseError } from "twitter-api-v2";
import { getTwitterValidAccessToken, tweetText } from "./twitter";

describe("Tweet", () => {
  const enableTweetTest = true;
  if (enableTweetTest) {
    it("should tweet", async () => {
      try {
        const at = await getTwitterValidAccessToken();
        console.log("access token gotten");
        const r = await tweetText("test tweet", at.accessToken);
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
});