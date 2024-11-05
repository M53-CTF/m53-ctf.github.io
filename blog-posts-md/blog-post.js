/**
 * This is a script to automatically update '/blog/posts/' file with the blog post using markdown. Please run this script using the following command:
 * `node blog-post.js example.md`
 *
 * **Make sure you are in blog-posts-md directory before running the command**
 */

// Import required modules
const fs = require('fs');
const fm = require('front-matter');
const marked = require('marked');

// Custom HTML Header to prepend
var headerTemplate = `
<!DOCTYPE html>
<html lang="en" class="dark">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TITLE_TO_BE_REPLACED</title>
  <!-- SELF-ADDED SECTION -->
  <style>
    pre[class*="language-"]:before,
    pre[class*="language-"]:after {
      display: none;
    }
    /** Adding !important because the style.css will be loaded below this style tag**/
    ul {
      list-style: circle !important;
      list-style-type: circle !important;
      padding-left: 30px !important;
      list-style-position: inside;
    }

    ol {
      list-style: decimal !important;
      list-style-type: decimal !important;
      padding-left: 30px !important;
      list-style-position: inside;
    }

    code {
      font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace !important;
       color: rgba(251,250,245,.8);
      font-display: auto !important;
      font-feature-settings: normal !important;
      padding: 1px 6px !important;
      margin: 0 2px !important;
      border-radius: 5px !important;
      font-size: 0.95rem !important;
      background: #3b3d42;
    }
  </style>
  <script type="text/javascript">
    // Remove the indentation whitespaces from <pre> tags
      Prism.plugins.NormalizeWhitespace.setDefaults({
        'remove-initial-line-feed': false,
        'remove-trailing': false,
        'remove-indent': true,
        'left-trim': true,
        'right-trim': true,
      });
  </script>
  <!-- END OF SELF-ADDED SECTION -->
</head>
`;

