import { CustomRequest, TrackSender } from './TrackSender';
export interface TrackerConfig {
    serverURL: string;
    patchCount?: number;
    maxNumberOfTrackInRequest?: number;
    customRequest?: CustomRequest;
    distinctID?: string;
    requestInterval?: number;
}
export declare class Tracker {
    protected constructor(serverURL: string, patchCount: number, maxNumberOfTrackInRequest: number, customRequest: CustomRequest, distinctID: string, requestInterval: number);
    protected sender: TrackSender;
    protected globalProperityes: () => any;
    protected distinctID: string;
    private static instance;
    private storageManager;
    private serverURL;
    static configure(config: TrackerConfig): void;
    static sharedInstance(): Tracker;
    enableAutoPageViewEvent(pageView?: (page: any) => {
        message: string;
        detail: any;
    }): void;
    setGlobalProperties(globalProperties: () => any | any): void;
    trackMessage(event: any, detail: any): void;
    getDistinctID(): string;
    setDistinctID(distinctID: string): void;
    private generateDistinctID;
}
