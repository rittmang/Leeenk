const dataUrl = '/prp-data.json';

// gets URL Parameters
function getAllUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {

                // create key if it doesn't exist
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];

                // if it's an indexed array e.g. colors[2]
                if (paramName.match(/\[\d+\]$/)) {
                    // get the index value and add the entry at the appropriate position
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    // otherwise add the value to the end of the array
                    obj[key].push(paramValue);
                }
            } else {
                // we're dealing with a string
                if (!obj[paramName]) {
                    // if it doesn't exist, create property
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                    // if property does exist and it's a string, convert it to an array
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    // otherwise add the property
                    obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj;
}
// sorts links in the desired order
const applyCustomOrder = (arr, desiredOrder) => {
    const orderForIndexVals = desiredOrder.slice(0).reverse();
    arr.sort((a, b) => {
        const aIndex = -orderForIndexVals.indexOf(a.getAttribute("data-id"));
        const bIndex = -orderForIndexVals.indexOf(b.getAttribute("data-id"));
        return aIndex - bIndex;
    });
}

function sortLinks(customOrder) {
    var links = document.querySelectorAll('[data-id]');

    const parentContainer = document.getElementById("links");
    links = Array.from(links);
    applyCustomOrder(links, customOrder);
    while (parentContainer.firstChild) {
        parentContainer.removeChild(parentContainer.firstChild);
    }
    for (i = 0; i < links.length; i++) {
        console.log(links[i].getAttribute("data-id"));
        parentContainer.appendChild(links[i]);
    }
    parentContainer.firstChild.innerHTML += `<span id='arrowhead'> ↗</span>`;
}

function updatePageElements(pageElements) {
    document.getElementById("userName").innerHTML = pageElements.name;//set name
    document.getElementById("userPhoto").src = pageElements.photo;//set photo
    document.getElementById("favicon").href = pageElements.photo;//set favicon  
    // set pic and name link
    document.getElementById("shadow-link").setAttribute('href', pageElements.link);
    document.getElementById("userName").setAttribute('href', pageElements.link);
    if (pageElements.verified === true) {
        document.getElementById("userName").innerHTML += `<svg width="1rem" height="1rem" version="1.1" viewBox="0,0,24,24" xmlns="http://www.w3.org/2000/svg" style="margin-left:0.3rem"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" fill="#1da1f2"/></svg>`;
    }
    if (pageElements.branded.logo && pageElements.branded.logoSize && pageElements.branded.logoLink) {
        let link = document.createElement("a");
        link.setAttribute("target", "_blank");
        link.href = pageElements.branded.logoLink;
        let img = document.createElement("img");
        img.src = pageElements.branded.logo;
        img.style = "width:" + pageElements.branded.logoSize + "rem;"
        let p = document.getElementById("footer-logo");
        link.appendChild(img);
        p.appendChild(link);
    }
    if (pageElements.doNotDisplay) {
        let links = Array.from(document.querySelectorAll('[data-id]'));
        console.log(pageElements.doNotDisplay);
        // Iterate over the links and remove the ones listed in doNotDisplay
        links.forEach(function (link) {
            let dataId = link.getAttribute('data-id');
            if (pageElements.doNotDisplay.includes(parseInt(dataId))) {
                link.remove();
            }
        });
    }
}

// applies styles
function applyStyle(pagestyle) {
    document.body.style.background = pagestyle.background;
    let links = document.querySelectorAll('.link');
    links.forEach(link => {
        link.style.color = pagestyle.allText;
        link.style.borderStyle = "solid";
        link.style.borderWidth = "2px";
        link.style.borderRadius = "20px";

        if (pagestyle.defaultLinkColor.startsWith("linear-gradient")) {
            link.style.borderImage = pagestyle.defaultLinkColor;
        }
        else {
            link.style.borderColor = pagestyle.defaultLinkColor;
        }
    })
    document.getElementById('userName').style.color = pagestyle.allText;
    const parentContainer = document.getElementById("links");

    //TODO : highlightLinkColor should support gradients too
    parentContainer.firstChild.style = "background-color:" + pagestyle.highlightLinkColor + "; border: solid " + pagestyle.highlightLinkColor + " 2px; color: " + pagestyle.labelTextColor + "; font-weight:bolder;";
    document.getElementById('arrowhead').style = 'color: ' + pagestyle.labelTextColor + '; font-weight: bolder;';
    document.getElementById('label').style = 'font-size: xx-small;background-color: ' + pagestyle.labelColor + '; padding-left:5px; padding-right:5px; border-radius: 10px; vertical-align:middle; font-weight: bold; color: ' + pagestyle.labelTextColor + ';';

    //modify dialogflow agent styles
    document.querySelector('df-messenger').style = '--df-messenger-primary-color: ' + pagestyle.background + '; --df-messenger-chat-bubble-icon-color:' + pagestyle.highlightLinkColor + '; --df-messenger-titlebar-border: solid ' + pagestyle.defaultLinkColor + ' 1px;';
}

function updatePushDate() {
    fetch('https://api.github.com/repos/rittmang/Leeenk')
        .then(response => {
            // Check if the response was successful
            if (!response.ok) {
                // If not successful, throw an error with the status
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Extract the 'pushed_at' field
            const pushedAt = data.pushed_at;
            // Convert the date string to a Date object
            const date = new Date(pushedAt);
            // Format the date to "Mon YYYY"
            const options = { year: 'numeric', month: 'short' };
            const formattedDate = date.toLocaleDateString('en-US', options);
            // Update the div's content
            const updateDateDiv = document.getElementById('update-date');
            updateDateDiv.textContent = `✧ Updated ${formattedDate} ✧`;
        })
        .catch(error => {
            // console.log("hello");
            const updateDateDiv = document.getElementById('update-date');
            updateDateDiv.textContent = `✧ Updated Nov 2023 ✧`;
            // console.error('Error fetching the push date:', error);
        });
}

//main execution

const urlParams = getAllUrlParams(window.location.href);
const customOrder = (urlParams.order || "1").split(",");
const prp = urlParams.p;

const pageElements = {
    name: 'Ritom',
    link: 'https://twitter.com/rittmang',
    verified: false,
    photo: 'img/avatar.jpg',
    branded: false,
    doNotDisplay: []
}

const pagestyle = {
    background: '#000000',
    allText: '#ffffff',
    highlightLinkColor: '#1db954',
    defaultLinkColor: '#a9a9a9',
    labelColor: '#1db954',
    labelTextColor: '#ffffff'
};

if (urlParams.game === 'brickbreaker') {
    var script = document.createElement('script');
    script.onload = function () {
        console.log('game loaded');
    }
    script.src = 'scripts/renderGameMode.js';
    document.body.appendChild(script);
}

updatePushDate();

fetch(dataUrl)
    .then(response => response.json())
    .then(data => {
        const prpData = data[prp];
        if (prpData) {
            if (prpData['colors']) {
                console.log("Yes PRP. Yes colors.")
                Object.assign(pagestyle, prpData.colors);
            }
            else {
                console.log("Yes PRP. No colors.")
            }
            pageElements.name = prpData['name'] ? prpData['name'] : pageElements.name;
            pageElements.photo = prpData['photo'] ? prpData['photo'] : pageElements.photo;
            pageElements.link = prpData['link'] ? prpData['link'] : pageElements.link;
            pageElements.verified = prpData['verified'] ? prpData['verified'] : pageElements.verified;
            pageElements.branded = prpData['branded'] ? prpData['branded'] : pageElements.branded;
            pageElements.doNotDisplay = prpData['doNotDisplay'] ? prpData['doNotDisplay'] : pageElements.doNotDisplay;
            updatePageElements(pageElements);
            sortLinks(customOrder);
            applyStyle(pagestyle);
        } else {
            console.log("No PRP. Using default schemes.");
        }
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });



// document.referrer can give direct prp values based on referrer:
/*
    Twitter : https://t.co/
    Instagram : https://l.instagram.com/
    LinkedIn : https://www.linkedin.com/
    Gmail : https://mail.google.com/
    YouTube : https://www.youtube.com/
    Facebook : https://l.facebook.com/
    Reddit : https://www.reddit.com/
    SubStack : <Newsletter URL>
*/

/*

Linktr.ee ld json
<script type="application/ld+json">{"@context":"https://schema.org/","@type":"WebPage","name":"adrianbliss | Twitter, Instagram, Facebook, TikTok | Linktree","url":"https://linktr.ee/adrianbliss","sameAs":["https://twitter.com/adrianbliss","https://instagram.com/adrianbliss","https://tiktok.com/@adrianbliss","https://www.youtube.com/c/AdrianBliss","mailto:bashley@settebelloentertainment.com"],"description":"Business: bashley@settebelloentertainment.com","image":"https://d1fdloi71mui9q.cloudfront.net/7DMJETvURsK60eZoltKr_1m0eZU6nqB1A79l8","identifier":"adrianbliss","alternateName":"@adrianbliss Linktree Profile","significantLink":"https://www.halloweencostumes.com/?CouponCode=adrianbliss15&utm_source=influencer","dateCreated":1617463926000,"dateModified":1676904974000,"isPartOf":"https://linktr.ee","thumbnailUrl":"https://d1fdloi71mui9q.cloudfront.net/7DMJETvURsK60eZoltKr_1m0eZU6nqB1A79l8","genre":"comedy","keywords":"comedy, writer, arts-entertainment"}</script>

*/