import { Tracker } from './Tracker'
import { CustomRequest } from './TrackSender'

export class BxTracker extends Tracker {

  private getSystemInfoComplete = false
  private systemInfo: any = {}
  private getSystemInfoQueue = []

  protected constructor(serverURL: string, patchCount: number, maxNumberOfTrackInRequest: number, customRequest: CustomRequest, distinctID: string) {
    super(serverURL, patchCount, maxNumberOfTrackInRequest, customRequest, distinctID)
    this.initSystemInfo()
  }

  private initSystemInfo() {
    const systemInfo = wx.getSystemInfoSync()

    this.systemInfo.$model = systemInfo['model']
    this.systemInfo.$screen_width = Number(systemInfo['windowWidth'])
    this.systemInfo.$screen_height = Number(systemInfo['windowHeight'])
    this.systemInfo.$os = systemInfo['system'].split(' ')[0]
    this.systemInfo.$os_version = systemInfo['system'].split(' ')[1]
    this.systemInfo.$env_version = systemInfo['version']

    wx.getNetworkType({
      success: res => {
        this.globalProperityes.$network_type = res.networkType
      },
      complete: () => {
        this.getSystemInfoComplete = true
      }
    })
  }

  private getSystemInfo(complete: (systemInfo: any) => void) {
    if (!this.getSystemInfoComplete) {
      this.getSystemInfoQueue.push(complete)
    } else {
      const consume = () => {
        this.getSystemInfoQueue.forEach(value => {
          value(this.systemInfo)
        })
        this.getSystemInfoQueue = []
      }
      complete(this.systemInfo)
      consume()
    }
  }

  public trackMessage(event, detail) {
    this.getSystemInfo(systemInfo => {
      this.sender.addTrack({
        properties: {
          ...systemInfo,
          ...this.globalProperityes,
          ...detail,
        },
        event,
        distinct_id: this.distinctID,
      })
    })
  }
}

