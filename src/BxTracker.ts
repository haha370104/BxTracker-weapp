import { Tracker } from './Tracker'
import { CustomRequest } from './TrackSender'

export class BxTracker extends Tracker {

  protected constructor(serverURL: string, patchCount: number, maxNumberOfTrackInRequest: number, customRequest: CustomRequest) {
    super(serverURL, patchCount, maxNumberOfTrackInRequest, customRequest)

    const systemInfo = wx.getSystemInfoSync()

    this.extraInfo.$model = systemInfo['model']
    this.extraInfo.$screen_width = Number(systemInfo['windowWidth'])
    this.extraInfo.$screen_height = Number(systemInfo['windowHeight'])
    this.extraInfo.$os = systemInfo['system'].split(' ')[0]
    this.extraInfo.$os_version = systemInfo['system'].split(' ')[1]
    this.extraInfo.$env_version = systemInfo['version']
  }
}

