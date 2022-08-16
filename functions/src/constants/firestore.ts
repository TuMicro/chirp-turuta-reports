import { isTesting } from "../util/devEnv";

export const FS_rally_events_01 = (isTesting() ? 'test_' : '' ) + 'rally_events_01';

export const FS_reports = 'reports';