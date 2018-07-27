import { Storage } from './Storage'
import { CustomRequest, TrackSender } from './TrackSender'
import { objectMethodWrapper } from './Wrapper'

export interface TrackerConfig {
  // 服务器地址
  serverURL: string

  // track有多少条之后会上传
  patchCount?: number

  // 每个请求最多的track条数
  maxNumberOfTrackInRequest?: number

  // 自定义的request方法
  customRequest?: CustomRequest

  // 用户已经标示的ID
  distinctID?: string

  // 两次请求间隔(第一个请求结束到第二个请求开始)时间, 单位毫秒
  requestInterval?: number
}

const TrackerStoragePrefixKey = 'TrackerStoragePrefixKey'
const TrackerDistinctIDKey = 'TrackerDistinctIDKey'

export class Tracker {
  protected constructor(serverURL: string, patchCount: number, maxNumberOfTrackInRequest: number, customRequest: CustomRequest, distinctID: string, requestInterval: number) {
    this.serverURL = serverURL
    this.storageManager = new Storage(TrackerStoragePrefixKey)
    if (distinctID) {
      this.setDistinctID(distinctID)
      this.distinctID = distinctID
    } else {
      this.distinctID = this.getDistinctID()
    }
    this.sender = new TrackSender(serverURL,
      patchCount || 10,
      maxNumberOfTrackInRequest || 50,
      customRequest || wx.request,
      requestInterval === undefined ? 1000 : requestInterval)
  }

  protected sender: TrackSender
  protected globalProperityes: () => any = () => {}
  protected distinctID: string = ''

  private static instance: Tracker
  private storageManager: Storage
  private serverURL: string = ''


  public static configure(config: TrackerConfig) {
    if (this.instance) {
      throw new Error('has been configured')
    }
    this.instance = new this(config.serverURL, config.patchCount, config.maxNumberOfTrackInRequest, config.customRequest, config.distinctID, config.requestInterval)
  }

  public static sharedInstance(): Tracker {
    if (!this.instance) {
      throw new Error('has not been configured!')
    }
    return this.instance
  }

  public enableAutoPageViewEvent(pageView?: (page) => { message: string, detail: any }) {
    const pageConstructor = Page

    Page = function (page) {
      if (pageView) {
        let properties = pageView(page)
        objectMethodWrapper(page, 'onLoad', () => {
          this.trackMessage(properties.message, properties.detail)
        })
      }
      return pageConstructor(page)
    }
  }

  public setGlobalProperties(globalProperties: () => any | any) {
    if (typeof globalProperties === 'object') {
      const properties = globalProperties as any
      this.globalProperityes = () => properties
    }
    if (globalProperties) {
      this.globalProperityes = globalProperties
    }
  }

  public trackMessage(event, detail) {
    this.sender.addTrack({
      properties: {
        ...this.globalProperityes() || {},
        ...detail,
      },
      event,
      distinct_id: this.distinctID,
    })
  }

  public getDistinctID(): string {
    let distinctID = this.storageManager.getStorageSync(TrackerDistinctIDKey)
    if (!distinctID) {
      distinctID = this.generateDistinctID()
      this.storageManager.setStorageSync(TrackerDistinctIDKey, distinctID)
    }
    return distinctID
  }

  public setDistinctID(distinctID: string) {
    this.storageManager.setStorageSync(TrackerDistinctIDKey, distinctID)
  }

  private generateDistinctID() {
    return '' + Date.now() + '-' + Math.floor(1e7 * Math.random()) + '-' + Math.random().toString(16).replace('.', '') + '-' + String(Math.random() * 31242).replace('.', '').slice(0, 8)
  }
}
