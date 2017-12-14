import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Beat.ME'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Beat.ME');
  }));

  it(`should change the value of 'running' to true when start the game`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.running).toBeFalsy();
    app.startTheGame();
    expect(app.running).toBeTruthy();
  }));

  it(`should change the value of 'status' to 'RUNNING' when start the game`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.status).toEqual('ready');
    app.startTheGame();
    expect(app.status).toEqual('running');
  }));

  it(`should inflict damage to player 1`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.keyPressed = 'l';
    app.textAction = 'FIGHT';
    expect(app.p1Life).toEqual(100);
    app.inputDamage();
    expect(app.p1Life).toEqual(80);

  }));

  it(`should inflict damage to player 2`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.keyPressed = 'a';
    app.textAction = 'FIGHT';
    expect(app.p2Life).toEqual(100);
    app.inputDamage();
    expect(app.p2Life).toEqual(80);

  }));

  it(`should inflict damage to player 1 when he anticipate the click`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.keyPressed = 'a';
    app.textAction = 'FIRULA';
    app.p1Life = 100;
    expect(app.p1Life).toEqual(100);
    app.inputDamage();
    app.normalDamage();
    expect(app.p1Life).toEqual(80);
  }));

  it(`should inflict damage to player 2 when he anticipate the click`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.keyPressed = 'l';
    app.textAction = 'FIRULA';
    app.p2Life = 100;
    expect(app.p2Life).toEqual(100);
    app.inputDamage();
    app.normalDamage();
    expect(app.p2Life).toEqual(80);
  }));

  it(`should inflict damage to player 2 and show gameover message with player 1 win.`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    app.keyPressed = 'a';
    app.textAction = 'FIGHT';
    app.p2Life = 20;
    expect(app.p2Life).toEqual(20);
    app.inputDamage();
    expect(app.p2Life).toEqual(0);
    expect(app.playerWin).toEqual('JOGADOR 1');
  }));

  it(`should inflict damage to player 1 and show gameover message with player 2 win.`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    app.keyPressed = 'l';
    app.textAction = 'FIGHT';
    app.p1Life = 20;
    expect(app.p1Life).toEqual(20);
    app.inputDamage();
    expect(app.p1Life).toEqual(0);
    expect(app.playerWin).toEqual('JOGADOR 2');
  }));

  it(`should be restarting the life values ​​when the reset button is pressed `, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    app.p1Life = 0;
    app.p2Life = 0;
    expect(app.p1Life).toEqual(0);
    expect(app.p2Life).toEqual(0);
    app.restartGame();
    expect(app.p1Life).toEqual(100);
    expect(app.p2Life).toEqual(100);
  }));

});
