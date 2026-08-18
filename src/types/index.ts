export interface Car {
    name: string,
    color: string,
    id: number
}

export interface EngineStatus {
    velocity: number,
    distance: number
}

export interface DriveStatus {
    success: boolean
}

export interface Winner {
    id: number,
    wins: number,
    time: number
}