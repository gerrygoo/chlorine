import {
	Style,
	StylePrefs,
	SwimLibConfig,
	SwimSet,
	Workout,
} from './swimTypes'

import {
	average,
	centerOnHalf,
	clampToUnit,
	getDivisors,
	peripheryDistance,
	progress,
	selectUsingScale,
	shuffle,
} from './math'

type LapSet = Omit<SwimSet, 'style'>
function makeLapSet(poolLength: number, drillLength: number, lengthScale: number): LapSet {
	// the lap length is between poolLength and drillLength
	// and is a multiple of poolLength
	// and evenly divides drillLength
	// TODO: support fast sets of poolLength

	const possibleIntervals = getDivisors(drillLength)
	  .filter(interval => interval > (poolLength * 2) &&
					 interval % (poolLength * 2) == 0)

	console.debug('intervals:drillLength', drillLength)
	console.debug('intervals:scale', lengthScale)
  console.debug('intervals:options', possibleIntervals)

	let interval = drillLength
	if (possibleIntervals.length > 0) {
	  interval = selectUsingScale(possibleIntervals, lengthScale)
	} else {
		console.debug('oops! no intervals generated')
	}

	console.debug('intervals:selected', interval)

	return {
		interval,
		reps: drillLength / interval,
		rest: 0,
	}
}

function makeSetDistances(poolSize: number, maxDistance: number): number[] {
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

function selectSetDistance(poolSize:number, remainingDistance: number, lengthScale:number): number {
	// [poolSize, remainingDistance]
	const possibleDistances =
		makeSetDistances(poolSize, remainingDistance)
	  .filter(distance => distance > (poolSize * 2))
	console.debug('distance:options', possibleDistances)
	if (possibleDistances.length === 0) {
		console.debug('oops! no set distances generated')
		return remainingDistance
	}
	
	const setDistance = selectUsingScale(possibleDistances, lengthScale)
	console.debug('distance:selected', setDistance)
	return setDistance
}

function selectStyle(prefs: StylePrefs, chaos: number, useShuffle = true): Style {
	let prefsArr = Object.keys(prefs).
		map(k => ({ style: k as Style, thold: prefs[k as Style] }))

	if (useShuffle) {
		prefsArr = shuffle(prefsArr)
	} else {
		prefsArr.sort( (sa, sb) => sa.thold - sb.thold ).reverse()
	}

	const styles = prefsArr.map(p => p.style)
	const weights = prefsArr.map(p => p.thold)
	  .map(t => clampToUnit(t + (chaos * Math.random() * 0.5)))

	const totalWeight = weights.reduce((a, b) => a + b)

	let cutoff = Math.floor(Math.random() * totalWeight)
	for (let i = 0; i < styles.length; ++i) {
		cutoff -= weights[i]

		if (cutoff < 0) return styles[i]
	}
  
  console.log('oops! could not select style')
  return 'crawl'
}

export function makeWorkout({
	pool,
	workoutDistance,
	params: { endurance, chaos, stylePrefs}}: SwimLibConfig
													 ): Workout {
	const distance = workoutDistance.magnitude

	const drills: SwimSet[] = []
	let remainingDistance = distance
	while (remainingDistance > 0) {	
	  const enduranceFactor = centerOnHalf(endurance)

		const progressFactor = progress(distance, remainingDistance)
		const peripheryDistanceFactor = peripheryDistance(distance, remainingDistance)
		const chaosFactor = centerOnHalf(chaos) * Math.random()

	  const scale = average([
			enduranceFactor,
			peripheryDistanceFactor,
			progressFactor,
			chaosFactor,
		])

		console.debug(
			'endurance: ', enduranceFactor,
			'periphery: ', peripheryDistanceFactor,
			'progressFactor: ', progressFactor,
			'chaos ', chaosFactor
		)

		const drillDistance = selectSetDistance(
			pool.length.magnitude,
			remainingDistance,
			scale
		)
		const lapSet = makeLapSet(
			pool.length.magnitude,
			drillDistance,
			scale
		)
		const style = selectStyle(stylePrefs, chaos)

		drills.push({...lapSet, style})

		remainingDistance -= drillDistance
	}

	return { drills }
}

