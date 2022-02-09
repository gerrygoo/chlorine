function getDivisors(n) {
    const bigDivisors = [];
    const smallDivisors = [];
    for(let divisor = 1; divisor <= Math.sqrt(n); divisor++)if (n % divisor == 0) {
        smallDivisors.push(divisor);
        if (n / divisor != divisor) bigDivisors.splice(0, 0, n / divisor);
    }
    return [
        ...smallDivisors,
        ...bigDivisors
    ];
}
// requires a > b and x in [0, 1]
function scaleInto(a, b, x) {
    return Math.floor(a + (b - a) * x);
}
function selectUsingScale(candidates, scale) {
    const idx = scaleInto(0, candidates.length - 1, scale);
    return candidates[idx];
}
function makeDrill(poolLength, drillLength, endurance) {
    // the lap length is between poolLength and drillLength
    // and is a multiple of poolLength
    // and evenly divides drillLength
    const possibleIntervals = getDivisors(drillLength).filter((interval)=>interval >= poolLength && interval % poolLength == 0
    );
    const interval1 = selectUsingScale(possibleIntervals, endurance);
    return {
        interval: interval1,
        reps: drillLength / interval1,
        rest: 0
    };
}
// TODO: support finishing drills on the other side of the pool
function makeDrillDistances(poolSize, maxDistance) {
    const distances = [];
    let i = 1;
    let candidateDistance = poolSize * 2;
    while(candidateDistance <= maxDistance){
        distances.push(candidateDistance);
        candidateDistance = poolSize * 2 * ++i;
    }
    return distances;
}
function makeDrillDistance(poolSize, workoutDistance, remainingDistance, lengthBias) {
    // we want the distance to be a function of:
    // - the 'stage' of the workout (warmup, main, cooldown)
    // - a bias towards length
    // [poolSize, remaining]
    const progress = remainingDistance / workoutDistance;
    const peripheryDistance = 1 - Math.abs(0.5 - progress) * 2;
    const possibleDistances = makeDrillDistances(poolSize, remainingDistance);
    if (possibleDistances.length === 0) {
        console.log('oops! no drill distances could be generated');
        return remainingDistance;
    }
    // skew towards smaller options at the beginning
    // and towards larger options in the end, because:
    // - initially the options are dominated by larger numbers
    // - there are few options near the end
    const scale = (0.5 + 0.5 * lengthBias + peripheryDistance + (1 - progress)) / 3;
    return selectUsingScale(possibleDistances, scale);
}
function makeWorkout(pool, workoutDistance, endurance) {
    const drills = [];
    let remainingDistance = workoutDistance;
    while(remainingDistance > 0){
        const drillDistance = makeDrillDistance(pool.length, workoutDistance, remainingDistance, endurance);
        drills.push(makeDrill(pool.length, drillDistance, endurance));
        remainingDistance -= drillDistance;
    }
    return {
        drills
    };
}
const form = document.querySelector('form');
const result = document.getElementById('result');
form.addEventListener('submit', (event)=>{
    event.preventDefault();
    const { 0: { value: poolLengthStr  } , 1: { value: workoutDistanceStr  } , 2: { value: enduranceStr  } ,  } = event.target;
    const workout = makeWorkout({
        length: parseInt(poolLengthStr),
        units: 'm'
    }, parseInt(workoutDistanceStr), parseInt(enduranceStr) / 100);
    result.textContent = workout.drills.map(({ interval , reps  })=>`${reps} of ${interval}`
    ).join(', ');
});

//# sourceMappingURL=index.377278e2.js.map
