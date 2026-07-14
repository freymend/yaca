import Peer, { type BaseConnectionErrorType, type DataConnectionErrorType, type PeerError, type DataConnection } from "peerjs";

type PeerServiceEvents = {
  connected: {
    peerId: string;
  }
  connection: DataConnection;
  disconnected: {
    peerId: string;
  }
  message: {
    peerId: string;
    data: unknown;
  }
  error: {
    peerId: string;
    error: PeerError<`${DataConnectionErrorType}` | `${BaseConnectionErrorType}`>;
  }
}

export class PeerJS extends EventTarget {
  #peerjs: Peer | null = null;
  connections: Record<string, DataConnection> = {};

  private get peer() {
    if (!this.#peerjs) {
      throw new Error("PeerJS instance not initialized. Call initialize() first.");
    }
    return this.#peerjs;
  }

  initialize(peerId: string) {
    if (this.#peerjs) {
      return this.#peerjs;
    }
    this.#peerjs = new Peer(peerId);
    this.#peerjs.on('connection', (conn) => {
      this.handleConnection(conn);
    });
  }

  on<K extends keyof PeerServiceEvents>(event: K, listener: (event: CustomEvent<PeerServiceEvents[K]>) => void) {
    const callback = (e: Event) => {
      listener(e as CustomEvent<PeerServiceEvents[K]>);
    }

    this.addEventListener(event, callback);

    return () => {
      this.removeEventListener(event, callback );
    }
  }

  private handleConnection(conn: DataConnection) {
    if (this.connections[conn.peer]) {
      return;
    }

    this.connections[conn.peer] = conn;

    this.dispatchEvent(new CustomEvent<PeerServiceEvents['connection']>('connection', { detail: conn }));

    conn.on('open', () => {
      this.dispatchEvent(new CustomEvent<PeerServiceEvents['connected']>('connected', { detail: { peerId: conn.peer } }));
    });

    conn.on('data', (data) => {
      this.dispatchEvent(new CustomEvent<PeerServiceEvents['message']>('message', { detail: { peerId: conn.peer, data } }));
    });

    conn.on('close', () => {
      delete this.connections[conn.peer];
      this.dispatchEvent(new CustomEvent<PeerServiceEvents['disconnected']>('disconnected', { detail: { peerId: conn.peer } }));
    });

    conn.on('error', (err) => {
      this.dispatchEvent(new CustomEvent<PeerServiceEvents['error']>('error', { detail: { peerId: conn.peer, error: err } }));
    });
  }

  connectToPeer(peerId: string): DataConnection | null {
    if (!this.#peerjs) {
      throw new Error("PeerJS instance not initialized. Call initialize() first.");
    }
    if (this.connections[peerId]) {
      return this.connections[peerId];
    }
    const connection = this.#peerjs.connect(peerId);
    this.handleConnection(connection);
    return connection;
  }

  destroy() {
    this.peer.destroy();
    this.#peerjs = null;
    this.connections = {};
  }
}
