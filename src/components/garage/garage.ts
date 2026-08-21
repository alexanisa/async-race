import { createCar, getCar, getCars } from '../../api/api';
import type {Car} from '../../types';

class Garage {
    currentPage: number = 1;
    cars: Car[] = [];
    totalCars: number = 0;
    limit: number = 7;

    constructor() {
        this.loadCars();
    }

    async loadCars() {
        const cars = await getCars(this.currentPage, this.limit);
        if (cars) {
            this.cars = cars;
            this.render();
        }
    }

    render() {
        const root = document.getElementById('root');
        if (!root) return;

        root.innerHTML = `
            <h1>Garage</h1>
            <form id="create-car-form">
                <input type="text" id="car-name" placeholder="Car name" required>
                <input type="color" id="car-color" value="#ffffff">
                <button type="submit">Create</button>
            </form>
            <p>Page ${this.currentPage}</p>
            <div class="car-list">
                ${this.cars.map(car => `
                    <div class="car-item">
                        <svg width="50" height="30" viewBox="0 0 50 30" style="display: block;">
                            <rect x="5" y="10" width="40" height="12" rx="3" fill="${car.color}" />
                            <rect x="15" y="2" width="20" height="10" rx="2" fill="${car.color}" opacity="0.85" />
                            <rect x="43" y="13" width="5" height="6" rx="1" fill="#333" />
                            <rect x="2" y="13" width="5" height="6" rx="1" fill="#333" />
                            <circle cx="12" cy="22" r="5" fill="#222" />
                            <circle cx="38" cy="22" r="5" fill="#222" />
                            <circle cx="12" cy="22" r="3" fill="#555" />
                            <circle cx="38" cy="22" r="3" fill="#555" />
                            <rect x="44" y="12" width="3" height="3" rx="1" fill="#ffeb3b" />
                            <rect x="3" y="12" width="3" height="3" rx="1" fill="#ff5722" />
                        </svg>
                        <span>${car.name}</span>
                    </div>
                `).join('')}
            </div>
        `;

        const form = document.getElementById('create-car-form');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();

            const carName = (document.getElementById('car-name') as HTMLInputElement).value;
            const carColor = (document.getElementById('car-color') as HTMLInputElement).value;
            await createCar(carName, carColor);
            await this.loadCars();
        })
    }


}

export { Garage };