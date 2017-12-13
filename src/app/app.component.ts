import { Component, HostListener } from '@angular/core';
import { options, getRandonInt, RUNNING, READY, GAMEOVER } from './shared/variables';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Beat.ME';
  waitInterval;
  p1Bar = document.getElementsByClassName('life-p1') as HTMLCollectionOf<HTMLElement>;
  p2Bar = document.getElementsByClassName('life-p2') as HTMLCollectionOf<HTMLElement>;
  initialized = false;
  running = false;
  keyAlreadyPress = false;
  status = READY;
  textAction: string;
  keyPressed: string;
  playerWin: string;
  reverseDamageMsg: string;
  timing: number;
  action: number;
  p1Life = 100;
  p2Life = 100;

  @HostListener('document:keypress', ['$event']) onKeyPressed(event) {
    if ((event.key === 'a' || event.key === 'A' || event.key === 'l' || event.key === 'L') &&
      this.initialized && !this.keyAlreadyPress) {
      this.keyAlreadyPress = true;
      clearInterval(this.waitInterval);
      this.action = 1500;
      this.keyPressed = event.key.toLowerCase();

      this.inputDamage();
    }
  }

  startTheGame() {
    this.running = true;
    this.status = RUNNING;
    this.startMatch();
  }

  run() {
    if (this.keyPressed === undefined) {
      this.setRandonValues();
      this.waitTime();
    }
  }

  private setRandonValues() {
    this.action = getRandonInt(0, 5);
    this.textAction = options[this.action];
    this.timing = 1;
  }

  private waitTime() {
    this.waitInterval = setInterval(() => {

      if (this.timing === 0) {
        clearInterval(this.waitInterval);
        this.run();
      } else {
        this.timing = 0;
      }

    }, 500);

  }

  private startMatch() {
    this.textAction = undefined;
    this.action = 3;
    const interval = setInterval(() => {
      this.reseteClickedButton();
      if (this.action === 0) {
        clearInterval(interval);
        this.initialized = true;
        this.run();
      } else {
        this.action--;
      }

    }, 1000);
  }
  private inputDamage() {
    document.getElementById(this.keyPressed).classList.remove('btn-primary');
    document.getElementById(this.keyPressed).classList.add('btn-danger');
    document.getElementById(this.keyPressed).classList.add('clicked');
    if (this.textAction !== 'FIGHT') {
      this.reverseDamage();
    } else {
      this.normalDamage();
    }
  }

  private damageP1(element: HTMLElement) {
    if (this.p1Life > 0) {
      this.showDamageInfo(document.getElementById('damageP1'), 'popover-p1');
      this.p1Life -= 20;
      element.style.width = `${this.p1Life}%`;
      if (this.p1Life === 0) {
        this.playerWin = 'JOGADOR 2';
        this.gameOver();
      }

    } else {
      this.gameOver();
    }
  }

  private damageP2(element: HTMLElement) {
    if (this.p2Life > 0) {
      this.showDamageInfo(document.getElementById('damageP2'), 'popover-p2');
      this.p2Life -= 20;
      element.style.width = `${this.p2Life}%`;

      if (this.p2Life === 0) {
        this.playerWin = 'JOGADOR 1';
        this.gameOver();
      }

    } else {
      this.gameOver();
    }
  }

  private reverseDamage() {
    if (this.keyPressed === 'a') {
      this.keyPressed = 'l';
      this.showReverseDamageMsg('Jogador 1');
    } else {
      this.keyPressed = 'a';
      this.showReverseDamageMsg('Jogador 2');
    }
  }

  private normalDamage() {
    this.resetDamageInfoStatus();
    switch (this.keyPressed) {
      case 'a':
        this.keyPressed = undefined;
        this.damageP2(this.p2Bar[0]);
        break;
      case 'l':
        this.keyPressed = undefined;
        this.damageP1(this.p1Bar[0]);
        break;
    }
    this.keyAlreadyPress = false;
    this.initialized = false;

    if (this.status !== GAMEOVER) {
      this.startMatch();
    }

  }

  private gameOver() {
    this.status = GAMEOVER;
    this.running = false;
    this.initialized = false;
    this.textAction = undefined;
  }

  private restartGame() {
    this.p1Life = 100;
    this.p1Bar[0].style.width = `${this.p1Life}%`;
    this.p2Life = 100;
    this.p2Bar[0].style.width = `${this.p2Life}%`;
    this.initialized = false;
    this.running = false;
    this.keyAlreadyPress = false;
    this.status = READY;
    this.startTheGame();
  }

  private showDamageInfo(htmlElement, classOut) {
    htmlElement.classList.remove(classOut);
    htmlElement.classList.add('popover-damage-active');
    let count = 2;

    const interval = setInterval(() => {
      if (count === 0) {
        clearInterval(interval);
        this.resetDamageInfoStatus();
        return;
      }
      count--;
    }, 2000);

  }

  private showReverseDamageMsg(player: string) {
    this.reverseDamageMsg = `${player} apertou adiantado e Levou o DANO!`;
    let time = 1;
    const showInterval = setInterval(() => {
      if (time === 0) {
        clearInterval(showInterval);
        this.reverseDamageMsg = undefined;
        this.normalDamage();

      }
      time--;
    }, 1000);
  }

  private resetDamageInfoStatus() {
    document.getElementById('damageP1').classList.add('popover-p1');
    document.getElementById('damageP1').classList.remove('popover-damage-active');
    document.getElementById('damageP2').classList.add('popover-p2');
    document.getElementById('damageP2').classList.remove('popover-damage-active');
  }

  private reseteClickedButton() {
    const btnP1 = document.getElementById('a');
    const btnP2 = document.getElementById('l');

    if (btnP1.classList.contains('btn-danger')) {
      btnP1.classList.remove('btn-danger');
      btnP1.classList.add('btn-primary');
    }

    if (btnP2.classList.contains('btn-danger')) {
      btnP2.classList.remove('btn-danger');
      btnP2.classList.add('btn-primary');
    }
    btnP1.classList.remove('clicked');
    btnP2.classList.remove('clicked');



  }


}
