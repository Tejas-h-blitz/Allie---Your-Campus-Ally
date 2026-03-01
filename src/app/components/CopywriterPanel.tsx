"use client";
import { useState, useMemo } from "react";
import SkeletonLoader from "./SkeletonLoader";

// ─── Types ────────────────────────────────────────────────────────────────────
type TabId = "instagram" | "email" | "discord";

const TABS: TabId[] = ["instagram", "email", "discord"];
const TAB_LABELS: Record<TabId, string> = { instagram: "Instagram", email: "Email", discord: "Discord" };
const TAB_ICONS: Record<TabId, string> = { instagram: "📸", email: "📧", discord: "💬" };

interface CopywriterPanelProps {
    isLoading: boolean;
    hasContent: boolean;
    prompt: string;
    localInference: boolean;
    generationSeed: number;
}

// ─── Event-type detector ──────────────────────────────────────────────────────
type EventType = "food" | "sports" | "music" | "tech" | "chess" | "art" | "party" | "workshop" | "cultural" | "general";

function detectEventType(prompt: string): EventType {
    const p = prompt.toLowerCase();
    if (p.match(/pizza|food|eat|dinner|lunch|feast|bbq|chicken|burger|snack|meal/)) return "food";
    if (p.match(/tug|war|rope|sport|cricket|football|soccer|basket|run|marathon|athletic|gym/)) return "sports";
    if (p.match(/music|concert|jazz|band|song|guitar|dance|festival|perform|sing|dj|rap/)) return "music";
    if (p.match(/hack|code|tech|program|computer|amd|ai|software|build|develop|debug/)) return "tech";
    if (p.match(/chess|strategy|board|game|tourney|quiz|puzzle/)) return "chess";
    if (p.match(/art|paint|design|creative|exhibition|gallery|sketch|draw|craft|pottery/)) return "art";
    if (p.match(/party|celebrat|welcome|birthday|theme|social|mixer|farewell/)) return "party";
    if (p.match(/workshop|seminar|talk|lecture|class|study|learn|training|boot/)) return "workshop";
    if (p.match(/cultural|tradition|heritage|folk|fest|carnival|mela|garba|navratri/)) return "cultural";
    return "general";
}

function pickEmoji(prompt: string): string {
    const type = detectEventType(prompt);
    const emojiMap: Record<EventType, string> = {
        food: "🍽️", sports: "🏆", music: "🎵", tech: "💻",
        chess: "♟️", art: "🎨", party: "🎉", workshop: "📚",
        cultural: "🌺", general: "⭐",
    };
    return emojiMap[type];
}

// ─── Rich, varied copy pools ──────────────────────────────────────────────────
type CopyPool = {
    instagram: { casual: string[]; professional: string[] };
    email: { casual: string[]; professional: string[] };
    discord: { casual: string[]; professional: string[] };
};

