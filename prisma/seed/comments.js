"use strict";

// A pool of short, realistic reader comments. The seed picks a few per post and
// occasionally turns one into a short author/reply thread.
const COMMENTS = [
    "This was exactly what I needed right now. Thanks for breaking it down so clearly.",
    "I've been meaning to look into this. Great overview, bookmarked for later.",
    "Solid article. I did try a bit of this last month and it really did click for me.",
    "One thing that helped me was just starting small instead of trying to do everything at once.",
    "Really appreciate the practical examples. The theory alone never stuck before.",
    "Did you consider mentioning the learning curve? It's steeper than it looks at first.",
    "This is one of the better explanations I've read on the topic. Nicely done.",
    "I shared this with my team, several of them said it made things a lot clearer.",
    "Good points. I'd add that consistency matters more than any single trick here.",
    "Finally someone explaining this without the jargon. Much easier to follow.",
    "The FAQ section alone was worth the read. Very on point.",
    "I tried the approach from the third section and it made a noticeable difference.",
    "Interesting perspective. I'd love to see a follow-up going deeper on the tradeoffs.",
    "This made me rethink how I've been doing things. Genuinely useful.",
    "Clear, concise, and actionable. Exactly the kind of post I look for.",
    "The examples really help. Abstract advice never lands the same way.",
    "I bookmarked this the moment I saw the title. The content delivered too.",
    "Would be great to see a comparison with the alternative approach in a future post.",
    "Great reminder that the basics are still the hardest part to get right.",
    "This is spot on. I've seen teams trip over exactly this mistake.",
    "Appreciate the balanced take. It's easy to go full hype, and you didn't.",
    "The step-by-step section made this actually doable instead of just theoretical.",
    "I read this twice. The second time it really sank in.",
    "Useful and well organized. The structure made it easy to skim or read fully.",
    "I was skeptical at first, but the reasoning here is convincing.",
    "Nice breakdown. The part about common mistakes saved me from a few headaches.",
    "This should be required reading before starting a project like this.",
    "Took notes throughout. Rare to find something this practical.",
    "The conclusion summed it up perfectly. Start simple, iterate.",
    "I appreciate the honesty about where this approach falls short.",
    "Really solid piece. The examples felt realistic, not contrived.",
    "This helped me finally understand something I'd been half getting for years.",
    "Great post. I'd encourage anyone on the fence to just read it straight through.",
    "The practical checklist near the end is gold. I printed it out.",
    "Well written and genuinely helpful. Thanks for sharing this.",
    "I'd add one caveat: it depends a lot on your specific setup, but the core advice holds.",
    "This is the clearest explanation of the topic I've found. Well done.",
    "Reading this motivated me to actually start this week instead of next month.",
    "The way you structured the sections made it easy to follow along and apply.",
    "Really enjoyed this. More posts like this, please.",
];

// Short replies an author might post in response.
const REPLIES = [
    "Thanks! Glad it resonated.",
    "Good catch — I'll expand on that in a future post.",
    "Agreed, that's a fair point.",
    "Appreciate you reading all the way through!",
    "That's a great question — short answer: it depends on your scale.",
];

module.exports = { COMMENTS, REPLIES };
