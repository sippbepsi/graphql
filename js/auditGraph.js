import { xpGraphWidth, xpGraphHeight } from '../main.js';
import { hideTooltip, addLabel, showTooltip } from './utils.js';


export function displayAuditGraph(eventStart, auditChanges) {
    const svg = document.getElementById("auditGraph");
    svg.innerHTML = ''; 

    auditChanges.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
    const end = Date.now();

    let upSum = 0;
    let downSum = 0;
    let maxRatio = 2;

    const ratios = auditChanges.map(change => {
        if (change.type === "up") upSum += change.amount;
        if (change.type === "down") downSum += change.amount;
        const ratio = downSum > 0 ? upSum / downSum : (upSum > 0 ? maxRatio : 1);
        maxRatio = Math.max(maxRatio, ratio);
        return { date: Date.parse(change.createdAt), ratio };
    });

    function scaleY(ratio) {
        if (ratio <= 1) return 1 - ratio / 2;
        return 0.5 - Math.log2(ratio) / (2 * Math.log2(maxRatio));
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'greenyellow');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('class', 'audit-path');
    let pathD = '';

    ratios.forEach((point, index) => {
        const relativeX = (point.date - eventStart) / (end - eventStart);
        const relativeY = scaleY(point.ratio);

        const x = relativeX * (xpGraphWidth - 48) + 24;
        const y = relativeY * (xpGraphHeight - 48) + 24;

        if (index === 0) {
            pathD = `M ${x} ${y}`;
        } else {
            pathD += ` L ${x} ${y}`;
        }

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '2');
        circle.setAttribute('fill', 'greenyellow');
        circle.addEventListener('mouseover', (e) => showTooltip(e, `Date: ${new Date(point.date).toLocaleDateString()}, Ratio: ${point.ratio.toFixed(2)}`));
        circle.addEventListener('mouseout', hideTooltip);
        svg.appendChild(circle);
    });

    path.setAttribute('d', pathD);
    svg.appendChild(path);

    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;
    path.getBoundingClientRect();

    path.classList.add('animate-path');

    const midlineY = scaleY(1) * (xpGraphHeight - 48) + 24;
    const midline = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    midline.setAttribute('x1', '24');
    midline.setAttribute('y1', midlineY.toString());
    midline.setAttribute('x2', (xpGraphWidth - 24).toString());
    midline.setAttribute('y2', midlineY.toString());
    midline.setAttribute('stroke', '#FFF8E3');
    midline.setAttribute('stroke-dasharray', '5,5');
    svg.appendChild(midline);

    addLabel(svg, new Date(eventStart).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" }) + " - 1", 24, xpGraphHeight - 12, 'start');
    addLabel(svg, new Date().toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" }) + " - " + (upSum / downSum).toFixed(1), xpGraphWidth - 24, 24, 'end');
    addLabel(svg, "0", 12, xpGraphHeight - 24, 'end');
    addLabel(svg, "1", 12, midlineY, 'end');
    addLabel(svg, maxRatio.toFixed(1), 12, 24, 'end');
}