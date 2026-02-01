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
};

function addArrowToFirstLink(parentContainer) {
    if (!parentContainer) {
        return;
    }

    const arrows = parentContainer.querySelectorAll('#arrowhead');
    arrows.forEach(arrow => arrow.remove());

    const firstLink = parentContainer.querySelector('.js-link');
    if (!firstLink) {
        return;
    }

    const arrow = document.createElement('span');
    arrow.id = 'arrowhead';
    arrow.textContent = '↗';
    arrow.style.marginLeft = '0.5rem';
    arrow.style.display = 'inline-block';
    arrow.style.verticalAlign = 'middle';
    firstLink.appendChild(arrow);
}

function sortLinks(customOrder) {
    let links = document.querySelectorAll('[data-id]');

    const parentContainer = document.getElementById("links");
    if (!parentContainer) {
        return;
    }

    links = Array.from(links);
    applyCustomOrder(links, customOrder);
    while (parentContainer.firstChild) {
        parentContainer.removeChild(parentContainer.firstChild);
    }
    for (let i = 0; i < links.length; i++) {
        parentContainer.appendChild(links[i]);
    }

    addArrowToFirstLink(parentContainer);
}

function updatePageElements(pageElements) {
    const userName = document.getElementById("userName");
    const userPhoto = document.getElementById("userPhoto");
    const favicon = document.getElementById("favicon");
    const shadowLink = document.getElementById("shadow-link");
    const footerLogo = document.getElementById("footer-logo");

    if (userName) {
        userName.innerHTML = pageElements.name;
        userName.setAttribute('href', pageElements.link);
    }
    if (userPhoto) {
        userPhoto.src = pageElements.photo;
    }
    if (favicon) {
        favicon.href = pageElements.photo;
    }
    if (shadowLink) {
        shadowLink.setAttribute('href', pageElements.link);
    }

    if (pageElements.verified === true && userName) {
        userName.innerHTML += `<svg width="1rem" height="1rem" version="1.1" viewBox="0,0,24,24" xmlns="http://www.w3.org/2000/svg" style="margin-left:0.3rem"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" fill="#1da1f2"/></svg>`;
    }

    if (footerLogo) {
        footerLogo.innerHTML = '';
    }

    if (pageElements.branded && typeof pageElements.branded === 'object') {
        const branded = pageElements.branded;
        if (branded.logo && branded.logoSize && branded.logoLink && footerLogo) {
            let link = document.createElement("a");
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener");
            link.href = branded.logoLink;
            let img = document.createElement("img");
            img.src = branded.logo;
            img.alt = 'Brand logo';
            img.style = "width:" + branded.logoSize + "rem;";
            link.appendChild(img);
            footerLogo.appendChild(link);
        }
    }

    if (pageElements.doNotDisplay && Array.isArray(pageElements.doNotDisplay)) {
        let links = Array.from(document.querySelectorAll('[data-id]'));
        links.forEach(function (link) {
            let dataId = link.getAttribute('data-id');
            if (pageElements.doNotDisplay.includes(parseInt(dataId, 10))) {
                link.remove();
            }
        });
    }
}

// applies styles
function applyStyle(pagestyle) {
    const root = document.documentElement;
    root.style.setProperty('--page-bg', pagestyle.background);
    root.style.setProperty('--text-color', pagestyle.allText);
    root.style.setProperty('--label-bg', pagestyle.labelColor);
    root.style.setProperty('--label-text', pagestyle.labelTextColor);

    let links = document.querySelectorAll('.js-link');
    links.forEach(link => {
        link.style.setProperty('--link-bg', 'transparent');
        link.style.setProperty('--link-text', pagestyle.allText);
        link.style.setProperty('--link-border', pagestyle.defaultLinkColor);
        link.style.borderImage = '';
        link.style.fontWeight = '500';

        if (pagestyle.defaultLinkColor && pagestyle.defaultLinkColor.startsWith("linear-gradient")) {
            link.style.borderImage = pagestyle.defaultLinkColor;
            link.style.setProperty('--link-border', 'transparent');
        }
    });

    const primaryLink = document.querySelector('#links .js-link');
    if (primaryLink) {
        primaryLink.style.setProperty('--link-bg', pagestyle.highlightLinkColor);
        primaryLink.style.setProperty('--link-text', pagestyle.labelTextColor);
        primaryLink.style.setProperty('--link-border', pagestyle.highlightLinkColor);
        primaryLink.style.fontWeight = '600';
        primaryLink.style.borderImage = '';
    }

    const arrow = document.getElementById('arrowhead');
    if (arrow) {
        arrow.style.color = pagestyle.labelTextColor;
    }

    const dfMessenger = document.querySelector('df-messenger');
    if (dfMessenger) {
        dfMessenger.style = '--df-messenger-primary-color: ' + pagestyle.background + '; --df-messenger-chat-bubble-icon-color: ' + pagestyle.highlightLinkColor + '; --df-messenger-titlebar-border: solid ' + pagestyle.defaultLinkColor + ' 1px;';
    }
}

function updatePushDate() {
    fetch('https://api.github.com/repos/rittmang/Leeenk')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const pushedAt = data.pushed_at;
            const date = new Date(pushedAt);
            const options = { year: 'numeric', month: 'short' };
            const formattedDate = date.toLocaleDateString('en-US', options);
            const updateDateDiv = document.getElementById('update-date');
            if (updateDateDiv) {
                updateDateDiv.textContent = `✧ Updated ${formattedDate} ✧`;
            }
        })
        .catch(() => {
            const updateDateDiv = document.getElementById('update-date');
            if (updateDateDiv) {
                updateDateDiv.textContent = `✧ Updated Nov 2023 ✧`;
            }
        });
}

// main execution

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
};

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
    };
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
                Object.assign(pagestyle, prpData.colors);
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
