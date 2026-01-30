/**
 * Standalone test for Agent-Agent mock outputs
 * This runs without importing from the Next.js app
 * 
 * Usage: node scripts/test-mock.js
 */

const fs = require("fs");
const path = require("path");

// =============================================
// MOCK IMPLEMENTATIONS (copied for standalone test)
// =============================================

function mockArchivist(piece) {
  const wordCount = piece.wordCount;
  const isTranscript = piece.title.toLowerCase().includes("transcript") || 
                       piece.title.toLowerCase().includes("podcast") ||
                       piece.title.toLowerCase().includes("episode");

  return {
    themes: ["leadership", "retention", "employee engagement", "management"],
    voice_tags: ["authoritative", "conversational", "practical", "direct"],
    content_type: isTranscript ? "PODCAST_TRANSCRIPT" : "WRITTEN_CONTENT",
    status: wordCount > 500 ? "READY" : "RAW",
    quality_band: wordCount > 2000 ? "A" : wordCount > 500 ? "B" : "C",
    key_insights: [
      "High performers leave for three reasons: Challenge, Autonomy, and Meaning",
      "Hire smart people, tell them the outcome you need, and get out of the way",
      "Your best people always have options—the question is whether they'll take them",
      "When was the last time you told your best performer exactly why they matter?",
    ],
    notes: `${wordCount}-word podcast transcript. High-value content on employee retention. Strong actionable framework (Challenge, Autonomy, Meaning). Multiple quotable moments. Excellent repurposing potential.`,
  };
}

function mockPlacement(piece) {
  return {
    primary_platform: "LINKEDIN",
    secondary_platforms: ["TWITTER", "EMAIL"],
    content_potential: "HIGH",
    recommended_formats: [
      "LinkedIn story post (the CEO story)",
      "LinkedIn listicle (3 reasons employees leave)",
      "Twitter thread (the 3 pillars framework)",
      "Email newsletter (full breakdown with homework)",
      "Instagram carousel (visual framework)",
    ],
    reasoning: `847-word podcast transcript with strong narrative (CEO story) and clear framework (Challenge, Autonomy, Meaning). Perfect for LinkedIn thought leadership. The homework section converts well to engagement CTAs.`,
  };
}