var bodyNavbarTemplate = `
<body class="dark:bg-black">
  <!-- ====== Navbar Section Start -->
  <header class="header bg-transparent absolute top-0 left-0 z-40 w-full flex items-center">
    <div class="container">
      <div class="flex mx-[-16px] items-center justify-between relative">
        <div class="px-4 w-60 max-w-full">
          <a href="/index.html" class="w-full block py-8 header-logo">
            <!-- <img src="images/logo/logo-2.svg" alt="logo" class="w-full dark:hidden" /> -->
            <img src="../../images/logo/M53-logo-transparent-wide.png" alt="logo" class="w-full hidden dark:block" />
          </a>
        </div>
        <div class="flex px-4 justify-between items-center w-full">
          <div>
            <button id="navbarToggler" aria-label="Mobile Menu"
              class="block absolute right-4 top-1/2 translate-y-[-50%] lg:hidden focus:ring-2 ring-primary px-3 py-[6px] rounded-lg">
              <span class="relative w-[30px] h-[2px] my-[6px] block bg-dark dark:bg-white"></span>
              <span class="relative w-[30px] h-[2px] my-[6px] block bg-dark dark:bg-white"></span>
              <span class="relative w-[30px] h-[2px] my-[6px] block bg-dark dark:bg-white"></span>
            </button>
            <nav id="navbarCollapse"
              class="absolute py-5 lg:py-0 lg:px-4 xl:px-6 bg-white dark:bg-dark lg:dark:bg-transparent lg:bg-transparent shadow-lg rounded-lg max-w-[250px] w-full lg:max-w-full lg:w-full right-4 top-full hidden lg:block lg:static lg:shadow-none">
              <ul class="block lg:flex">
                <li class="relative group">
                  <a href="/#home"
                    class="menu-scroll text-base text-dark dark:text-white group-hover:opacity-70 py-2 lg:py-6 lg:inline-flex lg:px-0 flex mx-8 lg:mr-0">
                    Home
                  </a>
                </li>
                <li class="relative group">
                  <a href="/#about"
                    class="menu-scroll text-base text-dark dark:text-white group-hover:opacity-70 py-2 lg:py-6 lg:inline-flex lg:px-0 flex mx-8 lg:mr-0 lg:ml-8 xl:ml-12">
                    About
                  </a>
                </li>
                <li class="relative group">
                  <a href="/#merch"
                    class="menu-scroll text-base text-dark dark:text-white group-hover:opacity-70 py-2 lg:py-6 lg:inline-flex lg:px-0 flex mx-8 lg:mr-0 lg:ml-8 xl:ml-12">
                    Merch
                  </a>
                </li>
                <li class="relative group">
                  <a href="/recruitment.html"
                  class="menu-scroll text-base text-dark dark:text-white group-hover:opacity-70 py-2 lg:py-6 lg:inline-flex lg:px-0 flex mx-8 lg:mr-0 lg:ml-8 xl:ml-12">
                    Recruitment
                  </a>
                </li>
                <li class="relative group">
                  <a href="/sponsors.html"
                  class="menu-scroll text-base text-dark dark:text-white group-hover:opacity-70 py-2 lg:py-6 lg:inline-flex lg:px-0 flex mx-8 lg:mr-0 lg:ml-8 xl:ml-12">
                  Sponsors
                  </a>
                </li>
                <li class="relative group">
                  <a href="/achievements.html"
                  class="menu-scroll text-base text-dark dark:text-white group-hover:opacity-70 py-2 lg:py-6 lg:inline-flex lg:px-0 flex mx-8 lg:mr-0 lg:ml-8 xl:ml-12">
                  Achievements
                  </a>
                </li>
                <li class="relative group">
                  <a href="/#contact"
                    class="menu-scroll text-base text-dark dark:text-white group-hover:opacity-70 py-2 lg:py-6 lg:inline-flex lg:px-0 flex mx-8 lg:mr-0 lg:ml-8 xl:ml-12">
                    Contact
                  </a>
                </li>
                <!-- Blog and Members inside the collapsible menu for mobile -->
                <li class="relative group lg:hidden">
                  <a href="/blog/blog-grids.html"
                    class="menu-scroll text-base font-bold text-dark dark:text-white group-hover:opacity-70 py-2 lg:py-6 lg:inline-flex lg:px-0 flex mx-8 lg:mr-0 lg:ml-8 xl:ml-12">
                    Blog
                  </a>
                </li>
                <li class="relative group lg:hidden">
                  <a href="/members.html"
                    class="menu-scroll text-base font-bold text-white py-2 lg:py-6 lg:inline-flex lg:px-0 flex mx-8 lg:mr-0 lg:ml-8 xl:ml-12 rounded-md hover:shadow-signUp hover:bg-opacity-90">
                    Members
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div class="flex justify-end items-center pr-16 lg:pr-0">
            <a href="../../blog/blog-grids.html"
              class="hidden md:block text-base font-bold text-dark dark:text-white hover:opacity-70 py-3 px-7"> Blog
            </a>
            <a href="/members.html"
              class="hidden md:block text-base font-bold text-white bg-primary py-3 px-8 md:px-8 lg:px-6 xl:px-8 hover:shadow-signUp hover:bg-opacity-90 rounded-md transition ease-in-up duration-300">
              Members
            </a>
            <!-- <div>
              <label for="darkToggler"
                class="cursor-pointer w-9 h-9 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-gray-2 dark:bg-dark-bg text-black dark:text-white">
                <input type="checkbox" name="darkToggler" id="darkToggler" class="sr-only" aria-label="darkToggler" />
                <svg viewBox="0 0 23 23" class="stroke-current dark:hidden w-5 h-5 md:w-6 md:h-6" fill="none">
                  <path
                    d="M9.55078 1.5C5.80078 1.5 1.30078 5.25 1.30078 11.25C1.30078 17.25 5.80078 21.75 11.8008 21.75C17.8008 21.75 21.5508 17.25 21.5508 13.5C13.3008 18.75 4.30078 9.75 9.55078 1.5Z"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  class="hidden dark:block w-5 h-5 md:w-6 md:h-6">
                  <mask id="path-1-inside-1_977:1934" fill="white">
                    <path
                      d="M12.0508 16.5C10.8573 16.5 9.71271 16.0259 8.8688 15.182C8.02489 14.3381 7.55078 13.1935 7.55078 12C7.55078 10.8065 8.02489 9.66193 8.8688 8.81802C9.71271 7.97411 10.8573 7.5 12.0508 7.5C13.2443 7.5 14.3888 7.97411 15.2328 8.81802C16.0767 9.66193 16.5508 10.8065 16.5508 12C16.5508 13.1935 16.0767 14.3381 15.2328 15.182C14.3888 16.0259 13.2443 16.5 12.0508 16.5ZM12.0508 18C13.6421 18 15.1682 17.3679 16.2934 16.2426C17.4186 15.1174 18.0508 13.5913 18.0508 12C18.0508 10.4087 17.4186 8.88258 16.2934 7.75736C15.1682 6.63214 13.6421 6 12.0508 6C10.4595 6 8.93336 6.63214 7.80814 7.75736C6.68292 8.88258 6.05078 10.4087 6.05078 12C6.05078 13.5913 6.68292 15.1174 7.80814 16.2426C8.93336 17.3679 10.4595 18 12.0508 18ZM12.0508 0C12.2497 0 12.4405 0.0790176 12.5811 0.21967C12.7218 0.360322 12.8008 0.551088 12.8008 0.75V3.75C12.8008 3.94891 12.7218 4.13968 12.5811 4.28033C12.4405 4.42098 12.2497 4.5 12.0508 4.5C11.8519 4.5 11.6611 4.42098 11.5205 4.28033C11.3798 4.13968 11.3008 3.94891 11.3008 3.75V0.75C11.3008 0.551088 11.3798 0.360322 11.5205 0.21967C11.6611 0.0790176 11.8519 0 12.0508 0V0ZM12.0508 19.5C12.2497 19.5 12.4405 19.579 12.5811 19.7197C12.7218 19.8603 12.8008 20.0511 12.8008 20.25V23.25C12.8008 23.4489 12.7218 23.6397 12.5811 23.7803C12.4405 23.921 12.2497 24 12.0508 24C11.8519 24 11.6611 23.921 11.5205 23.7803C11.3798 23.6397 11.3008 23.4489 11.3008 23.25V20.25C11.3008 20.0511 11.3798 19.8603 11.5205 19.7197C11.6611 19.579 11.8519 19.5 12.0508 19.5ZM24.0508 12C24.0508 12.1989 23.9718 12.3897 23.8311 12.5303C23.6905 12.671 23.4997 12.75 23.3008 12.75H20.3008C20.1019 12.75 19.9111 12.671 19.7705 12.5303C19.6298 12.3897 19.5508 12.1989 19.5508 12C19.5508 11.8011 19.6298 11.6103 19.7705 11.4697C19.9111 11.329 20.1019 11.25 20.3008 11.25H23.3008C23.4997 11.25 23.6905 11.329 23.8311 11.4697C23.9718 11.6103 24.0508 11.8011 24.0508 12ZM4.55078 12C4.55078 12.1989 4.47176 12.3897 4.33111 12.5303C4.19046 12.671 3.99969 12.75 3.80078 12.75H0.800781C0.601869 12.75 0.411103 12.671 0.270451 12.5303C0.129799 12.3897 0.0507813 12.1989 0.0507812 12C0.0507813 11.8011 0.129799 11.6103 0.270451 11.4697C0.411103 11.329 0.601869 11.25 0.800781 11.25H3.80078C3.99969 11.25 4.19046 11.329 4.33111 11.4697C4.47176 11.6103 4.55078 11.8011 4.55078 12ZM20.5363 3.5145C20.6769 3.65515 20.7559 3.84588 20.7559 4.04475C20.7559 4.24362 20.6769 4.43435 20.5363 4.575L18.4153 6.6975C18.3455 6.76713 18.2628 6.82235 18.1717 6.86C18.0806 6.89765 17.983 6.91699 17.8845 6.91692C17.6855 6.91678 17.4947 6.83758 17.354 6.69675C17.2844 6.62702 17.2292 6.54425 17.1915 6.45318C17.1539 6.36211 17.1345 6.26452 17.1346 6.16597C17.1348 5.96695 17.214 5.77613 17.3548 5.6355L19.4758 3.5145C19.6164 3.3739 19.8072 3.29491 20.006 3.29491C20.2049 3.29491 20.3956 3.3739 20.5363 3.5145ZM6.74678 17.304C6.88738 17.4446 6.96637 17.6354 6.96637 17.8342C6.96637 18.0331 6.88738 18.2239 6.74678 18.3645L4.62578 20.4855C4.48433 20.6221 4.29488 20.6977 4.09823 20.696C3.90158 20.6943 3.71347 20.6154 3.57442 20.4764C3.43536 20.3373 3.35648 20.1492 3.35478 19.9526C3.35307 19.7559 3.42866 19.5665 3.56528 19.425L5.68628 17.304C5.82693 17.1634 6.01766 17.0844 6.21653 17.0844C6.4154 17.0844 6.60614 17.1634 6.74678 17.304ZM20.5363 20.4855C20.3956 20.6261 20.2049 20.7051 20.006 20.7051C19.8072 20.7051 19.6164 20.6261 19.4758 20.4855L17.3548 18.3645C17.2182 18.223 17.1426 18.0336 17.1443 17.8369C17.146 17.6403 17.2249 17.4522 17.3639 17.3131C17.503 17.1741 17.6911 17.0952 17.8877 17.0935C18.0844 17.0918 18.2738 17.1674 18.4153 17.304L20.5363 19.425C20.6769 19.5656 20.7559 19.7564 20.7559 19.9552C20.7559 20.1541 20.6769 20.3449 20.5363 20.4855ZM6.74678 6.6975C6.60614 6.8381 6.4154 6.91709 6.21653 6.91709C6.01766 6.91709 5.82693 6.8381 5.68628 6.6975L3.56528 4.575C3.49365 4.50582 3.43651 4.42306 3.39721 4.33155C3.3579 4.24005 3.33721 4.14164 3.33634 4.04205C3.33548 3.94247 3.35445 3.84371 3.39216 3.75153C3.42988 3.65936 3.48557 3.57562 3.55598 3.5052C3.6264 3.43478 3.71014 3.37909 3.80232 3.34138C3.89449 3.30367 3.99325 3.2847 4.09283 3.28556C4.19242 3.28643 4.29083 3.30712 4.38233 3.34642C4.47384 3.38573 4.5566 3.44287 4.62578 3.5145L6.74678 5.6355C6.81663 5.70517 6.87204 5.78793 6.90985 5.87905C6.94766 5.97017 6.96712 6.06785 6.96712 6.1665C6.96712 6.26515 6.94766 6.36283 6.90985 6.45395C6.87204 6.54507 6.81663 6.62783 6.74678 6.6975Z" />
                  </mask>
                  <path
                    d="M12.0508 16.5C10.8573 16.5 9.71271 16.0259 8.8688 15.182C8.02489 14.3381 7.55078 13.1935 7.55078 12C7.55078 10.8065 8.02489 9.66193 8.8688 8.81802C9.71271 7.97411 10.8573 7.5 12.0508 7.5C13.2443 7.5 14.3888 7.97411 15.2328 8.81802C16.0767 9.66193 16.5508 10.8065 16.5508 12C16.5508 13.1935 16.0767 14.3381 15.2328 15.182C14.3888 16.0259 13.2443 16.5 12.0508 16.5ZM12.0508 18C13.6421 18 15.1682 17.3679 16.2934 16.2426C17.4186 15.1174 18.0508 13.5913 18.0508 12C18.0508 10.4087 17.4186 8.88258 16.2934 7.75736C15.1682 6.63214 13.6421 6 12.0508 6C10.4595 6 8.93336 6.63214 7.80814 7.75736C6.68292 8.88258 6.05078 10.4087 6.05078 12C6.05078 13.5913 6.68292 15.1174 7.80814 16.2426C8.93336 17.3679 10.4595 18 12.0508 18ZM12.0508 0C12.2497 0 12.4405 0.0790176 12.5811 0.21967C12.7218 0.360322 12.8008 0.551088 12.8008 0.75V3.75C12.8008 3.94891 12.7218 4.13968 12.5811 4.28033C12.4405 4.42098 12.2497 4.5 12.0508 4.5C11.8519 4.5 11.6611 4.42098 11.5205 4.28033C11.3798 4.13968 11.3008 3.94891 11.3008 3.75V0.75C11.3008 0.551088 11.3798 0.360322 11.5205 0.21967C11.6611 0.0790176 11.8519 0 12.0508 0V0ZM12.0508 19.5C12.2497 19.5 12.4405 19.579 12.5811 19.7197C12.7218 19.8603 12.8008 20.0511 12.8008 20.25V23.25C12.8008 23.4489 12.7218 23.6397 12.5811 23.7803C12.4405 23.921 12.2497 24 12.0508 24C11.8519 24 11.6611 23.921 11.5205 23.7803C11.3798 23.6397 11.3008 23.4489 11.3008 23.25V20.25C11.3008 20.0511 11.3798 19.8603 11.5205 19.7197C11.6611 19.579 11.8519 19.5 12.0508 19.5ZM24.0508 12C24.0508 12.1989 23.9718 12.3897 23.8311 12.5303C23.6905 12.671 23.4997 12.75 23.3008 12.75H20.3008C20.1019 12.75 19.9111 12.671 19.7705 12.5303C19.6298 12.3897 19.5508 12.1989 19.5508 12C19.5508 11.8011 19.6298 11.6103 19.7705 11.4697C19.9111 11.329 20.1019 11.25 20.3008 11.25H23.3008C23.4997 11.25 23.6905 11.329 23.8311 11.4697C23.9718 11.6103 24.0508 11.8011 24.0508 12ZM4.55078 12C4.55078 12.1989 4.47176 12.3897 4.33111 12.5303C4.19046 12.671 3.99969 12.75 3.80078 12.75H0.800781C0.601869 12.75 0.411103 12.671 0.270451 12.5303C0.129799 12.3897 0.0507813 12.1989 0.0507812 12C0.0507813 11.8011 0.129799 11.6103 0.270451 11.4697C0.411103 11.329 0.601869 11.25 0.800781 11.25H3.80078C3.99969 11.25 4.19046 11.329 4.33111 11.4697C4.47176 11.6103 4.55078 11.8011 4.55078 12ZM20.5363 3.5145C20.6769 3.65515 20.7559 3.84588 20.7559 4.04475C20.7559 4.24362 20.6769 4.43435 20.5363 4.575L18.4153 6.6975C18.3455 6.76713 18.2628 6.82235 18.1717 6.86C18.0806 6.89765 17.983 6.91699 17.8845 6.91692C17.6855 6.91678 17.4947 6.83758 17.354 6.69675C17.2844 6.62702 17.2292 6.54425 17.1915 6.45318C17.1539 6.36211 17.1345 6.26452 17.1346 6.16597C17.1348 5.96695 17.214 5.77613 17.3548 5.6355L19.4758 3.5145C19.6164 3.3739 19.8072 3.29491 20.006 3.29491C20.2049 3.29491 20.3956 3.3739 20.5363 3.5145ZM6.74678 17.304C6.88738 17.4446 6.96637 17.6354 6.96637 17.8342C6.96637 18.0331 6.88738 18.2239 6.74678 18.3645L4.62578 20.4855C4.48433 20.6221 4.29488 20.6977 4.09823 20.696C3.90158 20.6943 3.71347 20.6154 3.57442 20.4764C3.43536 20.3373 3.35648 20.1492 3.35478 19.9526C3.35307 19.7559 3.42866 19.5665 3.56528 19.425L5.68628 17.304C5.82693 17.1634 6.01766 17.0844 6.21653 17.0844C6.4154 17.0844 6.60614 17.1634 6.74678 17.304ZM20.5363 20.4855C20.3956 20.6261 20.2049 20.7051 20.006 20.7051C19.8072 20.7051 19.6164 20.6261 19.4758 20.4855L17.3548 18.3645C17.2182 18.223 17.1426 18.0336 17.1443 17.8369C17.146 17.6403 17.2249 17.4522 17.3639 17.3131C17.503 17.1741 17.6911 17.0952 17.8877 17.0935C18.0844 17.0918 18.2738 17.1674 18.4153 17.304L20.5363 19.425C20.6769 19.5656 20.7559 19.7564 20.7559 19.9552C20.7559 20.1541 20.6769 20.3449 20.5363 20.4855ZM6.74678 6.6975C6.60614 6.8381 6.4154 6.91709 6.21653 6.91709C6.01766 6.91709 5.82693 6.8381 5.68628 6.6975L3.56528 4.575C3.49365 4.50582 3.43651 4.42306 3.39721 4.33155C3.3579 4.24005 3.33721 4.14164 3.33634 4.04205C3.33548 3.94247 3.35445 3.84371 3.39216 3.75153C3.42988 3.65936 3.48557 3.57562 3.55598 3.5052C3.6264 3.43478 3.71014 3.37909 3.80232 3.34138C3.89449 3.30367 3.99325 3.2847 4.09283 3.28556C4.19242 3.28643 4.29083 3.30712 4.38233 3.34642C4.47384 3.38573 4.5566 3.44287 4.62578 3.5145L6.74678 5.6355C6.81663 5.70517 6.87204 5.78793 6.90985 5.87905C6.94766 5.97017 6.96712 6.06785 6.96712 6.1665C6.96712 6.26515 6.94766 6.36283 6.90985 6.45395C6.87204 6.54507 6.81663 6.62783 6.74678 6.6975Z"
                    fill="black" stroke="white" stroke-width="2" mask="url(#path-1-inside-1_977:1934)" />
                </svg>
              </label>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </header>
  <!-- ====== Navbar Section End -->
`;

