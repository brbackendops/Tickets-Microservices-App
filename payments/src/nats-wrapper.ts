import nats, { Stan } from 'node-nats-streaming';
import logger from './logger';

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('cannot access client before initializing');
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, {
      url,
      connectTimeout: 20000,
      verbose: true,
    });

    return new Promise((resolve, reject) => {
      this._client!.on('connect', () => {
        logger.info('connection successfull to NATS');
        console.log('connection successfull to NATS');
        resolve();
      });

      this._client!.on('error', err => {
        logger.error(err);
        console.log('connection failed to NATS');
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
