import { xpGraphWidth, xpGraphHeight } from '../main.js';
import { hideTooltip, addLabel, showTooltip, numberToBytes } from './utils.js';



export function displayXpGraph(eventStart, totalXp, xpChanges) {
    const svg = document.getElementById("xpGraph");
    svg.innerHTML = ''; 

    xpChanges.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
    const maxXp = totalXp * 1.1;
    const end = Date.now();

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'greenyellow');
    path.setAttribute('stroke-width', '2');

    let pathD = `M 24 ${xpGraphHeight - 24}`;
    let cumulativeXp = 0;

    xpChanges.forEach(change => {
        const relativeX = (Date.parse(change.createdAt) - eventStart) / (end - eventStart);
        cumulativeXp += change.amount;
        let currentCircleExp = cumulativeXp; // we need this otherwise the circles will always have the total cumulative exp because the code is only being executed once we hover it
        const relativeY = cumulativeXp / maxXp;
        //console.log(cumulativeXp);

        const x = relativeX * (xpGraphWidth - 48) + 24;
        const y = (1 - relativeY) * (xpGraphHeight - 48) + 24;
        //console.log(change.createdAt);

        pathD += ` L ${x} ${y}`;

        // creates a hoverable circle to view specific dates and their assosciated experience because DETAILS
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '3');
        circle.setAttribute('fill', 'greenyellow');
        circle.addEventListener('mouseover', (e) => showTooltip(e, `Date: ${new Date(change.createdAt).toLocaleDateString()}, EXP: ${numberToBytes(currentCircleExp)}`));
        circle.addEventListener('mouseout', hideTooltip);
        svg.appendChild(circle);
    });

    path.setAttribute('d', pathD);
    svg.appendChild(path);

    addLabel(svg, new Date(eventStart).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" }) + " - 0B", 24, xpGraphHeight - 12, 'start');
    addLabel(svg, new Date().toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" }) + " - " + numberToBytes(totalXp), xpGraphWidth - 24, 24, 'end');
}