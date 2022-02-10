// a workout is a sequence of distances and multipliers
// the distances are a multiple of the pool length
export type Style = 'crawl' | 'back' | 'breast' | 'fly'
export interface Mode {
	style: Style
}

export interface SwimSet {
	interval: number
	reps: number

	// mode: Mode

	rest: number
}

export interface Workout {
	drills: SwimSet[]
}

export interface Pool {
	length: number
	unit: 'm' | 'y'
}

export interface Endurance {
  stamina: number // [-1, 1]
}

