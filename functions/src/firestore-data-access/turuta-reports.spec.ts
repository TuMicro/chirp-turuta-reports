import { expect } from "chai";
import { getAllReportsInRange, getReportDocumentIds, getReports, getReportSubcollectionIds } from "./turuta-reports";
// import index from "./";

describe("TuRuta Reports", () => {
  it("should be able to query reports", async () => {
    const start = 1574597671;
    const end = 1574597671;
    const x = await getAllReportsInRange(start, end);
    expect(x.length).to.eq(1);

    // get all reports from the past days until now
    // const start2 = Math.round(Date.now() / 1000) - (21 * 24 * 60 * 60);
    // const end2 = Math.round(Date.now() / 1000);
    // const x2 = await getAllReportsInRange(start2, end2);
    // console.log(x2);
    // console.log(JSON.stringify(x2));
    // console.log(x2.length);
  }).timeout(2 * 60 * 1000);
});