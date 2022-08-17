import { ReportWithIds } from "../firestore-data-access/turuta-reports";

// from: https://docs.google.com/spreadsheets/d/1q1kE9KoZZ3NWSBLzdcR4ISKufB8mxW-c5Ve4p290OJM/edit#gid=541837242&fvid=741961423
const ALLOWED_REPORT_TYPES = [
  'Accident',
  'Card',
  'ConflictingBillCollectors',
  'DontRespectFare',
  'LongWaiting',
  'Stop',
  'Traffic',
];


export async function tweetReport(report: ReportWithIds) {
  // filter out empty detail and 'text' details
  const d = report.details?.toLowerCase().trim() ?? "";
  if (['', 'text'].includes(d)) { // test bots usually send 'text'
    console.log(`Skipping report ${report.id} because it has no details`);
    return;
  }
  // filter out reports that are not in the allowed report types
  if (!ALLOWED_REPORT_TYPES.includes(report.reportType)) {
    console.log(`Skipping report ${report.id} because it is not in the allowed report types`);
    return;
  }
  console.log(`tweetReport: ${JSON.stringify(report)}`);
}