import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentSample } = body;

    if (!contentSample || contentSample.length < 100) {
      return NextResponse.json(
        { error: "Content sample too short" },
        { status: 400 }
      );
    }

    // Generate 30 LinkedIn posts with calendar
    const result = await generateFullCalendar(contentSample);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}

async function generateFullCalendar(content: string): Promise<any> {
  const posts = await generateLinkedInPosts(content, 30);
  const calendar = generateCalendar(posts);
  
  return { posts, calendar };
}

async function generateLinkedInPosts(content: string, count: number): Promise<any[]> {
  if (!OPENAI_API_KEY) {
    return getMockPosts(count);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert LinkedIn content strategist for coaches and consultants. You write posts that stop the scroll, provide real value, and drive engagement.

Your posts follow these rules:
- Strong hooks that create curiosity (first line is everything)
- Short paragraphs and sentences for mobile readability
- Use line breaks liberally
- Mix of formats: stories, insights, listicles, hot takes, how-tos, questions
- End with a question or CTA that drives comments
- No hashtags in the main post (add 3-5 at the end)
- Authentic voice, not corporate speak
- Actionable and specific, not generic

Generate ${count} LinkedIn posts from the provided content. Each post should:
1. Be a complete, ready-to-post LinkedIn post
2. Have a different format/angle
3. Extract real insights from the source material
4. Feel like it was written by a coach who knows their stuff

Mix these formats across the ${count} posts:
- 8-10 Story posts (personal narratives, client stories)
- 6-8 Insight posts (contrarian takes, observations)
- 5-7 Listicle posts (5 things..., 3 ways...)
- 4-5 How-To posts (tactical advice)
- 3-4 Hot Take posts (bold opinions)
- 2-3 Question/Engagement posts

Return JSON object with "posts" array containing objects with: format, hook (first line), body (full post), hashtags (array of 3-5).`
          },
          {
            role: "user",
            content: `Generate ${count} LinkedIn posts from this content:\n\n${content.substring(0, 8000)}`
          }
        ],
        temperature: 0.8,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      console.error("OpenAI error:", await response.text());
      return getMockPosts(count);
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    
    const posts = parsed.posts || parsed;
    
    if (!Array.isArray(posts) || posts.length === 0) {
      return getMockPosts(count);
    }

    return posts.slice(0, count);
  } catch (error) {
    console.error("OpenAI generation failed:", error);
    return getMockPosts(count);
  }
}

function generateCalendar(posts: any[]): any {
  const today = new Date();
  const calendar: any[] = [];
  
  // LinkedIn optimal posting: Mon, Tue, Wed, Thu at 9am or 12pm
  const postingDays = [1, 2, 3, 4]; // Mon-Thu
  const postingTimes = ["9:00 AM", "12:00 PM"];
  
  let postIndex = 0;
  let currentDate = new Date(today);
  
  // Generate 30 days of calendar
  for (let day = 0; day < 30 && postIndex < posts.length; day++) {
    currentDate = new Date(today);
    currentDate.setDate(today.getDate() + day);
    
    const dayOfWeek = currentDate.getDay();
    
    // Post on Mon-Thu (1-4) and Saturday (6)
    if (postingDays.includes(dayOfWeek) || dayOfWeek === 6) {
      const time = dayOfWeek === 6 ? "10:00 AM" : postingTimes[postIndex % 2];
      
      calendar.push({
        date: currentDate.toISOString().split('T')[0],
        dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
        time,
        postIndex,
        post: posts[postIndex],
        week: Math.floor(day / 7) + 1,
      });
      
      postIndex++;
    }
  }
  
  // If we haven't placed all posts, add remaining to available slots
  while (postIndex < posts.length) {
    currentDate.setDate(currentDate.getDate() + 1);
    const dayOfWeek = currentDate.getDay();
    
    if (dayOfWeek !== 0) { // Skip Sundays
      calendar.push({
        date: currentDate.toISOString().split('T')[0],
        dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
        time: "9:00 AM",
        postIndex,
        post: posts[postIndex],
        week: Math.floor(calendar.length / 5) + 1,
      });
      postIndex++;
    }
  }
  
  return {
    entries: calendar,
    summary: {
      totalPosts: posts.length,
      weeksSpan: Math.ceil(calendar.length / 5),
      postsPerWeek: 5,
    },
    schedule: {
      days: "Monday - Thursday + Saturday",
      times: "9:00 AM or 12:00 PM EST",
      note: "Optimal LinkedIn engagement times for B2B audiences",
    },
  };
}

function getMockPosts(count: number): any[] {
  const templates = [
    {
      format: "story",
      hook: "Last week, a client asked me something that stopped me in my tracks...",
      body: `Last week, a client asked me something that stopped me in my tracks...

"How do I know if I'm actually making progress?"

Here's what I told them:

Progress isn't always visible.

Sometimes the biggest growth happens in the moments that feel the most stuck.

The question isn't "Am I moving fast enough?"

It's "Am I moving in the right direction?"

3 signs you're on the right track (even when it doesn't feel like it):

→ You're asking better questions than you were 6 months ago
→ The problems you're solving have gotten bigger  
→ You're uncomfortable in new ways, not the same old ways

What's one sign of progress you've noticed in yourself lately?`,
      hashtags: ["leadership", "growth", "coaching", "mindset"],
    },
    {
      format: "listicle",
      hook: "5 things nobody tells you about scaling past $500k:",
      body: `5 things nobody tells you about scaling past $500k:

1. Your calendar becomes your biggest liability
2. The skills that got you here won't get you there
3. Delegation isn't about tasks—it's about decisions
4. Your identity has to evolve faster than your revenue
5. The loneliness is real, but it's not permanent

I learned #3 the hard way.

For years, I delegated tasks but hoarded decisions.

I thought I was being a "good leader" by staying involved.

What I was actually doing: creating a bottleneck and burning out my team.

The shift?

Start delegating decisions, not just tasks.

Which of these hit home for you?`,
      hashtags: ["entrepreneurship", "scale", "leadership", "business"],
    },
    {
      format: "insight",
      hook: "The difference between a $100k coach and a $1M coach isn't what they know.",
      body: `The difference between a $100k coach and a $1M coach isn't what they know.

It's what they're willing to stop doing.

$100k coaches: Add more. More offers. More content. More hustle.

$1M coaches: Subtract ruthlessly. Fewer clients. Higher prices. Deeper work.

The math is simple:
• 100 clients at $1k = $100k
• 20 clients at $50k = $1M

But the mindset shift is hard.

Because saying no to $1k clients when you need money feels terrifying.

Until you realize:

Every $1k client you take is a $50k client you can't serve.

What do you need to stop doing?`,
      hashtags: ["coaching", "business", "pricing", "mindset"],
    },
    {
      format: "hot_take",
      hook: "Unpopular opinion: Most coaches don't have a marketing problem.",
      body: `Unpopular opinion: Most coaches don't have a marketing problem.

They have a clarity problem.

I see it every day:

→ Trying to serve everyone
→ Vague outcomes
→ Copying competitors
→ Changing their offer every month

No amount of content fixes this.

You can't market your way out of confusion.

The coaches winning right now?

They made ONE decision:

Who do I help? What outcome do I deliver?

Then they repeated it 1,000 times.

That's it.

That's the whole strategy.`,
      hashtags: ["marketing", "coaching", "clarity", "strategy"],
    },
    {
      format: "how_to",
      hook: "How to turn one podcast episode into 30 days of content:",
      body: `How to turn one podcast episode into 30 days of content:

Step 1: Extract 5-7 key insights from the transcript

Step 2: Turn each insight into:
→ 1 LinkedIn story post
→ 1 LinkedIn listicle
→ 2-3 tweets

Step 3: Create 1 email newsletter that goes deeper on the best insight

Step 4: Schedule everything across 30 days

Time investment: 2-3 hours

Content output: 30+ pieces

The key? Stop creating from scratch.

Start repurposing what you already have.

What content are you sitting on that could be repurposed?`,
      hashtags: ["contentmarketing", "repurposing", "productivity", "coaching"],
    },
    {
      format: "story",
      hook: "I almost quit coaching in 2019.",
      body: `I almost quit coaching in 2019.

Not because I wasn't good at it.

Because I was exhausted.

Working 60+ hours a week.
Taking calls at all hours.
Saying yes to every client.

I thought hustle = success.

What actually happened:

I burned out so badly I couldn't show up for anyone.

The thing that saved me?

Learning to charge more and serve fewer.

Counterintuitive, right?

But here's what I discovered:

→ Higher prices attract better clients
→ Fewer clients means deeper work
→ Deeper work creates better results
→ Better results justify higher prices

It's a flywheel.

But it starts with saying no.

What's one thing you need to say no to?`,
      hashtags: ["burnout", "coaching", "boundaries", "business"],
    },
    {
      format: "question",
      hook: "Quick audit for coaches:",
      body: `Quick audit for coaches:

How many of these are true for you?

□ You've raised prices in the last 12 months
□ You have a waitlist (or could)
□ You turn away clients who aren't a fit
□ You have recurring revenue (not just 1:1s)
□ You take real vacations (not "working vacations")
□ Your best clients came from referrals
□ You know exactly who you help and how

If you checked 5+, you're building something sustainable.

If you checked fewer than 3, we should talk.

No judgment—just clarity.

Which ones are you working on?`,
      hashtags: ["coaching", "business", "audit", "growth"],
    },
    {
      format: "insight",
      hook: "The best coaches I know have one thing in common:",
      body: `The best coaches I know have one thing in common:

They're obsessed with their clients' results.

Not their own content.
Not their follower count.
Not their revenue.

Results.

Everything else follows.

When your clients win, they talk about you.
When they talk about you, referrals come.
When referrals come, you don't need to "market."

This is the unsexy truth about building a coaching business:

Do great work for people you care about.
Document the results.
Share the stories.

Repeat for 5 years.

That's the whole playbook.`,
      hashtags: ["coaching", "results", "referrals", "business"],
    },
    {
      format: "listicle",
      hook: "3 questions I ask every new client:",
      body: `3 questions I ask every new client:

1. "What would success look like 12 months from now?"

(Most people can't answer this clearly. That's the first problem we solve.)

2. "What have you already tried?"

(I need to know what hasn't worked so we don't repeat it.)

3. "What are you most afraid of?"

(The real work is usually hiding behind the fear.)

These three questions reveal more than an hour of small talk.

Try them in your next intake call.

What questions do you always ask?`,
      hashtags: ["coaching", "discovery", "questions", "clients"],
    },
    {
      format: "hot_take",
      hook: "Your content doesn't need to go viral.",
      body: `Your content doesn't need to go viral.

It needs to reach the right 100 people.

Think about it:

If you charge $10k for coaching...

And your close rate is 25%...

You need 40 qualified leads per year.

That's 3-4 per month.

You don't need 10,000 followers.

You need 100 people who trust you.

Most coaches are playing the wrong game.

They're chasing reach when they should be building depth.

Stop trying to go viral.

Start trying to be useful to a small group of people who need what you have.

That's the game.`,
      hashtags: ["contentmarketing", "coaching", "strategy", "viral"],
    },
  ];
  
  // Repeat templates to reach count
  const posts: any[] = [];
  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    posts.push({
      ...template,
      // Slightly modify to make unique
      hook: i >= templates.length ? `[${Math.floor(i / templates.length) + 1}] ${template.hook}` : template.hook,
    });
  }
  
  return posts;
}
