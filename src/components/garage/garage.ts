import { createCar, deleteCar, drive, getCars, startEngine, updateCar, stopEngine } from '../../api/api';
import type {Car} from '../../types';

class Garage {
    currentPage: number = 1;
    cars: Car[] = [];
    totalCars: number = 0;
    limit: number = 7;
    editingID: number | null = null;
    animationFrames: Map<number, number> = new Map();
    carPositions: Map<number, number> = new Map();

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

    animateCar(carElement: SVGElement, duration: number, finish: number, id: number) {
        const startPosition = this.carPositions.get(id) ?? 0;
        const startTime = performance.now();
        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const position = startPosition + (finish - startPosition) * progress;

            carElement.style.transform = `translateX(${position}px)`;
            this.carPositions.set(id, position);

            if (progress < 1) {
                const frameId = requestAnimationFrame(animate);
                this.animationFrames.set(id, frameId);
            } else {
                this.animationFrames.delete(id);
            }
        };

        const frameId = requestAnimationFrame(animate);
        this.animationFrames.set(id, frameId);
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
            <p class = "paragraph-garage">Page ${this.currentPage} - Total: ${this.totalCars}</p>
            <div class="race-controls">
                <button id="race-btn">🏁 Race</button>
                <button id="reset-btn">🔄 Reset</button>
            </div>
            <div class="car-list">
                ${this.cars.map(car => `
                    <div class="car-item">
                        <div class="car-controls">
                            <button class="start-btn" data-id="${car.id}">Start</button>
                            <button class="stop-btn" data-id="${car.id}" disabled>Stop</button>

                            <span class="car-name">${car.name}</span>

                            <button class="update-btn" data-id="${car.id}">Update</button>
                            <button class="delete-btn" data-id="${car.id}">Delete</button>
                        </div>

                        <div class="race-track">
                            <svg
                                class="car-svg"
                                data-id="${car.id}"
                                width="50"
                                height="30"
                                viewBox="0 0 50 30"
                            >
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

                            <span class="finish-line">🏁</span>
                        </div>
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

            const nameInput = document.getElementById('car-name');
            const colorInput = document.getElementById('car-color');

            if (!(nameInput instanceof HTMLInputElement) ||
                !(colorInput instanceof HTMLInputElement)) {
                return;
            }

            const carName = nameInput.value;
            const carColor = colorInput.value;

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
                if (!(e.target instanceof HTMLButtonElement)) {
                    return;
                }

                const id = Number(e.target.dataset.id);
                await deleteCar(id);
                await this.loadCars();
            });
        });

        const btnsUpdate = document.querySelectorAll('.update-btn');
        btnsUpdate.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (!(e.target instanceof HTMLButtonElement)) {
                    return;
                }

                const id = Number(e.target.dataset.id);

                const car = this.cars.find(c => c.id === id);
                if (!car) return;

                const nameInput = document.getElementById('car-name');
                const colorInput = document.getElementById('car-color');

                if (!(nameInput instanceof HTMLInputElement) ||
                    !(colorInput instanceof HTMLInputElement)) {
                    return;
                }

                nameInput.value = car.name;
                colorInput.value = car.color;

                this.editingID = id;
                const submitBtn = document.querySelector('#create-car-form button[type ="submit"]');
                if (submitBtn) submitBtn.textContent = 'Save';
            });
        });

        const startButtons = document.querySelectorAll('.start-btn');
        startButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                if (!(event.currentTarget instanceof HTMLButtonElement)) {
                    return;
                }

                const id = Number(event.currentTarget.dataset.id);
                const data = await startEngine(id);
                if (!data) {
                    return;
                }

                const carElement = document.querySelector(
                    `.car-svg[data-id="${id}"]`
                );
                if (!(carElement instanceof SVGElement)) {
                    return;
                }

                const track = carElement.parentElement;
                if (!(track instanceof HTMLElement)) {
                    return;
                }

                const finishElement = track.querySelector('.finish-line');
                if (!(finishElement instanceof HTMLElement)) {
                    return;
                }

                const trackWidth = track.clientWidth;
                const carWidth = carElement.getBoundingClientRect().width;
                const finishWidth = finishElement.getBoundingClientRect().width;

                const finish = trackWidth - carWidth - finishWidth;
                const maxDuration = 10;
                const duration = (50 * maxDuration) / data.velocity;

                this.animateCar(carElement, duration * 1000, finish, id);

                const startButton = document.querySelector(
                    `.start-btn[data-id="${id}"]`
                );

                const stopButton = document.querySelector(
                    `.stop-btn[data-id="${id}"]`
                );

                if (
                    startButton instanceof HTMLButtonElement &&
                    stopButton instanceof HTMLButtonElement
                ) {
                    startButton.disabled = true;
                    stopButton.disabled = false;
                }

                await drive(id);
            });
        });

        const stopButtons = document.querySelectorAll('.stop-btn');
        stopButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                if (!(event.currentTarget instanceof HTMLButtonElement)) {
                    return;
                }

                const id = Number(event.currentTarget.dataset.id);
                await stopEngine(id);

                const frameId = this.animationFrames.get(id);
                if (frameId !== undefined) {
                    cancelAnimationFrame(frameId);
                    this.animationFrames.delete(id);
                }

                const startButton = document.querySelector(
                    `.start-btn[data-id="${id}"]`
                );

                const stopButton = document.querySelector(
                    `.stop-btn[data-id="${id}"]`
                );
                if (
                    startButton instanceof HTMLButtonElement &&
                    stopButton instanceof HTMLButtonElement
                ) {
                    startButton.disabled = false;
                    stopButton.disabled = true;
                }
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
        const generateBtn = document.getElementById('generate-btn');
        if (!(generateBtn instanceof HTMLButtonElement)) {
            return;
        }

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

        const clearBtn = document.getElementById('clear-all-btn');

        if (!(clearBtn instanceof HTMLButtonElement)) {
            return;
        }
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


        const raceBtn = document.getElementById('race-btn');
        raceBtn?.addEventListener('click', async () => {
            const raceResults: { id: number; time: number }[] = [];

            const engines = await Promise.all(this.cars.map(async (car) => {
                const data = await startEngine(car.id);
                return { car, data };
            }));

            const velocities = engines.map(({ data }) => data.velocity);
            const slowestVelocity = Math.min(...velocities);
            const maxDuration = 10;

            const raceTimes = engines.map(({ car, data }) => ({
                id: car.id,
                name: car.name,
                time: (slowestVelocity * maxDuration) / data.velocity,
            }));

            const winner = raceTimes.reduce((fastest, current) =>
                current.time < fastest.time ? current : fastest
            );
            setTimeout(() => {
                this.showWinner(winner.name, winner.time);
            }, winner.time * 1000);

            engines.forEach(({ car, data }) => {
                const duration = (slowestVelocity * maxDuration) / data.velocity;

                const carElement = document.querySelector(
                    `.car-svg[data-id="${car.id}"]`
                );

                if (
                    carElement instanceof SVGElement &&
                    carElement.parentElement instanceof HTMLElement
                ) {
                    const track = carElement.parentElement;
                    const finishElement = track.querySelector('.finish-line');

                    if (finishElement instanceof HTMLElement) {
                        const trackWidth = track.clientWidth;
                        const carWidth = carElement.getBoundingClientRect().width;
                        const finishWidth = finishElement.getBoundingClientRect().width;

                        const finish = trackWidth - carWidth - finishWidth;

                        this.animateCar(carElement, duration * 1000, finish, car.id);
                    }
                }
            });
        });
        const resetBtn = document.getElementById('reset-btn');

        resetBtn?.addEventListener('click', async () => {
            for (const car of this.cars) {
                const carElement = document.querySelector(
                    `.car-svg[data-id="${car.id}"]`
                );

                if (carElement instanceof SVGElement) {
                    carElement.style.transform = 'translateX(0px)';
                    this.carPositions.set(car.id, 0);
                }
            }
        });


    }

    showWinner(name: string, time: number) {
        const message = document.createElement('div');

        message.className = 'winner-message';
        message.innerHTML = `
            <div class="winner-title">🏆 WINNER! 🏆</div>
            <div class="winner-name">${name}</div>
            <div class="winner-time">${time.toFixed(2)} seconds</div>
        `;

        document.body.append(message);

        setTimeout(() => {
            message.remove();
        }, 4000);
    }
}

export { Garage };