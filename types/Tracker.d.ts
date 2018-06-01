import { CustomRequest } from './TrackSender';
export interface TrackerConfig {
    serverURL: string;
    patchCount?: number;
    maxNumberOfTrackInRequest?: number;
    customRequest?: CustomRequest;
}
export declare class Tracker {
    private constructor();
    private static instance;
    private sender;
    private serverURL;
    private globalProperityes;
    static configure(config: TrackerConfig): void;
    static sharedInstance(): Tracker;
    enableAutoPageViewEvent(pageView?: (page: any) => {
        message: string;
        detail: any;
    }): void;
    setGlobalProperties(globalProperties: any): void;
    trackMessage(message: any, detail: any): void;
}
