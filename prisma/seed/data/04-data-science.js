"use strict";

const CATEGORY = "Data Science";

module.exports = [
    {
        category: CATEGORY,
        title: "How to Clean Messy Data in Python with Pandas",
        intro:
            "Real data is messy, full of missing values, inconsistent formats, duplicates, and columns that almost mean the same thing. Cleaning it is the largest chunk of any data project and the part no one talks about with romance. The good news is that Pandas has a small set of tools that handles almost all of it. Here's a practical, repeatable approach to taking a rough dataset and turning it into something you can actually analyze.",
        sections: [
            { h: "Start by Inspecting, Not Fixing", p:
                "Before you change anything, learn what you're dealing with. Check the shape of the data, the types of each column, and a quick summary of the values. Look for missing entries, duplicates, and columns that are mostly empty or hold junk. This inspection tells you which problems are real and how big they are, so you spend your effort where it counts instead of fixing things that aren't actually broken. A few quick look at the data saves you from a long string of blind edits." },
            { h: "The Core Cleaning Moves", p:
                "A handful of operations cover most of the mess. Handle missing values by either dropping the rows where they matter or filling them with a sensible default, like a column mean or an explicit unknown. Remove exact duplicates and fix inconsistent formatting, like capitalization, extra spaces, or dates stored as strings in different formats. Standardize column names to a consistent convention and split or combine columns that are really two pieces of information in one. Each of these is a one-liner or a short block in Pandas, and doing them in a deliberate order keeps the process predictable." },
            { h: "Make It Repeatable and Verifiable", p:
                "Cleaning is easy to do once and hard to trust. Write the steps as a script or a function so the same input always gives the same clean output, and check your work as you go, comparing row counts before and after each step so an unexpected drop is visible. Document the decisions, especially anything where you had to choose, like how you handled a missing value, because a future you or a teammate will want to know. Clean data that you can reproduce and explain is the kind that lets the rest of the analysis rest on solid ground." },
        ],
        listTitle: "A Practical Cleaning Sequence",
        listType: "ol",
        listItems: [
            "Inspect shape, dtypes, and a quick summary of each column.",
            "Handle missing values by dropping or filling deliberately.",
            "Remove duplicates and fix inconsistent formats and types.",
            "Standardize column names and split or merge messy columns.",
            "Write it as a script and verify row counts after each step.",
        ],
        faq: [
            { q: "How do I decide whether to drop or fill missing values?", a:
                "If the missingness is random and the column matters, filling with a sensible value often preserves the row. If the row is useless without that value, or the missingness is systematic, dropping may be more honest. Know which case you're in." },
            { q: "Is it normal that cleaning takes most of the time?", a:
                "Yes, and that's a sign you're doing real work. Most data projects spend the majority of their time getting the data into a usable shape, and that's where the value is." },
            { q: "How do I avoid accidentally corrupting the data?", a:
                "Work on a copy, do one transformation at a time, and check row and column counts after each step so an unexpected change is immediately visible." },
        ],
        outro:
            "Cleaning messy data is a disciplined process, not a scramble. Inspect first, apply a small set of standard fixes in a deliberate order, and make it all repeatable and verifiable. Spend the time to document your decisions and check your work, and you'll end up with data you can trust, which is the foundation every good analysis is built on.",
    },
    {
        category: CATEGORY,
        title: "The Data Science Workflow: End to End",
        intro:
            "A lot of people picture data science as building a model, but the model is one step in a much longer process, and usually not the hardest part. The real workflow runs from a fuzzy business question all the way to a result that someone can act on, and each stage shapes the next. Understanding the full end-to-end flow helps you avoid the classic trap of building an impressive model that answers a question nobody asked. Here's the workflow, stage by stage.",
        sections: [
            { h: "It Starts With a Question, Not a Dataset", p:
                "The first and most important step is defining what decision the analysis should inform. A clear, answerable question, like why did churn spike last quarter, drives everything downstream, from which data you need to how you'll judge success. Skipping this and starting with data usually leads to a project that produces interesting numbers but no decision. If you can't state the question in one sentence, the project isn't ready to start." },
            { h: "The Middle: Data, Analysis, and Modeling", p:
                "Once the question is set, you gather and clean the data, which is where most of the time goes, and then you explore it to understand what's actually in there before you commit to any method. Only after you understand the data do you choose an analysis, which might be a simple comparison, a statistical test, or a predictive model. The key discipline is to let the data and the question guide the method, rather than reaching for the most complex tool you know. A simple, well-executed analysis that answers the question beats an elaborate model that doesn't." },
            { h: "The End: Communicating an Actionable Result", p:
                "The final step is the one that determines whether the work mattered: turning the result into something a non-technical person can understand and act on. That means a clear answer to the original question, the key evidence, and a concrete recommendation, presented in a way that fits the audience, a short report, a dashboard, or a few slides. A brilliant analysis that no one reads has no impact. Building the communication into the plan from the start, rather than bolting it on at the end, is what separates a finished project from a forgotten notebook." },
        ],
        quote: "The model is the smallest part of data science. The question and the communication are the parts that decide whether the work was worth doing.",
        faq: [
            { q: "How much time should each stage take?", a:
                "It varies, but a healthy split is heavy on understanding the question and cleaning the data, moderate on analysis and modeling, and a meaningful share on communicating the result. If modeling is the biggest chunk, something is off." },
            { q: "Do I always need a machine learning model?", a:
                "No. Many questions are best answered with descriptive statistics or a simple comparison. A model is a tool for when you need to predict or find patterns, not a requirement for every project." },
            { q: "How do I know when an analysis is 'done'?", a:
                "When it answers the original question clearly and the audience can act on it. If the result doesn't change a decision or a next step, the analysis probably isn't finished, regardless of how polished the model is." },
        ],
        outro:
            "The data science workflow is a loop from a clear question, through understanding and cleaning the data, to an analysis chosen to fit the problem, and finally to a result someone can act on. Resist the urge to jump straight to modeling, and resist treating the work as finished until it's communicated. That full arc, question to action, is what makes data science valuable instead of just interesting.",
    },
    {
        category: CATEGORY,
        title: "A/B Testing: A Practical Guide",
        intro:
            "A/B testing is the most reliable way to find out whether a change actually improves anything, yet it's constantly set up wrong in small, subtle ways that invalidate the results. The core is simple: split your users into two groups, show them different versions, and compare the outcome. The craft is in the details, how you split, what you measure, and how long you run it. Here's a practical guide to running an A/B test you can actually trust.",
        sections: [
            { h: "Set Up the Experiment Properly", p:
                "Start by choosing one primary metric, the single number that defines success, and decide in advance what difference would be worth shipping. Then randomly assign users to the control and the treatment group, making sure the assignment is truly random and that each user only ever sees one version. The randomization is what makes the comparison fair, because it balances out the differences between groups so the only systematic difference is the change you're testing. Skipping clean randomization is the most common way to poison an experiment." },
            { h: "Run It Long Enough, and Only Once", p:
                "The two cardinal sins are stopping too early and peeking. You need enough users in each group to detect a real difference, and checking the results every day and stopping the moment it looks significant is a recipe for false winners. Decide your sample size and duration up front based on the effect you care about, then let it run the full period before you look and decide. Running one primary metric and one experiment at a time also keeps the interpretation clean, because when you test many things at once, the chance of a fluke finding grows." },
            { h: "Read the Results Honestly", p:
                "When the experiment is done, look at the difference between the groups and whether it's large enough to matter and statistically reliable. A result can be statistically significant but too small to be worth the effort, or large but not reliable because the sample was too small. Report the effect size and the uncertainty, not just a win or a loss, and be willing to conclude that a change made no difference, which is a perfectly valid and useful outcome. The goal of the test is a confident decision, and sometimes the honest answer is that the two versions are effectively the same." },
        ],
        quote: "An A/B test is only as trustworthy as its setup. Randomize cleanly, pick one metric, decide the sample size in advance, and don't peek.",
        faq: [
            { q: "How many users do I need for a test?", a:
                "It depends on how small a difference you want to detect and how variable your metric is. There are calculators for this, but as a rule of thumb, small expected changes need large samples, and underpowered tests are worse than no test." },
            { q: "Can I test more than one thing at once?", a:
                "You can, but it gets complicated and inflates the chance of false findings. For a clear, trustworthy result, one primary change and one primary metric is the safest default." },
            { q: "What if the test is inconclusive?", a:
                "Treat it as information. An inconclusive result tells you the change likely doesn't make a meaningful difference, or that you need more data. Both are useful, and both are better than shipping on a hunch." },
        ],
        outro:
            "A trustworthy A/B test comes down to discipline: define the question and the primary metric in advance, randomize cleanly, run it long enough, and read the results with an eye on both size and reliability. Avoid peeking and avoid testing everything at once. Do that and you replace guesswork with evidence, which is the entire point of running the experiment in the first place.",
    },
    {
        category: CATEGORY,
        title: "Data Visualization Best Practices",
        intro:
            "A good chart makes a result obvious in a second; a bad one takes a paragraph to explain and still leaves the reader uncertain. The difference is rarely about fancy tooling, it's about a handful of consistent principles that keep the data honest and the message clear. Whether you're building a dashboard or a single figure for a report, these practices will make your visualizations far more effective and far harder to misread.",
        sections: [
            { h: "Choose the Right Chart for the Message", p:
                "The first decision is matching the chart type to what you're showing. Use a line chart to show a trend over time, a bar chart to compare categories, and a scatter plot to show the relationship between two quantities. Avoid 3D effects, pie charts with many slices, and double axes that twist the scale, because they all make it harder to read the true values. The test is simple: can a reader pull the main point out in a couple of seconds? If not, the chart type is probably wrong for the message." },
            { h: "Be Honest With the Scale and the Labels", p:
                "A visualization is a claim about the data, and a distorted scale is a dishonest claim. Start axes at a sensible baseline, use consistent units, and never truncate a bar chart's axis in a way that exaggerates a difference. Label everything clearly: a title that states the takeaway, axis labels with units, and a legend only when you truly have multiple series. A reader should never have to guess what a number means or which line is which. Clear, honest labeling is what lets a chart stand on its own." },
            { h: "Reduce the Noise, Highlight the Point", p:
                "The best charts remove everything that isn't the message. Strip away unnecessary gridlines, borders, and colors, and use a restrained palette where color is reserved for the thing you want attention on. If the story is about one series or one segment, make that the focal point and let the rest recede. White space is a feature, not a waste. A chart that is mostly signal, with the important part visually emphasized, is a chart that a busy reader can actually use in the moment they need it." },
        ],
        listTitle: "Quick Do's and Don'ts",
        listType: "ul",
        listItems: [
            "Use a line for trends over time and bars for comparing categories.",
            "Avoid 3D, excessive pie slices, and misleading truncated axes.",
            "Title the chart with the takeaway, not just the topic.",
            "Label axes with units and keep the legend minimal.",
            "Use color to highlight the point, not to decorate.",
        ],
        faq: [
            { q: "Are pie charts ever okay?", a:
                "Sometimes, for showing a few parts of a whole, like two or three categories that add to one hundred percent. For anything more granular or for comparing magnitudes, a bar chart is clearer and less error-prone." },
            { q: "How much color should I use?", a:
                "Less than you think. A restrained palette with one or two accent colors for the important series keeps the focus on the message instead of a rainbow of decoration." },
            { q: "What's the single most common visualization mistake?", a:
                "Distorting the scale, like truncating an axis, in a way that makes a small difference look large. It's the fastest way to make a chart misleading, even unintentionally." },
        ],
        outro:
            "Great data visualization is mostly restraint and honesty: pick the chart that fits the message, keep the scale truthful, label everything clearly, and strip out the noise so the point stands out. None of it requires a fancy tool, just a consistent set of habits. Apply them and your charts will communicate faster and more honestly, which is exactly what a reader needs to trust and use what you're showing them.",
    },
    {
        category: CATEGORY,
        title: "Introduction to Statistics for Data Scientists",
        intro:
            "You don't need to become a mathematician to use statistics well as a data scientist, but you do need a working feel for a handful of core ideas that show up everywhere. These are the concepts that let you tell a real signal from noise, summarize data honestly, and know when a result is actually meaningful. This is a gentle, practical introduction to the statistics that matter most, with the intuition behind each one rather than a wall of formulas.",
        sections: [
            { h: "Describing Data: The Basics That Matter", p:
                "Before you can infer anything, you need to describe what you have. The mean and the median summarize the center, but they tell very different stories when the data is skewed, which is why you should always look at both. The spread, captured by the standard deviation or the range, tells you how much the values vary, and a center without a spread is incomplete. A quick histogram is the single best first look at a distribution, because it shows you the shape, the skew, and any odd clusters or gaps that a summary number would hide." },
            { h: "Thinking in Terms of Uncertainty", p:
                "Almost everything in statistics is about reasoning under uncertainty, and the key idea is the difference between a sample and the population. You almost never have the whole population, so you estimate its properties from a sample, and that estimate has uncertainty attached to it. A confidence interval captures that uncertainty, giving you a range of plausible values rather than a single false-precision number. Thinking in ranges and in how confident you can be, instead of point estimates, is the mindset that separates a careful analysis from an overconfident one." },
            { h: "Testing Whether a Difference Is Real", p:
                "The most common statistical task is deciding whether an observed difference is real or just a fluke of the sample. A hypothesis test formalizes this by asking, if there were truly no difference, how likely would I be to see a result this extreme? That likelihood, the p-value, tells you how surprising your data is under the assumption of no effect. The crucial habit is to pair the p-value with the effect size, because a result can be statistically significant yet tiny, or large yet uncertain. Judging both together is what keeps you from chasing noise or dismissing a real, meaningful effect." },
        ],
        quote: "Statistics is the discipline of being honest about uncertainty. Every number you report should come with a sense of how confident you can be in it.",
        faq: [
            { q: "What does a p-value actually mean?", a:
                "It's the probability of seeing data at least as extreme as yours if there were truly no effect. A small p-value means your data would be surprising under the no-effect assumption, which is evidence for a real effect, not a probability that your hypothesis is true." },
            { q: "How much statistics do I actually need?", a:
                "A solid grasp of describing data, the idea of uncertainty and confidence intervals, and the basics of hypothesis testing covers the large majority of everyday data work. Depth in any one area can come later, as needed." },
            { q: "Why do I need both a p-value and an effect size?", a:
                "Because they answer different questions. The p-value says whether the effect is probably real, and the effect size says how big it is. You need both to decide whether something is both genuine and worth caring about." },
        ],
        outro:
            "Practical statistics for data science comes down to a few habits: describe your data with both a center and a spread, think in terms of uncertainty and ranges rather than false-precision points, and judge any difference by both its reliability and its size. Master those and you'll make far more trustworthy claims, avoid chasing noise, and communicate your results with an honesty that makes them actually useful.",
    },
    {
        category: CATEGORY,
        title: "How to Present Data to Non-Technical Stakeholders",
        intro:
            "You can run the best analysis in the world and still have zero impact if the people who need to act on it can't follow it. Presenting data to non-technical stakeholders is a distinct skill, and it's about translating, not dumbing down. The goal is to give a busy, non-specialist reader the key insight, the confidence behind it, and the decision it supports, without drowning them in methodology. Here's how to make your data land with the people who matter.",
        sections: [
            { h: "Lead With the Answer, Not the Process", p:
                "Start with the takeaway, the one or two sentences that state what you found and what it means for the decision in front of you. Non-technical readers don't need to watch you work; they need the conclusion and the reason to trust it. Then support it with the single most important piece of evidence, usually one clear chart, and only go deeper if they ask. Structure the whole presentation as answer first, key support second, and detail available on request. This flips the instinct to walk through every step and puts the value up front." },
            { h: "Translate the Numbers Into Their World", p:
                "Abstract numbers mean little; stakes and comparisons mean everything. Instead of saying the model has an F1 of zero point eight two, say it correctly catches most of the cases we care about and misses a small, manageable number. Frame findings against a baseline, a target, or a consequence, so the audience can feel what the number implies for their work. Replace jargon with plain language, and when you must use a technical term, define it in one short clause. The test is whether a smart person with no statistics background could restate your finding to a colleague. If they can, you've communicated well." },
            { h: "Design for the Decision, and Invite the Follow-Up", p:
                "Every presentation should point to a decision or a next step, because that's why the analysis exists. Make the recommendation explicit, state what you'd do and why, and be clear about the confidence and the caveats so the audience can weigh it honestly. Then design the visual and the talk to be easy to follow, one idea per slide, minimal text, and a clean chart. Finally, invite questions and be ready to go deeper for anyone who wants it. You're not hiding complexity, you're layering it, giving the clear answer first and the detail on demand." },
        ],
        quote: "You're not simplifying the data. You're translating it into the language of the decision your audience is trying to make.",
        faq: [
            { q: "Am I dumbing things down by keeping it simple?", a:
                "No. You're being clear. A non-technical reader can understand a clear, honest summary without needing the full methodology, and that's a service, not a disservice. The depth is there if they want it." },
            { q: "How much detail is too much?", a:
                "Enough that a non-specialist has to stop and decode the jargon or the math is too much. Keep the main track plain and move the technical detail to an appendix or a follow-up conversation." },
            { q: "What if the answer is complicated or uncertain?", a:
                "Say so plainly. Honest communication includes the uncertainty and the conditions, and a clear statement of the caveats builds far more trust than a false-precision answer that hides the complexity." },
        ],
        outro:
            "Presenting to non-technical stakeholders is translation: lead with the answer, support it with one clear piece of evidence, and translate every number into the stakes and decisions it affects. Point the whole thing at a decision, be honest about confidence, and keep the technical detail available but out of the main track. Do that and your analysis stops being a notebook and starts being something people actually use.",
    },
    {
        category: CATEGORY,
        title: "SQL Queries Every Data Analyst Should Know",
        intro:
            "SQL is the workhorse of data analysis, and a small set of query patterns covers a surprising amount of day-to-day work. You don't need to memorize every function, but there are a dozen or so query shapes you'll use constantly, from filtering and joining to aggregating and ranking. Learning these patterns well, and recognizing which one fits a given question, is what turns a slow, fumbling analyst into someone who can answer questions quickly and confidently. Here are the core ones.",
        sections: [
            { h: "Filtering, Joining, and Aggregating", p:
                "The foundation is selecting the right rows and the right columns, then combining tables and summarizing the result. Filtering with a where clause lets you isolate the slice of data a question is about. A join lets you pull related data from two tables together, like orders and customers, which is how you get from one table's facts to a richer picture. And aggregation, grouping the data and computing a sum, count, or average per group, is how you turn a million rows into the handful of numbers a report actually needs. These three, filter, join, aggregate, are the verbs of almost every analysis." },
            { h: "The Patterns That Answer Real Questions", p:
                "Beyond the basics, a few patterns show up everywhere. A window function lets you compute a running total or a rank within a group without collapsing your rows, which is how you do things like a monthly trend or a top-N per category. A subquery or a common table expression lets you build up an answer in readable steps, computing an intermediate result and then querying it. And a combination of aggregation with a having clause lets you filter on the grouped result, like finding the categories whose total is above a threshold. These are the shapes that take a simple query and turn it into a real, multi-step answer." },
            { h: "Writing SQL That's Fast and Readable", p:
                "As your queries get bigger, two qualities matter more: speed and readability. Write your queries in clear, labeled steps, often using a common table expression for each logical piece, so someone else can follow your reasoning. Be deliberate about filtering early, so you join and aggregate as little data as you need, and be careful with expensive patterns like unbounded joins. And when a query is slow, look at what it's actually doing, a quick explanation of the plan often reveals an obvious fix like a missing filter or a join that fans out far too much. Fast, readable SQL is the difference between a query you can trust and one you're afraid to touch." },
        ],
        listTitle: "The Core Query Shapes to Know",
        listType: "ul",
        listItems: [
            "Select the right columns and filter the right rows.",
            "Join related tables to build a richer picture.",
            "Group and aggregate to turn rows into summary numbers.",
            "Use window functions for running totals and rankings.",
            "Break complex answers into readable steps with CTEs.",
        ],
        faq: [
            { q: "Do I need to know advanced SQL to be an analyst?", a:
                "You need the core patterns very well, which covers most day-to-day work. Advanced features like window functions and CTEs are worth learning early because they come up constantly, but you don't need to master every exotic function." },
            { q: "What's the difference between where and having?", a:
                "Where filters individual rows before you group, and having filters after you group, on the aggregated result. You use having when the condition is about a sum or a count per group." },
            { q: "How do I make a slow query faster?", a:
                "Filter early to reduce the data you join and aggregate, avoid patterns that fan out rows, and read the query plan to spot the expensive step. Most speed wins come from touching far less data than you think you need." },
        ],
        outro:
            "SQL mastery for analysis is really pattern recognition: filter, join, and aggregate to get your numbers, and layer on window functions and readable multi-step queries to answer the harder questions. Write it in clear steps and keep it fast by filtering early. Nail these core shapes and you'll be able to answer most day-to-day data questions quickly and with confidence, which is exactly what the role calls for.",
    },
    {
        category: CATEGORY,
        title: "Feature Engineering: Making Data More Useful",
        intro:
            "Feature engineering is the art of turning raw data into inputs that actually help a model or an analysis, and it's often the difference between a weak result and a strong one. It's where domain knowledge meets the data, because the most valuable features are frequently things you have to construct rather than things that arrive ready-made. Understanding the core ideas and the common techniques will make your models and your analyses noticeably better, and it's a skill that compounds across every project.",
        sections: [
            { h: "What a Feature Is and Why It Matters", p:
                "A feature is any input you give to a model or use in an analysis, a column or a value that carries information relevant to the outcome. The quality of your features usually matters more than the choice of algorithm, because a smart model working on poor features will underperform a simple model working on great ones. Good feature engineering means finding or creating the inputs that most directly encode the signal you're trying to predict or explain. That's why it's a craft, not a step you rush through." },
            { h: "Common, High-Value Techniques", p:
                "A few transformations show up again and again. Encoding turns categories into numbers a model can use, and how you encode, one-hot or ordinal, matters depending on the category's nature. Scaling and normalization put different measurements on comparable footing so one large-valued column doesn't dominate. Creating interactions and ratios captures relationships, like revenue per user or the difference between two dates, that a raw column on its own doesn't. And extracting meaning from time, like the day of week or the month, often reveals patterns that a raw timestamp hides. Each is a small change with a real effect on usefulness." },
            { h: "Using Domain Knowledge and Staying Honest", p:
                "The best features come from understanding the problem, not from a recipe. Knowing the business tells you which relationships matter, which columns are actually signals versus noise, and which transformations make sense. But there's a danger: it's easy to engineer a feature that accidentally leaks the answer, like including a value that only exists after the outcome you're predicting, which makes a model look great and fail in the real world. Guard against leakage, validate that a feature helps on data the model hasn't seen, and prefer features you can explain, because a feature you can't justify is a feature you can't trust." },
        ],
        quote: "The best feature is usually the one that most directly encodes the signal, and it often has to be created, not found.",
        faq: [
            { q: "How much time should I spend on feature engineering?", a:
                "Often a lot, and it's usually worth it. A meaningful share of the total project time going into features is normal, because it's where much of the performance is won or lost." },
            { q: "What is data leakage, and why is it dangerous?", a:
                "It's when a feature accidentally contains information about the outcome that wouldn't be available at prediction time. It makes a model look excellent in testing but fail in production, so it's one of the most important things to check for." },
            { q: "Do I need deep math to engineer good features?", a:
                "No. Most valuable features come from domain understanding and common-sense transformations. The math helps you validate them, but the ideas are mostly about knowing what information matters." },
        ],
        outro:
            "Feature engineering is where domain knowledge turns raw data into useful signal. Encode categories sensibly, scale and combine columns to reveal relationships, extract meaning from time, and always guard against leakage. Spend real time here, validate that features help on unseen data, and prefer the ones you can explain. It's unglamorous work, but it's one of the highest-leverage parts of any data project.",
    },
    {
        category: CATEGORY,
        title: "How to Choose the Right Chart for Your Data",
        intro:
            "The single biggest factor in whether a chart works is whether the chart type matches the kind of story you're telling. A trend, a comparison, a relationship, a distribution, a part of a whole, each has a natural visualization, and picking the wrong one forces the reader to work hard or, worse, misread the data. This guide is a quick, practical map from the type of question you're answering to the chart that answers it best, so you can stop defaulting to the same two or three options.",
        sections: [
            { h: "Match the Chart to the Story", p:
                "Start from what you're trying to show, not from what's easy to make. To show how something changes over time, use a line chart, because the eye reads a connected line as a trend instantly. To compare values across categories, use a bar chart, ideally sorted, because aligned bars make magnitude differences obvious. To show how two quantities relate to each other, use a scatter plot, because the pattern of dots reveals correlation or clusters. Naming the story first, trend, comparison, relationship, removes most of the guesswork from the choice." },
            { h: "The Tricky Cases: Parts, Distributions, and Changes", p:
                "Some questions are less obvious. To show parts of a whole, a pie or a stacked bar can work, but only for a small number of slices, because humans are bad at comparing angles, so for more than a few categories a simple bar chart of the parts is clearer. To show the distribution of a single variable, a histogram or a box plot reveals the spread, the center, and any outliers. And to show how a total breaks down across categories over time, a stacked area or a small-multiples line chart keeps each part visible without a tangle of lines. Knowing these options stops you from forcing a pie chart where a bar chart was the right answer all along." },
            { h: "Test It on the Reader, Not Just on You", p:
                "You know what you were trying to show, so you'll always read your own chart correctly. The real test is whether someone who hasn't seen the data can pull out the main point in a couple of seconds. If the answer to that is no, the chart is doing too much or the wrong type is being used. Keep the number of series low, label everything, and prefer the simplest chart that carries the message. A chart that is instantly legible to a stranger is a chart that has done its job." },
        ],
        listTitle: "Story to Chart, Quickly",
        listType: "ul",
        listItems: [
            "Trend over time: line chart.",
            "Compare categories: bar chart, usually sorted.",
            "Relationship between two variables: scatter plot.",
            "Parts of a whole, few parts: pie or stacked bar.",
            "Distribution of one variable: histogram or box plot.",
        ],
        faq: [
            { q: "When is a pie chart actually the right choice?", a:
                "Rarely, and only when you're showing a small number of parts that add to one whole, like two or three categories summing to one hundred percent. For more, or for comparing magnitudes, a bar chart is almost always clearer." },
            { q: "Why do people reach for the same few charts all the time?", a:
                "Because they default to what they know instead of starting from the story. Once you map the type of message to its natural chart, the choice stops being a habit and starts being a decision." },
            { q: "How do I know if my chart is working?", a:
                "Ask whether a reader who hasn't seen the data can state the main point in a few seconds. If they can't, simplify it or switch to the chart type that fits the message better." },
        ],
        outro:
            "Choosing the right chart is really about identifying the story, trend, comparison, relationship, or distribution, and then picking the visualization that expresses that story most directly. Default to lines for time, bars for comparison, and scatter for relationships, and reach for the other types only when they fit. Test every chart on a reader who doesn't already know the answer, and you'll consistently produce visuals that communicate instead of confuse.",
    },
];
