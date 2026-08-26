import { getWinners, getCar } from '../../api/api';
import type { Winner } from '../../types';

class Winners {
    currentPage: number =1
    winners : Winner[] =[]
    totalWinners: number =0
    limit: number = 10
    sort: 'id' | 'wins' | 'time' = 'wins'
    order: 'ASC' | 'DESC' = 'DESC'

    constructor () {
        this.loadWinners();
    }

    async loadWinners () {
        const result = await getWinners(this.currentPage, this.limit, this.sort, this.order);
        if (result) {
            this.winners = result;
            this.totalWinners = result.length;
            this.render();
        }
    }

    async render() {
        const root = document.getElementById('root');
        if (!root) return;

        const carsData = await Promise.all(
            this.winners.map(winner => getCar(winner.id))
        );

        root.innerHTML = `
            <div class="winners-page">
                <h1>Winners</h1>
                <p>Page ${this.currentPage} - Total: ${this.totalWinners}</p>
                <table class="winners-table">
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Car</th>
                            <th>Wins</th>
                            <th>Best time</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.winners.map((winner, index) => {
                            const car = carsData[index];
                            const color = car?.color || '#ccc';
                            const name = car?.name || 'Unknown';
                            return `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>
                                        <span class="color-dot" style="background: ${color};"></span>
                                        ${name}
                                    </td>
                                    <td>${winner.wins}</td>
                                    <td>${winner.time}s</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
}

export {Winners};