var blogSectionTemplate = `
<!-- ====== Blog Section Start -->
  <section class="pt-[150px] pb-[120px]">
    <div class="container">
      <div class="flex flex-wrap justify-center mx-[-16px]">
        <div class="w-full lg:w-8/12 px-4">
          <div>
            <h2 class="font-bold text-black dark:text-white text-3xl sm:text-4xl leading-tight sm:leading-tight mb-8">
              TITLE_TO_BE_REPLACED
            </h2>
            <div
              class="flex flex-wrap items-center justify-between pb-4 mb-10 border-b border-body-color border-opacity-10 dark:border-white dark:border-opacity-10">
              <div class="flex flex-wrap items-center">
                <div class="flex items-center mr-10 mb-5">
                  <div class="max-w-[40px] w-full h-[40px] rounded-full overflow-hidden mr-4">
                    <img src="../../images/blog/anon.png" alt="author" class="w-full" />
                  </div>
                  <div class="w-full">
                    <h4 class="text-base font-medium text-body-color mb-1">
                      By
                      <a href="/members.html" class="text-body-color hover:text-primary"> AUTHOR_TO_BE_REPLACED </a>
                    </h4>
                  </div>
                </div>
                <div class="flex items-center mb-5">
                  <p class="flex items-center text-base text-body-color font-medium mr-5">
                    <span class="mr-3">
                      <svg width="15" height="15" viewBox="0 0 15 15" class="fill-current">
                        <path
                          d="M3.89531 8.67529H3.10666C2.96327 8.67529 2.86768 8.77089 2.86768 8.91428V9.67904C2.86768 9.82243 2.96327 9.91802 3.10666 9.91802H3.89531C4.03871 9.91802 4.1343 9.82243 4.1343 9.67904V8.91428C4.1343 8.77089 4.03871 8.67529 3.89531 8.67529Z" />
                        <path
                          d="M6.429 8.67529H5.64035C5.49696 8.67529 5.40137 8.77089 5.40137 8.91428V9.67904C5.40137 9.82243 5.49696 9.91802 5.64035 9.91802H6.429C6.57239 9.91802 6.66799 9.82243 6.66799 9.67904V8.91428C6.66799 8.77089 6.5485 8.67529 6.429 8.67529Z" />
                        <path
                          d="M8.93828 8.67529H8.14963C8.00624 8.67529 7.91064 8.77089 7.91064 8.91428V9.67904C7.91064 9.82243 8.00624 9.91802 8.14963 9.91802H8.93828C9.08167 9.91802 9.17727 9.82243 9.17727 9.67904V8.91428C9.17727 8.77089 9.08167 8.67529 8.93828 8.67529Z" />
                        <path
                          d="M11.4715 8.67529H10.6828C10.5394 8.67529 10.4438 8.77089 10.4438 8.91428V9.67904C10.4438 9.82243 10.5394 9.91802 10.6828 9.91802H11.4715C11.6149 9.91802 11.7105 9.82243 11.7105 9.67904V8.91428C11.7105 8.77089 11.591 8.67529 11.4715 8.67529Z" />
                        <path
                          d="M3.89531 11.1606H3.10666C2.96327 11.1606 2.86768 11.2562 2.86768 11.3996V12.1644C2.86768 12.3078 2.96327 12.4034 3.10666 12.4034H3.89531C4.03871 12.4034 4.1343 12.3078 4.1343 12.1644V11.3996C4.1343 11.2562 4.03871 11.1606 3.89531 11.1606Z" />
                        <path
                          d="M6.429 11.1606H5.64035C5.49696 11.1606 5.40137 11.2562 5.40137 11.3996V12.1644C5.40137 12.3078 5.49696 12.4034 5.64035 12.4034H6.429C6.57239 12.4034 6.66799 12.3078 6.66799 12.1644V11.3996C6.66799 11.2562 6.5485 11.1606 6.429 11.1606Z" />
                        <path
                          d="M8.93828 11.1606H8.14963C8.00624 11.1606 7.91064 11.2562 7.91064 11.3996V12.1644C7.91064 12.3078 8.00624 12.4034 8.14963 12.4034H8.93828C9.08167 12.4034 9.17727 12.3078 9.17727 12.1644V11.3996C9.17727 11.2562 9.08167 11.1606 8.93828 11.1606Z" />
                        <path
                          d="M11.4715 11.1606H10.6828C10.5394 11.1606 10.4438 11.2562 10.4438 11.3996V12.1644C10.4438 12.3078 10.5394 12.4034 10.6828 12.4034H11.4715C11.6149 12.4034 11.7105 12.3078 11.7105 12.1644V11.3996C11.7105 11.2562 11.591 11.1606 11.4715 11.1606Z" />
                        <path
                          d="M13.2637 3.3697H7.64754V2.58105C8.19721 2.43765 8.62738 1.91189 8.62738 1.31442C8.62738 0.597464 8.02992 0 7.28906 0C6.54821 0 5.95074 0.597464 5.95074 1.31442C5.95074 1.91189 6.35702 2.41376 6.93058 2.58105V3.3697H1.31442C0.597464 3.3697 0 3.96716 0 4.68412V13.2637C0 13.9807 0.597464 14.5781 1.31442 14.5781H13.2637C13.9807 14.5781 14.5781 13.9807 14.5781 13.2637V4.68412C14.5781 3.96716 13.9807 3.3697 13.2637 3.3697ZM6.6677 1.31442C6.6677 0.979841 6.93058 0.716957 7.28906 0.716957C7.62364 0.716957 7.91042 0.979841 7.91042 1.31442C7.91042 1.649 7.64754 1.91189 7.28906 1.91189C6.95448 1.91189 6.6677 1.6251 6.6677 1.31442ZM1.31442 4.08665H13.2637C13.5983 4.08665 13.8612 4.34954 13.8612 4.68412V6.45261H0.716957V4.68412C0.716957 4.34954 0.979841 4.08665 1.31442 4.08665ZM13.2637 13.8612H1.31442C0.979841 13.8612 0.716957 13.5983 0.716957 13.2637V7.16957H13.8612V13.2637C13.8612 13.5983 13.5983 13.8612 13.2637 13.8612Z" />
                      </svg>
                    </span>
                    DATE_TO_BE_REPLACED
                  </p>
                  <!-- ORIGINAL_SOURCE -->
                </div>
              </div>
              <div class="mb-5">
                <span
                  class="bg-primary rounded-full inline-flex items-center justify-center py-2 px-4 font-semibold text-sm text-white">
                  CAT_TO_BE_REPLACED </span>
              </div>
            </div>
            <div>
              <div class="w-full rounded overflow-hidden mb-10">
                <img src="../../images/blog/blog-details-02.jpg" alt="image"
                  class="w-full h-[384px] object-center" />
              </div>

              BLOG_CONTENT_TO_BE_REPLACED

              <div class="sm:flex items-center justify-between pt-4">
                <div class="mb-5">
                  <h5 class="font-medium text-body-color text-sm mb-3">Popular Tags :</h5>
                  <div class="flex items-center">
                    TAGS_TO_BE_REPLACED
                  </div>
                </div>
                <!-- <div class="mb-5"> -->
                  <!-- <h5 class="font-medium text-body-color text-sm sm:text-right mb-3">Share this post :</h5> -->
                  <!-- <div class="flex items-center sm:justify-end"> -->
                    <!-- <a href="javascript:void(0)" -->
                      <!-- class="inline-flex items-center justify-center w-9 h-9 sm:ml-3 rounded-md bg-primary bg-opacity-10 text-body-color hover:bg-opacity-100 hover:text-white"> -->
                      <!-- <svg width="16" height="16" viewBox="0 0 16 16" class="fill-current"> -->
                        <!-- <path -->
                          <!-- d="M14.3442 0H1.12455C0.499798 0 0 0.497491 0 1.11936V14.3029C0 14.8999 0.499798 15.4222 1.12455 15.4222H14.2942C14.919 15.4222 15.4188 14.9247 15.4188 14.3029V1.09448C15.4688 0.497491 14.969 0 14.3442 0ZM4.57316 13.1089H2.29907V5.7709H4.57316V13.1089ZM3.42362 4.75104C2.67392 4.75104 2.09915 4.15405 2.09915 3.43269C2.09915 2.71133 2.69891 2.11434 3.42362 2.11434C4.14833 2.11434 4.74809 2.71133 4.74809 3.43269C4.74809 4.15405 4.19831 4.75104 3.42362 4.75104ZM13.1947 13.1089H10.9206V9.55183C10.9206 8.7061 10.8956 7.58674 9.72108 7.58674C8.52156 7.58674 8.34663 8.53198 8.34663 9.47721V13.1089H6.07255V5.7709H8.29665V6.79076H8.32164C8.64651 6.19377 9.37122 5.59678 10.4958 5.59678C12.8198 5.59678 13.2447 7.08925 13.2447 9.12897V13.1089H13.1947Z" /> -->
                      <!-- </svg> -->
                    <!-- </a> -->
                    <!-- <a href="javascript:void(0)" -->
                      <!-- class="inline-flex items-center justify-center w-9 h-9 ml-3 rounded-md bg-primary bg-opacity-10 text-body-color hover:bg-opacity-100 hover:text-white"> -->
                      <!-- <svg width="18" height="14" viewBox="0 0 18 14" class="fill-current"> -->
                        <!-- <path -->
                          <!-- d="M15.5524 2.26027L16.625 1.0274C16.9355 0.693493 17.0202 0.436644 17.0484 0.308219C16.2016 0.770548 15.4113 0.924658 14.9032 0.924658H14.7056L14.5927 0.821918C13.9153 0.282534 13.0685 0 12.1653 0C10.1895 0 8.6371 1.48973 8.6371 3.21062C8.6371 3.31336 8.6371 3.46747 8.66532 3.57021L8.75 4.0839L8.15726 4.05822C4.54435 3.95548 1.58065 1.13014 1.10081 0.642123C0.310484 1.92637 0.762097 3.15925 1.24194 3.92979L2.20161 5.36815L0.677419 4.5976C0.705645 5.67637 1.15726 6.52397 2.03226 7.14041L2.79435 7.65411L2.03226 7.93665C2.5121 9.24658 3.58468 9.78596 4.375 9.99144L5.41935 10.2483L4.43145 10.8647C2.85081 11.8921 0.875 11.8151 0 11.738C1.77823 12.8682 3.89516 13.125 5.3629 13.125C6.46371 13.125 7.28226 13.0223 7.47984 12.9452C15.3831 11.25 15.75 4.82877 15.75 3.54452V3.36473L15.9194 3.26199C16.879 2.44007 17.2742 2.00342 17.5 1.74658C17.4153 1.77226 17.3024 1.82363 17.1895 1.84932L15.5524 2.26027Z" /> -->
                      <!-- </svg> -->
                    <!-- </a> -->
                    <!-- <a href="javascript:void(0)" -->
                      <!-- class="inline-flex items-center justify-center w-9 h-9 ml-3 rounded-md bg-primary bg-opacity-10 text-body-color hover:bg-opacity-100 hover:text-white"> -->
                      <!-- <svg width="9" height="18" viewBox="0 0 9 18" class="fill-current"> -->
                        <!-- <path -->
                          <!-- d="M8.13643 7H6.78036H6.29605V6.43548V4.68548V4.12097H6.78036H7.79741C8.06378 4.12097 8.28172 3.89516 8.28172 3.55645V0.564516C8.28172 0.254032 8.088 0 7.79741 0H6.02968C4.11665 0 2.78479 1.58064 2.78479 3.92339V6.37903V6.94355H2.30048H0.65382C0.314802 6.94355 0 7.25403 0 7.70564V9.7379C0 10.1331 0.266371 10.5 0.65382 10.5H2.25205H2.73636V11.0645V16.7379C2.73636 17.1331 3.00273 17.5 3.39018 17.5H5.66644C5.81174 17.5 5.93281 17.4153 6.02968 17.3024C6.12654 17.1895 6.19919 16.9919 6.19919 16.8226V11.0927V10.5282H6.70771H7.79741C8.11222 10.5282 8.35437 10.3024 8.4028 9.96371V9.93548V9.90726L8.74182 7.95968C8.76604 7.7621 8.74182 7.53629 8.59653 7.31048C8.54809 7.16935 8.33016 7.02823 8.13643 7Z" /> -->
                      <!-- </svg> -->
                    <!-- </a> -->
                  <!-- </div> -->
                <!-- </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- ====== Blog Section End -->
`;

