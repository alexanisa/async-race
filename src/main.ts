import {Garage} from './components/garage/garage';
import { Winners } from './components/garage/winners';

const garage = new Garage;

let winnersInstance: Winners | null = null;

document.getElementById('garage-tab')?.addEventListener('click', () => {
    document.getElementById('garage-tab')?.classList.add('active');
    document.getElementById('winners-tab')?.classList.remove('active');
    garage.render();
});

document.getElementById('winners-tab')?.addEventListener('click', () => {
    document.getElementById('winners-tab')?.classList.add('active');
    document.getElementById('garage-tab')?.classList.remove('active');
    if (!winnersInstance) {
        winnersInstance = new Winners();
    } else {
        winnersInstance.render();
    }
});

garage.render();