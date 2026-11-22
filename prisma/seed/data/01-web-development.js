"use strict";

const CATEGORY = "Web Development";

module.exports = [
    {
        category: CATEGORY,
        title: "How to Choose the Right Frontend Framework in 2026",
        intro:
            "Picking a frontend framework is one of the highest-leverage decisions you'll make on a web project, yet it's often decided by momentum rather than fit. The right choice saves you hours every week for years; the wrong one quietly taxes you with bugs, slow builds, and migration pain. In this guide you'll learn the concrete questions to ask before committing to React, Vue, Svelte, or one of the newer options.",
        sections: [
            { h: "Start With Your Team, Not the Hype", p:
                "The single most important factor is how well the framework matches your team's existing knowledge and hiring pool. A framework you already know is almost always faster to ship than a shinier one you don't. Check how much of your component library, state, and data-fetching logic you'd have to rebuild, because that hidden cost dwarfs any benchmark difference you'll see online." },
            { h: "Match the Framework to the App's Shape", p:
                "Server-rendered, content-heavy marketing sites and dashboards have different needs than a low-latency collaborative canvas or a complex state machine. If interactivity is sparse, a lighter option or even plain Web Components may be enough. If you need fine-grained reactivity and a huge state surface, a framework with a strong reactivity model and a mature ecosystem for state management will pay off over time." },
            { h: "Look at the Ecosystem, Not Just the Core", p:
                "A framework is only as good as the libraries around it. Evaluate the quality of routing, forms, data fetching, testing, and TypeScript support out of the box. Strong, actively maintained first-party or community integrations mean you're not hand-rolling everything. Also weigh the size of the community: more contributors, more answers, and more battle-tested patterns mean fewer dead ends when you hit an edge case." },
        ],
        listTitle: "Quick Decision Heuristics",
        listType: "ul",
        listItems: [
            "If your team already knows React well, staying the course usually beats the switch.",
            "If you want smaller bundles and less boilerplate, evaluate Svelte or Vue.",
            "If you need maximum performance for a data-dense UI, check server-rendering and streaming options.",
            "If you're starting a small project, pick what your team can learn fastest and move on.",
        ],
        faq: [
            { q: "Is React still the default choice?", a:
                "For many teams, yes, because of its ecosystem, job market, and predictability. It's not automatically best, but it's rarely a wrong choice for a general-purpose app." },
            { q: "How long should a framework decision take?", a:
                "For a new project, one to two weeks of a small proof-of-concept is usually plenty. The goal is to surface real integration costs, not to win a benchmark." },
            { q: "Can I switch later if I choose wrong?", a:
                "You can, but migrations get expensive as the codebase grows. That's exactly why it's worth spending a little time on the decision upfront." },
        ],
        outro:
            "There is no universally best frontend framework, only the best fit for your team, your app's shape, and your timeline. Run a quick proof-of-concept, be honest about the hidden migration cost, and choose the option that lets your team ship confidently. When the fundamentals are a good match, the framework stops being the thing you think about and you can focus on the product.",
    },
    {
        category: CATEGORY,
        title: "Understanding React Server Components: A Practical Guide",
        intro:
            "React Server Components (RSC) change where and how your UI runs, and the shift can feel confusing at first. At its core, RSC lets you run parts of your component tree on the server so you can fetch data and render markup without shipping that JavaScript to the browser. Here's a practical, plain-English walkthrough of what that means and when it helps.",
        sections: [
            { h: "The Mental Model: Server vs Client", p:
                "Think of every component as either living on the server, on the client, or both. Server components run only on the server and can read the database or call internal APIs directly, then send the rendered HTML (not the component's JavaScript) to the browser. Client components, the kind you've always written, ship to the browser and handle interactivity. The power of RSC is mixing these: a page can fetch and render its shell on the server while a few interactive islands stay on the client." },
            { h: "What You Can and Can't Do in a Server Component", p:
                "A server component can't use browser-only APIs like window, can't run event handlers, and can't rely on client state hooks. In exchange, it can import anything you need to read data, including files that would never be safe to expose to a browser. When a component needs interactivity, you mark it with the client directive and pass serializable data down from the server component. This boundary is the most common source of confusion, so it's worth internalizing early." },
            { h: "Where RSC Actually Helps Most", p:
                "Content-heavy pages, dashboards that read directly from the database, and any screen where a lot of UI is read-only benefit the most, because you avoid shipping JavaScript the user never interacts with. For a highly interactive, app-like UI, the gains shrink and you may end up with a large client component anyway. The best results come from treating RSC as a way to push data fetching up the tree and keep interactive code small and focused." },
        ],
        quote: "Server components aren't about moving everything to the server. They're about making the server a first-class place to build and fetch your UI.",
        faq: [
            { q: "Do I have to rewrite my whole app to use RSC?", a:
                "No. You can adopt it incrementally, turning read-only parts into server components while keeping interactive pieces as client components." },
            { q: "Does RSC work with any data source?", a:
                "Yes. Since server components run on the server, they can talk to databases, internal services, or local files directly." },
            { q: "Is RSC only for a specific framework?", a:
                "The pattern is most mature in Next.js's App Router, but the underlying idea is independent of any single tool." },
        ],
        outro:
            "React Server Components reward a clear mental model: know which part of your UI needs the browser and which part just needs to render. Start by moving read-only, data-heavy sections to the server, keep interactive code small, and you'll often see smaller bundles and simpler data fetching without a full rewrite. Treat it as a tool for the right jobs, and it quietly improves how your app is built.",
    },
    {
        category: CATEGORY,
        title: "Optimizing Website Performance: Core Web Vitals Explained",
        intro:
            "A fast website keeps users, ranks better in search, and costs less to run, yet performance is often an afterthought until a launch goes sideways. Google's Core Web Vitals give you a small, concrete set of metrics to aim for, and most of the wins are surprisingly straightforward. This guide explains what each metric means and the highest-impact changes you can make without rewriting your stack.",
        sections: [
            { h: "The Three Core Web Vitals That Matter", p:
                "Largest Contentful Paint (LCP) measures how fast the main content becomes visible, and you want it under about 2.5 seconds. Interaction to Next Paint (INP) captures how quickly the page responds to input like taps and clicks. Cumulative Layout Shift (CLS) tracks how much the page jumps around as it loads. Together they cover the three things users notice most: can I see something, does it respond, and is it stable?" },
            { h: "The Wins That Move the Needle Most", p:
                "The biggest improvements usually come from the basics. Serve optimized, correctly-sized images in modern formats, preload the hero image or critical fonts, and reduce JavaScript that blocks the first paint. Avoid loading fonts from a slow third party, and make sure above-the-fold content isn't waiting on a slow API call. Fixing layout shift is mostly about reserving space for images, ads, and embeds so nothing jumps when they appear." },
            { h: "Measuring on Real Devices, Not Just the Lab", p:
                "Lab tools give you a controlled, repeatable number, but real-user data tells you what actual visitors experience on real phones and real networks. Use both: lab for fast iteration, field data to confirm the fix helped people. A page that scores great in the lab but stutters for mobile users on slow connections is still a slow page, so always check the field percentiles, not just the average." },
        ],
        listTitle: "A Fast First-Paint Checklist",
        listType: "ol",
        listItems: [
            "Compress and resize images, and use next-gen formats like WebP or AVIF.",
            "Preload critical assets such as the hero image and primary font.",
            "Trim or lazy-load JavaScript that isn't needed for the first render.",
            "Reserve space for dynamic content to keep layout shift low.",
            "Verify the results with real-user monitoring, not just a single lab run.",
        ],
        faq: [
            { q: "How much does Core Web Vitals actually affect SEO?", a:
                "It's a ranking signal, so it helps, but it's one of many. The bigger win is that a fast page retains more visitors, which indirectly supports everything else." },
            { q: "Do I need a premium hosting plan to be fast?", a:
                "No. Most performance problems are in the code and assets, not the server. You can make a slow site much faster without upgrading infrastructure." },
            { q: "Is a perfect score worth chasing?", a:
                "Usually not. Aim for the good thresholds and focus on the changes that help the most users, rather than squeezing out the last fractional point." },
        ],
        outro:
            "Performance optimization is mostly a few high-leverage habits: make the first thing visible fast, keep the page responsive, and stop it from jumping around. Measure on real devices, fix the basics first, and you'll get most of the benefit quickly. Treat speed as a feature you design for from day one, and it becomes one of the quietest differentiators you can offer.",
    },
    {
        category: CATEGORY,
        title: "REST vs GraphQL: Which API Style Should You Use?",
        intro:
            "REST and GraphQL are the two most common ways to expose an API, and choosing between them shapes everything from your endpoints to your caching. REST is familiar and simple; GraphQL is flexible and powerful. The honest answer is that both are great, and the right one depends on your clients and your data. Here's how to think about the tradeoffs so you can decide with confidence.",
        sections: [
            { h: "How Each One Actually Works", p:
                "In REST, each resource gets a URL and you use standard HTTP verbs to read and write it. A client makes one or more requests per endpoint to assemble a screen. In GraphQL, the client sends a single query describing exactly the fields it needs, and the server returns precisely that shape. This means a GraphQL client never gets more data than it asked for and usually makes one request per screen, which can cut over-fetching and the number of round trips." },
            { h: "Where REST Is the Better Fit", p:
                "REST is the pragmatic default when your API has a handful of clients, a straightforward resource model, and you value simplicity, browser caching, and a huge ecosystem of tooling. Because it maps to standard HTTP semantics, many REST responses are naturally cacheable, which is a real win for read-heavy, public content. If your team is new to APIs or your data model is simple, REST lets you ship fast without extra machinery." },
            { h: "Where GraphQL Earns Its Keep", p:
                "GraphQL shines when you have many different clients, mobile apps with limited bandwidth, or a graph-like data model where one screen pulls from several sources. Because clients specify exactly what they need, you avoid both over-fetching and under-fetching, and adding fields rarely breaks existing clients. The tradeoff is that you take on more complexity: query parsing, caching is trickier, and you need to guard against expensive nested queries that can hammer your backends." },
        ],
        faq: [
            { q: "Is GraphQL always faster?", a:
                "Not always. It removes over-fetching and can reduce round trips, but a poorly designed schema or a deep query can be just as slow. Performance depends on your schema and how you control query cost." },
            { q: "Can I use both?", a:
                "Yes. Some teams expose a simple REST API for public consumers and a GraphQL layer for internal, data-heavy clients. Mixing them is a legitimate pattern." },
            { q: "Which is easier for a small team to maintain?", a:
                "For a small, simple API, REST is usually easier to reason about and operate. GraphQL's complexity pays off as the number and diversity of your clients grows." },
        ],
        outro:
            "Neither style is universally better; they optimize for different situations. Default to REST when your needs are simple and your clients are few, and reach for GraphQL when many diverse clients need flexible, tightly-scoped data. Whichever you pick, invest in a clear data model and sane caching, because those fundamentals matter more than the style itself.",
    },
    {
        category: CATEGORY,
        title: "CSS Grid vs Flexbox: When to Use Each",
        intro:
            "CSS Grid and Flexbox both solve layout, and it's easy to overthink which one to reach for. The short version: Flexbox is great for a single row or column of items, while Grid is built for two-dimensional layouts with rows and columns at once. Understanding when each shines stops the endless copy-paste of layout hacks. Here's a clear breakdown with practical rules of thumb.",
        sections: [
            { h: "The Core Difference: One Axis vs Two", p:
                "Flexbox lays items out along a single axis, a row or a column, and excels at distributing space and aligning a handful of elements. Grid gives you a two-dimensional canvas where you place things in both rows and columns simultaneously, which makes it ideal for page-level structure and complex arrangements. If your problem is fundamentally about one line of things, start with Flexbox. If it's about a whole grid of things, start with Grid." },
            { h: "Great Jobs for Flexbox", p:
                "Flexbox is perfect for navigation bars, toolbars, centering a block, and any layout where the content should size naturally and space gets distributed around it. It's content-aware: the items determine their size and the container arranges them. Use it when you want a responsive row that wraps, like a set of buttons or a list of chips, without worrying about explicit column definitions." },
            { h: "Great Jobs for Grid", p:
                "Grid is the tool for page scaffolding, card layouts, image galleries, and anything where you need both rows and columns to line up. It's layout-driven: you define the tracks and the items fill them, which makes it easy to build a layout that stays aligned no matter what's inside the cells. A full-page header, sidebar, and content arrangement is far cleaner in Grid than in nested Flexbox." },
        ],
        listTitle: "Rules of Thumb",
        listType: "ul",
        listItems: [
            "One row or column of items? Use Flexbox.",
            "Rows and columns that must align? Use Grid.",
            "Content should dictate size and space? Flexbox.",
            "The layout should dictate the structure? Grid.",
            "You can combine them: Grid for the page, Flexbox inside cells.",
        ],
        faq: [
            { q: "Can I use Grid and Flexbox together?", a:
                "Absolutely, and it's common. Use Grid for the overall page or section structure and Flexbox for the smaller, one-dimensional arrangements inside each cell." },
            { q: "Is one of them more compatible?", a:
                "Both are well supported in every modern browser. You don't need to choose for compatibility reasons." },
            { q: "Does Grid replace Flexbox?", a:
                "No. Grid is great for two dimensions but Flexbox is still the cleaner tool for simple, content-sized one-line layouts." },
        ],
        outro:
            "Most layout confusion comes from forcing one tool to do a job the other is built for. Default to Flexbox for a single line of content and Grid for anything with both rows and columns, and don't hesitate to nest them. Once the mental model clicks, layout decisions stop being a puzzle and become a quick, confident choice.",
    },
    {
        category: CATEGORY,
        title: "A Beginner's Guide to TypeScript",
        intro:
            "TypeScript is JavaScript with a type system that catches a huge number of bugs before your code ever runs. For a lot of developers it feels like an extra step, but once it clicks it becomes the thing that keeps you productive instead of the thing that slows you down. This guide gets you past the setup hump and into the habits that make TypeScript genuinely useful.",
        sections: [
            { h: "What TypeScript Actually Adds", p:
                "TypeScript lets you annotate values with types and the compiler checks your code for mismatches before you run it. That means a function that expects a string can't silently be passed a number, and a property that might be undefined is flagged the moment you try to use it. The compiler also drives your editor's autocomplete, so you get far more precise suggestions and can rename or refactor with confidence because the tooling knows your types." },
            { h: "Start Simple, Don't Type Everything", p:
                "You don't need to type every variable. Start by typing your function inputs and outputs and the shape of your important data, like API responses and domain models. Let TypeScript infer the rest. A common mistake for beginners is fighting the system by slapping any everywhere, which defeats the purpose. Instead, when you're unsure, narrow the type gradually until the compiler is happy, and you'll find the right shape emerges on its own." },
            { h: "The Patterns That Pay Off Fastest", p:
                "Three habits get you most of the benefit quickly. First, define interfaces or type aliases for your core data structures so they're documented and reused. Second, use unions to represent a value that can be one of several shapes, like a status that's loading, success, or error. Third, let the compiler's error messages guide you, because they're usually telling you exactly what's wrong and often suggest the fix. Treat TypeScript as a collaborator, not an obstacle." },
        ],
        faq: [
            { q: "Do I need to learn it all before I start using it?", a:
                "No. Start by typing function signatures and your key data shapes, and pick up more advanced features as you hit problems that they solve." },
            { q: "Is it worth it for small projects?", a:
                "Yes. Even small projects benefit from the safety net and the better autocomplete, and the setup cost is a few minutes." },
            { q: "How strict should my compiler be?", a:
                "Aim for a reasonably strict configuration. Turning on strict mode catches far more real bugs, and you can loosen specific rules later if a particular check is too noisy for your codebase." },
        ],
        outro:
            "TypeScript isn't a rewrite of your brain, it's a safety net that gets stronger the more you lean on it. Begin by typing your boundaries, your functions and your data, let inference handle the noise, and let the compiler's messages teach you the shape of your code. Within a project or two it stops feeling like extra work and starts feeling like the way you always wanted JavaScript to be.",
    },
    {
        category: CATEGORY,
        title: "How to Structure a Scalable Next.js Project",
        intro:
            "A Next.js project that's organized well when it has ten pages can fall apart the moment you hit a hundred. The difference between the two is almost always structure, not code. Getting the folder layout, routing, and data flow right early means new features are quick to add and easy to find. Here's a structure that has held up as apps grew from prototypes to production.",
        sections: [
            { h: "Organize by Feature, Not by Type", p:
                "Group related files together by feature instead of dumping every component in one folder, every hook in another, and every type in a third. A feature folder holds its components, its hooks, its types, and its data logic in one place, so when you change a feature you change it in one spot. This keeps the project navigable as it grows, because the file path now tells you what a file is about and where it belongs." },
            { h: "Keep Routes as the Entry, Logic Where It Belongs", p:
                "In the App Router, your route files should stay thin: they assemble the page and delegate to your feature components and data functions. Put server-side data fetching in server components or server actions, and put client interactivity in the smallest client component that needs it. Resisting the urge to write all your logic directly in the route file is the single best thing you can do for long-term readability, because the route becomes a clear map of the page rather than a grab-bag." },
            { h: "Share a Few Thin, Well-Defined Boundaries", p:
                "You still want a place for truly shared stuff: UI primitives, a few global utilities, and API client wrappers. Keep these layers small and stable, and make sure features depend on them rather than on each other, so one feature's refactor doesn't ripple across the app. A small number of well-defined shared modules is far more maintainable than a dozen cross-cutting feature dependencies." },
        ],
        listTitle: "A Folder Layout That Scales",
        listType: "ul",
        listItems: [
            "app/ for routes and page assembly, kept thin.",
            "features/ with one folder per feature, containing its own components, hooks, and data.",
            "components/ui for small shared primitives.",
            "lib/ for a few stable utilities and API clients.",
            "types/ or per-feature types for shared domain shapes.",
        ],
        faq: [
            { q: "Do I need this structure for a small app?", a:
                "Not the whole thing. Even a small app benefits from separating routes from logic and grouping related files. The full feature-based structure pays off as the project and team grow." },
            { q: "How do I avoid features depending on each other?", a:
                "Make features depend only on shared, stable modules, never on another feature's internals. If two features need to share logic, pull it into a shared module instead." },
            { q: "Where should data fetching live?", a:
                "Server-side fetching belongs in server components or server actions. Client components fetch only the small, interactive pieces they own." },
        ],
        outro:
            "Scalability is less about a specific layout and more about a few consistent rules: organize by feature, keep routes thin, and share through a small set of stable boundaries. Follow those and a Next.js app stays easy to navigate and change whether it has ten pages or a hundred. Spend an hour on structure early and it saves you from a painful re-organization later.",
    },
    {
        category: CATEGORY,
        title: "Debouncing and Throttling: Taming Event Handlers",
        intro:
            "Some events fire far more often than you can usefully handle, think of a search box that runs a request on every keystroke or a scroll handler that fires dozens of times a second. Debouncing and throttling are two simple techniques that let you control how often your handler actually runs, cutting wasted work and keeping your UI smooth. Here's when to use each and how they actually work.",
        sections: [
            { h: "What Each One Does", p:
                "Debouncing waits until the user stops an action for a set period, then runs once. It's perfect for events where you only care about the final state, like a search input, where you want to search after the user pauses typing, not on every character. Throttling, by contrast, guarantees the handler runs at most once per time window, no matter how many times the event fires. It's ideal for continuous events like scroll or resize, where you still want periodic updates while the action is in progress." },
            { h: "Which One to Reach For", p:
                "Ask whether you care about the end state or the ongoing stream. If you only need the last value, debounce: the search box, a form field that validates on blur-ish input, or saving a document after the user stops typing. If you need steady, capped updates, throttle: adjusting a layout on scroll, sending a location update, or logging interaction frequency. Using the wrong one is a common bug, where a debounced scroll feels laggy or a throttled search still fires too often." },
            { h: "Keeping It Clean and Correct", p:
                "A few details matter for correct behavior. Make sure to clean up the timer when a component unmounts so you don't fire a handler after it's gone, and be careful about which value you capture in the closure so you act on the latest input. Modern runtimes and frameworks often give you hooks or utilities that handle the lifecycle for you, which removes a whole class of subtle bugs. The goal is a handler that's responsive enough to feel live but calm enough to not waste cycles." },
        ],
        quote: "The difference in one line: debounce runs once after the user stops; throttle runs at a steady, capped rate while they continue.",
        faq: [
            { q: "Can I use both on the same event?", a:
                "You can, but pick the one that matches your intent. Combining them usually signals you haven't decided whether you want end-state or steady updates." },
            { q: "How long should the delay be?", a:
                "Tune it to the task. Search boxes often use a couple hundred milliseconds, while scroll handlers might throttle to every hundred or two. Start reasonable and adjust by feel." },
            { q: "Do these work with async handlers?", a:
                "Yes, but make sure the async work is also guarded so a slow response doesn't trigger a cascade. Debounce and throttle control when you start, not how long the work takes." },
        ],
        outro:
            "Debouncing and throttling are small ideas with big payoff: they turn a flood of events into a calm, predictable rate of work. Default to debounce when you only need the final value and throttle when you need steady updates, and always clean up timers on unmount. Get that right and your search boxes, scroll effects, and form saves will all feel smoother and cost far less.",
    },
    {
        category: CATEGORY,
        title: "The Complete Guide to HTTP Caching Headers",
        intro:
            "Caching is one of the cheapest, most powerful ways to make your site fast, and it's controlled almost entirely by a handful of HTTP headers. Get them right and your pages load nearly instantly on repeat visits and offload huge amounts of traffic to CDNs. Get them wrong and you ship stale content to users or never refresh at all. This guide walks through the headers that matter and how to set them with confidence.",
        sections: [
            { h: "The Two Kinds of Cache to Think About", p:
                "There's the browser cache, which lives on the user's device and saves their next visit, and the CDN or shared cache, which sits between your server and the world and serves many users. Different headers control each, and the distinction drives a lot of the decisions below. A well-designed caching strategy answers both questions at once: what can a shared cache store, and how long can a browser keep it?" },
            { h: "The Headers That Do the Heavy Lifting", p:
                "Cache-Control is the modern workhorse. Directives like public and private decide whether a shared cache may store the response, no-store disables caching, and max-age sets how long a stored copy stays fresh. ETag and If-None-Match let a browser or CDN ask, is my copy still valid, and receive a cheap 304 Not Modified instead of the full body when it is. Age and Expires appear in responses and mostly help you debug what's actually being served. Understanding these few is enough to cache almost anything correctly." },
            { h: "A Practical Caching Strategy by Asset Type", p:
                "Treat different content differently. Immutable, versioned static assets like JS bundles, images, and fonts that change their URL when they change should be cached aggressively for a very long time. HTML pages that can go stale quickly should be cached briefly or revalidated with an ETag. API responses you can tolerate being stale for a minute can use a short max-age with a stale-while-revalidate so users get an instant cached copy while a fresh one refreshes in the background. This layered approach is what makes a site feel fast without going stale." },
        ],
        listTitle: "Headers Cheat Sheet",
        listType: "ul",
        listItems: [
            "Cache-Control: public, max-age=... for assets and pages a shared cache may store.",
            "Cache-Control: no-store for private or highly volatile responses.",
            "ETag plus If-None-Match for cheap revalidation with 304 responses.",
            "stale-while-revalidate to serve a cached copy instantly and refresh in the background.",
        ],
        faq: [
            { q: "Should I cache HTML pages?", a:
                "Usually for a short time or with revalidation. HTML changes often, so a long cache can serve stale pages. Keep it brief and let the browser revalidate." },
            { q: "What's the deal with versioned assets?", a:
                "If an asset's URL changes when its content changes, you can cache it for years, because a new version always has a new URL. It's the safest form of long-term caching." },
            { q: "How do I know if caching is actually working?", a:
                "Check the response headers and the browser network tab. Look for a 304 status or a cached source, and confirm the Age and ETag headers behave as you expect." },
        ],
        outro:
            "HTTP caching is a small set of levers with an outsized effect on both speed and cost. Cache versioned assets for a long time, keep HTML and volatile APIs short or revalidated, and use ETags for cheap checks. Get those patterns down and your site will load faster for every repeat visitor while your servers quietly do less work.",
    },
];