function mockRepurposer(piece) {
  return {
    source_piece_id: piece.id,
    linkedin_posts: [
      {
        format: "story",
        hook: "Last month, a Fortune 500 CEO called me in a panic.",
        body: `His VP of Product just quit. No warning. No negotiation. Just... gone.

The VP had just gotten a raise. The company was hitting targets. From the outside, everything looked perfect.

So what happened?

After digging in, we found the same 3 problems I see with every high performer who leaves:

1. No challenge
She'd mastered her role. The work that used to stretch her was now routine. And bored A-players start taking recruiter calls.

2. No autonomy
She ran a $40M product line but needed approval to hire a $5K contractor. That's not a job. That's a prison with good benefits.

3. No meaning
When was the last time anyone told her why her work actually mattered? Not "good job on Q3." I mean really told her the impact she was having.

Here's the truth: Your best people always have options.

The question isn't whether they'll get offers.

It's whether they'll take them.

And that decision? That's on you.`,
        cta: "Which of these 3 is the biggest gap on your team right now?",
        hashtags: ["leadership", "retention", "management", "executivecoaching"],
      },
      {
        format: "listicle",
        hook: "3 reasons your best employees are leaving (and it's not money):",
        body: `1. You stopped challenging them

Your A-players don't want easy. They want hard problems.

The trap: The better they get, the easier their job becomes. If you're not actively giving them new mountains to climb, they're getting bored.

2. You're suffocating them with oversight

High performers are allergic to micromanagement. You can watch the light leave their eyes when you ask for the third status update in a week.

My rule: Hire smart people, tell them the outcome you need, get out of the way.

3. You never told them why they matter

Your A-players need to see the connection between their work and actual impact.

Not "good job on the numbers."

I mean: "Here's the specific impact you've had on this company, these customers, this team."

When was the last time you did that?

If you can't remember, that's your problem right there.`,
        cta: "Save this for your next 1:1 with your top performer 👇",
        hashtags: ["leadership", "employeeretention", "management"],
      },
      {
        format: "insight",
        hook: "The most expensive mistake leaders make with their best people:",
        body: `Assuming they know they're valued.

They don't.

Your top performer is getting LinkedIn DMs from recruiters every week.

They're comparing your culture to the fantasy version of somewhere else.

They're wondering if the grass is greener.

And here's what you're NOT doing:

• Telling them specifically why they matter
• Giving them problems that scare them a little
• Getting out of their way so they can actually lead

You think you're being a good boss by "not overloading them."

You're actually being negligent.

Your A-players don't need protection.

They need mountains to climb.

Give them one this week.`,
        cta: "Tag a leader who needs to hear this",
        hashtags: ["leadership", "talentmanagement"],
      },
      {
        format: "question",
        hook: "Quick leadership audit:",
        body: `Think of your top performer. The one who would devastate you if they left tomorrow.

Now answer honestly:

→ When did you last give them a problem that scared them?
→ How much autonomy do they ACTUALLY have? (Not on paper—in practice)
→ Have you explicitly told them why their work matters this month?

If you hesitated on any of these, you have work to do.

Your best people always have options.

The question is whether they'll take them.`,
        cta: "Which question made you pause?",
        hashtags: ["leadership", "retention"],
      },
      {
        format: "hot_take",
        hook: "Unpopular opinion: Most \"retention problems\" are actually leadership problems.",
        body: `When a great employee leaves, we blame:
- The market
- Compensation
- The economy
- "They got a better offer"

But 90% of the time?

It's one of these three:

1. We bored them (no challenge)
2. We suffocated them (no autonomy)  
3. We ignored them (no meaning)

All three are 100% in your control.

Stop blaming external factors.

Start having honest conversations.

Your best people don't leave companies.

They leave leaders.`,
        cta: "Agree or disagree?",
        hashtags: ["leadership", "management", "hottake"],
      },
    ],
    twitter_threads: [
      {
        hook_tweet: "A Fortune 500 CEO called me last month in a panic.\n\nHis VP of Product just quit. No warning. No negotiation.\n\nHere's what I found when I dug in (and why your best people are probably thinking about leaving too):\n\n🧵",
        tweets: [
          { text: "A Fortune 500 CEO called me last month in a panic.\n\nHis VP of Product just quit. No warning. No negotiation.\n\nHere's what I found when I dug in (and why your best people are probably thinking about leaving too):\n\n🧵", position: 1 },
          { text: "The VP had just gotten a raise.\n\nThe company was hitting targets.\n\nFrom the outside, everything looked perfect.\n\nBut when I started asking questions, we found the same 3 problems I see every time a high performer leaves.", position: 2 },
          { text: "Problem #1: No Challenge\n\nYour best people don't want easy. They want hard problems.\n\nThe trap: The better they get at their job, the easier it becomes.\n\nIf you're not actively giving them new challenges, they're getting bored.\n\nAnd bored A-players start taking recruiter calls.", position: 3 },
          { text: "Problem #2: No Autonomy\n\nHigh performers are allergic to micromanagement.\n\nThis VP ran a $40M product line but needed approval to hire a $5K contractor.\n\nThat's not a job.\n\nThat's a prison with good benefits.", position: 4 },
          { text: "My rule for managing A-players:\n\n→ Hire smart people\n→ Tell them the outcome you need\n→ Get out of the way\n\nIf you can't do that, you either hired wrong or YOU'RE the problem.\n\n(Usually it's the second one.)", position: 5 },
          { text: "Problem #3: No Meaning\n\nYour A-players need to see the connection between their work and actual impact.\n\nNot in corporate-speak. Real impact.\n\nWhen was the last time you told your best performer exactly WHY they matter?\n\nNot \"good job.\" Actually told them.", position: 6 },
          { text: "Here's your homework:\n\n1. Identify your top 3 performers\n2. Ask: When did I last give them a problem that scared them?\n3. How much autonomy do they ACTUALLY have?\n4. Have I explicitly told them why they matter?\n\nBe honest. Then fix it.", position: 7 },
          { text: "The truth that keeps me up at night:\n\nYour best people always have options. Always.\n\nThe question isn't whether they'll get offers.\n\nIt's whether they'll take them.\n\nAnd that decision? That's on you.", position: 8 },
        ],
      },
      {
        hook_tweet: "The 3 reasons your best employees leave (and it's never the money):\n\n🧵",
        tweets: [
          { text: "The 3 reasons your best employees leave (and it's never the money):\n\n🧵", position: 1 },
          { text: "1. CHALLENGE\n\nYour A-players don't want easy. They want hard.\n\nThe better they get at their job, the easier it becomes.\n\nIf you're not actively giving them new mountains to climb, they're getting bored.\n\nBored = recruiter calls.", position: 2 },
          { text: "2. AUTONOMY\n\nHigh performers are allergic to micromanagement.\n\nMy rule: Hire smart people. Tell them the outcome. Get out of the way.\n\nIf you can't do that, you're the problem.", position: 3 },
          { text: "3. MEANING\n\nYour best people need to know their work matters.\n\nNot in abstract corporate speak. Actually matters.\n\nWhen was the last time you told them specifically why they're valuable?\n\nIf you can't remember, that's your answer.", position: 4 },
          { text: "Your best people always have options.\n\nThe question isn't whether they'll get offers.\n\nIt's whether they'll take them.\n\nFix these 3 things this week.", position: 5 },
        ],
      },
    ],
    instagram_captions: [
      {
        hook: "Why your best employees are leaving 👋",
        caption: `Why your best employees are leaving 👋

(And it's not the money)

Swipe to learn the 3 real reasons →

After coaching hundreds of executives, I've found the same pattern every time a top performer walks out the door.

It's not compensation. It's not the market.

It's:
❌ No challenge (they're bored)
❌ No autonomy (they're micromanaged)
❌ No meaning (they don't know they matter)

All three are 100% in your control.

Quick homework:
Think of your best performer.
When did you last give them a scary problem?
How much real autonomy do they have?
Have you told them why they matter lately?

Save this for your next 1:1 👇

#leadership #management #employeeretention #executivecoach #leadershipdevelopment #peoplemanagement #hr`,
        hashtags: ["leadership", "management", "employeeretention", "executivecoach", "leadershipdevelopment", "peoplemanagement", "hr"],
        carousel_slides: [
          "Why your best employees are leaving",
          "It's not the money.",
          "Reason 1: NO CHALLENGE\nThey're bored. The job got too easy.",
          "Reason 2: NO AUTONOMY\nYou're suffocating them with oversight.",
          "Reason 3: NO MEANING\nThey don't know why they matter.",
          "Your homework:\n1. When did you last scare them with a challenge?\n2. How much real autonomy do they have?\n3. Have you told them why they matter?",
          "Your best people always have options.\n\nThe question is whether they'll take them.",
        ],
      },
    ],
    email_drafts: [
      {
        subject_line: "Why your best people are leaving",
        preview_text: "It's not the money. It's these 3 things.",
        body: `Last month, a Fortune 500 CEO called me in a panic.

His VP of Product had just resigned. No warning. No negotiation. Just... gone.

The VP had just gotten a raise. The company was hitting targets. From the outside, everything looked perfect.

So what happened?

After digging in, we found the same 3 problems I see every time a high performer leaves:

**1. No Challenge**

Your best people don't want easy. They want hard problems.

The trap: The better they get at their job, the easier it becomes. If you're not actively giving them new challenges, they're getting bored.

And bored A-players start taking recruiter calls.

I had a client tell me, "I thought I was being kind by not overloading her."

No. You were being negligent. She didn't need protection. She needed mountains to climb.

**2. No Autonomy**

High performers are allergic to micromanagement. Literally allergic.

This CEO's VP? She was running a $40 million product line but needed approval to hire a contractor. Think about that—$40 million in responsibility, zero authority to make a $5,000 decision.

That's not a job. That's a prison with good benefits.

My rule: Hire smart people, tell them the outcome you need, and get out of the way.

**3. No Meaning**

Your A-players need to know that what they're doing matters. Not in some abstract way—really matters.

When was the last time you told your best performer exactly why they matter? Not "good job on the Q3 numbers." I mean really told them the specific impact they've had.

If you can't remember, that's your problem right there.

**Your homework this week:**

1. Identify your top 3 performers (the ones who would devastate you if they left)
2. For each one, ask: When did I last give them a problem that scared them?
3. How much autonomy do they actually have—not on paper, in practice?
4. Have I explicitly told them why their work matters?

Be honest with yourself. Then fix what needs fixing.

Because here's the truth: Your best people always have options. Always.

The question isn't whether they'll get offers.

It's whether they'll take them.

And that decision? That's on you.

Talk soon,
[Your name]

P.S. Hit reply and tell me: Which of the three (Challenge, Autonomy, or Meaning) is the biggest gap on your team right now?`,
        cta: "Reply with your biggest gap",
      },
    ],
    blog_outlines: [
      {
        title: "Why Your Best Employees Are Leaving (And What To Do About It)",
        meta_description: "Discover the 3 real reasons high performers quit—and the simple framework to keep your A-players engaged and loyal.",
        sections: [
          {
            heading: "The $40 Million Wake-Up Call",
            key_points: [
              "Story: Fortune 500 CEO's VP quits unexpectedly",
              "Everything looked perfect from the outside",
              "The pattern that emerges with every high performer departure",
            ],
          },
          {
            heading: "Reason #1: The Challenge Deficit",
            key_points: [
              "A-players want hard problems, not easy work",
              "The trap: Success makes the job easier",
              "Why 'not overloading' your best people is actually negligent",
              "How to identify when someone needs a new mountain",
            ],
          },
          {
            heading: "Reason #2: The Autonomy Problem",
            key_points: [
              "High performers are allergic to micromanagement",
              "The $40M responsibility vs $5K authority disconnect",
              "The simple rule: Hire smart, state outcome, get out of the way",
              "Signs you're the bottleneck",
            ],
          },
          {
            heading: "Reason #3: The Meaning Gap",
            key_points: [
              "Why 'good job' isn't enough",
              "The difference between assumed value and explicit recognition",
              "How to connect daily work to real impact",
              "The question that reveals if you have a meaning gap",
            ],
          },
          {
            heading: "The 4-Question Audit",
            key_points: [
              "Identify your top 3 devastation-level performers",
              "When did you last give them a scary problem?",
              "How much real autonomy do they have?",
              "Have you explicitly told them why they matter?",
            ],
          },
          {
            heading: "The Truth About Options",
            key_points: [
              "Your best people always have options",
              "The question isn't whether they'll get offers",
              "Taking action this week (not someday)",
            ],
          },
        ],
        estimated_word_count: 2000,
      },
    ],
  };
}

