const FIRULA = 'FIRULA';
const FILIAL = 'FILIAL';
const FIGURA = 'FIGURA';
const FIRME = 'FIRME';
const FIGHT = 'FIGHT';

export const READY = 'ready';
export const RUNNING = 'running';
export const GAMEOVER = 'gameover';

export const options = [FIRULA, FILIAL, FIRME, FIGURA, FIGHT];
export const getRandonInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

