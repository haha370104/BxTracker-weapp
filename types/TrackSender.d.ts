export declare type CustomRequest = (options: wx.RequestOptions) => void;
export declare class TrackSender {
    private storageManager;
    private url;
    private patchCount;
    private maxNumberOfTrackInRequest;
    private requestInterval;
    private enableBase64Encode;
    private processingFlag;
    private forceToSend;
    private customRequest;
    constructor(url: string, patchCount?: number, maxNumberOfTrackInRequest?: number, customRequest?: CustomRequest, requestInterval?: number, enableBase64Encode?: boolean);
    private delay;
    private sendTrack;
    private tryToSendPatchedTrack;
    addTrack(properties: any): Promise<void>;
}
