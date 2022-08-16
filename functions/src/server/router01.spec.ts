// NOTE: run these tests after deploying to production
// TODO: be able to run these tests before deploying
const enable = false;

import chai from "chai";
import fetch from "node-fetch";
import chaiHttp from 'chai-http';
import { equal } from "assert";

const expect = chai.expect;

chai.use(chaiHttp);
const BASE_URL = "https://us-central1-tumicro-1203.cloudfunctions.net/sweaty_01";

const accounts = [
  {
    email: 'josueajc+apiv1test@gmail.com',
    password: 'josueajc+apiv1test@gmail.comPPdfs',
  },
  {
    email: 'josueajc+apiv1test02@gmail.com',
    password: 'josueajc+apiv1test02@gmail.com3j342',
  },
]

async function getUserToken({ email, password }: { email: string, password: string }) {
  // login to firebase
  const apiKey = "AIzaSyBmZo-DVx-QP1P9uitYTQhtmLXIv1xUcDE";
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  });
  const rj = await res.json();
  // console.log(rj);
  return {
    token: rj.idToken as string,
    userId: rj.localId as string,
  }
}

if (enable) {
  describe("ApiV1", () => {
    it("protected endpoint should reject when firebase token is invalid", async () => {
      let r = await
        chai.request(BASE_URL) // couldn't make it work with the endpoints object
          // maybe we need the middleware body parser express.json() on express
          .post('/api/v1/p/storeUserInfo')
          .set('content-type', 'application/json')
          .set('tkn', "invalid-token")
          .send({
            "userName": "loquillo",
            "name": "pato",
            "lastName": "erere"
          })
        ;
      equal(r.body.status, "AUTH_TKN_ERROR");


      r = await
        chai.request(BASE_URL) // couldn't make it work with the endpoints object
          // maybe we need the middleware body parser express.json() on express
          .post('/api/v1/p/storeUserInfo')
          .set('content-type', 'application/json')
          // .set('tkn', "invalid-token") // without tkn header
          .send({
            "userName": "loquillo",
            "name": "pato",
            "lastName": "erere"
          })
        ;
      equal(r.body.status, "AUTH_TKN_ERROR");
    })

  });
}
