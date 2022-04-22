import {
	SwimSet,
	Pool,
	Workout,
} from './swimTypes'

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


