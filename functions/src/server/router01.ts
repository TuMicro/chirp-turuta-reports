import * as express from "express";
import { createNewEvent } from "./logic/rally-event-01";
import { getFirebaseAuthMiddleware } from "./util/express-firebase-middleware";
import { logRequest } from "./util/log-request-middleware";
import { logAndAnswer } from "./util/utils";

export const routerV1 = express
  .Router()

  // declaring auth protected prefix
  .use("/p/", getFirebaseAuthMiddleware(false))
  // declaring auth protected prefix but where authentication is optional
  .use("/po/", getFirebaseAuthMiddleware(true))

  // log request path and body
  .use(logRequest)


  // endpoints code:


  .post('/p/createEvent', async function (req, res) {
    const userId = res.locals.userId as string;
    const rawBody = req.body;

    try {
      const { docId: eventId, eventData } = await createNewEvent({
        name: String(rawBody.name),
        start_time: Number(rawBody.start_time),
        end_time: Number(rawBody.end_time),
        upload_deadline: Number(rawBody.upload_deadline),
        place: String(rawBody.place),
        lat: rawBody.lat == null ? null : Number(rawBody.lat),
        lon: rawBody.lon == null ? null : Number(rawBody.lon),
        category: String(rawBody.category),
        notes: String(rawBody.notes),
        distance: Number(rawBody.distance),
        speed: Number(rawBody.speed),
        place_id: rawBody.place_id == null ? null : String(rawBody.place_id),
        zip_code: rawBody.zip_code == null ? null : String(rawBody.zip_code),
        city: rawBody.city == null ? null : String(rawBody.city),
        address_line_2: rawBody.address_line_2 == null ? null : String(rawBody.address_line_2),
      }, userId);


      logAndAnswer(res, {
        status: "OK",
        docId: eventId,
        eventData,
      });
    } catch (e) {
      logAndAnswer(res, {
        status: "ERROR",
        message: (e as any).message,
      });
    }
  })
  ;

