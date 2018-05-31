export class Storage {
  private prefix: string = ''
  private cache: any = {}

  constructor(prefix: string) {
    this.prefix = prefix
  }

  private innerStorageKey(key: string) {
    return `${this.prefix}.${key}`
  }

  public async getValue<T>(key: string, defaultValue?: T): Promise<T> {
    const innerKey = this.innerStorageKey(key)
    const memoryCache = this.getMemoryCache(innerKey)
    if (memoryCache) {
      return memoryCache
    }
    const storageCache = await this.getStorage(innerKey)
    if (storageCache) {
      this.setMemoryCache(innerKey, storageCache)
      return storageCache
    }
    return defaultValue
  }

  public async setValue(key: string, value: any) {
    const innerKey = this.innerStorageKey(key)
    this.setMemoryCache(innerKey, value)
    await this.setStorage(innerKey, value)
  }

  public getMemoryCache(key: string) {
    return this.cache[this.innerStorageKey(key)]
  }

  public setMemoryCache(key: string, value: any) {
    this.cache[this.innerStorageKey(key)] = value
  }

  public getStorage(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const innerKey = this.innerStorageKey(key)
      wx.getStorage({
        key: innerKey,
        success: res => {
          resolve(res.data)
        },
        fail: reason => {
          reject(reason)
        },
      })
    })
  }

  public getStorageSync(key: string): any {
    return wx.getStorageSync(this.innerStorageKey(key))
  }

  public setStorage(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key: this.innerStorageKey(key),
        data: value,
        success: () => {
          resolve()
        },
        fail: reason => {
          reject(reason)
        },
      })
    })
  }

  public setStorageSync(key: string, value: any): void {
    const innerKey = this.innerStorageKey(key)
    wx.setStorageSync(innerKey, value)
  }
}
