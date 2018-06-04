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
}

export class Tracker {
  protected constructor(serverURL: string, patchCount: number, maxNumberOfTrackInRequest: number, customRequest: CustomRequest) {
    this.serverURL = serverURL
    this.sender = new TrackSender(serverURL,
      patchCount || 10,
      maxNumberOfTrackInRequest || 50,
      customRequest || wx.request)
  }

  protected extraInfo: any = {}

  private static instance: Tracker
  private sender: TrackSender
  private serverURL: string = ''

  private globalProperityes: any = {}

  public static configure(config: TrackerConfig) {
    if (this.instance) {
      throw new Error('has been configured')
    }
    this.instance = new this(config.serverURL, config.patchCount, config.maxNumberOfTrackInRequest, config.customRequest)
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

  public setGlobalProperties(globalProperties: any) {
    this.globalProperityes = globalProperties || {}
  }

  public trackMessage(event, detail) {
    this.sender.addTrack({
      properties: {
        ...this.extraInfo,
        ...this.globalProperityes,
        ...detail,
      },
      event,
    })
  }
}
