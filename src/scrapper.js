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

        // Convert each nodelist to array, merge the 2 arrays, convert back to nodelist 
        Array.from(topPriorityData.children).forEach(element => fragment.appendChild(element))
        Array.from(homePageData.children).forEach(element => fragment.appendChild(element))

        for (let i = 0; i < fragment.children.length; i++) {
            if (fragment.children[i].nodeName === 'DIV') {
                const a = fragment.children[i].querySelector('a')
                match.group = a ? a.textContent.trim().replace(/[^a-z0-9]/gmi, " ").replace(/\s+/g, " ") : '' // [5]
                continue
            } else {
                match.time = fragment.children[i].querySelector('div:nth-child(1)').textContent.trim()
                match.homeTeam = fragment.children[i].querySelector("div:nth-child(2) > div > div:nth-child(1) > div:nth-child(1)").textContent.trim()
                match.awayTeam = fragment.children[i].querySelector("div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1)").textContent.trim()
                match.oddsHome = fragment.children[i].children[3].textContent.trim()
                match.oddsDraw = fragment.children[i].children[4].textContent.trim()
                match.oddsAway = fragment.children[i].children[5].textContent.trim()
                match.result = fragment.children[i].querySelector("div:nth-child(8)").textContent.trim()
            }
            matches.push({ ...match }) // destructure to fix referencing issue
        }

        // console.log(`Scraped ${matches.length} matches`, matches)

        return matches
    } catch (err) {
        console.log(err)
    }
}


export default scrapper



/*



[5]
https://stackoverflow.com/questions/20864893/replace-all-non-alphanumeric-characters-new-lines-and-multiple-white-space-wit


*/