function buildCopyPool(prompt: string): CopyPool {
    const type = detectEventType(prompt);
    const emoji = pickEmoji(prompt);
    const title = prompt.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    const tags = prompt.split(/\s+/).filter(w => w.length > 2).map(w => `#${w.replace(/\W/g, "")}`).slice(0, 3).join(" ");
    const fullTags = `${tags} #CampusLife #StudentEvents`;

    const pools: Record<EventType, CopyPool> = {
        food: {
            instagram: {
                casual: [
                    `${emoji} FREE FOOD ALERT at campus — and yes, it's actually good 👀\n\n${title} is happening and you're sleeping on it bestie. Come hungry, leave happy 🍴\n\n📍 Student Union · This Weekend\n${fullTags}`,
                    `👇 Stop scrolling. Free food. Real ones know.\n\n${title} is about to go CRAZY. Bring your roommate, your crush, your entire floor — the more the merrier 🔥\n\n📍 Campus Grounds · Saturday\n${fullTags}`,
                    `okay but why is nobody talking about ${title}??? 😤\n\nFree eats, good vibes, and zero formal dress code. Just show up and eat fr 🍕\n\n📍 Main Quad · This Weekend\n${fullTags}`,
                ],
                professional: [
                    `We're delighted to present: ${title} 🍽️\n\nA wonderful occasion for the campus community to come together over great food and great company.\n\n📅 This Weekend · Campus Grounds\n\n${fullTags}`,
                    `Join us for ${title} — a curated campus dining experience open to all students.\n\nNetwork, unwind, and enjoy complimentary refreshments in a relaxed setting.\n\n📍 Student Union Hall\n${fullTags}`,
                    `${emoji} ${title}: A Community Dining Initiative\n\nWe warmly invite all students to join us for an afternoon of food and fellowship.\n\n📅 Saturday · Student Union\n${fullTags}`,
                ],
            },
            email: {
                casual: [
                    `Subject: 🍕 There's free food and you're not here yet??\n\nHey [Name]!\n\nOkay so ${title} is literally happening RIGHT NOW (well, this weekend) and we'd feel bad if you missed out.\n\nNo agenda. No dress code. Just good food and even better vibes.\n\n📍 Campus Grounds · Saturday\n\nCome thru!\nYour Campus Events Squad`,
                    `Subject: ${title} = free food = you should come 🍴\n\nHi [Name]!\n\nShort email, big news: ${title} is this weekend. Free food. Open to everyone. No questions asked.\n\nJust show up, eat, and have a great time. Simple as that.\n\nSee you there 👋\nEvents Team`,
                    `Subject: Psst — we saved you a plate 🤫\n\nHi [Name],\n\n${title} is happening and we'd love to see you there.\n\nExpect: delicious eats, friendly faces, and that one person who goes back 4 times (we don't judge).\n\n📍 Student Union · This Weekend\n\nBring a friend!\nThe Events Crew`,
                ],
                professional: [
                    `Subject: Invitation to ${title}\n\nDear [Student Name],\n\nWe cordially invite you to ${title}, a campus-wide culinary event organized by the Student Events Council.\n\nDate: This Weekend\nTime: 12:00 PM – 3:00 PM\nVenue: Student Union Main Hall\n\nKindly RSVP by replying to this email.\n\nWarm regards,\nStudent Events Council`,
                    `Subject: ${title} — Campus Community Gathering\n\nDear [Student Name],\n\nThe Student Events Committee is pleased to announce ${title}.\n\nThis event aims to bring together students across all departments in a welcoming, casual environment.\n\nDate: This Saturday\nVenue: Campus Grounds\n\nAll are Welcome.\n\nBest regards,\nEvents Committee`,
                ],
            },
            discord: {
                casual: [
                    `@everyone 🍕 **${title.toUpperCase()} — HAPPENING THIS WEEKEND**\n\nFree food. No cap. Come eat. Bring people. That's the whole message.\n\nReact with 🍕 if you're coming so we know how many to order!`,
                    `@everyone 📢 **FREE FOOD ALERT** 📢\n\n**${title}** is this weekend and it is NOT to be missed. Drop a 🙋 if you're pulling up`,
                    `@here 🔔 Last reminder: **${title}** is almost here!\n\nEveryone in this server is invited. Come for the food, stay for the vibe. React with ✅ to confirm!`,
                ],
                professional: [
                    `@everyone 📢 **Announcement: ${title}**\n\nThe Student Events Council is organizing **${title}** this weekend at the Campus Grounds.\n\nAll students are welcome. Please react ✅ to confirm attendance so we can plan accordingly.`,
                    `@everyone 🍽️ **${title} — Community Event**\n\nJoin us for a delightful campus food event this Saturday. Open to all. Complimentary refreshments provided.\n\nPlease react 🍴 to confirm your attendance.`,
                ],
            },
        },

        sports: {
            instagram: {
                casual: [
                    `${emoji} ${title.toUpperCase()}?! We're literally NOT ready 😤💪\n\nWho's coming to throw down this weekend?? This is the one event you can NOT skip bro.\n\n📍 Sports Ground · Saturday\n${fullTags}`,
                    `POV: You're watching ${title} unfold in real time 👀🔥\n\nPure adrenaline. Pure campus energy. Pure chaos (the good kind). Come witness greatness.\n\n📍 Campus Sports Complex\n${fullTags}`,
                    `The ${title} hype is REAL and there's no going back 💯\n\nTag your bestie who thinks they can outrun everyone. Saturday. Sports Ground. Let's go.\n\n${fullTags}`,
                ],
                professional: [
                    `We're excited to announce ${title} — an inter-department sports competition open to all students 🏆\n\nSign up, compete, and represent your department with pride!\n\n📅 This Saturday · Campus Sports Complex\n${fullTags}`,
                    `${emoji} ${title}: Where champions are made.\n\nJoin us for an exhilarating athletic showcase. All skill levels welcome, all departments invited.\n\n📍 Sports Complex · Saturday\n${fullTags}`,
                ],
            },
            email: {
                casual: [
                    `Subject: 🏆 ${title} — Are you IN or are you out??\n\nHey [Name]!\n\n${title} is HAPPENING and we need you there. Cheer, compete, or just enjoy the show — all options are valid.\n\n📍 Sports Complex · This Saturday\n\nLet's gooo!\nCampus Sports Club`,
                    `Subject: Your legs work. Come to ${title} 🏃‍♂️\n\nHi [Name]!\n\nJust a friendly reminder that ${title} is this weekend and staying home is NOT an option. Come support your fellow students!\n\nSee you there,\nEvents Team`,
                    `Subject: ${title} — This Saturday, No Excuses! 🎽\n\nHi [Name],\n\nWhether you're competing or cheering from the sidelines, ${title} is the place to be this weekend.\n\n📍 Campus Sports Ground · 10 AM onwards\n\nCheer loud!\nSports Committee`,
                ],
                professional: [
                    `Subject: ${title} — Official Invitation\n\nDear [Student Name],\n\nWe are pleased to invite you to ${title}, organized by the Campus Sports Committee.\n\nEvent Details:\nDate: This Saturday\nTime: 10:00 AM\nVenue: Campus Sports Complex\n\nParticipation is open to all students. Teams may register via the college portal.\n\nWarm regards,\nSports Committee`,
                    `Subject: Invitation to Participate — ${title}\n\nDear [Student Name],\n\nThe Sports Department cordially invites you to ${title}, a celebration of athletic talent and team spirit.\n\nAll departments are encouraged to participate.\n\nDate: This Saturday · 10:00 AM onwards\n\nBest regards,\nSports Committee`,
                ],
            },
            discord: {
                casual: [
                    `@everyone ⚡ **${title.toUpperCase()} — THIS SATURDAY** ⚡\n\nWho's ready to absolutely demolish the competition?? 💪\n\nReact with 🏆 if you're competing and 👐 if you're coming to cheer!`,
                    `@everyone 🔥 **${title}** is almost here and chat is NOT prepared\n\nTag your team. Drop your predictions. Saturday. Sports Ground. NO EXCUSES.\n\n🏅 React to claim your spot`,
                    `@here 📢 FINAL REMINDER: **${title}** kicks off THIS SATURDAY at 10 AM!\n\nWarm up. Hydrate. Come ready. React ✅ if you're showing up!`,
                ],
                professional: [
                    `@everyone 🏆 **Official Announcement: ${title}**\n\nThe Sports Committee is pleased to announce ${title} this Saturday at Campus Sports Complex.\n\nAll students are encouraged to participate or attend as spectators. React ✅ to confirm attendance.`,
                ],
            },
        },

        music: {
            instagram: {
                casual: [
                    `${emoji} ${title.toUpperCase()} is the collab this campus didn't know it needed 🎶✨\n\nLights, sound, vibes — it's all there. See you in the front row bestie.\n\n📍 Amphitheatre · Saturday Night\n${fullTags}`,
                    `okay ${title} is about to be THE campus moment of the semester and I will not be taking questions 🎸🔥\n\nTag who you're going with. It's gonna be unreal.\n\n📍 Campus Main Stage\n${fullTags}`,
                    `Lights low. Music loud. Vibes immaculate. 🎵\n\n${title} is happening and if you're not there, you'll see it on everyone's stories anyway. Just come.\n\n📍 Open Air Stage · Saturday\n${fullTags}`,
                ],
                professional: [
                    `We are thrilled to present: ${title} 🎵\n\nAn evening of live music, artistry, and campus community — all in one beautiful night.\n\n📍 Campus Amphitheatre · Saturday\n${fullTags}`,
                    `${emoji} ${title}: A Musical Evening by Students, For Students.\n\nJoin us for an unforgettable night of performances from the most talented musicians on campus.\n\n📅 This Saturday · 6 PM\n${fullTags}`,
                ],
            },
            email: {
                casual: [
                    `Subject: 🎵 ${title} — don't say we didn't warn you\n\nHey [Name]!\n\nSo ${title} is happening THIS Saturday and you absolutely cannot miss it. Live music. Great energy. Your whole friend group, probably.\n\n📍 Campus Amphitheatre · 6 PM\n\nSee you there! 🎶\nCampus Music Club`,
                    `Subject: Serenade your Saturday with ${title} 🎸\n\nHi [Name]!\n\nA night of live performances curated just for the campus community. Whether you're a music head or just love good vibes, ${title} is calling your name.\n\nSee you Saturday!\nMusic Club`,
                ],
                professional: [
                    `Subject: Formal Invitation — ${title}\n\nDear [Student Name],\n\nThe Campus Music Society cordially invites you to ${title}.\n\nThis event will feature live performances from student artists and musicians across all genres.\n\nDate: Saturday\nTime: 6:00 PM\nVenue: Campus Amphitheatre\n\nWarm regards,\nMusic Society`,
                    `Subject: ${title} — A Musical Evening\n\nDear [Student Name],\n\nWe are pleased to welcome you to ${title}, an evening dedicated to musical excellence on campus.\n\nEntry: Free | Venue: Amphitheatre | Time: 6 PM Saturday\n\nKindly RSVP to ensure reserved seating.\n\nWith regards,\nCultural Committee`,
                ],
            },
            discord: {
                casual: [
                    `@everyone 🎵 **${title}** IS ALMOST HERE AND I'M NOT OKAY\n\nTHIS SATURDAY. LIVE MUSIC. CAMPUS AMPHI. YOU NEED TO BE THERE.\n\nReact with 🎶 if you're coming — let's see the hype!`,
                    `@everyone 🎸 **${title} — Saturday 6PM** 🎸\n\nLive performances from campus artists. Free entry. Absolute vibes only.\n\nDrop a 🙌 if you're coming! Tag your crew!`,
                    `@here 🔔 **${title}** countdown is ON!\n\n48 hours until the most musical night this campus has seen. Bring your friends. Bring your energy. React ✅ to confirm!`,
                ],
                professional: [
                    `@everyone 🎵 **Announcement: ${title}**\n\nThe Campus Music Society presents ${title} — a live musical evening this Saturday at 6PM in the Amphitheatre.\n\nAll students are welcome. React ✅ to confirm attendance.`,
                ],
            },
        },

        tech: {
            instagram: {
                casual: [
                    `${emoji} ${title.toUpperCase()} — 24 hours, zero sleep, infinite possibilities 🔥\n\nIf you're a builder, a dreamer, or just someone who likes free snacks at 3am — this is your event.\n\n📍 Tech Hub · Starting Friday Night\n${fullTags}`,
                    `bro ${title} dropped and nobody's talking about it?? 💻\n\nHack. Build. Ship. Win. Or just show up and absorb the energy — we truly don't mind.\n\n📍 Computer Lab Block · This Weekend\n${fullTags}`,
                    `The grind hits different at ${title} 👾⚡\n\nCode with your team. Meet mentors. Build something wild. This is what you've been prepping for.\n\n📍 Innovation Hub · Friday Night\n${fullTags}`,
                ],
                professional: [
                    `Announcing: ${title} 💻\n\nA platform for innovation, collaboration, and building the future — right here on our campus.\n\nAll domains welcome: AI, Web, IoT, Design & more.\n\n📅 This Weekend · Tech Hub\n${fullTags}`,
                    `${emoji} ${title}: Where Ideas Become Reality.\n\nWe invite ambitious student builders to compete, collaborate and create at our campus-wide event.\n\n📍 Innovation Centre · This Weekend\n${fullTags}`,
                ],
            },
            email: {
                casual: [
                    `Subject: 💻 ${title} — wake up, time to build\n\nHey [Name]!\n\n${title} is happening and your future self is already thanking you for going. 24 hours of coding, mentorship, and (most importantly) free snacks.\n\nRegister now. Teams of 2–4.\n\nLet's build,\nTech Club`,
                    `Subject: Your big break might be at ${title} 🚀\n\nHi [Name]!\n\nGreat projects don't build themselves. ${title} is your chance to work on something real, meet industry people, and maybe even win some cool prizes.\n\nSign up today!\nHackathon Team`,
                    `Subject: ${title} — the grind is voluntary, the fun is not 🖥️\n\nHey [Name]!\n\nThis weekend is ${title} and you're not going to want to miss it. Whether you're a coder, designer, or ideas person — there's a team for you.\n\nSee you at the Tech Hub!\nInnovation Club`,
                ],
                professional: [
                    `Subject: Registration Open — ${title}\n\nDear [Student Name],\n\nWe are excited to announce ${title}, a campus-wide innovation challenge open to all students.\n\nParticipants will build tech solutions around real-world problems and present to a panel of industry judges.\n\nDates: This Weekend\nVenue: Technology Hub\nTeam Size: 2–4 students\n\nRegister via the college portal before Friday.\n\nBest regards,\nTech Club`,
                    `Subject: Invitation — ${title}\n\nDear [Student Name],\n\nThe Technology Society cordially invites you to participate in ${title}.\n\nThis is an excellent opportunity to apply your technical skills in a competitive, collaborative environment.\n\nEvent Duration: 24 Hours\nVenue: Innovation Centre\nRegistration Deadline: Friday\n\nWarm regards,\nTechnology Society`,
                ],
            },
            discord: {
                casual: [
                    `@everyone ⚡ **${title.toUpperCase()}** ⚡\n\n24 hours. Free food. Real prizes. Legendary builds.\n\nForm your team NOW. React with 💻 if you're competing, 🎯 if you're mentoring!`,
                    `@everyone 🖥️ **${title} — registration is OPEN!**\n\nThis is it. The big one. Teams of 2–4. All tracks open.\n\nDrop your team name below and let's GET it 🔥`,
                    `@here 🔔 **${title} — 48 hours to register!**\n\nIf you're reading this and don't have a team yet — the #team-formation channel is waiting for you.\n\nReact ✅ to confirm you're coming!`,
                ],
                professional: [
                    `@everyone 💻 **Announcement: ${title}**\n\nRegistration is now open for ${title}, organized by the Technology Society.\n\nAll students are welcome to participate. Teams of 2–4. Please register via the college portal by Friday.\n\nReact ✅ to indicate participation interest.`,
                ],
            },
        },

        chess: {
            instagram: {
                casual: [
                    `${emoji} ${title.toUpperCase()} — where big brain energy meets campus drama 😤♟️\n\nThink you can handle the pressure? Clock's ticking. Come prove it.\n\n📍 Common Room · Saturday\n${fullTags}`,
                    `No cap ${title} is about to expose who's ACTUALLY been studying Sun Tzu 💀\n\nGM vs. your overconfident roommate. Main character energy only.\n\n📍 Campus Common Room\n${fullTags}`,
                    `Plot twist: the quietest person in your class is about to wreck everyone at ${title} ♟️\n\nCome watch. Come compete. Come humble yourself.\n\n📍 Reading Hall · Saturday\n${fullTags}`,
                ],
                professional: [
                    `Announcing: ${title} — A Battle of Minds ♟️\n\nTest your strategic thinking against the best players on campus. All skill levels welcome.\n\n📍 Student Common Room · Saturday\n${fullTags}`,
                    `${emoji} ${title}: Compete. Strategize. Conquer.\n\nJoin us for a structured chess showdown open to everyone — from beginners to seasoned players.\n\n📅 Saturday · 10 AM\n${fullTags}`,
                ],
            },
            email: {
                casual: [
                    `Subject: ♟️ ${title} — may the best mind win\n\nHey [Name]!\n\n${title} is this weekend and we're looking for our campus chess champion. Think that's you? Prove it.\n\n📍 Student Common Room · Saturday 10 AM\n\nGood luck!\nChess Club`,
                    `Subject: ${title} — no mercy, just moves ♟️\n\nHi [Name]!\n\nEvery great player starts somewhere. ${title} is your shot to show campus what you're made of. Open to all skill levels!\n\nSee you at the board,\nChess Club`,
                ],
                professional: [
                    `Subject: ${title} — Registration Open\n\nDear [Student Name],\n\nThe Chess Club is pleased to announce ${title}, an inter-college chess competition.\n\nDate: This Saturday\nTime: 10:00 AM\nVenue: Student Common Room\nFormat: Swiss system, 5 rounds\n\nKindly register by Friday evening.\n\nWarm regards,\nChess Club`,
                ],
            },
            discord: {
                casual: [
                    `@everyone ♟️ **${title}** — SATURDAY 10 AM\n\nWho thinks they're the best chess player on campus? This is your moment to prove it.\n\nReact with ♟️ if you're competing! Brackets will be posted Friday.`,
                    `@everyone 🧠 **${title} bracket is filling up FAST!**\n\nOpen seats remaining. Claim yours now. React ✅ to register and we'll DM you the details.`,
                ],
                professional: [
                    `@everyone ♟️ **Official Announcement: ${title}**\n\nThe Chess Club will be hosting ${title} this Saturday at 10 AM in the Student Common Room.\n\nAll skill levels welcome. Please react ✅ to register. Format: Swiss system, 5 rounds.`,
                ],
            },
        },

        art: {
            instagram: {
                casual: [
                    `${emoji} okay ${title} is genuinely the most beautiful thing coming to campus this semester 🫶\n\nCome immerse yourself. Come feel things. Come stare at art for 20 minutes without knowing why — we support it.\n\n📍 Art Gallery · This Weekend\n${fullTags}`,
                    `Art is just feelings you can hang on a wall and ${title} is FULL of them 🎨✨\n\nCome support your campus creatives. They did the thing. Come see the thing.\n\n📍 Campus Gallery · Saturday\n${fullTags}`,
                    `no filter needed at ${title} because the art does all the work 🖌️🔥\n\nFree entry. Open exhibition. Absolute eye candy.\n\n📍 Exhibition Hall · Saturday\n${fullTags}`,
                ],
                professional: [
                    `We are proud to present: ${title} 🎨\n\nA curated showcase of student artwork, design, and creative expression — open to all.\n\n📍 Campus Art Gallery · This Weekend\n${fullTags}`,
                    `${emoji} ${title}: Creativity Unleashed.\n\nJoin us for a vibrant exhibition celebrating the artistic talent of our campus community.\n\n📅 Saturday · Art Gallery\n${fullTags}`,
                ],
            },
            email: {
                casual: [
                    `Subject: 🎨 ${title} — come see what your classmates made!\n\nHey [Name]!\n\n${title} is opening this weekend and it is genuinely stunning. Free entry. All are welcome. Just come ready to be impressed.\n\nSee you there!\nArt Club`,
                    `Subject: ${title} — your feed is about to thank you 📸\n\nHi [Name]!\n\nFull of beautiful artwork. Great lighting. Excellent Instagram opportunities.\n\n${title} is this weekend. Don't miss it.\n\nSee you,\nCreative Society`,
                ],
                professional: [
                    `Subject: Invitation to ${title}\n\nDear [Student Name],\n\nThe Fine Arts Society cordially invites you to ${title}, an open exhibition featuring works by student artists.\n\nDate: This Weekend\nTiming: 10 AM – 6 PM\nVenue: Campus Art Gallery\n\nEntry: Free\n\nWarm regards,\nFine Arts Society`,
                ],
            },
            discord: {
                casual: [
                    `@everyone 🎨 **${title}** — OPEN THIS WEEKEND!\n\nYour campus artists worked hard and it SHOWS. Come see the exhibition. Bring your friends. React 🖼️ if you're coming!`,
                    `@everyone ✨ **${title} opens Saturday!**\n\nFree entry. Beautiful art. Proud artists. Come support. React 💙 to let them know you're coming!`,
                ],
                professional: [
                    `@everyone 🎨 **Announcement: ${title}**\n\nThe Fine Arts Society presents ${title}, open this weekend at the Campus Art Gallery.\n\nAll students, faculty, and visitors are welcome. Entry is free. React ✅ to indicate attendance.`,
                ],
            },
        },

        party: {
            instagram: {
                casual: [
                    `${emoji} ${title.toUpperCase()}?! Oh we are SO doing this 🙌🥳\n\nTheme is set, music is ready, snacks are ordered — all we need is YOU. This Saturday.\n\n📍 Student Union · 7 PM\n${fullTags}`,
                    `grab your squad and GET HERE 🎊 ${title} is not a drill\n\nWe've been waiting for an excuse to party and this is it. Don't be the person who stayed home.\n\n📍 Main Hall · Saturday Night\n${fullTags}`,
                    `2 days until ${title} and I literally cannot contain myself 😭🥳\n\nCome dressed in the theme, come as you are, just COME.\n\n📍 Campus Main Hall · Saturday\n${fullTags}`,
                ],
                professional: [
                    `Cordially inviting you to: ${title} 🎉\n\nAn evening of celebration, community, and great memories — organized by the Student Events Council.\n\n📍 Main Hall · Saturday, 7 PM\n${fullTags}`,
                    `${emoji} ${title}: A Campus Celebration.\n\nJoin your fellow students for an evening of festivities, refreshments, and good company.\n\n📅 Saturday · Student Union\n${fullTags}`,
                ],
            },
            email: {
                casual: [
                    `Subject: 🎉 ${title} — we're going ALL out this Saturday\n\nHey [Name]!\n\nOkay so ${title} is THIS SATURDAY and we genuinely need you there. Think good music, good food, and the kind of night you tell people about.\n\nDoors open at 7 PM!\nEvents Team`,
                    `Subject: Your Saturday plans just changed 😏🎊\n\nHi [Name]!\n\n${title} > whatever you were going to do instead. Trust us.\n\nSaturday. 7 PM. Main Hall. Dress code: have fun.\n\nSee you there!\nCampus Events`,
                    `Subject: ${title} is happening and your presence is mandatory 🎈\n\nHey [Name]!\n\nNot optional. Not a suggestion. Please come to ${title} this Saturday and have the time of your life.\n\n📍 Main Hall · 7 PM\n\nWith love,\nEvents Team`,
                ],
                professional: [
                    `Subject: Invitation to ${title}\n\nDear [Student Name],\n\nThe Student Events Council is pleased to invite you to ${title}, a campus celebration event.\n\nDate: This Saturday\nTime: 7:00 PM\nVenue: Student Union Main Hall\n\nKindly RSVP by Friday.\n\nWith warm regards,\nStudent Events Council`,
                ],
            },
            discord: {
                casual: [
                    `@everyone 🎉 **${title.toUpperCase()} — THIS SATURDAY 7PM** 🎉\n\nChats → main hall counts as attendance points. React 🥳 if you're coming, and tag who you're bringing!`,
                    `@everyone 🔥 **${title}** is 2 days away and the hype is real\n\nDress code: vibes only. Drop a 🎊 to confirm you're coming!`,
                    `@here 📢 **LAST CALL for ${title}!**\n\nSaturday. 7 PM. Main Hall. React ✅ so we know to save you a spot!`,
                ],
                professional: [
                    `@everyone 🎉 **Announcement: ${title}**\n\nThe Student Events Council cordially invites all students to ${title}, this Saturday at 7 PM in the Student Union.\n\nPlease react ✅ to confirm attendance. Refreshments will be provided.`,
                ],
            },
        },

        workshop: {
            instagram: {
                casual: [
                    `${emoji} ${title} and it's actually going to be useful for once 😅✨\n\nLearn something real. Meet people who know things. Add it to your LinkedIn.\n\n📍 Seminar Hall · Saturday\n${fullTags}`,
                    `ngl ${title} might actually change how you think about things 🧠💡\n\nFree. Certified. On campus. No excuse not to come.\n\n📍 Workshop Hall · This Weekend\n${fullTags}`,
                ],
                professional: [
                    `Join us for ${title} — a hands-on learning experience designed to equip students with real-world skills 📚\n\n📍 Seminar Hall · Saturday · 10 AM\n${fullTags}`,
                    `${emoji} ${title}: Level Up Your Skills.\n\nIndustry-aligned sessions, expert speakers, and practical takeaways — all in one day.\n\n📅 Saturday · 10 AM\n${fullTags}`,
                ],
            },
            email: {
                casual: [
                    `Subject: 📚 ${title} — your future self will thank you\n\nHey [Name]!\n\n${title} is this weekend and it's actually one of those events worth waking up early for. Practical skills, expert sessions, and it's free.\n\nSee you Saturday!\nAcademic Committee`,
                    `Subject: ${title} — learn something new this weekend 💡\n\nHi [Name]!\n\nSkills don't build themselves. ${title} is your chance to learn something valuable in a fun, interactive setting.\n\nSaturday · Seminar Hall · 10 AM\n\nRegister by Friday!\nWorkshop Team`,
                ],
                professional: [
                    `Subject: Invitation to ${title}\n\nDear [Student Name],\n\nWe are pleased to invite you to ${title}, an intensive workshop session organized by the Academic Development Committee.\n\nDate: This Saturday\nTime: 10:00 AM – 1:00 PM\nVenue: Seminar Hall\nCertificate: Provided\n\nPlease register via the college portal.\n\nWarm regards,\nAcademic Committee`,
                ],
            },
            discord: {
                casual: [
                    `@everyone 📚 **${title} — SATURDAY 10 AM**\n\nFree. Useful. On campus. You have zero excuses. React 💡 if you're registering!`,
                    `@everyone 🧠 **${title}** is this weekend!\n\nCertificate included. Expert session. Hands-on practice. React ✅ to reserve your spot!`,
                ],
                professional: [
                    `@everyone 📚 **Announcement: ${title}**\n\nThe Academic Development Committee presents ${title} this Saturday at 10 AM in the Seminar Hall.\n\nCertificates will be provided. Please react ✅ to register interest.`,
                ],
            },
        },

        cultural: {
            instagram: {
                casual: [
                    `${emoji} ${title.toUpperCase()} is giving main character energy and we are HERE for it 🌺✨\n\nColors. Culture. Campus coming together like it should. Don't miss this one.\n\n📍 Main Ground · Saturday\n${fullTags}`,
                    `${title} hits differently because it's not just an event — it's a whole experience 🎊🌸\n\nDance, food, music, tradition — all of it, this weekend.\n\n📍 Campus Grounds\n${fullTags}`,
                ],
                professional: [
                    `We proudly present: ${title} 🌺\n\nA vibrant celebration of culture, tradition, and campus unity. All communities welcome.\n\n📍 Campus Main Ground · Saturday\n${fullTags}`,
                ],
            },
            email: {
                casual: [
                    `Subject: 🌺 ${title} — this one hits different\n\nHey [Name]!\n\n${title} is happening this Saturday and it is going to be an experience unlike anything else this year. Cultural performances, food stalls, and so much more.\n\nBe there!\nCultural Club`,
                ],
                professional: [
                    `Subject: Invitation to ${title}\n\nDear [Student Name],\n\nThe Cultural Committee cordially invites you to ${title}, a celebration of tradition, art, and community.\n\nDate: This Saturday\nVenue: Campus Main Ground\nTime: 4:00 PM onwards\n\nAll are welcome.\n\nWarm regards,\nCultural Committee`,
                ],
            },
            discord: {
                casual: [
                    `@everyone 🌺 **${title}** — THIS SATURDAY IS THE DAY\n\nCultural performances, food, and campus unity. React 🌸 if you're coming!`,
                ],
                professional: [
                    `@everyone 🌺 **Announcement: ${title}**\n\nThe Cultural Committee presents ${title} this Saturday. Performances, exhibitions, and cultural displays open to all.\n\nReact ✅ to confirm attendance.`,
                ],
            },
        },

        general: {
            instagram: {
                casual: [
                    `${emoji} ${title.toUpperCase()} is happening and campus is about to be lit 🔥\n\nCome through. Bring your people. Make memories.\n\n📍 Campus Grounds · This Weekend\n${fullTags}`,
                    `okay but ${title} is giving exactly the kind of energy we needed this semester 💯\n\nDrop everything. Seriously. Come.\n\n📍 Main Campus · Saturday\n${fullTags}`,
                    `The collab we didn't know we needed: ${title} × your entire campus 🚀\n\nJoin us. It's going to be legendary.\n\n📍 Campus · This Weekend\n${fullTags}`,
                ],
                professional: [
                    `Announcing: ${title} 🎯\n\nA campus-wide event built for students, by students. Join us for an experience worth talking about.\n\n📍 Campus Grounds · This Weekend\n${fullTags}`,
                    `${emoji} ${title}: Bringing Campus Together.\n\nAll departments. All years. One great event.\n\n📅 This Weekend · Main Campus\n${fullTags}`,
                ],
            },
            email: {
                casual: [
                    `Subject: 📢 ${title} — you need to come\n\nHey [Name]!\n\n${title} is this weekend and we'd love to see you there. No agenda — just a great campus event for everyone.\n\nDetails: This Weekend · Campus Grounds\n\nSee you!\nEvents Team`,
                    `Subject: ${title} — weekend plans sorted 🎯\n\nHi [Name]!\n\nLooking for something fun to do this weekend? ${title} has you covered. Come, enjoy, and make it a memory.\n\nSee you there!\nCampus Events`,
                    `Subject: Don't sleep on ${title} this weekend! ⭐\n\nHey [Name]!\n\nYour campus is throwing something special and you're on the list. ${title} — this weekend — be there or be square.\n\nSee you!\nEvents Committee`,
                ],
                professional: [
                    `Subject: Official Invitation — ${title}\n\nDear [Student Name],\n\nThe Student Events Council is pleased to invite you to ${title}, a campus-wide initiative open to all.\n\nDate: This Weekend\nVenue: Campus Grounds\n\nWe look forward to your participation.\n\nWarm regards,\nStudent Events Council`,
                    `Subject: You are Invited: ${title}\n\nDear [Student Name],\n\nWe cordially invite you to ${title} — an event designed to bring together the campus community.\n\nDate: This Weekend\nVenue: Main Campus\n\nPlease join us for what promises to be a memorable occasion.\n\nKind regards,\nEvents Committee`,
                ],
            },
            discord: {
                casual: [
                    `@everyone ⭐ **${title.toUpperCase()} — THIS WEEKEND!**\n\nYour campus is doing something amazing and you should be there for it. React 🔥 if you're coming!`,
                    `@everyone 📢 **${title}** is happening and this server better show up!\n\nDrop your hype reaction below 👇`,
                    `@here 🎯 **${title} — Final Reminder!**\n\nThis weekend is the moment. Don't say we didn't tell you. React ✅ to confirm!`,
                ],
                professional: [
                    `@everyone 📢 **Official Announcement: ${title}**\n\nThe Student Events Council presents ${title} this weekend at the Campus Grounds.\n\nAll students are warmly invited. React ✅ to confirm attendance.`,
                    `@everyone ⭐ **${title} — Campus-Wide Event**\n\nJoin us this weekend for ${title}, open to all students. React ✅ to indicate interest.`,
                ],
            },
        },
    };

    return pools[type];
}

