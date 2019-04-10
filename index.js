import EventEmitter from 'wolfy87-eventemitter/EventEmitter'
import hark from 'hark';

import { getSystemInfo } from './lib/system-info'
import { waitForDeviceInfo } from './lib/devices'

const emitter = new EventEmitter;

/** @implements {GlobalSystemInfoObject} */
class SystemInfo {
  constructor() {
    this.userMediaStatus = {};
    this.systemInfo = getSystemInfo();

    waitForDeviceInfo().then(userMediaStatus => {
      this.userMediaStatus = userMediaStatus;
    });
  }

  enableWebcam() {
    return navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    }).then(stream => {
      emitter.emit('localStream', stream);

      const speech = hark(stream, {
        interval: 500
      });
      speech.on('volume_change', volume => {
        emitter.emit('localVolumeChange', volume);
      });
    });
  }

  on(...args) {
    return emitter.on(...args)
  }
}

export default function activate() {
  return new SystemInfo();
}