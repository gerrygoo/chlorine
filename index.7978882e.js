function getDivisors(e){const t=[],n=[];for(let r=1;r<=Math.sqrt(e);r++)e%r==0&&(n.push(r),e/r!=r&&t.splice(0,0,e/r));return[...n,...t]}function scaleInto(e,t,n){return Math.floor(e+(t-e)*n)}function selectUsingScale(e,t){return e[scaleInto(0,e.length-1,t)]}function makeDrill(e,t,n){const r=selectUsingScale(getDivisors(t).filter((t=>t>=e&&t%e==0)),n);return{interval:r,reps:t/r,rest:0}}function makeDrillDistances(e,t){const n=[];let r=1,l=2*e;for(;l<=t;)n.push(l),l=2*e*++r;return n}function makeDrillDistance(e,t,n,r){const l=n/t,s=1-2*Math.abs(.5-l),o=makeDrillDistances(e,n);if(0===o.length)return console.log("oops! no drill distances could be generated"),n;return selectUsingScale(o,(.5+.5*r+s+(1-l))/3)}function makeWorkout(e,t,n){const r=[];let l=t;for(;l>0;){const s=makeDrillDistance(e.length,t,l,n);r.push(makeDrill(e.length,s,n)),l-=s}return{drills:r}}const form=document.querySelector("form"),result=document.getElementById("result");form.addEventListener("submit",(e=>{e.preventDefault();const{0:{value:t},1:{value:n},2:{value:r}}=e.target,l=makeWorkout({length:parseInt(t),units:"m"},parseInt(n),parseInt(r)/100);result.textContent=l.drills.map((({interval:e,reps:t})=>`${t} of ${e}`)).join(", ")}));
//# sourceMappingURL=index.7978882e.js.map