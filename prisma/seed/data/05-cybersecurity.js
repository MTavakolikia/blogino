"use strict";

const CATEGORY = "Cybersecurity";

module.exports = [
    {
        category: CATEGORY,
        title: "How to Secure Your Passwords: A Practical Guide",
        intro:
            "Your passwords are the front door to almost everything you do online, and most people are protecting that door with a few weak, reused keys. The good news is that a handful of habits, most of them taking minutes, will dramatically cut your risk. This is a practical, no-jargon guide to the password practices that actually matter, in the order that gives you the most protection for the least effort.",
        sections: [
            { h: "Use a Password Manager", p:
                "The single biggest upgrade you can make is a password manager. It generates and stores a long, unique, random password for every account, so you only need to remember one strong master password. This solves the two worst habits at once, reusing the same password everywhere and writing passwords down where they can be found. A good manager also autofills, which removes the excuse to reuse a weak one. If you do only one thing from this guide, make it adopt a reputable password manager and let it handle the rest." },
            { h: "Make Your Passwords Long and Unique", p:
                "Length beats complexity. A long passcode of several random words or a long random string is far harder to crack than a short one stuffed with symbols. The key principle is uniqueness: every important account, especially email, banking, and anything with your identity, should have a password no other site has, because a single breach then doesn't cascade to everything else. You can relax this for low-risk, throwaway sites, but your high-value accounts should each have their own long, random password, which your manager makes trivial to manage." },
            { h: "Protect the Front Door: Your Master Password and Email", p:
                "A password manager centralizes your security, so the two things that matter most are your master password and your email. Choose a master password that's long and that you'll actually remember, since losing it can lock you out of everything. And treat your email account as the crown jewel, because it's how you reset nearly every other password. Secure it with a unique password and two-factor authentication, and be especially wary of anything that tries to get you to change your email or your recovery options. Protect those two and the rest of your setup holds together." },
        ],
        listTitle: "Do These, In This Order",
        listType: "ol",
        listItems: [
            "Adopt a reputable password manager.",
            "Let it generate a long, unique password for every important account.",
            "Pick a long master password you can remember.",
            "Turn on two-factor authentication for email, banking, and social.",
            "Never reuse a password between your high-value accounts.",
        ],
        faq: [
            { q: "Is it safe to store all my passwords in one place?", a:
                "Yes, if the place is a reputable, well-maintained password manager. A strong, encrypted vault guarded by a long master password is far more secure than the alternative of reused passwords and sticky notes. The risk is concentrated, but it's protected far more strongly than any individual password was." },
            { q: "How long should a password be?", a:
                "Longer is better. For a manager-generated password, something like twelve or more random characters is a solid default, and longer is even stronger. For something you type by hand, a phrase of several random words is both strong and memorable." },
            { q: "What if I've already reused passwords everywhere?", a:
                "Start with your most important accounts, email, banking, and anything with your identity, and give each a unique password now. Then work through the rest over time. You don't have to fix everything in a day, but prioritize the high-value targets first." },
        ],
        outro:
            "Strong password security comes down to a few moves: adopt a password manager, use long unique passwords for your important accounts, and protect your master password and your email with extra care. None of it is hard, and together it eliminates the two most common causes of account takeover, reuse and weak secrets. Make these changes once and you'll sleep far better, with far less to think about.",
    },
    {
        category: CATEGORY,
        title: "Understanding Phishing: How to Spot and Avoid It",
        intro:
            "Phishing is the most common way ordinary people get compromised, and it works not by breaking into your security but by convincing you to hand it over. The attackers don't need a technical exploit; they need you to click, to type your password, or to approve something. Learning to recognize the patterns and the pressure tactics they use is one of the highest-value security skills you can have, and it protects not just you but everyone you're connected to.",
        sections: [
            { h: "How a Phishing Attack Actually Works", p:
                "A phishing attempt is a message, an email, a text, or a call, that is disguised to look legitimate and is designed to get you to take a specific action. That action is almost always one of a few things: click a link to a fake site and enter your credentials, open an attachment that installs malware, or approve a payment or a request. The craft is in the packaging, a familiar logo, a plausible sender, and a reason to act quickly. Once you understand that the goal is to manipulate you into a single action, the rest of the warning signs start to make sense." },
            { h: "The Warning Signs That Matter Most", p:
                "A few cues stand out. Urgency and pressure are the biggest, a threat of account closure, a package that will be returned, or a deadline that means you shouldn't think. A mismatch between the display name and the actual sender address is another strong signal, as is a link that, when you hover over it, points somewhere unexpected. Generic greetings, poor grammar, and requests for information a legitimate service would never ask for over email are all red flags. And the strongest test of all is a simple pause: legitimate organizations rarely need you to act this instant, so a message that rushes you is telling you something about itself." },
            { h: "What to Do When You're Not Sure", p:
                "The best habit is to verify through a separate, trusted channel instead of through the message itself. If an email says your account is in trouble, don't click its link, go to the site or app you normally use and check there. If you get a call claiming to be your bank, hang up and call the number on the back of your card. And if you already clicked and entered something, act fast: change that password, turn on two-factor authentication if you haven't, and alert the service, because early action limits the damage. Calm, verify-through-a-second-channel, and respond quickly are the three moves that keep you safe." },
        ],
        quote: "Phishing doesn't attack your password. It attacks your sense of urgency. A pause and a second channel defeat most of it.",
        faq: [
            { q: "Can a legitimate company ever ask for my password by email?", a:
                "No. A real service will never ask you to send your password by email or to enter it on a page you reached from an email link. If a message asks for that, treat it as phishing regardless of how convincing it looks." },
            { q: "What's the fastest way to check a suspicious message?", a:
                "Don't interact with it. Open the service directly from a bookmark or your app, log in there, and see if there's a real alert. That second, independent channel is what separates a real notification from a fake one." },
            { q: "I clicked a link. Now what?", a:
                "If you only viewed a page, you're likely fine, but change the password for that account and enable two-factor authentication. If you entered credentials or attached a file, act quickly: change the password, alert the service, and monitor for unusual activity." },
        ],
        outro:
            "Phishing wins by making you act fast and trust a message you should verify. Build the habit of recognizing the pressure, checking the sender and the links, and always verifying through a separate channel before you act. If you do get caught, respond quickly and calmly, because early action is what limits the harm. A few seconds of suspicion now save a lot of trouble later, and that instinct is the single best defense you have.",
    },
    {
        category: CATEGORY,
        title: "The Basics of Network Security",
        intro:
            "Network security sounds like it belongs to big organizations with dedicated teams, but the core ideas apply to anyone who connects devices to the internet, from a home office to a small business. The goal is the same everywhere: keep the people and data you trust able to communicate, and keep everyone else out. Understanding a few fundamental concepts, like segmentation, encryption, and the basics of what crosses your network, will make you far more effective at protecting what you have, without needing to become a specialist.",
        sections: [
            { h: "Think in Terms of Trust Boundaries", p:
                "Network security is fundamentally about deciding who and what is trusted, and drawing clear boundaries around it. The core idea is to assume the outside is hostile and to control everything that crosses the line between your trusted space and the rest of the internet. That means a firewall that decides what traffic is allowed in and out, authentication that confirms who is connecting, and an eye on the devices and services that are exposed. The less you expose and the more clearly you define the boundary, the smaller your target becomes." },
            { h: "Encrypt the Things That Matter", p:
                "Encryption protects data in two places: in transit, as it moves across the network, and at rest, when it's sitting on a disk. For transit, using encrypted connections, HTTPS for web traffic and encrypted protocols for everything else, means that even if someone intercepts the traffic, they can't read it. For data at rest, encrypting your drives and your backups protects information if a device is lost or stolen. The practical habit is to check that the connections you rely on are actually encrypted, which today usually means looking for HTTPS and secure protocols, and to encrypt your local storage, especially on laptops and portable drives that can walk away." },
            { h: "Limit Exposure and Keep an Eye on Traffic", p:
                "Every port, service, or device you expose to the network is a potential entry point, so a core principle is to expose as little as possible. Turn off the services and sharing features you don't use, keep devices updated, and separate your more sensitive devices or guests from your main network where you can. And basic monitoring goes a long way: knowing what's normally on your network makes it easier to notice when something new or strange appears. Security isn't a single wall, it's a set of layers, and each one you add shrinks the chance that a single mistake leads to a breach." },
        ],
        quote: "Network security is mostly about saying no: no to unnecessary exposure, no to unencrypted traffic, no to untrusted devices on your network.",
        faq: [
            { q: "Do I really need a firewall if I'm just a home user?", a:
                "Your router already acts as a basic firewall, which is a good start. Being deliberate about what you expose, turning off unused services and sharing, and keeping devices updated goes a long way beyond the default protection." },
            { q: "What does 'encrypt in transit' actually mean for me?", a:
                "It means your data is scrambled while it travels so it can't be read if intercepted. In practice, it shows up as HTTPS on websites and secure protocols on your services. Check for it, and prefer the encrypted option whenever one is available." },
            { q: "How do I keep an eye on my network without being a pro?", a:
                "Get familiar with the devices normally connected, use your router's admin page to see what's on the network, and look for anything unfamiliar. Enable automatic updates and alerts where available, so unusual activity is more likely to surface to you." },
        ],
        outro:
            "The basics of network security are a set of habits rather than a toolkit: define what's trusted and keep the boundary clear, encrypt the data that moves and the data that's stored, and expose as little as you can while keeping a light watch on what's connected. You don't need a security team to benefit from these, just the consistent application of a few sound principles. Layer them and you turn a single point of failure into a system where one mistake rarely becomes a breach.",
    },
    {
        category: CATEGORY,
        title: "How to Enable Two-Factor Authentication (2FA)",
        intro:
            "Two-factor authentication is the single most effective thing most people can do to protect their accounts, and it's often free and takes only a few minutes to set up. The idea is simple: even if someone steals your password, they can't get in without the second thing you have. This guide explains the different types of 2FA, ranks them by how secure they are, and walks through enabling it on the accounts that matter most.",
        sections: [
            { h: "What 2FA Actually Does", p:
                "Standard login asks for one thing you know, your password. Two-factor authentication adds a second, independent check, usually something you have, like your phone or a security key. The value is that the two factors are different kinds of secret, so stealing the password alone is no longer enough. An attacker who gets your password from a breach still can't sign in without also having your phone or key. That second layer is what turns a stolen password from an account takeover into, at best, a nuisance you can reset." },
            { h: "The Types of 2FA, Ranked", p:
                "Not all second factors are equally good, so it's worth knowing the difference. The strongest are hardware security keys, a small physical device you plug in or tap, which are extremely hard to fake and are the best choice for high-value accounts. The next tier is an authenticator app, like the ones from major security vendors, which generates a changing six-digit code on your phone, and it's a strong, practical default for most people. SMS text codes are convenient but weaker, because they can be intercepted or your number can be ported, so treat them as a step up from nothing rather than a real barrier. Pick the strongest option the service offers, and prefer the app or a key over SMS whenever you can." },
            { h: "Turn It On Where It Counts, and Keep Backup Codes", p:
                "Prioritize the accounts that unlock everything: your email, your banking, and any password manager, plus the social and cloud accounts that hold your identity and your files. Enabling 2FA on those gives you the biggest protection for the least effort. And when you set it up, save the backup codes the service gives you in a safe place, because they're your way back in if you lose your phone. Without them, a lost device can lock you out of your own accounts, which is a problem you definitely don't want to discover at the worst possible moment." },
        ],
        listTitle: "Enable 2FA In This Order",
        listType: "ol",
        listItems: [
            "Your email account, it unlocks the rest.",
            "Your password manager, it holds all your other passwords.",
            "Banking and financial accounts.",
            "Cloud storage and the social accounts with your identity.",
            "Anywhere else you can, for a little more safety.",
        ],
        faq: [
            { q: "Is 2FA by text message good enough?", a:
                "It's better than nothing, but it's the weakest common option because a phone number can be intercepted or ported. Use an authenticator app or a hardware key instead, and keep SMS as a last resort rather than your default." },
            { q: "What should I do if I lose my phone?", a:
                "This is exactly why you save the backup codes when you first enable 2FA. Keep them somewhere safe, like a password manager or a physical copy in a secure place, and you can recover access without your phone." },
            { q: "Is 2FA worth it if I already have strong passwords?", a:
                "Yes, absolutely. Strong passwords and 2FA protect against different threats. Passwords stop guessing, and 2FA stops a stolen password from being enough. Together they cover far more ground than either one alone." },
        ],
        outro:
            "Two-factor authentication is the highest-impact, lowest-effort security upgrade most people can make. Enable it on your email, your password manager, and your financial accounts first, use an authenticator app or a security key rather than SMS where you can, and keep your backup codes safe. A few minutes of setup now adds a layer that a stolen password simply can't get past, which is exactly the protection you want.",
    },
    {
        category: CATEGORY,
        title: "What Is a Ransomware Attack and How to Prevent It?",
        intro:
            "Ransomware is one of the most damaging kinds of cyberattack, and yet much of the damage comes from a small number of preventable mistakes. The basic idea is simple to describe and frightening to experience: malware locks or encrypts your files and demands payment for the key. Understanding how an attack typically unfolds, and where prevention actually bites, turns ransomware from an abstract threat into a set of concrete habits that meaningfully reduce your risk, whether you're a home user or running a small business.",
        sections: [
            { h: "How a Ransomware Attack Typically Unfolds", p:
                "Most ransomware gets in through an ordinary door. A common path is a phishing email that tricks someone into running a malicious attachment or clicking to a site that drops the malware. From there, the software spreads across the machine and, in a business, across the network, encrypting documents, databases, and backups it can reach. Then it leaves a note demanding payment, often in cryptocurrency, in exchange for a decryption key. The whole point of understanding the sequence is that each stage is a place you can intervene, and most successful attacks exploited a preventable early step rather than some exotic, unblockable technique." },
            { h: "The Prevention That Actually Works", p:
                "Three habits account for most of the protection. First, keep your systems and software updated, because a lot of ransomware gets in through a known, already-patched hole, and automatic updates close that door. Second, maintain backups that are separate and ideally offline, so that even if files are encrypted, you can restore them without paying. A backup that's on the same network and always connected can get encrypted too, which is why separation matters. Third, limit what any single account and device can reach, so that if something does get compromised, the blast radius stays small rather than spreading to everything at once. These three, updates, offline backups, and limited access, are the backbone of ransomware defense." },
            { h: "If It Happens: The First Hours Matter", p:
                "If you do hit ransomware, the first moves matter a great deal. Isolate the affected machines from the network to stop the spread, but don't rush to pay, because paying doesn't guarantee a working key and funds further attacks. Identify the scope of what's been touched, lean on your backups to restore what you can, and report it to the right people, your IT, your insurer, and often the authorities, both for help and because some regions require it. And go through the lessons, which almost always trace back to an unpatched system, a missing or connected backup, or an overly permissive account. Treating an incident as a source of concrete fixes is what makes the next one less likely." },
        ],
        quote: "Ransomware is usually preventable. Updates close the door, offline backups remove the leverage, and limited access keeps the blast radius small.",
        faq: [
            { q: "Should I pay the ransom if I'm hit?", a:
                "Generally, no. Paying doesn't guarantee you'll get a working key, it encourages more attacks, and it may have legal implications. Your priority should be isolating the system and restoring from backups. Payment is a last resort, not a plan." },
            { q: "Why does a backup need to be offline or separate?", a:
                "Because ransomware often looks for and encrypts backups on the same network to destroy your recovery path. A backup that's disconnected, on separate infrastructure, or immutable is much harder for the attack to reach, which is what actually protects you." },
            { q: "Can a small business or a home user be a target?", a:
                "Yes. Ransomware is largely automated and opportunistic, so it doesn't aim only at big names. Any device with files and a network connection is a potential target, which is exactly why the basic habits, updates, backups, and limited access, matter for everyone." },
        ],
        outro:
            "Ransomware is a serious threat, but it's also one of the most preventable. Keep everything updated, maintain backups that are separate and offline, and limit how much any single compromised account or device can reach. If you're hit, isolate fast, don't rush to pay, and restore from your backups. A little ongoing discipline on those fronts is what turns a potentially catastrophic event into a manageable, recoverable incident.",
    },
    {
        category: CATEGORY,
        title: "Securing Your Home Wi-Fi Network",
        intro:
            "Your home network is the gateway for every device you own, and it's often secured with the weak defaults the router shipped with. The good news is that a focused, twenty-minute pass through your router settings will close the most common holes and make your network meaningfully safer. This is a practical checklist for the changes that matter most, ranked by how much they help, so you can spend your time on the things that actually reduce your risk.",
        sections: [
            { h: "Start With the Router Itself", p:
                "The router is the front door, so secure it first. Change the default administrator password, because the factory defaults are public and widely known, and make sure the router's own firmware is up to date, since vendors patch real vulnerabilities. If your router offers a guest network, enable it and put your less-trusted devices, and any visitors, on that separate network so they're isolated from your main one. These few steps harden the device that controls access to everything else in your home, and they're the foundation the rest of the security builds on." },
            { h: "Lock Down the Wireless Network", p:
                "Your Wi-Fi password and encryption matter a great deal. Use the strongest encryption your router supports, which today means WPA3 where available or WPA2 as a solid fallback, and avoid the older, broken options entirely. Set a long, unique Wi-Fi password, ideally one your password manager generates, because a weak network password is a very common way outsiders get in. And hide your network name only if you like, understanding it's a small step, not a real barrier, because the real protection is the strong password and the modern encryption, not the name being invisible." },
            { h: "Keep the Devices on the Network Healthy", p:
                "A secure router can still be let down by the devices behind it, so keep those in good shape too. Make sure every connected device, phones, laptops, smart devices, is updated, because an outdated, exposed device on your network is a potential entry point even if the Wi-Fi itself is locked down. Disable remote management and any services you don't use, and be picky about the smart devices you bring in, since some are notoriously hard to secure. A network is only as strong as its weakest connected device, so treating the whole set as part of the security picture, not just the router, is what keeps it together." },
        ],
        listTitle: "The Router Checklist, In Order",
        listType: "ol",
        listItems: [
            "Change the default router admin password.",
            "Update the router firmware to the latest version.",
            "Use WPA3 or WPA2 encryption with a long, unique Wi-Fi password.",
            "Enable a separate guest network for visitors and less-trusted devices.",
            "Turn off remote management and unused services.",
            "Keep every connected device updated.",
        ],
        faq: [
            { q: "Is hiding my network name worth it?", a:
                "A little, but don't count on it. Hiding the name stops only the most casual scanner; a determined person can still see the network. The real protection is a strong password and modern encryption, so treat hiding as a minor extra, not a security measure." },
            { q: "How often should I update my router firmware?", a:
                "Whenever the vendor releases an update, and checking a couple of times a year is a reasonable habit. Updates often patch real vulnerabilities, so staying current is one of the cheapest forms of protection you have." },
            { q: "My smart devices can't be updated much. What do I do?", a:
                "Isolate them as much as you can, ideally on a guest or separate VLAN, and don't expose them to the internet directly if you can avoid it. You can't fully fix a weak device, but you can limit what it can reach, which keeps a compromise from spreading to your main network." },
        ],
        outro:
            "Securing your home Wi-Fi is mostly a focused pass through your router: change the default login, update the firmware, use strong modern encryption with a long password, and separate out guests and less-trusted devices. Then keep the devices behind it updated and limit their reach. Twenty minutes of deliberate setup gives you a network that is far harder to break into, and a habit of keeping it current keeps that protection in place over time.",
    },
    {
        category: CATEGORY,
        title: "Understanding SSL/TLS and HTTPS",
        intro:
            "The little lock icon and the HTTPS in your browser's address bar represent one of the most important pieces of security you interact with every day, and it's worth actually understanding what it does and, just as importantly, what it doesn't. SSL and its successor, TLS, are the protocols that encrypt the connection between your browser and a website, and HTTPS is the web that uses them. Here's a clear, practical explanation of how they work and what you should, and shouldn't, assume from them.",
        sections: [
            { h: "What SSL/TLS Actually Does", p:
                "When your browser connects to a site over HTTPS, it first performs a handshake with the server to establish an encrypted channel. Part of that handshake is verifying the site's identity using a digital certificate, a credential that confirms you're talking to the real site and not an imposter. Once the handshake succeeds, all the data that flows between you and the site is encrypted, so someone watching the connection can see that you're talking to a site, but not what you're sending or receiving. In short, TLS gives you both encryption, so the content is private, and authentication, so you're confident about who you're talking to." },
            { h: "What the Lock and HTTPS Do Tell You", p:
                "Seeing HTTPS and a valid certificate means the connection is encrypted and the site's identity was verified by a trusted authority, which protects you from eavesdropping and from a casual imposter swapping in a fake site. It's a real and important guarantee, and the absence of HTTPS is a genuine warning sign, especially on any page where you enter information. But it's worth being precise about the strength of the signal: a valid lock confirms the transport is secure and the site is who the certificate says it is, which is more than people often assume but less than the absolute safety some imagine." },
            { h: "What It Doesn't Guarantee", p:
                "A common misconception is that HTTPS means the site is safe or legitimate in every sense, and that's not true. The lock protects the connection, not your judgment. A well-run phishing site can have a valid certificate, so the encryption is real while the destination is still a scam. HTTPS also doesn't protect you once you're on the page from what the page itself does, like a malicious script or a form that's designed to trick you. So treat the lock as a necessary baseline, a sign the transport is secure, while still applying the same caution about the site's trustworthiness that you would anywhere else." },
        ],
        quote: "HTTPS encrypts the road between you and the site and confirms the site's identity. It does not vouch for the site's intentions.",
        faq: [
            { q: "Does a padlock mean the website is safe to use?", a:
                "It means the connection is encrypted and the site's identity was verified, which is important, but it doesn't guarantee the site is trustworthy or that you won't be scammed on the page. Use the lock as a baseline, not a seal of approval." },
            { q: "What's the difference between SSL and TLS?", a:
                "SSL was the original protocol and TLS is its updated, more secure successor. Today's connections use TLS, and 'SSL' is kept in the name for familiarity. In practice, you're almost always dealing with TLS when you see a secure connection." },
            { q: "Why does my browser warn me about a site without HTTPS?", a:
                "Because without HTTPS, anything you send, including passwords and personal data, travels unencrypted and can be read or altered in transit. The warning is telling you the connection isn't protected, so you should be cautious, especially before entering any sensitive information." },
        ],
        outro:
            "SSL and TLS are the quiet workhorses that keep your web traffic encrypted and confirm the site you're reaching is who it claims to be, and HTTPS is the web that runs on them. Understand what they give you, a secure, authenticated connection, and what they don't, a guarantee of the site's good intentions, and you'll use the padlock the way it was meant to be used: as a necessary baseline for trust, alongside your own judgment.",
    },
    {
        category: CATEGORY,
        title: "How to Create and Manage Secure Passwords",
        intro:
            "Most password advice boils down to a few principles that, applied consistently, make a dramatic difference: make them long, make them unique, and don't rely on your memory to hold dozens of them. The tricky part isn't the principles, it's actually managing a large set of strong, different passwords without falling back on the weak, reused habits that cause most breaches. This guide covers how to create passwords that are genuinely strong and the system that keeps them organized so you never have to memorize a wall of them.",
        sections: [
            { h: "What Makes a Password Actually Strong", p:
                "Strength comes from length and randomness, not from a clever combination of a word and a number. A long string of random characters, or a passcode built from several random words, is dramatically harder to guess or brute-force than a short, patterned one, because the number of possibilities grows enormously with each added character. Uniqueness matters just as much as length: the real danger is reuse, because a single compromised site then hands an attacker the key to every other place you used that password. So the goal is long, random, and different per account, a combination that's easy to generate but nearly impossible to attack." },
            { h: "Use a Passphrase You Can Remember for the Things That Matter Most", p:
                "For the one or two secrets you have to type by hand, like your password manager's master password, a passphrase of several random words is a practical sweet spot. It's long enough to be strong, memorable enough that you won't write it down, and random enough that it resists guessing. Pick words that are unrelated, like a mix that has no obvious theme, and you get something that's both high-entropy and human. Reserve this approach for the small number of high-value secrets you'll actually recall under pressure, and let a tool handle the long, random passwords for everything else." },
            { h: "Manage Them Without Losing Your Mind", p:
                "You can't remember fifty unique random passwords, and you shouldn't try. A password manager is the answer, generating and storing a strong, unique password for every account so your memory only holds the one master secret. Beyond that, a few habits keep the system safe: review your most important accounts periodically, enable two-factor authentication on them, and be ready to rotate a password if you learn it was exposed in a breach. The management layer is what turns the ideal of long, unique passwords from a good idea into something you can actually live with every day." },
        ],
        listTitle: "The System, Summarized",
        listType: "ul",
        listItems: [
            "Long and random beats short and clever.",
            "Unique per account, especially for high-value ones.",
            "A memorable passphrase for your master password and a few key secrets.",
            "A password manager for everything else.",
            "Two-factor authentication on the accounts that matter most.",
        ],
        faq: [
            { q: "How often should I change my passwords?", a:
                "You don't need to change strong, unique passwords on a fixed schedule. Change one if you have reason to believe it was compromised, or for a high-value account as part of good hygiene, but constant rotation of random passwords mostly just creates weaker ones and more friction." },
            { q: "Are passphrases really as strong as random strings?", a:
                "A passphrase of several random words can be very strong, especially because it's long, and it's far more memorable. For a master password you must recall, a good passphrase is an excellent choice. For accounts a manager handles, a fully random string is even stronger and you don't have to remember it anyway." },
            { q: "What's the worst habit to break first?", a:
                "Reusing the same password across multiple sites, because it turns one breach into many. Giving your important accounts unique passwords first has the biggest payoff, and a password manager makes the rest straightforward." },
        ],
        outro:
            "Secure passwords come from three principles, long, unique, and managed, applied with a tool so you don't have to hold them all in your head. Use a memorable passphrase for the few secrets you type by hand, let a password manager generate and store long random ones for everything else, and add two-factor authentication to the accounts that matter. It's a small system that removes the two biggest causes of account compromise and makes strong security something you can actually sustain.",
    },
    {
        category: CATEGORY,
        title: "The OWASP Top 10 Web Application Risks Explained",
        intro:
            "The OWASP Top 10 is the most widely used list of the most critical web application security risks, and it's a great shared vocabulary for any team that builds software. It's not a rulebook you check off, but a map of where web apps most often get hurt, and understanding the categories helps you think about security from the start instead of discovering it in a breach. This post walks through the list in plain language, focusing on what each risk actually is and the instinct that prevents it.",
        sections: [
            { h: "Broken Access and Injection, the Big Two", p:
                "Two risks dominate real-world incidents. Broken access control is when a user can reach data or functions they shouldn't, like viewing another user's account or calling an admin endpoint, because the app doesn't consistently check who is allowed to do what. The fix is to verify authorization on every request, assuming the user is an attacker until proven otherwise. Injection, historically led by SQL injection, is when untrusted input is mixed directly into a command, letting an attacker run queries they crafted. The defense is to never build commands by concatenating user input, and instead use parameterized queries and input validation, so the data stays data and never becomes instructions." },
            { h: "The Risks That Come From Trusting Input and Config", p:
                "A large share of the list is about not trusting things you didn't create. Security misconfiguration means shipping with default, verbose, or overly permissive settings, like debug pages or open storage, that hand attackers a foothold. Sensitive data exposure happens when you send or store personal information without encrypting it or without a reason to. And flaws in how you handle identity, like weak authentication or session management, let attackers impersonate users. The unifying instinct is to treat configuration, input, and data as untrusted by default, and to apply the principle of least privilege, giving each piece of the app only the access it genuinely needs." },
            { h: "The Rest of the List, and How to Use It", p:
                "The remaining entries cover things like using components with known vulnerabilities, which you address by keeping your dependencies updated and watching for advisories, and flaws in how you log and monitor, which you fix by logging security-relevant events so you can detect and respond to an attack. The practical way to use the Top 10 is not to memorize every item but to let it shape your review: before you ship, ask whether you've handled authorization, injection, configuration, sensitive data, and your dependencies. It's a checklist of instincts rather than a certification, and it catches the most common, most damaging mistakes before they become incidents." },
        ],
        quote: "The OWASP Top 10 is a map of where web apps get hurt. Use it as a set of questions to ask before you ship, not a badge to display after you do.",
        faq: [
            { q: "Is the OWASP Top 10 a complete security standard?", a:
                "No. It's a high-level list of the most common and critical risks, meant to focus your attention, not to replace a full security review. It's a starting vocabulary, not a certification or a guarantee that covering it makes you secure." },
            { q: "How often does the list change?", a:
                "OWASP updates it periodically as the threat landscape shifts, so specific entries move up and down or are reworded over time. The core themes, like access control, injection, and misconfiguration, have been central for years, even as the exact items evolve." },
            { q: "How should a small team actually use it?", a:
                "Treat it as a pre-launch review: walk the categories and ask whether you've handled authorization, injection, configuration, sensitive data, and dependency updates. It turns security from an abstract worry into a concrete, repeatable set of questions you can answer before you release." },
        ],
        outro:
            "The OWASP Top 10 is best understood as a shared map of the most dangerous, most common web application risks, and the strongest uses of it are as a pre-launch review and a common vocabulary for your team. Focus on the core instincts, verify authorization on every request, never trust user input, keep configuration tight, protect sensitive data, and update your dependencies. You won't become fully secure by checking a list, but you will stop making the most damaging mistakes, which is where the real value lies.",
    },
];
