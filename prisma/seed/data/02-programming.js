"use strict";

const CATEGORY = "Programming";

module.exports = [
    {
        category: CATEGORY,
        title: "Big-O Notation Explained Simply",
        intro:
            "Big-O notation is the language we use to talk about how code scales, and once it clicks it becomes one of the most useful instincts you can have as a developer. It answers a single question: as the input gets bigger, how much slower does this get? You don't need to be a mathematician to use it well. Here's a plain-English version with the few cases you'll actually see every day.",
        sections: [
            { h: "What Big-O Really Measures", p:
                "Big-O describes the upper bound on how the number of operations grows relative to the input size. It deliberately ignores constants and one-time costs, so a loop that runs twice per element is still just linear. The point is the shape of the growth, not the exact count. When someone says this is O(n), they mean the work roughly doubles when the input doubles. When they say O(n squared), they mean the work quadruples when the input doubles, which is a very different story at large n." },
            { h: "The Cases You'll Meet Constantly", p:
                "A handful of complexities cover almost all everyday code. Constant time, O(1), is an operation that takes the same time no matter the input, like reading a map by key. Linear time, O(n), is a single pass over the data, like a loop. Logarithmic time, O(log n), is halving the search space each step, like a binary search. And quadratic time, O(n squared), is a nested loop where each element is compared against every other one. Recognizing these four in your own code is the real skill." },
            { h: "Why It Matters More Than It Looks", p:
                "The reason Big-O is worth learning is that it predicts where your code will break. A linear routine over a million items is fine, but a quadratic one over the same million items is a hundred million operations and likely a several-minute stall. It also gives you a shared vocabulary, so you can reason with a teammate about whether an approach will hold up as the data grows. You're not memorizing notation, you're building intuition for when a design is future-proof and when it's a ticking clock." },
        ],
        quote: "Big-O isn't about how fast your code is today. It's about whether it will still be acceptable when the data is a hundred times bigger.",
        faq: [
            { q: "Do I need to calculate Big-O for every function?", a:
                "No. Focus on the parts that process collections or run in loops. Most other code is constant time and not worth the analysis." },
            { q: "Is a lower Big-O always better?", a:
                "Usually, but not always. A simpler algorithm with slightly worse complexity can be faster for the small inputs you actually handle. Match the tool to the real data size." },
            { q: "How do I spot quadratic code?", a:
                "Look for nested loops where the inner one runs over the whole input for each outer iteration. That's the classic O(n squared) pattern and the most common performance trap." },
        ],
        outro:
            "Big-O is a practical tool, not an academic one. Learn the four core shapes, train yourself to notice which one your loops produce, and use it to predict where code will stall as data grows. It's a small investment that pays off every time you're deciding between two approaches, and it quietly makes you a more careful engineer.",
    },
    {
        category: CATEGORY,
        title: "Recursion: Thinking Recursively",
        intro:
            "Recursion is the idea of a function solving a problem by calling itself on a smaller version of that same problem. It feels like magic or a trap depending on the day, but once you learn to see the two parts, a base case and a smaller sub-problem, it becomes one of the clearest ways to express certain solutions. Here's how to build the mental model and use recursion without it chewing through your stack.",
        sections: [
            { h: "The Two Rules That Make It Work", p:
                "Every correct recursive function has exactly two pieces. The base case is the smallest input you can answer directly, and it's what stops the recursion from continuing forever. The recursive step is where you solve the problem by reducing it to a smaller input and calling the function again. If you can't clearly name both, the function will either run forever or do the wrong thing. A classic example is counting down: the base case is reaching zero, and the step is doing the work for this number then recursing on one less." },
            { h: "Where Recursion Is the Natural Fit", p:
                "Recursion shines for data that is defined in terms of itself. Trees and nested structures are the obvious case, because a tree is literally a node plus smaller trees. Divide-and-conquer problems, like sorting by splitting an array in half and merging the sorted halves, are also naturally recursive. And certain mathematical definitions, like factorials or the Fibonacci sequence, map almost word-for-word onto a recursive function. When the problem is structurally self-similar, recursion tends to be the shortest, clearest solution." },
            { h: "Avoiding the Pitfalls", p:
                "The most common failure is forgetting or mis-stating the base case, which leads to a stack overflow. The next is doing redundant work, where the same sub-problem is solved many times over, like a naive Fibonacci that recomputes the same values again and again. The fix for that is memoization, caching the answer to a sub-problem the first time you compute it. And when the recursion gets very deep, a loop or an explicit stack is often a safer rewrite. Knowing when to reach for recursion and when to back off is part of using it well." },
        ],
        faq: [
            { q: "When should I avoid recursion?", a:
                "When the depth can get very large, like processing a long chain, because each call uses stack space. In those cases an iterative version with a loop or an explicit stack is usually safer." },
            { q: "What is memoization?", a:
                "It's a way to store the result of a sub-problem the first time you compute it so you don't recompute it later. It turns slow, repetitive recursion into something close to linear." },
            { q: "Can any recursive function be written iteratively?", a:
                "In theory, yes, because a loop is just recursion with the state managed by you. In practice some recursive solutions are far clearer that way, so don't force the conversion unless you have a reason to." },
        ],
        outro:
            "Recursion is a way of thinking, not just a syntax trick. Find the base case, define how the problem shrinks, and make sure you're not redoing the same work. Use it where the data or the problem is genuinely self-similar, and step back to a loop when the depth gets dangerous. Get comfortable with those moves and recursion stops being scary and starts being one of your clearest tools.",
    },
    {
        category: CATEGORY,
        title: "Object-Oriented vs Functional Programming",
        intro:
            "Object-oriented and functional programming are two of the most common ways to organize code, and the debate about them has gone on for decades. In practice, almost every modern language lets you use a mix, so the real question isn't which one is right but when each style makes your code clearer. Understanding the core ideas of both helps you pick the right shape for each part of a program instead of dogmatically defending one camp.",
        sections: [
            { h: "The Core Idea Behind Each", p:
                "Object-oriented programming bundles data with the operations on that data, grouping related state and behavior into objects. It's a natural fit for modeling things that have a life and a state, like a bank account or a document. Functional programming centers on pure functions that transform inputs into outputs without changing shared state, treating data as something that flows through a pipeline of transformations. It's a great fit for logic that's mostly about computing a result from an input, where side effects are the exception rather than the rule." },
            { h: "Strengths and the Problems Each Solves", p:
                "Object-oriented code is strong at keeping related state and behavior together, which makes large, stateful systems easier to reason about and extend, since a new kind of thing is often just a new class. Functional code is strong at predictability and testing, because a pure function with the same input always gives the same output and doesn't depend on hidden global state. The tradeoffs are real: overly object-oriented design can produce rigid hierarchies that are hard to change, and purely functional code can be awkward when a feature is genuinely about managing a lot of changing state." },
            { h: "How Modern Code Blends the Two", p:
                "Most real programs use both, and the best structure often separates them deliberately. You might model the domain with objects that own state, and express the transformations and business rules as small pure functions that operate on that state. Functional-style tools like mapping, filtering, and reducing are now idiomatic in object-oriented languages, and many object-oriented languages have added functional features to make code more expressive. The skill is to use the style that fits each part, not to paint the whole program with one." },
        ],
        quote: "The question is never 'OO or functional?' It's 'which part of this program is about owning state, and which is about transforming it?'",
        faq: [
            { q: "Is one of them objectively better?", a:
                "No. They solve different problems. Object-oriented thinking models stateful things well, and functional thinking makes logic easier to test and reason about. Strong code usually uses both." },
            { q: "Do I need to pick a side to write good code?", a:
                "No. You just need to recognize the two styles and choose per situation. Most developers write a pragmatic blend without labeling it." },
            { q: "Which should I learn more of if I know one?", a:
                "If you're strong in object-oriented code, learning functional ideas like pure functions and immutability makes your code more testable. If you're strong in functional style, learning how to model stateful domains will round you out." },
        ],
        outro:
            "Rather than defending one paradigm, treat object-oriented and functional programming as two lenses for different parts of the same problem. Use objects where you need to own and model state, use functions where you're transforming data, and let the boundaries between them be explicit. That pragmatic mix is how most well-built modern systems actually get written, and it will serve you far better than any pure allegiance.",
    },
    {
        category: CATEGORY,
        title: "How to Write Clean, Readable Code",
        intro:
            "Clean code isn't about style nits; it's about writing so that the next person, including you a month from now, can understand your intent without guessing. Readable code is faster to change, fewer bugs hide in it, and reviews go smoother. The good news is that most of clean coding is a handful of habits you can adopt immediately. Here are the ones that matter most and are easiest to start using today.",
        sections: [
            { h: "Names Are the Foundation", p:
                "The single highest-leverage habit is naming things well. A name should tell you what something is or does without making you open the definition. Prefer a descriptive function name over a short one, and make variable names say what they hold, not what type they are. If you find yourself adding a comment to explain a variable, the name is probably the thing that's weak. Good names are the cheapest documentation you'll ever write, and they compound across an entire codebase." },
            { h: "Make Functions Small and Focused", p:
                "A function should do one thing and do it at a single level of abstraction. If a function is long, it's often doing several things, and splitting it into small, well-named pieces makes the main flow read almost like a script of high-level steps. This also makes each piece easier to test and easier to trust. A readable function is one where the top-to-bottom flow tells you what happens, and the details live in the small functions it calls." },
            { h: "Reduce the Noise", p:
                "Clean code keeps the signal high by removing what doesn't matter. That means deleting dead code and commented-out blocks, avoiding deep nesting by handling the boring case early and returning, and not over-generalizing for imaginary future needs. Every bit of extra abstraction or unused branch is a small tax on comprehension. The goal is that when someone reads your code, almost every line is doing something they need to see, and there's very little to wade through to find the point." },
        ],
        listTitle: "Habits You Can Start Today",
        listType: "ul",
        listItems: [
            "Name things for what they mean, not what they are.",
            "Split long functions into small, single-purpose ones.",
            "Handle edge cases early to cut nesting.",
            "Delete dead and commented-out code.",
            "Let the flow read top-to-bottom like a story.",
        ],
        faq: [
            { q: "Does clean code run faster?", a:
                "Not necessarily in raw speed, and over-optimizing for readability can occasionally cost a little. But it's almost always faster to maintain and change, which is where most time is actually spent." },
            { q: "Is there a single definition of clean code?", a:
                "There's no universal standard, but the ideas are consistent: clear names, small focused functions, low noise, and code that states its intent directly." },
            { q: "How do I get my team to follow it?", a:
                "Make it concrete in reviews with specific, constructive feedback, and lead by example. Shared, small examples are far more effective than a long style document." },
        ],
        outro:
            "Writing clean code is a collection of small, learnable habits that pay off every time someone reads your work. Focus on names, keep functions small, and strip out the noise, and your code will start to explain itself. It won't make you the fastest in raw execution, but it will make you dramatically faster at understanding, changing, and trusting the code you and your team ship.",
    },
    {
        category: CATEGORY,
        title: "Git Branching Strategies for Teams",
        intro:
            "A good branching strategy keeps a team shipping continuously while protecting the main line of code from half-finished work. There's no single perfect model, but a few approaches have become popular for good reasons. Understanding how each one flows, and when it fits, helps you pick a strategy your team can actually follow without constant context switching.",
        sections: [
            { h: "Why You Branch at All", p:
                "Branching lets you build and review work in isolation before it reaches the main branch, so one unfinished feature doesn't block or break everyone else. It also creates a natural checkpoint for code review and for a team to agree on what is stable. The goal is a clear, predictable flow from an idea to merged, tested code, with a main branch that is always close to releasable. A strategy is just a set of conventions that makes that flow easy for a lot of people to follow at once." },
            { h: "The Common Strategies Compared", p:
                "GitFlow is the classic, heavier model with long-lived develop and release branches plus short feature branches. It's great for projects with scheduled releases and a lot of parallel work, but it can feel slow and ceremonial for teams that deploy every day. GitHub Flow is lighter: a single main branch that's always deployable, plus short-lived feature branches that get merged through pull requests. Trunk-based development goes further and has everyone commit to a single branch behind feature flags, optimizing for the smallest possible changes and continuous delivery. Each is a tradeoff between structure and speed." },
            { h: "Choosing What Fits Your Team", p:
                "Match the strategy to how you release. If you ship in big, scheduled versions and need a place to stabilize, a GitFlow-style model with release branches makes sense. If you deploy to production frequently and want a simple, fast loop, GitHub Flow or trunk-based development will keep you moving. Whichever you pick, the success factors are the same: keep branches short-lived, merge often, automate the tests and the build, and make the review step consistent. The strategy matters less than the discipline of small, frequent, well-tested changes." },
        ],
        quote: "A branching strategy is just a shared convention. Its real value is that ten people can work in parallel without wondering what state the main branch is in.",
        faq: [
            { q: "How long should a branch live?", a:
                "As short as possible, ideally hours to a couple of days. The longer a branch lives, the more it drifts from main and the messier the eventual merge becomes." },
            { q: "Do I need release branches if I deploy daily?", a:
                "Usually not. If you deploy continuously from a stable main branch, heavy release branches add ceremony without much benefit." },
            { q: "What about feature flags?", a:
                "Feature flags let you merge incomplete or risky work behind a toggle, which is a key enabler for trunk-based development. They let main stay releasable even while features are still in progress." },
        ],
        outro:
            "Pick a branching model that matches your release cadence, then invest most of your energy in the habits that make any model work: short-lived branches, frequent merges, automated checks, and consistent reviews. A lightweight strategy with strong discipline will outperform a heavyweight one that the team can't keep up with. The best strategy is the one your team will actually follow every day.",
    },
    {
        category: CATEGORY,
        title: "Design Patterns: The Single Responsibility Principle",
        intro:
            "The Single Responsibility Principle is one of the most useful and most misunderstood ideas in software design. It's often summarized as a class should have only one reason to change, but what that actually means in practice is more subtle and more valuable. Learning to spot when a piece of code is taking on too many jobs is one of the fastest ways to make a codebase easier to change. Here's the principle explained clearly, with the intuition you need to apply it.",
        sections: [
            { h: "What One Responsibility Actually Means", p:
                "A responsibility is a reason for a piece of code to change. If a class both formats a price for display and also calculates tax, it has at least two responsibilities, because a change in the tax rules forces you to touch the same code as a change in how prices are shown. The principle says to separate those so each change has exactly one place to land. It's less about counting methods and more about asking, how many different things could make me edit this code? If the answer is several, the code is doing too much." },
            { h: "Why It Matters for Change", p:
                "The payoff is that changes stop spreading. When each responsibility lives in its own place, a business rule change, a formatting tweak, or a new output format each touch a single, focused piece of code instead of rippling through a large class. That makes changes safer, easier to review, and easier to test, because you can test one responsibility in isolation. It also makes the code more reusable, since a small, single-purpose piece is easier to drop into another context than a bloated one." },
            { h: "Applying It Without Over-Engineering", p:
                "The mistake people make is splitting everything into a dozen tiny classes until the code is impossible to follow. Single Responsibility is a signal, not a quota. Apply it when a class is clearly doing several different jobs or when you keep finding unrelated changes landing in the same place. A good test is the cohesion of the code: if the members of a class all revolve around one concept, you're fine. If they're about several unrelated things, that's the cue to split. Aim for clarity, not an arbitrary number of classes." },
        ],
        faq: [
            { q: "How do I know if I'm over-splitting?", a:
                "If the new pieces are so small that you have to jump between many files just to understand one behavior, you've gone too far. Aim for classes that are each obviously about one concept." },
            { q: "Does this apply to functions, not just classes?", a:
                "Yes, the same idea applies. A function with multiple reasons to change is usually a candidate to split into smaller, single-purpose functions." },
            { q: "Is there a downside to strict Single Responsibility?", a:
                "It can add a bit of indirection, and over-applying it can fragment the code. The goal is balance: separate genuinely distinct responsibilities, but don't split things that naturally belong together." },
        ],
        outro:
            "Single Responsibility is about giving every change a single, obvious home. When you can name more than one reason a piece of code would change, that's the signal to separate the jobs. Apply it as a guide for clarity rather than a rigid rule, and your code will be easier to change, easier to test, and easier for anyone to follow. It's a small idea with a big, lasting effect on how maintainable your software is.",
    },
    {
        category: CATEGORY,
        title: "Debugging Like a Pro: Techniques and Tools",
        intro:
            "Debugging is less about guessing and more about forming a hypothesis and testing it with the least noise possible. The difference between a developer who finds a bug in ten minutes and one who spends an hour is almost always process, not luck. A few reliable techniques and the right use of a debugger turn a frustrating mystery into a short, logical investigation. Here are the habits that consistently make debugging faster.",
        sections: [
            { h: "Reproduce It Before You Touch Anything", p:
                "The single most important first step is to reproduce the bug reliably. A bug you can trigger on demand is a bug you can fix, because you now have a before-and-after to test against. If you can't reproduce it, your first job is to find the conditions under which it happens, the exact input, the sequence of clicks, the environment. Trying to fix something you can't reproduce usually leads to random changes and the feeling that you fixed it by accident." },
            { h: "Form a Hypothesis, Then Test It Cheaply", p:
                "Once you can reproduce the bug, make a specific guess about what's causing it, and design the cheapest way to confirm or reject it. That might mean adding a log, inspecting a value, or reading the code path. The key is to change one thing at a time and observe, so you actually learn something from each step instead of accumulating a pile of unexplained changes. This turns debugging into a loop of predict, check, update your belief, and repeat, which is far more efficient than blindly editing." },
            { h: "Use the Debugger, Not Just Print Statements", p:
                "A real debugger is the single most powerful debugging tool available, and most developers underuse it. With breakpoints you can pause the program exactly where you care about and inspect the state, the variables, and the call stack at that moment, then step through line by line to watch how values change. It answers questions that print statements can only answer badly, like what was on the call stack or what the object looked like right before it broke. Learn your environment's basic breakpoints, stepping, and variable inspection and debugging gets dramatically faster." },
        ],
        quote: "Reproduce, hypothesize, test one thing at a time. That loop solves far more bugs faster than any amount of guess-and-check.",
        faq: [
            { q: "When should I add a log instead of a breakpoint?", a:
                "Logs are great for events you can't pause for, like background jobs or issues that only happen on a user's machine. Breakpoints are better when you can run the code locally and need to inspect live state." },
            { q: "How do I debug a bug that only happens in production?", a:
                "Lean on logs and error tracking to capture the context, try to reproduce locally with the same input and environment, and add targeted logging to confirm your hypothesis before shipping a fix." },
            { q: "Is it worth learning a debugger if logs 'work'?", a:
                "Yes. A debugger answers state and control-flow questions that logs handle poorly, and it's often much faster for local debugging once you get comfortable with it." },
        ],
        outro:
            "Debugging gets faster when you stop guessing and start running a disciplined loop: reproduce the bug, form a clear hypothesis, and test it with the cheapest reliable method, which is often a debugger. Change one thing at a time so each step teaches you something, and you'll move from the next bug to the fix in a fraction of the time. It's a skill you build with practice, and it compounds across everything you write.",
    },
    {
        category: CATEGORY,
        title: "Concurrency vs Parallelism: What's the Difference?",
        intro:
            "Concurrency and parallelism sound the same and are often used interchangeably, but they're different ideas, and confusing them leads to real bugs. Concurrency is about managing many tasks at once; parallelism is about actually running some of them at the same time. Understanding the distinction is essential whether you're writing web servers, background jobs, or anything that does more than one thing. Here's the difference, made concrete.",
        sections: [
            { h: "The Core Distinction", p:
                "Concurrency is about structure and managing the overlap of tasks, so your program can handle many things and make progress on each even if they don't all run literally at the same instant. Parallelism is about doing things at the same time, using multiple processors or cores so two pieces of code are genuinely executing simultaneously. You can have concurrency without parallelism, and that's the most common case, and you can have parallelism without much of the complexity of managing concurrency if the tasks are independent." },
            { h: "An Everyday Analogy That Sticks", p:
                "Imagine one cook in a kitchen making several dishes. That's concurrency: the cook is juggling multiple tasks, checking on the pasta, starting the sauce, plating the soup, and making steady progress on each even though only one action happens at a time. Now imagine four cooks each handling a separate dish at the same time. That's parallelism: multiple pieces of work genuinely happening simultaneously. Most software is more like the one cook, interleaving lots of tasks to keep everything moving, and that interleaving is where the tricky bugs hide." },
            { h: "Why the Confusion Causes Real Bugs", p:
                "The danger of mixing these up is assuming that because your code is concurrent, it's automatically using multiple cores, or because it's on multiple cores, the pieces don't interact. Concurrency introduces things like interleaving and shared state that you must reason about, whether or not you have parallelism. Parallelism introduces the need to protect shared data from simultaneous access. Knowing which problem you're actually solving tells you which tools you need, like locks, queues, or message passing, and helps you avoid a whole class of subtle, hard-to-reproduce errors." },
        ],
        faq: [
            { q: "Can I have concurrency without parallelism?", a:
                "Yes, and it's the most common case. A single-core server handling many requests is concurrent, interleaving work across them, but not parallel because only one thing runs at a time." },
            { q: "Does parallelism automatically make code faster?", a:
                "Not always. Parallelism only helps work that can genuinely be split, and the overhead of coordinating tasks can eat the gains for small or tightly-coupled work." },
            { q: "What's the practical takeaway?", a:
                "Treat concurrency as the art of managing overlapping tasks and parallelism as the act of running things at once. Naming which one you're dealing with points you to the right tools and the right risks." },
        ],
        outro:
            "Concurrency is about managing many tasks so they all make progress; parallelism is about running some of them literally at the same time. Most software is concurrent, and the bugs live in how those tasks interleave and share state. Keep the two ideas distinct and you'll pick the right tools, set the right expectations about speed, and avoid a whole category of confusing, intermittent problems.",
    },
    {
        category: CATEGORY,
        title: "The Art of Writing Meaningful Commit Messages",
        intro:
            "A good commit message is one of the cheapest ways to make a codebase easier to work in, yet it's one of the most common things developers skimp on. The history of a project is made of its commits, and a clear message turns that history from a wall of noise into a useful record of why things changed. You don't need a long essay; you need a short, consistent format that answers the right questions. Here's a simple standard that works for almost any team.",
        sections: [
            { h: "The Format: Subject, Then the Why", p:
                "A strong commit message has a short subject line and, when needed, a longer body. The subject is one line, kept under about fifty characters, that says what changed in an imperative, specific way, like 'Fix off-by-one in pagination' rather than 'fix stuff' or 'changes.' The body, separated by a blank line, explains why the change was made and any important context that isn't obvious from the code itself. Most of the value is in the why, because the code already shows you the what, but the reason is the part you can't reconstruct later." },
            { h: "What Makes a Subject Line Good", p:
                "A good subject is specific, present-tense, and scoped. It names the area and the change so that someone scanning a long list of commits can instantly tell what each one did. Avoid vague words and avoid mixing the message with a ticket number as the entire subject. If the change is small, the subject alone may be enough. If it's large or surprising, the body earns its place. The goal is that the subject line alone is a useful summary, and the body is the detail you reach for only when you need it." },
            { h: "The Payoff Over Time", p:
                "Well-written commit messages pay off every time someone uses the history. You can find out when a bug was introduced and why a decision was made, you can revert a change with confidence because you know its scope, and a new teammate can understand how the project evolved instead of guessing. It also makes code review and git blame far more useful, because the message and the change align. The cost is a few seconds per commit, and the benefit compounds across the whole life of the project." },
        ],
        listTitle: "A Simple Commit Standard",
        listType: "ul",
        listItems: [
            "Keep the subject under about 50 characters and make it specific.",
            "Write the subject in imperative form: 'Add', 'Fix', 'Refactor'.",
            "Separate a blank line before the body.",
            "Explain the why in the body, not just the what.",
            "Reference a ticket if you have one, but don't let it be the whole message.",
        ],
        faq: [
            { q: "Do I need a body for every commit?", a:
                "No. For a small, obvious change a good subject line is enough. Add a body when the why isn't clear from the code or the change is significant." },
            { q: "How detailed should the body be?", a:
                "Just enough for someone to understand the decision and the context without asking you. Usually a couple of sentences, not a paragraph or more." },
            { q: "Is there a benefit to a strict format like conventional commits?", a:
                "Yes. A consistent, parseable format lets tooling auto-generate changelogs and categorize changes, which is a real win for larger projects." },
        ],
        outro:
            "A meaningful commit message is a few seconds of effort that makes the entire history of your project more useful. Keep the subject short, specific, and imperative, and explain the why in the body when it isn't obvious. Do that consistently and your git history stops being a source of confusion and starts being one of the most helpful documents your project has.",
    },
];
