//TODO: separate types in internal to lib and exported ones
// and files
export type Style = 'crawl' | 'back' | 'breast' | 'fly'

export type StylePrefs = {
	[k in Style]: number
}

export interface SwimLibParams {
	endurance: number
	chaos: number
	stylePrefs: StylePrefs
}

export interface SwimLibConfig {
	pool: Pool
	workoutDistance: Distance
	params: SwimLibParams
}

export interface Workout {
	drills: SwimSet[]
}

export interface SwimSet {
	interval: number
	reps: number
	style: Style

	rest: number
}

export type DistanceUnit = 'm' | 'y'
export interface Distance {
	unit: DistanceUnit
	magnitude: number
}

export interface Pool {
	length: Distance
}

