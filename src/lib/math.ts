// increases as we advance towards completion
// we use this factor to skew towards smaller distances
// early on, and towards bigger ones in the end.
//
// this is to counteract the fact that early on
// the possible distances are dominated by longer option and
// near the end the opposite is true.
export function progress(totalDistance: number, remainingDistance: number): number {
	const fractionLeft = remainingDistance/totalDistance
  return 1 - fractionLeft
}

// returns 1 at the middle of the workout and decreases
// as one approaches either the very beginning or end.
//
// we use this to implement a warmup - core - cooldown
// pacing on workouts.
// TODO: experiment with non-linear options to shape the
// pacing curve described above
export function peripheryDistance(totalDistance: number, remainingDistance: number): number {
		const midPoint = totalDistance / 2
		const swam = totalDistance - remainingDistance
		const midSeparation = Math.abs(midPoint - swam)

		return 1 - midSeparation/midPoint
}

export function clampToUnit(n: number): number {
	if (n < 0) return 0
	if (n > 1) return 1
	return n
}

export function centerOnHalf(n: number): number {
  return 0.5 + 0.5 * n
}

export function shuffle<T>(array: Array<T>): Array<T> {
	const arr = [...array]

	let i = arr.length
	while (i > 0) {
		const ri = Math.floor(Math.random() * arr.length)
		i--
		[arr[i], arr[ri]] = [arr[ri], arr[i]]
	}

	return arr
}

export function of100(n: number): number {
	return n/100
}

export function getDivisors(n: number): number[] {
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
export function scaleInto(b:number, x: number) {
	const a = 0
  return Math.floor(a + ((b - a) * x))
}

export function average(items: number[], weights: number[] | undefined = undefined): number {
	let w: number[]

	if (weights === undefined) w = items.map( _ => 1)
	else w = weights

	return items.reduce((res, cur, idx) => res + cur * w[idx])/items.length
}

export function selectUsingScale(candidates: number[], scale: number): number {
	const idx = scaleInto(candidates.length - 1, scale)
	return candidates[idx]
}