var origSrcTemplate = `
                  <p class="flex items-center text-base text-body-color font-medium mr-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link-45deg"
                      viewBox="0 0 16 16">
                      <path
                        d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                      <path
                        d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
                    </svg>&nbsp;&nbsp;
                    <span class="text-primary dark:text-white underline break-words"><a href="SRC_TO_BE_REPLACED">SRC_TO_BE_REPLACED</a></span>
                  </p>
`

var footerTemplate = `
  <!-- ====== Footer Section Start -->
  <footer class="relative z-10 bg-primary bg-opacity-5 pt-[100px] wow fadeInUp" data-wow-delay=".1s">
    <div class="container">
      <div class="flex flex-wrap mx-[-16px]">
        <div class="w-full md:w-1/2 lg:w-4/12 xl:w-5/12 px-4">
          <div class="mb-16 max-w-[360px]">
            <a href="/index.html" class="inline-block mb-8">
              <img src="../../images/logo/M53-logo-transparent.png" alt="logo" class="w-40 hidden dark:block" />
            </a>
            <p class="text-body-color text-base font-medium leading-relaxed mb-9">Yada Yada :3</p>
            <div class="flex items-center">
              <!-- <a href="javascript:void(0)" aria-label="social-link" class="text-[#CED3F6] hover:text-primary mr-6">
                  <svg width="9" height="18" viewBox="0 0 9 18" class="fill-current">
                    <path
                      d="M8.13643 7H6.78036H6.29605V6.43548V4.68548V4.12097H6.78036H7.79741C8.06378 4.12097 8.28172 3.89516 8.28172 3.55645V0.564516C8.28172 0.254032 8.088 0 7.79741 0H6.02968C4.11665 0 2.78479 1.58064 2.78479 3.92339V6.37903V6.94355H2.30048H0.65382C0.314802 6.94355 0 7.25403 0 7.70564V9.7379C0 10.1331 0.266371 10.5 0.65382 10.5H2.25205H2.73636V11.0645V16.7379C2.73636 17.1331 3.00273 17.5 3.39018 17.5H5.66644C5.81174 17.5 5.93281 17.4153 6.02968 17.3024C6.12654 17.1895 6.19919 16.9919 6.19919 16.8226V11.0927V10.5282H6.70771H7.79741C8.11222 10.5282 8.35437 10.3024 8.4028 9.96371V9.93548V9.90726L8.74182 7.95968C8.76604 7.7621 8.74182 7.53629 8.59653 7.31048C8.54809 7.16935 8.33016 7.02823 8.13643 7Z" />
                  </svg>
                </a> -->
              <a href="https://twitter.com/M53CTF" aria-label="social-link"
                class="text-[#CED3F6] hover:text-primary mr-6">
                <svg width="19" height="14" viewBox="0 0 19 14" class="fill-current">
                  <path
                    d="M16.3024 2.26027L17.375 1.0274C17.6855 0.693493 17.7702 0.436644 17.7984 0.308219C16.9516 0.770548 16.1613 0.924658 15.6532 0.924658H15.4556L15.3427 0.821918C14.6653 0.282534 13.8185 0 12.9153 0C10.9395 0 9.3871 1.48973 9.3871 3.21062C9.3871 3.31336 9.3871 3.46747 9.41532 3.57021L9.5 4.0839L8.90726 4.05822C5.29435 3.95548 2.33065 1.13014 1.85081 0.642123C1.06048 1.92637 1.5121 3.15925 1.99194 3.92979L2.95161 5.36815L1.42742 4.5976C1.45565 5.67637 1.90726 6.52397 2.78226 7.14041L3.54435 7.65411L2.78226 7.93665C3.2621 9.24658 4.33468 9.78596 5.125 9.99144L6.16935 10.2483L5.18145 10.8647C3.60081 11.8921 1.625 11.8151 0.75 11.738C2.52823 12.8682 4.64516 13.125 6.1129 13.125C7.21371 13.125 8.03226 13.0223 8.22984 12.9452C16.1331 11.25 16.5 4.82877 16.5 3.54452V3.36473L16.6694 3.26199C17.629 2.44007 18.0242 2.00342 18.25 1.74658C18.1653 1.77226 18.0524 1.82363 17.9395 1.84932L16.3024 2.26027Z" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@M53CTF" aria-label="social-link"
                class="text-[#CED3F6] hover:text-primary mr-6">
                <svg width="18" height="14" viewBox="0 0 18 14" class="fill-current">
                  <path
                    d="M17.5058 2.07119C17.3068 1.2488 16.7099 0.609173 15.9423 0.395963C14.5778 7.26191e-08 9.0627 0 9.0627 0C9.0627 0 3.54766 7.26191e-08 2.18311 0.395963C1.41555 0.609173 0.818561 1.2488 0.619565 2.07119C0.25 3.56366 0.25 6.60953 0.25 6.60953C0.25 6.60953 0.25 9.68585 0.619565 11.1479C0.818561 11.9703 1.41555 12.6099 2.18311 12.8231C3.54766 13.2191 9.0627 13.2191 9.0627 13.2191C9.0627 13.2191 14.5778 13.2191 15.9423 12.8231C16.7099 12.6099 17.3068 11.9703 17.5058 11.1479C17.8754 9.68585 17.8754 6.60953 17.8754 6.60953C17.8754 6.60953 17.8754 3.56366 17.5058 2.07119ZM7.30016 9.44218V3.77687L11.8771 6.60953L7.30016 9.44218Z" />
                </svg>
              </a>
              <!-- <a href="javascript:void(0)" aria-label="social-link" class="text-[#CED3F6] hover:text-primary mr-6">
                  <svg width="17" height="16" viewBox="0 0 17 16" class="fill-current">
                    <path
                      d="M15.2196 0H1.99991C1.37516 0 0.875366 0.497491 0.875366 1.11936V14.3029C0.875366 14.8999 1.37516 15.4222 1.99991 15.4222H15.1696C15.7943 15.4222 16.2941 14.9247 16.2941 14.3029V1.09448C16.3441 0.497491 15.8443 0 15.2196 0ZM5.44852 13.1089H3.17444V5.7709H5.44852V13.1089ZM4.29899 4.75104C3.54929 4.75104 2.97452 4.15405 2.97452 3.43269C2.97452 2.71133 3.57428 2.11434 4.29899 2.11434C5.02369 2.11434 5.62345 2.71133 5.62345 3.43269C5.62345 4.15405 5.07367 4.75104 4.29899 4.75104ZM14.07 13.1089H11.796V9.55183C11.796 8.7061 11.771 7.58674 10.5964 7.58674C9.39693 7.58674 9.222 8.53198 9.222 9.47721V13.1089H6.94792V5.7709H9.17202V6.79076H9.19701C9.52188 6.19377 10.2466 5.59678 11.3711 5.59678C13.6952 5.59678 14.12 7.08925 14.12 9.12897V13.1089H14.07Z" />
                  </svg>
                </a> -->
            </div>
          </div>
        </div>

        <div class="w-full sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12 px-4">
          <div class="mb-16">
            <h2 class="font-bold text-black dark:text-white text-xl mb-10">Useful Links</h2>
            <ul>
              <li>
                <a href="../../blog/blog-grids.html"
                  class="text-base font-medium inline-block text-body-color mb-4 hover:text-primary"> Blog </a>
              </li>
              <li>
                <a href="/#merch" class="text-base font-medium inline-block text-body-color mb-4 hover:text-primary">
                  Merch </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="w-full md:w-1/2 lg:w-4/12 xl:w-3/12 px-4">
          <div class="mb-16">
            <h2 class="font-bold text-black dark:text-white text-xl mb-10">Support & Help</h2>
            <ul>
              <li>
                <a href="/#contact" class="text-base font-medium inline-block text-body-color mb-4 hover:text-primary">
                  Contact </a>
              </li>
              <li>
                <a href="/#about" class="text-base font-medium inline-block text-body-color mb-4 hover:text-primary">
                  About </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="py-8 bg-primary bg-opacity-10">
      <div class="container">
        <p class="text-body-color dark:text-white text-base text-center">&copy; Crafted by M53</p>
      </div>
    </div>
    <div class="absolute right-0 top-14 z-[-1]">
      <svg width="55" height="99" viewBox="0 0 55 99" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle opacity="0.8" cx="49.5" cy="49.5" r="49.5" fill="#959CB1" />
        <mask id="mask0_94:899" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="99" height="99">
          <circle opacity="0.8" cx="49.5" cy="49.5" r="49.5" fill="#4A6CF7" />
        </mask>
        <g mask="url(#mask0_94:899)">
          <circle opacity="0.8" cx="49.5" cy="49.5" r="49.5" fill="url(#paint0_radial_94:899)" />
          <g opacity="0.8" filter="url(#filter0_f_94:899)">
            <circle cx="53.8676" cy="26.2061" r="20.3824" fill="white" />
          </g>
        </g>
        <defs>
          <filter id="filter0_f_94:899" x="12.4852" y="-15.1763" width="82.7646" height="82.7646"
            filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="10.5" result="effect1_foregroundBlur_94:899" />
          </filter>
          <radialGradient id="paint0_radial_94:899" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
            gradientTransform="translate(49.5 49.5) rotate(90) scale(53.1397)">
            <stop stop-opacity="0.47" />
            <stop offset="1" stop-opacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
    <div class="absolute left-0 bottom-24 z-[-1]">
      <svg width="79" height="94" viewBox="0 0 79 94" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect opacity="0.3" x="-41" y="26.9426" width="66.6675" height="66.6675" transform="rotate(-22.9007 -41 26.9426)"
          fill="url(#paint0_linear_94:889)" />
        <rect x="-41" y="26.9426" width="66.6675" height="66.6675" transform="rotate(-22.9007 -41 26.9426)"
          stroke="url(#paint1_linear_94:889)" stroke-width="0.7" />
        <path opacity="0.3" d="M50.5215 7.42229L20.325 1.14771L46.2077 62.3249L77.1885 68.2073L50.5215 7.42229Z"
          fill="url(#paint2_linear_94:889)" />
        <path d="M50.5215 7.42229L20.325 1.14771L46.2077 62.3249L76.7963 68.2073L50.5215 7.42229Z"
          stroke="url(#paint3_linear_94:889)" stroke-width="0.7" />
        <path opacity="0.3" d="M17.9721 93.3057L-14.9695 88.2076L46.2077 62.325L77.1885 68.2074L17.9721 93.3057Z"
          fill="url(#paint4_linear_94:889)" />
        <path d="M17.972 93.3057L-14.1852 88.2076L46.2077 62.325L77.1884 68.2074L17.972 93.3057Z"
          stroke="url(#paint5_linear_94:889)" stroke-width="0.7" />
        <defs>
          <linearGradient id="paint0_linear_94:889" x1="-41" y1="21.8445" x2="36.9671" y2="59.8878"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#4A6CF7" stop-opacity="0.62" />
            <stop offset="1" stop-color="#4A6CF7" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="paint1_linear_94:889" x1="25.6675" y1="95.9631" x2="-42.9608" y2="20.668"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#4A6CF7" stop-opacity="0" />
            <stop offset="1" stop-color="#4A6CF7" stop-opacity="0.51" />
          </linearGradient>
          <linearGradient id="paint2_linear_94:889" x1="20.325" y1="-3.98039" x2="90.6248" y2="25.1062"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#4A6CF7" stop-opacity="0.62" />
            <stop offset="1" stop-color="#4A6CF7" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="paint3_linear_94:889" x1="18.3642" y1="-1.59742" x2="113.9" y2="80.6826"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#4A6CF7" stop-opacity="0" />
            <stop offset="1" stop-color="#4A6CF7" stop-opacity="0.51" />
          </linearGradient>
          <linearGradient id="paint4_linear_94:889" x1="61.1098" y1="62.3249" x2="-8.82468" y2="58.2156"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#4A6CF7" stop-opacity="0.62" />
            <stop offset="1" stop-color="#4A6CF7" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="paint5_linear_94:889" x1="65.4236" y1="65.0701" x2="24.0178" y2="41.6598"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#4A6CF7" stop-opacity="0" />
            <stop offset="1" stop-color="#4A6CF7" stop-opacity="0.51" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </footer>
  <!-- ====== Footer Section End -->

  <!-- ====== Back To Top Start -->
  <a href="javascript:void(0)"
    class="hidden items-center justify-center bg-primary text-white w-10 h-10 rounded-md fixed bottom-8 right-8 left-auto z-[999] hover:shadow-signUp hover:bg-opacity-80 transition duration-300 ease-in-out back-to-top shadow-md">
    <span class="w-3 h-3 border-t border-l border-white rotate-45 mt-[6px]"></span>
  </a>
  <!-- ====== Back To Top End -->

</body>

</html>
`;

