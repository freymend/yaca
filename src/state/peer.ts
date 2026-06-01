import Peer, { type PeerEvents } from "peerjs";

export class PeerJS {
  #peerjs: Peer | null;
  connections = new Set<string>();

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
    this.peer.on("connection", (conn) => {
      if (!this.connections.has(conn.peer)) {
        this.connections.add(conn.peer);
        callback(conn);
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
    if (!this.connections.has(peerId)) {
      const connection = this.peer.connect(peerId);
      if (connection) {
        connection.on("open", () => {
          console.log(`Connection established with peer: ${peerId}`);
          this.connections.add(peerId);
        });
        connection.on("close", () => {
          console.log(`Connection closed with peer: ${peerId}`);
          this.connections.delete(peerId);
        });
      }
    }
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
    this.connections.clear();
  }
}
