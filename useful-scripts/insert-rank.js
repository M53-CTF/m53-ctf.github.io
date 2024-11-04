/**
 * This is a script to automatically update 'achievements.html' file with the latest ranking details. Please run this script using the following command:
 *
 * `node insert-rank.js`
 *
 * The enter the ranking details from oldest to latest CTF date. The script will prompt you to enter the rank obtained, CTF name, CTF date, and CTF points obtained.
 *
 * **Make sure you are in the useful-scripts directory before running the command**
 * **Make sure `npm install prompt-sync` is installed**
 */


// Import required modules
const fs = require('fs');
const ps = require("prompt-sync");
const path = require('path');
const { exit } = require('process');

const prompt = ps();

// Custom HTML template to prepend
var rankTemplate = `
        <!-- MARK FOR NEXT -->

        <div class="w-full px-4">
            <div class="relative bg-white dark:bg-dark shadow-one rounded-md overflow-hidden mb-10 wow fadeInUp"
            data-wow-delay=".1s">
            <div class="p-4 sm:p-6 md:py-8 md:px-6 lg:p-8 xl:py-8 xl:px-5 2xl:p-8">
                <div class="flex flex-nowrap items-center justify-between">
                <!-- Ranking Section -->
                <div
                  class="flex items-center pr-2 sm:pr-3 xl:pr-3 2xl:pr-5 border-r border-body-color border-opacity-10 dark:border-white dark:border-opacity-10 min-w-[50px] sm:min-w-[70px]">
                    <div class="flex-1 flex items-center">
                    <div class="flex-1">
                        <h4 class="ranking RANK_CSS text-sm sm:text-base"># RANK_OBTAINED</h4>
                    </div>
                    </div>
                </div>
                <!-- Competition Name and Date Section -->
                <div class="flex items-center flex-grow justify-between pr-2 sm:pr-3 xl:pr-3 2xl:pr-5">
                    <div class="flex-1">
                        <h4 class="competition-name text-sm sm:text-base break-words">CTF_NAME</h4>
                        <p class="competition-date text-xs sm:text-sm">CTF_DATE</p>
                    </div>
                </div>
                <!-- Points and Merger Section -->
                <div class="flex items-center justify-between min-w-[120px] sm:min-w-[150px] gap-x-2 sm:gap-x-3">
                    <!-- MERGER_ICON -->
                    <h4 class="earned-points text-xs sm:text-sm">CTF_POINTS Points</h4>
                </div>
                </div>
            </div>
            </div>
        </div>
`;

var mergerTemplate = `
                <div class="merger-oval flex items-center justify-center p-1 sm:p-2 text-xs sm:text-sm flex-shrink-0" aria-label="Merger Icon">
                    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(-90deg);" aria-hidden="true">
                    <path
                        d="M7.586 8.00366L4 8.00366C3.44772 8.00366 3 7.55595 3 7.00366C3 6.45138 3.44772 6.00366 4 6.00366L8 6.00366C8.26509 6.00366 8.51933 6.10892 8.70685 6.2963L13.414 11H18.5845L15.2931 7.71103C14.9025 7.32065 14.9023 6.68748 15.2926 6.29681C15.683 5.90615 16.3162 5.90592 16.7068 6.2963L21.7068 11.2926C21.8945 11.4802 22 11.7346 22 11.9998C22 12.2651 21.8947 12.5195 21.7071 12.7071L16.7071 17.7071C16.3166 18.0976 15.6834 18.0976 15.2929 17.7071C14.9024 17.3166 14.9024 16.6834 15.2929 16.2929L18.5858 13H13.4142L8.70711 17.7071C8.51957 17.8947 8.26522 18 8 18H4C3.44772 18 3 17.5523 3 17C3 16.4477 3.44772 16 4 16H7.58579L11.5855 12.0003L7.586 8.00366Z"
                        fill="#212121" />
                    </svg>
                    &nbsp;Merger
                </div>
`;

// While loop to prompt for user input on ranking details
var rankDetails = [];
var i = 0;
while (true) {

    var rank = prompt("\nEnter the rank obtained: ");
    var ctfName = prompt("Enter the CTF name: ");
    var ctfDate = prompt("Enter the CTF date (E.g. 12 Jun 2024): ");
    var ctfPoints = prompt("Enter the CTF points obtained: ");
    var merge = prompt("Played with Merger team (Y/N): ");

    if (rank !== null && ctfName !== null && ctfDate !== null && ctfPoints !== null && merge !== null && rank !== '' && ctfName !== '' && ctfDate !== '' && ctfPoints !== '' && merge !== '') {
        rankDetails.push({
            rank: rank,
            ctfName: ctfName,
            ctfDate: ctfDate,
            ctfPoints: ctfPoints,
            merge: merge
        });
    }else{
        exit();
    }

    var continueAdding = prompt("\nDo you want to add another ranking (Y/N): ");
    if (continueAdding.replace(/\r?\n|\r/g, "").toLowerCase() === 'n' || continueAdding.replace(/\r?\n|\r/g, "").toLowerCase() === 'no'){
        break;
    }
}

// Replace the placeholders in the rankTemplate with the rankDetails
var finalRankTemplate = '';
rankDetails.forEach(rankDetail => {
    // Check if finalRankTemplate is empty
    if (finalRankTemplate === '') {
        finalRankTemplate = rankTemplate;
    }else{
        finalRankTemplate = finalRankTemplate.replace('<!-- MARK FOR NEXT -->', rankTemplate);
    }

    if (rankDetail.merge.replace(/\r?\n|\r/g, "").toLowerCase() === 'y' || rankDetail.merge.replace(/\r?\n|\r/g, "").toLowerCase() === 'yes') {
        finalRankTemplate = finalRankTemplate.replace('<!-- MERGER_ICON -->', mergerTemplate);
    }

    finalRankTemplate = finalRankTemplate.replace('RANK_OBTAINED', rankDetail.rank);
    finalRankTemplate = finalRankTemplate.replace('CTF_NAME', rankDetail.ctfName);
    finalRankTemplate = finalRankTemplate.replace('CTF_DATE', rankDetail.ctfDate);
    finalRankTemplate = finalRankTemplate.replace('CTF_POINTS', rankDetail.ctfPoints);

    switch (rankDetail.rank) {
        case '1':
            finalRankTemplate = finalRankTemplate.replace('RANK_CSS', 'ranking-1');
            break;
        case '2':
            finalRankTemplate = finalRankTemplate.replace('RANK_CSS', 'ranking-2');
            break;
        case '3':
            finalRankTemplate = finalRankTemplate.replace('RANK_CSS', 'ranking-3');
            break;
        default:
            finalRankTemplate = finalRankTemplate.replace('RANK_CSS', 'ranking-other');
            break;
    }
});

const filePath = path.join(__dirname, '../src/achievements.html');

// Replace the '<!-- MARK FOR NEXT -->' comment with the finalRankTemplate
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    const markPattern = /<!-- MARK FOR NEXT -->/g;
    const updatedData = data.replace(markPattern, finalRankTemplate);
    fs.writeFile(filePath, updatedData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing the updated content to the file:', err);
            return;
        }
        console.log('The "MARK FOR NEXT" comment has been successfully replaced with latest rankTemplate HTML.');
    });
});