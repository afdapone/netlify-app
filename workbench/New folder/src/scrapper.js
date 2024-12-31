import { Window } from 'happy-dom'


async function scrapper() {
    // Scrape Function
    try {
        const response = await fetch('https://www.soccervista.com/')
        const html = await response.text()

        // Set up Happy DOM
        const document = (new Window()).document
        document.body.innerHTML = html

        const matches = []
        const match = {}

        const fragment = document.createDocumentFragment()

        const topPriorityData = document.querySelector("body > div.container.relative.z-20.min-w-\\[375px\\] > main > div.min-md\\:pr-3\\.5.flex.w-full.flex-col.max-md\\:mb-3 > div:nth-child(3) > div.flex.flex-col > div:nth-child(2)")
        const homePageData = document.querySelector("body > div.container.relative.z-20.min-w-\\[375px\\] > main > div.min-md\\:pr-3\\.5.flex.w-full.flex-col.max-md\\:mb-3 > div:nth-child(3) > div.flex.flex-col > div:nth-child(3)")
console.log('topPriorityData', topPriorityData)
console.log('homePageData', homePageData)
        // Convert each nodelist to array, merge the 2 arrays, convert back to nodelist
        if (topPriorityData)
            Array.from(topPriorityData.children).forEach(element => fragment.appendChild(element))
        if (topPriorityData)
            Array.from(homePageData.children).forEach(element => fragment.appendChild(element))

        for (let i = 0; i < fragment.children.length; i++) {
            if (fragment.children[i].nodeName === 'DIV') {
                // Get rid of ads frame advert
                if (fragment.children[i].classList.contains('bannerZone') || fragment.children[i].id.includes('advert'))
                    continue
                const a = fragment.children[i].querySelector('a')
                match.group = 'Soccer'
                match.title = a ? a.textContent.trim().replace(/[^a-z0-9]/gmi, " ").replace(/\s+/g, " ") : '' // [5]
                match.key = 'soccer_' + match.title.toLowerCase().replaceAll(' ', '_')
                match.sport_key = match.key
                match.active = true
                continue
            } else {
                match.id = uuidv4().replaceAll('-', '')
                match.commence_time = fragment.children[i].querySelector('div:nth-child(1)').textContent.trim()
                match.commence_time = convertToUTC(match.commence_time)
                match.home_team = fragment.children[i].querySelector("div:nth-child(2) > div > div:nth-child(1) > div:nth-child(1)").textContent.trim()
                match.away_team = fragment.children[i].querySelector("div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1)").textContent.trim()
                match.home_odd = fragment.children[i].children[3].textContent.trim()
                match.draw_odd = fragment.children[i].children[4].textContent.trim()
                match.away_odd = fragment.children[i].children[5].textContent.trim()
                match.prediction = fragment.children[i].querySelector("div:nth-child(8)").textContent.trim()
            }
            matches.push({ ...match }) // destructure to fix referencing issue
        }

        // console.log(`Scraped ${matches.length} matches`, matches)

        return matches
    } catch (err) {
        console.log(err)
    }
}

function convertToUTC(timeString) {
    // Split the time string into hours and minutes
    const [hours, minutes] = timeString.split(':').map(Number)

    // Get the current date in UTC
    const now = new Date()
    const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hours, minutes, 0))

    return utcDate
}

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}


// const timeString = "21:20";
// const utcDatetime = convertToUTC(timeString);

// console.log(utcDatetime.toISOString()); // Output in ISO 8601 format

export default scrapper



/*



[5]
https://stackoverflow.com/questions/20864893/replace-all-non-alphanumeric-characters-new-lines-and-multiple-white-space-wit


*/