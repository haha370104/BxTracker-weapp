import { CustomRequest, TrackSender } from './TrackSender'

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
  private constructor(serverURL: string, patchCount: number, maxNumberOfTrackInRequest: number, customRequest: CustomRequest) {
    this.serverURL = serverURL
    this.sender = new TrackSender(serverURL,
      patchCount || 10,
      maxNumberOfTrackInRequest || 50,
      customRequest || wx.request)
  }

  private static instance: Tracker
  private sender: TrackSender
  private serverURL: string = ''

  private globalProperityes: any = {}

  public static configure(config: TrackerConfig) {
    if (this.instance) {
      throw new Error('has been configured')
    }
    this.instance = new Tracker(config.serverURL, config.patchCount, config.maxNumberOfTrackInRequest, config.customRequest)
  }

  public static sharedInstance(): Tracker {
    if (!this.instance) {
      throw new Error('has not been configured!')
    }
    return this.instance
  }

  public enableAutoPageViewEvent(pageView?: (page) => { message: string, detail: any }) {
    const pageConstructor = Page

    const objectMethodWrapper = (object, methodName: string, implement) => {
      if (object[methodName]) {
        let originMethod = object[methodName]
        object[methodName] = function (e) {
          implement.call(this, e, methodName)
          originMethod.call(this, e)
        }
      } else
        object[methodName] = function (e) {
          implement.call(this, e, methodName)
        }
    }

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
    this.globalProperityes = globalProperties
  }

  public trackMessage(message, detail) {
    this.sender.addTrack({
      message,
      detail,
    })
  }
}