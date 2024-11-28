import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import * as io from "socket.io-client";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  private socket: any;
  private playerId: number;
  
  title = 'Beat.ME';
  p1Bar = document.getElementsByClassName('life-p1') as HTMLCollectionOf<HTMLElement>;
  p2Bar = document.getElementsByClassName('life-p2') as HTMLCollectionOf<HTMLElement>;
  initialized = false;
  running = false;
  status = 'READY';
  textAction: string;
  playerWin: string;
  action: number;
  p1Life = 100;
  p2Life = 100;

  constructor() {
    this.socket = io('https://msrsoftware.com.br/socket.io', {
      transports: ['websocket', 'polling']
    });
  }

  ngOnInit() {
    this.socket.on('player-assigned', (data: any) => {
      this.playerId = data.playerId;
    });

    this.socket.on('game-update', (state: any) => {
      this.running = state.running;
      this.initialized = state.initialized;
      this.textAction = state.textAction;
      this.action = state.action;
      this.p1Life = state.p1Life;
      this.p2Life = state.p2Life;
      
      this.p1Bar[0].style.width = `${this.p1Life}%`;
      this.p2Bar[0].style.width = `${this.p2Life}%`;
      
      if (this.p1Life <= 0) this.playerWin = 'JOGADOR 2';
      if (this.p2Life <= 0) this.playerWin = 'JOGADOR 1';
      
      this.status = state.running ? 'RUNNING' : 'GAMEOVER';
    });
  }

  @HostListener("document:keypress", ["$event"])
  onKeyPressed(event) {
    if (
      (event.key === "a" ||
        event.key === "A" ||
        event.key === "l" ||
        event.key === "L") &&
      this.initialized
    ) {
      this.socket.emit("player-attack", {
        playerId: this.playerId,
        key: event.key.toLowerCase(),
      });
    }
  }

  startTheGame() {
    console.log('CLicou')
    this.socket.emit("start-game");
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}