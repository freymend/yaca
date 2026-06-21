import Peer, { type DataConnection, type PeerEvents } from "peerjs";

export class PeerJS {
  #peerjs: Peer | null;
  connections = {} as Record<string, DataConnection>;

  constructor() {
    this.#peerjs = null;
  }

  private get peer() {
    if (!this.#peerjs) {
      throw new Error("PeerJS instance not initialized. Call initialize() first.");
    }
    return this.#peerjs;
  }

  onopen(callback: PeerEvents["open"]) {
    this.peer.on("open", callback);
  }

  onconnection(callback: PeerEvents["connection"]) {
    // TODO: refactor connection handling
    this.peer.on("connection", (conn) => {
      if (!this.connections[conn.peer]) {
        this.connections[conn.peer] = conn;
        callback(conn);
        conn.on("close", () => {
          console.log(`Connection closed with peer: ${conn.peer}`);
          delete this.connections[conn.peer];
        });
      }
    });
  }

  oncall(callback: PeerEvents["call"]) {
    this.peer.on("call", callback);
  }

  onclose(callback: PeerEvents["close"]) {
    this.peer.on("close", callback);
  }

  ondisconnected(callback: PeerEvents["disconnected"]) {
    this.peer.on("disconnected", callback);
  }

  onerror(callback: PeerEvents["error"]) {
    this.peer.on("error", callback);
  }

  connectToPeer(peerId: string) {
   return this.peer.connect(peerId);
  }

  initialize(peerId: string) {
    if (this.#peerjs) {
      return this.#peerjs;
    }
    this.#peerjs = new Peer(peerId);
  }

  destroy() {
    this.peer.destroy();
    this.#peerjs = null;
    this.connections = {};
  }
}
