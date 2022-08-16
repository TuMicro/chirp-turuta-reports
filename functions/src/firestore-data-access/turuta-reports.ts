import { FS_reports } from "../constants/firestore";
import { fdb } from "../firestore-init";

// from https://gitlab.com/turuta/turutar3-billing/-/blob/58e4d73afb5af55ba1d95631847ea2388b31644c/tumicro/src/main/java/pe/tumicro/android/vo/firebase/report/BaseReport.java#L21
export interface BaseReport {
  lat?: number | null; // double
  lng?: number | null; // double
  timestamp: number | null; // timestamp in seconds
  details: string | null;
  totPictures: number | null; // integer
}

// get all document references under the reports collection (includes empty docs
// with just subcollection references)
export async function getReportDocumentIds() {
  const s = await fdb.collection(FS_reports).listDocuments()
  return s.map(x => x.id);
}

// get all collections under a specif reports collection
export async function getReportSubcollectionIds(reportType: string) {
  const s = await fdb.collection(FS_reports).doc(reportType).listCollections();
  return s.map(x => x.id);
}

// get all reports of a type, userId and time range
export async function getReports(reportType: string, userId: string,
  startInSecs: number, endInSecs: number) {
  const s = await fdb.collection(FS_reports).doc(reportType)
    .collection(userId).where("timestamp", ">=", startInSecs).where("timestamp", "<=", endInSecs).get();
  return s.docs.map(x => ({
    id: x.id,
    userId,
    reportType,
    ...(x.data() as BaseReport),
  }));
}

export async function getAllReportsInRange(startInSecs: number, endInSecs: number) {
  const r = await getReportDocumentIds();
  const docs = await Promise.all(r.map(async (reportType) => {
    const userIds = await getReportSubcollectionIds(reportType)
    const r1 = await Promise.all(userIds.map(userId => getReports(
      reportType,
      userId,
      startInSecs, endInSecs)));
    // concat all reports
    return r1.reduce((a, b) => a.concat(b), []);
  }));
  // flatten all reports
  return docs.reduce((a, b) => a.concat(b), []);
}
