export async function getCars(page: number, limit = 7) {
    try {
        const res = await fetch(`http://127.0.0.1:3000/garage?_page=${page}&_limit=${limit}`);
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error', error);
        return [];
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