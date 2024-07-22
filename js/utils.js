export function addLabel(svg, text, x, y, anchor) {
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.textContent = text;
    label.setAttribute('x', x);
    label.setAttribute('y', y);
    label.setAttribute('fill', '#FFF8E3');
    label.setAttribute('text-anchor', anchor);
    svg.appendChild(label);
}

export function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) tooltip.style.display = 'none';
}

function createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'rgba(0,0,0,0.7)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.pointerEvents = 'none';
    document.body.appendChild(tooltip);
    return tooltip;
}

export function showTooltip(event, text) {
    const tooltip = document.getElementById('tooltip') || createTooltip();
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    tooltip.style.left = (event.pageX + 10) + 'px';
    tooltip.style.top = (event.pageY + 10) + 'px';
}

const prettified = ["B", "kB", "mB"];

export function numberToBytes(num) {
    let decimals = 2;
    let divisions = 0;
    while (num >= 1000) {
        num /= 1000;
        divisions++;
    }
    if(num >= 10) decimals--;
    if(num >= 100) decimals--;
    return num.toFixed(decimals).toString() + " " + prettified[divisions];
}

export function getTokenCookie() {
    var cookiestring = RegExp("token=[^;]+").exec(document.cookie);
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
}

export function logOut(){
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
}