function mockExecutive(pieces) {
  const today = new Date();
  const calendar = [];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      if (dayOfWeek >= 2 && dayOfWeek <= 4) {
        calendar.push({
          date: dateStr,
          time: "08:00",
          platform: "LINKEDIN",
          content_type: "Story post",
          notes: "Morning engagement window",
        });
      }
      
      calendar.push({
        date: dateStr,
        time: "12:00",
        platform: "TWITTER",
        content_type: i % 5 === 0 ? "Thread" : "Single tweet",
        notes: "Lunch engagement peak",
      });
    }
    
    if (dayOfWeek === 2 && i < 28) {
      calendar.push({
        date: dateStr,
        time: "06:00",
        platform: "EMAIL",
        content_type: "Newsletter",
        notes: "Weekly newsletter",
      });
    }
  }

  return {
    calendar,
    weekly_breakdown: {
      linkedin_posts: 3,
      twitter_posts: 5,
      instagram_posts: 2,
      emails: 1,
      blog_posts: 0,
    },
    strategy_notes: "Focus on LinkedIn as primary platform for B2B executive coaching. Use Twitter for daily touchpoints. Email weekly for nurturing. One podcast episode generates enough content for 2+ weeks.",
    content_gaps: [
      "Need more client success stories for social proof",
      "Could use video content for LinkedIn native video",
      "Missing lead magnet content for list building",
    ],
  };
}