// Override function
const renderer = {
  heading(...args) {
    const html = marked.Renderer.prototype.heading.call(this, ...args);
    return html.replace(/^<(h\d)/, '<$1 class="font-bold text-black dark:text-white font-xl sm:text-2xl lg:text-xl xl:text-2xl leading-tight sm:leading-tight lg:leading-tight xl:leading-tight mb-10"');
  },
  list(...args) {
    const html = marked.Renderer.prototype.list.call(this, ...args);
    return html.replace(/^<([uo]l)/, '<$1 class="list-disc list-inside text-body-color mb-10"');
  },
  listitem(...args) {
    const html = marked.Renderer.prototype.listitem.call(this, ...args);
    return html.replace(/^<li/, '<li class="font-medium text-body-color text-base sm:text-lg lg:text-base xl:text-lg mb-2"');
  },
  paragraph(...args) {
    const html = marked.Renderer.prototype.paragraph.call(this, ...args);
    return html.replace(/^<p/, '<p class="font-medium text-body-color text-base sm:text-lg lg:text-base xl:text-lg sm:leading-relaxed lg:leading-relaxed xl:leading-relaxed leading-relaxed mb-8"');
  },
  strong(strong) {
    return `<strong class="text-primary dark:text-white">${strong.text}</strong>`;
  },
  link(link) {
    return `
          <a href="${link.href}"><span class="text-primary dark:text-white underline">${link.text}</span>
          </a>`;
  },
  blockquote(quote) {
    return `
          <div
              class="rounded-md overflow-hidden p-8 md:p-9 lg:p-8 xl:p-9 bg-primary bg-opacity-10 relative z-10 mb-10">
              <p class="text-center text-base text-body-color italic font-medium">
                  ${quote}
              </p>
              <span class="absolute left-0 top-0 z-[-1]">
                <svg width="132" height="109" viewBox="0 0 132 109" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.5"
                    d="M33.0354 90.11C19.9851 102.723 -3.75916 101.834 -14 99.8125V-15H132C131.456 -12.4396 127.759 -2.95278 117.318 14.5117C104.268 36.3422 78.7114 31.8952 63.2141 41.1934C47.7169 50.4916 49.3482 74.3435 33.0354 90.11Z"
                    fill="url(#paint0_linear_111:606)" />
                  <path opacity="0.5"
                    d="M33.3654 85.0768C24.1476 98.7862 1.19876 106.079 -9.12343 108.011L-38.876 22.9988L100.816 -25.8905C100.959 -23.8126 99.8798 -15.5499 94.4164 0.87754C87.5871 21.4119 61.9822 26.677 49.5641 38.7512C37.146 50.8253 44.8877 67.9401 33.3654 85.0768Z"
                    fill="url(#paint1_linear_111:606)" />
                  <defs>
                    <linearGradient id="paint0_linear_111:606" x1="94.7523" y1="82.0246" x2="8.40951" y2="52.0609"
                      gradientUnits="userSpaceOnUse">
                      <stop stop-color="white" stop-opacity="0.06" />
                      <stop offset="1" stop-color="white" stop-opacity="0" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_111:606" x1="90.3206" y1="58.4236" x2="1.16149" y2="50.8365"
                      gradientUnits="userSpaceOnUse">
                      <stop stop-color="white" stop-opacity="0.06" />
                      <stop offset="1" stop-color="white" stop-opacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <span class="absolute right-0 bottom-0 z-[-1]">
                <svg width="53" height="30" viewBox="0 0 53 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle opacity="0.8" cx="37.5" cy="37.5" r="37.5" fill="#4A6CF7" />
                  <mask id="mask0_111:596" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="75"
                    height="75">
                    <circle opacity="0.8" cx="37.5" cy="37.5" r="37.5" fill="#4A6CF7" />
                  </mask>
                  <g mask="url(#mask0_111:596)">
                    <circle opacity="0.8" cx="37.5" cy="37.5" r="37.5" fill="url(#paint0_radial_111:596)" />
                    <g opacity="0.8" filter="url(#filter0_f_111:596)">
                      <circle cx="40.8089" cy="19.853" r="15.4412" fill="white" />
                    </g>
                  </g>
                  <defs>
                    <filter id="filter0_f_111:596" x="4.36768" y="-16.5881" width="72.8823" height="72.8823"
                      filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                      <feGaussianBlur stdDeviation="10.5" result="effect1_foregroundBlur_111:596" />
                    </filter>
                    <radialGradient id="paint0_radial_111:596" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(37.5 37.5) rotate(90) scale(40.2574)">
                      <stop stop-opacity="0.47" />
                      <stop offset="1" stop-opacity="0" />
                    </radialGradient>
                  </defs>
                </svg>
              </span>
            </div>`;
  }
};

