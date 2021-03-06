'use strict'

const { resolve } = require('path')
const { MessageChannel, Worker } = require('worker_threads') // eslint-disable-line import/no-unresolved

const workerThreadHelperPath = resolve(__dirname, './workerThreadHelper.js')

module.exports = class WorkerThreadRunner {
  constructor(funOptions /* options */, env) {
    this._env = env
    this._funOptions = funOptions
    // this._options = options
    this._workerThread = null
  }

  // () => Promise<number>
  cleanup() {
    // TODO console.log('worker thread cleanup')

    // NOTE: terminate returns a Promise with exit code in node.js v12.5+
    return this._workerThread.terminate()
  }

  run(event, context) {
    const { functionName, handlerName, handlerPath, timeout } = this._funOptions

    if (this._workerThread == null) {
      this._workerThread = new Worker(workerThreadHelperPath, {
        // don't pass process.env from the main process!
        env: this._env,
        workerData: {
          functionName,
          handlerName,
          handlerPath,
          timeout,
        },
      })
    }

    return new Promise((_resolve, reject) => {
      const { port1, port2 } = new MessageChannel()

      port1
        .on('message', _resolve)
        // emitted if the worker thread throws an uncaught exception.
        // In that case, the worker will be terminated.
        .on('error', reject)
        // TODO
        .on('exit', (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`))
          }
        })

      this._workerThread.postMessage(
        {
          context,
          event,
          // port2 is part of the payload, for the other side to answer messages
          port: port2,
        },
        // port2 is also required to be part of the transfer list
        [port2],
      )
    })
  }
}