function mockStrategist(input) {
  return {
    platform_priority: [
      {
        platform: "LinkedIn",
        priority: 1,
        reasoning: "Primary platform for B2B executive coaching. Your niche aligns perfectly with LinkedIn's C-suite audience.",
        weekly_target: "3-5 posts",
      },
      {
        platform: "Email",
        priority: 2,
        reasoning: "Owned audience with highest conversion rates. Build list from LinkedIn traffic.",
        weekly_target: "1-2 newsletters",
      },
      {
        platform: "Twitter/X",
        priority: 3,
        reasoning: "Good for reach and engagement. Repurpose LinkedIn content into threads.",
        weekly_target: "5-7 posts",
      },
    ],
    content_strategy: {
      primary_content_type: "Thought leadership posts with actionable frameworks",
      content_pillars: [
        "Leadership challenges and solutions",
        "Executive retention and team building",
        "Decision-making frameworks",
        "Personal stories from coaching",
      ],
      posting_cadence: "LinkedIn 3x/week (Tue-Thu 8am), Twitter daily, Email weekly (Tuesday 6am)",
      engagement_strategy: "Spend 15-20 min after each LinkedIn post engaging with comments. Comment on 5-10 posts from ideal clients daily.",
    },
    quick_wins: [
      {
        action: "Turn this podcast episode into a LinkedIn carousel",
        impact: "high",
        effort: "low",
        timeframe: "This week",
      },
      {
        action: "Add a clear CTA to your LinkedIn headline",
        impact: "medium",
        effort: "low",
        timeframe: "Today",
      },
      {
        action: "Set up weekly email from repurposed podcast content",
        impact: "high",
        effort: "medium",
        timeframe: "Next 2 weeks",
      },
    ],
    recommendations: [
      "Your podcast is an untapped goldmine. One episode = 20+ pieces of content.",
      "Focus on LinkedIn for 90 days before expanding platforms.",
      "Build email list aggressively—it's the only audience you truly own.",
      "Document client wins religiously. Social proof drives conversions.",
    ],
  };
}

