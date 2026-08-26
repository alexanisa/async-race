import { createCar, deleteCar, getCars, updateCar } from '../../api/api';
import type {Car} from '../../types';

class Garage {
    currentPage: number = 1;
    cars: Car[] = [];
    totalCars: number = 0;
    limit: number = 7;
    editingID: number | null = null;

    constructor() {
        this.loadCars();
    }

    async loadCars() {
        const result = await getCars(this.currentPage, this.limit);
        if (result) {
            this.cars = result.cars;
            this.totalCars = result.total;
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
            <button class="generate-btn" id ="generate-btn" >Generate 100 random cars</button>
            <button id="clear-all-btn">Clear all cars</button>
            <p>Page ${this.currentPage} - Total: ${this.totalCars}</p>
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
                        <button class="update-btn" data-id="${car.id}">Update</button>
                        <button class="delete-btn" data-id="${car.id}">Delete</button>
                    </div>
                `).join('')}
            </div>
            <div class="pagination">
                <button id="prev-page" ${this.currentPage === 1 ? 'disabled' : ''}>Prev</button>
                <span>Page ${this.currentPage}</span>
                <button id="next-page">Next</button>
            </div>
        `;

        const form = document.getElementById('create-car-form');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();

            const carName = (document.getElementById('car-name') as HTMLInputElement).value;
            const carColor = (document.getElementById('car-color') as HTMLInputElement).value;

            if (this.editingID !== null) {
                await updateCar(this.editingID, carName, carColor);
                this.editingID = null;
                const submitBtn = document.querySelector('#create-car-form button[type ="submit"]');
                if (submitBtn) submitBtn.textContent = 'Create';
            } else {
                await createCar(carName, carColor);
            }
            await this.loadCars();
        })

        const btnsDel = document.querySelectorAll('.delete-btn');
        btnsDel.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = Number((e.target as HTMLButtonElement).dataset.id);
                await deleteCar(id);
                await this.loadCars();
            });
        });

        const btnsUpdate = document.querySelectorAll('.update-btn');
        btnsUpdate.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = Number((e.target as HTMLButtonElement).dataset.id);

                const car = this.cars.find(c => c.id === id);
                if (!car) return;

                (document.getElementById('car-name') as HTMLInputElement).value = car.name;
                (document.getElementById('car-color') as HTMLInputElement).value = car.color;

                this.editingID = id;
                const submitBtn = document.querySelector('#create-car-form button[type ="submit"]');
                if (submitBtn) submitBtn.textContent = 'Save';
            });
        });

        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        prevBtn?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadCars();
            }
        });

        nextBtn?.addEventListener('click', ()=> {
            this.currentPage++;
            this.loadCars();
        })
        const garage = this;
        const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
        generateBtn?.addEventListener('click', async () => {
            const brands = ['Tesla', 'Ford', 'BMW', 'Mercedes', 'Toyota', 'Honda', 'Nissan', 'Audi', 'Volkswagen', 'Hyundai'];
            const models = ['Model S', 'Mustang', 'X5', 'C-Class', 'Camry', 'Civic', 'Teana', 'A4', 'Golf', 'Creta'];
            const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#FFD733', '#33FFF5', '#A833FF', '#FF8333', '#33A8FF', '#FF33A8'];
            generateBtn.textContent = 'Generating...';
            generateBtn.disabled = true;

            for (let i=0; i <100 ; i++) {
                const randomBrand = brands[Math.floor(Math.random() * brands.length)];
                const randomModel = models[Math.floor(Math.random() * models.length)];
                const nameCar = `${randomBrand} ${randomModel}`;
                const colorCar = colors[Math.floor(Math.random() * colors.length)];
                await createCar(nameCar, colorCar);
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            await garage.loadCars();

            generateBtn.textContent = 'Generate 100 random cars';
            generateBtn.disabled = false;
        })

        const clearBtn = document.getElementById('clear-all-btn') as HTMLButtonElement;
        clearBtn?.addEventListener('click', async ()=> {
            clearBtn.textContent = 'Clearing...';
            clearBtn.disabled = true;

            const allCars = await getCars(1, 1000);
            if (allCars && allCars.cars) {
                for (const car of allCars.cars) {
                    await deleteCar(car.id);
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
                await this.loadCars();
            }

            clearBtn.textContent = 'Clear all';
            clearBtn.disabled = false;
        })
    }
}

export { Garage };