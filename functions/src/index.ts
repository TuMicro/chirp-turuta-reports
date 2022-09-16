import { init } from './init/init';
init(); // Executed synchronously before the rest of your app loads

import * as functions from 'firebase-functions';
import { Report, ReportWithIds } from './firestore-data-access/turuta-reports';
import { tweetReport } from './tasks/tweet-report';

// Listen for new documents on the reports collection
export const turuta_app_reports_listener = functions.firestore
    .document('reports/{reportType}/{userId}/{reportId}')
    .onCreate(async (snap, context) => {
      const reportType = context.params.reportType as string;
      const userId = context.params.userId as string;
      const reportId = context.params.reportId as string;
      const reportWithIds : ReportWithIds = {
        id: reportId,
        userId,
        reportType,
        ...(snap.data() as Report)
      };
      await tweetReport(reportWithIds);
    });