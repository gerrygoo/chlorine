import {
	SwimSet,
	Pool,
	Workout,
} from './swimTypes'

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
function scaleInto(b:number, x: number) {
	const a = 0
  return Math.floor(a + ((b - a) * x))
}

function average(items: number[], weights: number[] | undefined = undefined): number {
	let w: number[]

	if (weights === undefined) w = items.map( _ => 1)
	else w = weights

	return items.reduce((res, cur, idx) => res + cur * w[idx])/items.length
}

function selectUsingScale(candidates: number[], scale: number): number {
	const idx = scaleInto(candidates.length - 1, scale)
	return candidates[idx]
}

function makeSwimSet(poolLength: number, drillLength: number, lengthScale: number): SwimSet {
	// the lap length is between poolLength and drillLength
	// and is a multiple of poolLength
	// and evenly divides drillLength
	// TODO: support fast sets of poolLength
	const possibleIntervals = getDivisors(drillLength)
	  .filter(interval => interval > poolLength &&
					 interval % (poolLength * 2) == 0)
	
	const interval = selectUsingScale(possibleIntervals, lengthScale)

	return {
		interval,
		reps: drillLength / interval,
		rest: 0,
	}
}

function makeSwimSetDistances(poolSize: number, maxDistance: number): number[] {
	const distances: number[] = []


  // TODO: support finishing drills on the other side of the pool
	const minDistance = poolSize * 2
	let candidateDistance = minDistance
	let i = 1
	while (candidateDistance <= maxDistance) {
		distances.push(candidateDistance)
		candidateDistance = minDistance * ++i
	}

	return distances
}

function makeSwimSetDistance(poolSize:number, remainingDistance: number, lengthScale:number): number {
	// [poolSize, remainingDistance]
	const possibleDistances = makeSwimSetDistances(poolSize, remainingDistance)
	if (possibleDistances.length === 0) {
		console.log('oops! no drill distances could be generated')
		return remainingDistance
	}
	console.log(possibleDistances)

	return selectUsingScale(possibleDistances, lengthScale)
}

function makeWorkout(pool: Pool, workoutDistance: number, endurance: number): Workout {
	console.log(pool, workoutDistance, endurance)
	const drills: SwimSet[] = []
	let remainingDistance = workoutDistance

	while (remainingDistance > 0) {
		// skew towards smaller options at the beginning
		// and towards larger options in the end, because:
		// - initially the options are dominated by larger numbers
		// - there are few options near the end
		
	  const enduranceFactor = 0.5 + 0.5 * endurance
		const progressFactor = 1 - remainingDistance/workoutDistance

		const midPoint = workoutDistance / 2
		const midSeparation = Math.abs(midPoint - (workoutDistance - remainingDistance))
		const peripheryDistanceFactor = 1 - midSeparation/midPoint

		console.log(
			'endurance: ', enduranceFactor,
			'periphery: ', peripheryDistanceFactor,
			'progress: ', progressFactor
		)

	  const scale = average([
			enduranceFactor,
			peripheryDistanceFactor,
			progressFactor
		])
		const drillDistance = makeSwimSetDistance(pool.length, remainingDistance, scale)


		drills.push(makeSwimSet(pool.length, drillDistance, scale))

		remainingDistance -= drillDistance
	}

	return { drills }
}

const form = document.querySelector('form')
const result = document.getElementById('result')
if (form !== null && result !== null) {
	form.addEventListener('submit', event => {
		event.preventDefault()

		const {
			0: {value: poolLengthStr},
			1: {value: workoutDistanceStr},
			2: {value: enduranceStr},
		} = (event.target as any)

		const workout = makeWorkout(
				{
					length: parseInt(poolLengthStr),
					unit: 'm'
				},
				parseInt(workoutDistanceStr),
				(parseInt(enduranceStr) - 50)/100
			)

		result.textContent = workout.drills
			.map(({ interval, reps }) => `${reps} of ${interval}`)
			.join(', ')
	})
}
