import { displayXpGraph } from './xpGraph.js';
import { displayAuditGraph } from './auditGraph.js';
import { numberToBytes } from './utils.js';

export function getData(token, userId) {
    let urlData = 'https://01.kood.tech/api/graphql-engine/v1/graphql';

    let http = new XMLHttpRequest();
    http.open('POST', urlData, true);
    http.setRequestHeader('Authorization', 'Bearer ' + token);
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            let res = JSON.parse(http.responseText);
            document.getElementById("login").style.display = "none";
            document.getElementById("main").style.display = "block";
            displayData(res.data);
        }
    }

    const data = JSON.stringify({
        query: `{
      user {
        login
      }
      transaction{
        type
        amount
        eventId
        createdAt
      }
      event_user(where: { userId: { _eq: ${userId} }}){
        eventId
        event{
            path
            createdAt
            endAt
        }
      }
    }`,
    });

    http.send(data);
}

export function displayData(data) {
    let eventId = 0;
    let eventStart = 0;
    for (let i of data.event_user) {
        if (i.event.path.endsWith("div-01")) {
            eventId = i.eventId;
            eventStart = Date.parse(i.event.createdAt);
            break;
        }
    }
    let xpChanges = [];
    let auditChanges = [];
    let xp = 0;
    let auditUp = 0;
    let auditDown = 0;
    for (let i of data.transaction) {
        if (i.eventId != eventId) continue;
        if (i.type == "xp") {
            xp += i.amount;
            xpChanges.push(i);
        } else if (i.type == "up") {
            auditUp += i.amount;
            auditChanges.push(i);
        } else if (i.type == "down") {
            auditDown += i.amount;
            auditChanges.push(i);
        }
    }
    document.getElementById("displayUser").innerHTML = data.user[0].login;
    document.getElementById("xp").innerHTML = numberToBytes(xp);

    document.getElementById("auditrecieved").innerHTML = numberToBytes(auditDown);
    document.getElementById("auditdone").innerHTML = numberToBytes(auditUp);
    document.getElementById("auditratio").innerHTML = (auditUp / auditDown).toFixed(2);

    displayXpGraph(eventStart, xp, xpChanges);
    displayAuditGraph(eventStart, auditChanges);
}