/**
 * This is a script to automatically update 'blog-grids.html' file with the latest blog details. Please run this script using the following command:
 * `node blog-grid.js example.md`
 *
 * **Make sure you are in blog-posts-md directory before running the command**
 */

const fs = require('fs');
const fm = require('front-matter');
const path = require('path');

// Function to replace the "MARK" comment with custom HTML
function replaceMarkWithCustomHtml(filePath, customHtml) {
    // Read the HTML file content
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        // Define the pattern to find the "MARK" comment
        const markPattern = /<!--\s*MARK FOR NEXT\s*-->/g;

        // Check if the "MARK FOR NEXT" comment exists in the file
        if (!markPattern.test(data)) {
            console.log('The "MARK FOR NEXT" comment was not found in the file.');
            return;
        }

        fs.readFile(process.argv[2], 'utf8', (err, mdData) => {
            if (err) {
                console.error('Error reading the file:', err);
                return;
            }

            // Parse the content attribute
            const content = fm(mdData);

            // Replace the "CAT_TO_BE_REPLACED" with the CTF Category Tags
            customHtml = customHtml.replace("CAT_TO_BE_REPLACED", content.attributes.category);
            customHtml = customHtml.replace('AUTHOR_TO_BE_REPLACED', content.attributes.author);
            customHtml = customHtml.replace('DATE_TO_BE_REPLACED', content.attributes.date);
            customHtml = customHtml.replace('TITLE_TO_BE_REPLACED', content.attributes.title);
            customHtml = customHtml.replace(/BLOG_POST_URI/g, "posts/" + content.attributes.title.replace("[", "").replace("]", "").replace(/ /g, "-").toLowerCase() + ".html");

            // Replace the "MARK" comment with the custom HTML
            const updatedData = data.replace(markPattern, customHtml);

            // Write the updated content back to the file
            fs.writeFile(filePath, updatedData, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing the updated content to the file:', err);
                    return;
                }
                console.log('The "MARK FOR NEXT" comment has been successfully replaced with custom HTML.');
            });
        });
    });
}

// Example usage
const filePath = path.join(__dirname, '../src/blog/blog-grids.html'); // Path to your HTML file
const customHtml = `
        <!-- MARK FOR NEXT -->

        <div class="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 px-4" >
            <div class="relative bg-white dark:bg-dark shadow-one rounded-md overflow-hidden mb-10 wow fadeInUp"
                data-wow-delay=".1s">
                <a href="BLOG_POST_URI" class="w-full block relative">
                    <span
                        class="absolute top-6 right-6 bg-primary rounded-full inline-flex items-center justify-center py-2 px-4 font-semibold text-sm text-white">
                        CAT_TO_BE_REPLACED
                    </span>
                    <img src="../images/blog/blog-01.jpg" alt="image" class="w-[408px] h-[242px]" />
                </a>
                <div class="p-6 sm:p-8 md:py-8 md:px-6 lg:p-8 xl:py-8 xl:px-5 2xl:p-8">
                    <h3>
                        <a href="BLOG_POST_URI"
                            class="font-bold text-black dark:text-white text-xl sm:text-2xl block mb-4 hover:text-primary dark:hover:text-primary">
                            TITLE_TO_BE_REPLACED
                        </a>
                    </h3>
                    <p
                        class="text-base text-body-color font-medium pb-6 mb-6 border-b border-body-color border-opacity-10 dark:border-white dark:border-opacity-10">
                        A writeup about XSS and etc.
                    </p>
                    <div class="flex items-center">
                        <div
                            class="flex items-center pr-5 mr-5 xl:pr-3 2xl:pr-5 xl:mr-3 2xl:mr-5 border-r border-body-color border-opacity-10 dark:border-white dark:border-opacity-10">
                            <div class="max-w-[40px] w-full h-[40px] rounded-full overflow-hidden mr-4">
                                <img src="../images/blog/anon.png" alt="author" class="w-full" />
                            </div>
                            <div class="w-full">
                                <h4 class="text-sm font-medium text-dark dark:text-white mb-1">
                                    By
                                    <a href="/members.html"
                                        class="text-dark dark:text-white hover:text-primary dark:hover:text-primary"> AUTHOR_TO_BE_REPLACED </a>
                                </h4>
                                <p class="text-xs text-body-color">Graphic Designer</p>
                            </div>
                        </div>
                        <div class="inline-block">
                            <h4 class="text-sm font-medium text-dark dark:text-white mb-1">Date</h4>
                            <p class="text-xs text-body-color">DATE_TO_BE_REPLACED</p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
`;

replaceMarkWithCustomHtml(filePath, customHtml);