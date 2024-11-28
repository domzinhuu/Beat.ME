// socket.service.ts
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import * as io from "socket.io-client";

@Injectable()
export class SocketService {
  private socket: any;

  constructor() {
    this.socket = io("https://msrsoftware.com.br/socket.io", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
  }

  connect(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on("player-assigned", (data) => observer.next(data));
    });
  }

  onPlayerAttack(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on("player-attack", (data) => observer.next(data));
    });
  }

  sendAttack(data: any) {
    this.socket.emit("player-attack", data);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