// Apply the overriden renderer
marked.use({ renderer, useNewRenderer: true });

// Read the Markdown file
// \blog-posts-md> node blog-post.js example.md
fs.readFile(process.argv[2], 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Parse the content attribute
  const content = fm(data);

  // Replace the details in the templates
  headerTemplate = headerTemplate.replace('TITLE_TO_BE_REPLACED', content.attributes.title);
  blogSectionTemplate = blogSectionTemplate.replace('TITLE_TO_BE_REPLACED', content.attributes.title);
  blogSectionTemplate = blogSectionTemplate.replace('AUTHOR_TO_BE_REPLACED', content.attributes.author);
  blogSectionTemplate = blogSectionTemplate.replace('DATE_TO_BE_REPLACED', content.attributes.date);
  blogSectionTemplate = blogSectionTemplate.replace('CAT_TO_BE_REPLACED', content.attributes.category);

  if (content.attributes.origsrc.trim() != "" && content.attributes.origsrc.trim() != null) {
    origSrcTemplate = origSrcTemplate.replace(/SRC_TO_BE_REPLACED/g, content.attributes.origsrc);
    blogSectionTemplate = blogSectionTemplate.replace('<!-- ORIGINAL_SOURCE -->', origSrcTemplate);
  }
  // Setup tags
  var tags = "";
  var tagsTemplate = `<a class="inline-flex items-center justify-center py-2 px-4 mr-4 rounded-md bg-primary bg-opacity-10 text-body-color hover:bg-opacity-100 hover:text-white">TAG_TO_BE_REPLACED</a>`

  content.attributes.tags.forEach(tag => {
    tags += tagsTemplate.replace("TAG_TO_BE_REPLACED", tag);
  });

  // console.log(blogSectionTemplate);
  blogSectionTemplate = blogSectionTemplate.replace('TAGS_TO_BE_REPLACED', tags);

  // Replace these double casting markdown as it cannot be parse correctly for now
  content.body = content.body.replace(/\*\*.*`.*?`.*\*\*/g, match => match.replace(/\*\*/g, ""));
  content.body = content.body.replace(/\`.*\*\*.*?\*\*.*\`/g, match => match.replace(/\*\*/g, ""));
  content.body = content.body.replace(/\*\*\*\*.*?\*\*\*\*/g, match => match.replace(/\*\*\*\*/g, "**"));

  // Parse the Markdown content
  const body = marked.parse(content.body);

  blogSectionTemplate = blogSectionTemplate.replace('BLOG_CONTENT_TO_BE_REPLACED', body);

  // console.log(blogSectionTemplate);

  const blog_post_html = headerTemplate + bodyNavbarTemplate + blogSectionTemplate + footerTemplate;
  const blog_post_filename = content.attributes.title.replace(/ /g, '-').replace(']', '').replace('[', '').toLowerCase() + '.html';

  // Copy the final HTML to the a file
  fs.writeFileSync('../src/blog/posts/' + blog_post_filename, blog_post_html);
});