import { Tracker } from './Tracker';
import { CustomRequest } from './TrackSender';
export declare class BxTracker extends Tracker {
    protected constructor(serverURL: string, patchCount: number, maxNumberOfTrackInRequest: number, customRequest: CustomRequest);
}
