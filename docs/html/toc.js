// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="title-page.html">The Ruchy Programming Language</a></li><li class="chapter-item expanded affix "><a href="foreword.html">Foreword</a></li><li class="chapter-item expanded affix "><a href="ch00-00-introduction.html">Introduction</a></li><li class="chapter-item expanded "><a href="ch01-00-getting-started.html"><strong aria-hidden="true">1.</strong> Getting Started</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="ch01-01-installation.html"><strong aria-hidden="true">1.1.</strong> Installation</a></li><li class="chapter-item "><a href="ch01-02-hello-world.html"><strong aria-hidden="true">1.2.</strong> Hello, World!</a></li></ol></li><li class="chapter-item expanded "><a href="ch02-00-variables-types.html"><strong aria-hidden="true">2.</strong> Variables and Types</a></li><li class="chapter-item expanded "><a href="ch03-00-functions.html"><strong aria-hidden="true">3.</strong> Functions</a></li><li class="chapter-item expanded "><a href="ch03-01-testing-functions.html"><strong aria-hidden="true">4.</strong> Testing Functions</a></li><li class="chapter-item expanded "><a href="ch04-00-command-line-tools.html"><strong aria-hidden="true">5.</strong> Command-Line Tools</a></li><li class="chapter-item expanded "><a href="ch05-00-data-processing.html"><strong aria-hidden="true">6.</strong> Data Processing</a></li><li class="chapter-item expanded "><a href="ch06-00-file-operations.html"><strong aria-hidden="true">7.</strong> File Operations</a></li><li class="chapter-item expanded "><a href="ch07-00-building-applications.html"><strong aria-hidden="true">8.</strong> Building Applications</a></li><li class="chapter-item expanded "><a href="ch08-00-systems-programming.html"><strong aria-hidden="true">9.</strong> Systems Programming</a></li><li class="chapter-item expanded "><a href="ch09-00-network-programming.html"><strong aria-hidden="true">10.</strong> Network Programming</a></li><li class="chapter-item expanded "><a href="ch10-00-performance-optimization.html"><strong aria-hidden="true">11.</strong> Performance &amp; Optimization</a></li><li class="chapter-item expanded "><a href="ch11-00-advanced-patterns.html"><strong aria-hidden="true">12.</strong> Advanced Patterns</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
