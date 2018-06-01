export declare class Storage {
    private prefix;
    private cache;
    constructor(prefix: string);
    private innerStorageKey;
    getValue<T>(key: string, defaultValue?: T): Promise<T>;
    setValue(key: string, value: any): Promise<void>;
    getMemoryCache(key: string): any;
    setMemoryCache(key: string, value: any): void;
    getStorage(key: string): Promise<any>;
    getStorageSync(key: string): any;
    setStorage(key: string, value: any): Promise<void>;
    setStorageSync(key: string, value: any): void;
}
