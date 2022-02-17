import { makeWorkout } from './lib/swimLib'

import {
	Workout,
	SwimLibConfig,
	Distance,
	DistanceUnit
} from './lib/swimTypes'

import { of100 } from './lib/math'

function renderWorkout(workout: Workout): string {
	return workout.drills
		.map(({ interval, reps, style }) => `${reps} of ${interval} ${style}`)
		.join(', ')
}

function makeDistance(m: number, u: DistanceUnit): Distance {
	return {
		magnitude: m,
		unit: u,
	}
}

type ParentTarget = EventTarget & {
	[i: number]: { value: string },
}
function gatherInputs(target: ParentTarget): SwimLibConfig {
	const {
		0: {value: poolLengthStr},
		1: {value: workoutDistanceStr},
		2: {value: enduranceStr},
		3: {value: chaosStr},
		4: {value: crawlStr},
		5: {value: backStr},
		6: {value: breastStr},
		7: {value: flyStr},
	} = target
  
	return {
		pool: {
			length: makeDistance(parseInt(poolLengthStr), 'm'),
		},
		workoutDistance: makeDistance(parseInt(workoutDistanceStr), 'm'),
		params: {
			endurance: of100(parseInt(enduranceStr) - 50),
			chaos: of100(parseInt(chaosStr) - 50),
			stylePrefs: {
				crawl: of100(parseInt(crawlStr)),
				back: of100(parseInt(backStr)),
				breast: of100(parseInt(breastStr)),
				fly: of100(parseInt(flyStr)),
			} 
		},
	}
}

function handleForm(event: Event, resultContainer: Element){
	event.preventDefault()

	const workout = makeWorkout(
		gatherInputs(event.target as ParentTarget))

  resultContainer.textContent = renderWorkout(workout) 
}

const form = document.querySelector('form')
const result = document.getElementById('result')

if (form !== null && result !== null) {
	form.addEventListener('submit', e => handleForm(e, result))
} else {
	console.log('whoops, coulden\'t get a hold of the components')
}