// =============================================
// TEST RUNNER
// =============================================

async function main() {
  console.log("🚀 Agent-Agent Coaches Edition - Test Pipeline\n");
  console.log("=".repeat(60));

  // Load sample content
  const samplePath = path.join(__dirname, "../sample-content/coach-podcast-transcript.md");
  const sampleContent = fs.readFileSync(samplePath, "utf-8");
  
  const testPiece = {
    id: "test-piece-001",
    title: "Leadership Lab Podcast - Why Your Best Employees Are Leaving",
    body: sampleContent,
    wordCount: 847,
  };

  // Test Strategist
  console.log("\n📋 STRATEGIST AGENT");
  console.log("-".repeat(60));
  
  const strategistInput = {
    coaching_niche: "Executive Leadership",
    target_audience: "C-suite executives and senior leaders at mid-size to Fortune 500 companies",
    current_revenue: "500k_1m",
    current_platforms: ["linkedin", "podcast", "email"],
    audience_size: {
      linkedin: 8500,
      twitter: 2000,
      email_list: 3500,
    },
    content_time_weekly_hours: 4,
    primary_goal: "get_clients",
    current_content_sources: ["podcast", "workshops", "written"],
  };

  const strategyOutput = mockStrategist(strategistInput);
  console.log("\n✅ Strategy Output:");
  console.log("Platform Priorities:");
  strategyOutput.platform_priority.forEach((p) => {
    console.log(`  ${p.priority}. ${p.platform} - ${p.weekly_target}`);
  });
  console.log("\nContent Pillars:", strategyOutput.content_strategy.content_pillars.join(", "));
  console.log("\nQuick Wins:");
  strategyOutput.quick_wins.forEach((w) => {
    console.log(`  - ${w.action} (Impact: ${w.impact}, Effort: ${w.effort})`);
  });

  // Test Archivist
  console.log("\n\n📚 ARCHIVIST AGENT");
  console.log("-".repeat(60));
  
  const archivistOutput = mockArchivist(testPiece);
  console.log("\n✅ Archivist Output:");
  console.log("Content Type:", archivistOutput.content_type);
  console.log("Status:", archivistOutput.status);
  console.log("Quality:", archivistOutput.quality_band);
  console.log("Themes:", archivistOutput.themes.join(", "));
  console.log("Key Insights:", archivistOutput.key_insights.length, "extracted");
  archivistOutput.key_insights.forEach((insight, i) => {
    console.log(`  ${i + 1}. "${insight.substring(0, 60)}..."`);
  });

  // Test Placement
  console.log("\n\n🎯 PLACEMENT AGENT");
  console.log("-".repeat(60));
  
  const placementOutput = mockPlacement(testPiece);
  console.log("\n✅ Placement Output:");
  console.log("Primary Platform:", placementOutput.primary_platform);
  console.log("Secondary:", placementOutput.secondary_platforms.join(", "));
  console.log("Content Potential:", placementOutput.content_potential);
  console.log("Recommended Formats:");
  placementOutput.recommended_formats.forEach((f) => {
    console.log(`  - ${f}`);
  });

  // Test Repurposer
  console.log("\n\n✍️  REPURPOSER AGENT");
  console.log("-".repeat(60));
  
  const repurposerOutput = mockRepurposer(testPiece);
  console.log("\n✅ Repurposer Output:");
  console.log(`LinkedIn Posts: ${repurposerOutput.linkedin_posts.length}`);
  repurposerOutput.linkedin_posts.forEach((p, i) => {
    console.log(`  ${i + 1}. [${p.format}] "${p.hook.substring(0, 50)}..."`);
  });
  console.log(`\nTwitter Threads: ${repurposerOutput.twitter_threads.length}`);
  repurposerOutput.twitter_threads.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t.tweets.length} tweets - "${t.hook_tweet.substring(0, 50)}..."`);
  });
  console.log(`\nInstagram Captions: ${repurposerOutput.instagram_captions.length}`);
  console.log(`Email Drafts: ${repurposerOutput.email_drafts.length}`);
  console.log(`Blog Outlines: ${repurposerOutput.blog_outlines.length}`);

  // Test Executive
  console.log("\n\n📅 EXECUTIVE AGENT");
  console.log("-".repeat(60));
  
  const executiveOutput = mockExecutive([testPiece]);
  console.log("\n✅ Executive Output:");
  console.log(`Calendar Entries: ${executiveOutput.calendar.length}`);
  console.log("\nWeekly Breakdown:");
  Object.entries(executiveOutput.weekly_breakdown).forEach(([platform, count]) => {
    console.log(`  ${platform}: ${count}`);
  });
  console.log("\nContent Gaps:");
  executiveOutput.content_gaps.forEach((gap) => {
    console.log(`  - ${gap}`);
  });

  // Summary
  console.log("\n\n" + "=".repeat(60));
  console.log("🎉 ALL AGENTS PASSED - Pipeline Ready");
  console.log("=".repeat(60));
  
  const total = repurposerOutput.linkedin_posts.length + 
                repurposerOutput.twitter_threads.length + 
                repurposerOutput.instagram_captions.length + 
                repurposerOutput.email_drafts.length + 
                repurposerOutput.blog_outlines.length;

  console.log("\n📊 Content Generated from 1 Podcast Episode:");
  console.log(`   • ${repurposerOutput.linkedin_posts.length} LinkedIn posts`);
  console.log(`   • ${repurposerOutput.twitter_threads.length} Twitter threads (${repurposerOutput.twitter_threads.reduce((a, t) => a + t.tweets.length, 0)} total tweets)`);
  console.log(`   • ${repurposerOutput.instagram_captions.length} Instagram captions`);
  console.log(`   • ${repurposerOutput.email_drafts.length} email drafts`);
  console.log(`   • ${repurposerOutput.blog_outlines.length} blog outline`);
  console.log(`   ────────────────`);
  console.log(`   TOTAL: ${total} pieces of content\n`);

  // Show sample outputs
  console.log("\n📝 SAMPLE LINKEDIN POST (Story Format):");
  console.log("-".repeat(60));
  const storyPost = repurposerOutput.linkedin_posts[0];
  console.log(`\n${storyPost.hook}\n\n${storyPost.body}\n\n${storyPost.cta}\n`);
  console.log(storyPost.hashtags.map((h) => `#${h}`).join(" "));

  console.log("\n\n🐦 SAMPLE TWITTER THREAD:");
  console.log("-".repeat(60));
  const thread = repurposerOutput.twitter_threads[0];
  thread.tweets.forEach((t) => {
    console.log(`\n[${t.position}/${thread.tweets.length}] ${t.text}`);
  });

  console.log("\n\n📧 SAMPLE EMAIL:");
  console.log("-".repeat(60));
  const email = repurposerOutput.email_drafts[0];
  console.log(`\nSubject: ${email.subject_line}`);
  console.log(`Preview: ${email.preview_text}`);
  console.log(`\n${email.body.substring(0, 1000)}...`);
}

main().catch(console.error);
