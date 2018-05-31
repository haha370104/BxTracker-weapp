import { Storage as StroageManager } from './Storage'
import { Base64 } from 'js-base64'

const TrackStoragePreffixKey = 'TrackStoragePreffixKey'
const TrackPatchKey = 'TrackPatchKey'
const TrackIncrementIdKey = 'TrackIncrementIdKey'

export type CustomRequest = (options: wx.RequestOptions) => void

export class TrackSender {
  private storageManager: StroageManager

  private url: string
  private patchCount = 10
  private maxNumberOfTrackInRequest = 50

  private processingFlag: boolean = false

  private customRequest: CustomRequest
  private requestQueue: wx.RequestOptions[] = []

  constructor(url: string, patchCount: number = 10, maxNumberOfTrackInRequest: number = 50, customRequest: CustomRequest = wx.request) {
    this.url = url
    this.storageManager = new StroageManager(TrackStoragePreffixKey)
    this.patchCount = patchCount
    this.maxNumberOfTrackInRequest = maxNumberOfTrackInRequest
    this.customRequest = customRequest
  }

  private sendTrack(properties: any) {
    this.processingFlag = true
    return new Promise((resolve, reject) => {
      this.customRequest({
        url: this.url,
        data: {
          data: Base64.encode(JSON.stringify({
            ...properties,
          })),
        },
        success: res => {
          resolve(res)
        },
        fail: reason => {
          reject(reason)
        },
        complete: () => {
          this.processingFlag = false
        },
      })
    })
  }

  private async tryToSendPatchedTrack() {
    if (this.processingFlag) {
      return
    }
    const trackPatch: any[] = (await this.storageManager.getValue(TrackPatchKey)) as any[]
    if (trackPatch.length < this.patchCount) {
      return
    }
    let patch = trackPatch.slice(0, Math.min(trackPatch.length, this.maxNumberOfTrackInRequest))
    try {
      await this.sendTrack(patch)
      trackPatch.splice(0, patch.length)
      await this.storageManager.setValue(TrackPatchKey, trackPatch)
    } catch (e) {
    }
    await this.tryToSendPatchedTrack()
  }

  public async addTrack(properties: any) {
    let trackIncrementId = await this.storageManager.getValue(TrackIncrementIdKey, 0)
    trackIncrementId++
    properties['_id'] = trackIncrementId

    let trackPatch: any[] = (await this.storageManager.getValue(TrackPatchKey)) as any[]
    trackPatch.push(properties)

    const trackPatchSetterPromise = this.storageManager.setValue(TrackPatchKey, trackPatch)
    const trackIdSetterPromise = this.storageManager.setValue(TrackIncrementIdKey, trackIncrementId)
    await Promise.all([trackIdSetterPromise, trackPatchSetterPromise])

    await this.tryToSendPatchedTrack()
  }
}
