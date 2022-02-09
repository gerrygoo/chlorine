
// a workout is a sequence of distances and multipliers
// the distances are a multiple of the pool length
interface Drill {
	interval: number
	reps: number

	rest: number
}

interface Workout {
	drills: Drill[]
}

interface Pool {
	length: number
	unit: 'm' | 'y'
}

interface Endurance {
  stamina: number
}

function getDivisors(n: number): number[] {
	const bigDivisors: number[] = []
	const smallDivisors: number[] = []

	for(let divisor = 1; divisor <= Math.sqrt(n); divisor++) {
		if (n % divisor == 0) {
			smallDivisors.push(divisor)

			if (n / divisor != divisor) {
				bigDivisors.splice(0, 0, n/divisor)
			}
		}
	}

	return [...smallDivisors, ...bigDivisors]
}

// requires a > b and x in [0, 1]
function scaleInto(a: number, b:number, x: number) {
  return Math.floor(a + ((b - a) * x))
}

function selectUsingScale(candidates: number[], scale: number): number {
	const idx = scaleInto(0, candidates.length - 1, scale)
	return candidates[idx]
}

function makeDrill(poolLength: number, drillLength: number): Drill {
	// the lap length is between poolLength and drillLength
	// and is a multiple of poolLength
	// and evenly divides drillLength
	const possibleIntervals = getDivisors(drillLength)
	  .filter(interval => interval >= poolLength &&
					 interval % poolLength == 0)
	
	const interval = selectUsingScale(possibleIntervals, 0.5)

	return {
		interval,
		reps: drillLength / interval,
		rest: 0,
	}
}

// TODO: support finishing drills on the other side of the pool
function makeDrillDistances(poolSize: number, maxDistance: number): number[] {
	const distances: number[] = []

	let i = 1
	let candidateDistance = poolSize * 2
	while (candidateDistance <= maxDistance) {
		distances.push(candidateDistance)
		candidateDistance = poolSize * 2 * ++i
	}

	return distances
}

function makeDrillDistance(poolSize:number, workoutDistance:number, remainingDistance: number, lengthBias:number): number {
	// we want the distance to be a function of:
	// - the 'stage' of the workout (warmup, main, cooldown)
	// - a bias towards length
	// [poolSize, remaining]
	const progress = remainingDistance/workoutDistance
	const peripheryDistance = 1 - Math.abs(0.5 - progress) * 2

	const possibleDistances = makeDrillDistances(poolSize, remainingDistance)
	if (possibleDistances.length === 0) {
		console.log('oops! no drill distances could be generated')
		return remainingDistance
	}

	// skew towards smaller options at the beginning
	// and towards larger options in the end, because:
	// - initially the options are dominated by larger numbers
	// - there are few options near the end
	const scale = ((0.5 + 0.5 * lengthBias) + peripheryDistance + (1 - progress))/3
	return selectUsingScale(possibleDistances, scale)
}

function makeWorkout(pool: Pool, workoutDistance: number): Workout {
	const drills: Drill[] = []
	let remainingDistance = workoutDistance

	while (remainingDistance > 0) {
		const drillDistance = makeDrillDistance(pool.length, workoutDistance, remainingDistance, 0)

		drills.push(makeDrill(pool.length, drillDistance))

		remainingDistance -= drillDistance
	}

	return { drills }
}

console.log(makeWorkout({ length: 25, unit: 'm' }, 1500).drills)
