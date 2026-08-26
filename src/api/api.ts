export async function getCars(page: number, limit = 7) {
    try {
        const res = await fetch(`http://127.0.0.1:3000/garage?_page=${page}&_limit=${limit}`);
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }
        return {
            cars: await res.json(),
            total: Number(res.headers.get('X-Total-Count'))
        };
    } catch (error) {
        console.error('Error', error);
        return {
            cars: [],
            total: 0
        }
    }
}

export async function getCar(id:number) {
    try {
        const res = await fetch(`http://127.0.0.1:3000/garage/${id}`);
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

export async function createCar(name:string, color: string) {
    try {
        const res = await fetch(`http://127.0.0.1:3000/garage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, color })
        });
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

export async function updateCar(id: number, name: string, color: string) {
    try {
        const res = await fetch(`http://127.0.0.1:3000/garage/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, color })
        });
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

export async function deleteCar(id: number) {
    try {
        const res = await fetch(`http://127.0.0.1:3000/garage/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

export async function startEngine(id: number) {
    try {
        const res = await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=started`, {
            method: 'PATCH',
        });
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

export async function stopEngine(id: number) {
    try {
        const res = await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=stopped`, {
            method: 'PATCH',
        });
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

export async function drive(id: number) {
    try {
        const res = await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=drive`, {
            method: 'PATCH',
        });
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

export async function getWinners(
    page: number,
    limit = 7,
    sort?: 'id' | 'wins' | 'time',
    order?: 'ASC' | 'DESC'
) {
    try {
        let url = `http://127.0.0.1:3000/winners?_page=${page}&_limit=${limit}`;
        if(sort) url += `&_sort=${sort}`;
        if (order) url += `&_order=${order}`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

export async function getWinner(id: number) {
    try {
        const res = await fetch(`http://127.0.0.1:3000/winners/${id}`, {
            method: 'GET',
        });
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

export async function createWinner(id: number, wins: number, time: number) {
    try {
        const res = await fetch(`http://127.0.0.1:3000/winners`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, wins, time })
        });
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

export async function updateWinner(id: number, wins: number, time: number) {
    try {
        const res = await fetch(`http://127.0.0.1:3000/winners/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wins, time })
        });
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

export async function deleteWinner(id: number) {
    try {
        const res = await fetch(`http://127.0.0.1:3000/winners/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}