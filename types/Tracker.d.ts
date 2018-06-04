import { CustomRequest } from './TrackSender';
export interface TrackerConfig {
    serverURL: string;
    patchCount?: number;
    maxNumberOfTrackInRequest?: number;
    customRequest?: CustomRequest;
    distinctID?: string;
}
export declare class Tracker {
    protected constructor(serverURL: string, patchCount: number, maxNumberOfTrackInRequest: number, customRequest: CustomRequest, distinctID: string);
    protected extraInfo: any;
    private static instance;
    private sender;
    private storageManager;
    private serverURL;
    private distinctID;
    private globalProperityes;
    static configure(config: TrackerConfig): void;
    static sharedInstance(): Tracker;
    enableAutoPageViewEvent(pageView?: (page: any) => {
        message: string;
        detail: any;
    }): void;
    setGlobalProperties(globalProperties: any): void;
    trackMessage(event: any, detail: any): void;
    getDistinctID(): string;
    setDistinctID(distinctID: string): void;
    private generateDistinctID;
}