// ─── Variant picker — uses seed so each Generate gives different content ───────
function pickVariant(pool: string[], seed: number): string {
    if (!pool || pool.length === 0) return "";
    return pool[seed % pool.length];
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CopywriterPanel({
    isLoading,
    hasContent,
    prompt,
    localInference,
    generationSeed,
}: CopywriterPanelProps) {
    const [activeTab, setActiveTab] = useState<TabId>("instagram");
    const [tone, setTone] = useState<"casual" | "professional">("casual");
    const [copied, setCopied] = useState(false);

    // Rebuild copy pool when prompt OR seed changes — fresh content every Generate
    const copyPool = useMemo(() => buildCopyPool(prompt), [prompt]);

    const getCopy = () => {
        const pool = copyPool[activeTab][tone];
        return pickVariant(pool, generationSeed);
    };

    const handleCopy = async () => {
        try { await navigator.clipboard.writeText(getCopy()); } catch { /* noop */ }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className="glass flex flex-col h-full"
            style={{ borderRadius: 16, overflow: "hidden", minHeight: 0 }}
        >
            {/* Panel Header */}
            <div
                style={{
                    padding: "16px 16px 12px",
                    borderBottom: "1px solid var(--amd-border)",
                    flexShrink: 0,
                }}
            >
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <span style={{ fontSize: 16 }}>✍️</span>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>Copywriter</span>
                        {localInference && (
                            <div
                                className="green-pulse"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    background: "rgba(0,210,106,0.12)",
                                    border: "1px solid rgba(0,210,106,0.3)",
                                    borderRadius: 999,
                                    padding: "2px 8px",
                                }}
                            >
                                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--amd-green)" }} />
                                <span style={{ fontSize: 9, color: "var(--amd-green)", fontWeight: 700 }}>LOCAL · AMD AI</span>
                            </div>
                        )}
                    </div>

                    {/* Tone Toggle */}
                    <div className="tone-pill">
                        <button className={tone === "casual" ? "active" : ""} onClick={() => setTone("casual")}>Casual</button>
                        <button className={tone === "professional" ? "active" : ""} onClick={() => setTone("professional")}>Pro</button>
                    </div>
                </div>

                {/* Tab Bar */}
                <div className="tab-bar mt-2">
                    {TABS.map((tab) => (
                        <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
                            {TAB_ICONS[tab]} {TAB_LABELS[tab]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, padding: 16, overflowY: "auto", position: "relative", minHeight: 0 }}>
                {isLoading ? (
                    <div className="fade-in-up"><SkeletonLoader lines={5} height={14} /></div>
                ) : !hasContent ? (
                    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--amd-text-dim)" }}>
                        <span style={{ fontSize: 36 }}>✍️</span>
                        <p style={{ fontSize: 12, textAlign: "center", lineHeight: 1.5 }}>
                            Enter a prompt and click Generate to create platform-ready copy
                        </p>
                    </div>
                ) : (
                    <div className="fade-in-up" key={`${prompt}-${generationSeed}-${tone}-${activeTab}`}>
                        <pre
                            style={{
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                fontSize: 13,
                                lineHeight: 1.75,
                                color: "var(--amd-text)",
                                fontFamily: "inherit",
                                margin: 0,
                            }}
                        >
                            {getCopy()}
                        </pre>
                    </div>
                )}
            </div>

            {/* Footer */}
            {hasContent && !isLoading && (
                <div
                    style={{
                        padding: "12px 16px",
                        borderTop: "1px solid var(--amd-border)",
                        flexShrink: 0,
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <button
                        className={`btn-icon ${copied ? "pop-in" : ""}`}
                        onClick={handleCopy}
                        style={{
                            background: copied ? "rgba(0,210,106,0.15)" : undefined,
                            borderColor: copied ? "rgba(0,210,106,0.4)" : undefined,
                            color: copied ? "var(--amd-green)" : undefined,
                        }}
                    >
                        {copied ? (
                            <>
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                                </svg>
                                Click to Copy
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
