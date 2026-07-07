// ==UserScript==
// @name         HocIZ-Tweaks
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tweaks for hociz.vn
// @author       Triangle
// @match        https://hociz.vn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hociz.vn
// ==/UserScript==

function print(message) {
    console.log("[HocIZ-Tweaks] " + message);
}

function waitForElem(selector, disappear = false) {
    // Wait for an element to appear (or disappear), then return the element
    return new Promise((resolve) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        let appeared = false;

        const observer = new MutationObserver((mutations) => {
            const exist = document.querySelector(selector) ? true : false;
            if (exist ? (!disappear) : (disappear & appeared)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
            appeared = exist;
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

async function getYtURL() {
    const elem = await waitForElem(".plyr__video-wrapper iframe");
    if (!elem) return "";
    const url = elem.src.replace(/\?.*/, "").replace(/embed\//, "watch?v=");

    print(`Extracting Youtube URL: ${url}`);
    return url;
}

function addYtButton() {
    async function add() {
        if (document.querySelector(".youtube-link")) return;

        const plyr = await waitForElem(".w-full .plyr");
        if (!plyr) {add(); return;}

        const url = await getYtURL();
        const elem = plyr.parentElement;
        if (!elem) {add(); return;}

        const link = document.createElement("div");

        link.innerHTML = `
            <div class="youtube-link text-primary-500" style="padding:10px; float:down">
                <a href=${url} target="_blank" style="display:flex; align-items:center; gap:10px; float:left">
                    <img src="https://www.google.com/s2/favicons?sz=64&domain=youtube.com" style="width:32px; height:32px; float:left">
                    <b style="float:left">
                        Xem trên Youtube
                    </b>
                </a>
            </div>`;

        elem.appendChild(link);

        print("Sucessfully added Youtube button");
    }

    add();
    waitForElem(".youtube-link", true).then(addYtButton);
}

addYtButton();
