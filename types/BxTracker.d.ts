import { Tracker } from './Tracker';
import { CustomRequest } from './TrackSender';
export declare class BxTracker extends Tracker {
    private getSystemInfoComplete;
    private systemInfo;
    private getSystemInfoQueue;
    protected constructor(serverURL: string, patchCount: number, maxNumberOfTrackInRequest: number, customRequest: CustomRequest, distinctID: string);
    private initSystemInfo;
    private getSystemInfo;
    trackMessage(event: any, detail: any): void;
}
