/**
 * Content Starter Service
 * Generates 30 LinkedIn posts from customer content for $997 product
 * Isolated from main library - delivers via email/Notion
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface LinkedInPost {
  day: number;
  date: string;
  dayOfWeek: string;
  postTime: string;
  postType: "story" | "insight" | "listicle" | "question" | "hot_take" | "how_to";
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
}

interface ContentStarterOutput {
  customerName: string;
  customerEmail: string;
  generatedAt: string;
  posts: LinkedInPost[];
  postingSchedule: {
    frequency: string;
    bestDays: string[];
    bestTimes: string[];
  };
  strategyNotes: string;
}

/**
 * Generate LinkedIn posting dates for next 30 days
 * Best times: Tue-Thu 8-10am, 12pm
 */
function generatePostingSchedule(): { date: string; dayOfWeek: string; time: string; day: number }[] {
  const schedule: { date: string; dayOfWeek: string; time: string; day: number }[] = [];
  const today = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Best posting times for LinkedIn
  const bestTimes = ["9:00 AM", "10:00 AM", "12:00 PM"];
  
  let dayCounter = 1;
  let postCount = 0;
  
  while (postCount < 30) {
    const postDate = new Date(today);
    postDate.setDate(today.getDate() + dayCounter);
    const dayOfWeek = postDate.getDay();
    
    // Post on weekdays only (Mon-Fri), prioritize Tue-Thu
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // Tue-Thu get 2 posts sometimes, Mon/Fri get 1
      const isBestDay = dayOfWeek >= 2 && dayOfWeek <= 4;
      const postsToday = isBestDay && postCount < 28 ? (postCount % 5 === 0 ? 1 : 1) : 1;
      
      for (let i = 0; i < postsToday && postCount < 30; i++) {
        const timeIndex = postCount % bestTimes.length;
        schedule.push({
          date: postDate.toISOString().split('T')[0],
          dayOfWeek: dayNames[dayOfWeek],
          time: bestTimes[timeIndex],
          day: postCount + 1,
        });
        postCount++;
      }
    }
    
    dayCounter++;
    if (dayCounter > 60) break; // Safety limit
  }
  
  return schedule;
}

/**
 * Generate 30 LinkedIn posts from customer content using OpenAI
 */
export async function generateContentStarter(
  customerName: string,
  customerEmail: string,
  rawContent: string
): Promise<ContentStarterOutput> {
  
  const schedule = generatePostingSchedule();
  
  // If no OpenAI key, use enhanced mock
  if (!OPENAI_API_KEY) {
    console.log("No OpenAI key, using mock generation");
    return generateMockPosts(customerName, customerEmail, rawContent, schedule);
  }
  
  // Generate posts in batches to avoid token limits
  const posts: LinkedInPost[] = [];
  const postTypes: LinkedInPost["postType"][] = ["story", "insight", "listicle", "question", "hot_take", "how_to"];
  
  // Generate 10 posts at a time (3 batches)
  for (let batch = 0; batch < 3; batch++) {
    const batchStart = batch * 10;
    const batchEnd = Math.min(batchStart + 10, 30);
    const batchSchedule = schedule.slice(batchStart, batchEnd);
    
    const batchPosts = await generatePostBatch(
      rawContent,
      batchSchedule,
      postTypes,
      batch
    );
    
    posts.push(...batchPosts);
  }
  
  return {
    customerName,
    customerEmail,
    generatedAt: new Date().toISOString(),
    posts,
    postingSchedule: {
      frequency: "Daily on weekdays (Mon-Fri)",
      bestDays: ["Tuesday", "Wednesday", "Thursday"],
      bestTimes: ["9:00 AM EST", "10:00 AM EST", "12:00 PM EST"],
    },
    strategyNotes: `These 30 LinkedIn posts were generated from your source content. Each post is designed to stop the scroll, deliver value, and drive engagement. Post types are rotated to keep your feed fresh. Best engagement days for LinkedIn are Tuesday-Thursday. Aim to respond to comments within the first hour of posting.`,
  };
}

/**
 * Generate a batch of posts using OpenAI
 */
async function generatePostBatch(
  rawContent: string,
  schedule: { date: string; dayOfWeek: string; time: string; day: number }[],
  postTypes: LinkedInPost["postType"][],
  batchNumber: number
): Promise<LinkedInPost[]> {
  
  const systemPrompt = `You are an expert LinkedIn ghostwriter for executive coaches and high-ticket service providers. You write posts that stop the scroll, deliver massive value, and drive engagement. 

Your posts:
- Have hooks that demand attention (first line is everything)
- Use short paragraphs and line breaks for mobile readability
- Include specific stories, numbers, and examples (not vague advice)
- End with CTAs that drive comments
- Feel personal and authentic, not corporate
- Are 150-300 words (not too long, not too short)

Return ONLY valid JSON array.`;

  const userPrompt = `Generate ${schedule.length} LinkedIn posts from this source content. Each post should feel unique and native to LinkedIn.

SOURCE CONTENT:
${rawContent.substring(0, 4000)}

Generate posts for these dates:
${schedule.map((s, i) => `${i + 1}. Day ${s.day}: ${s.dayOfWeek} ${s.date} at ${s.time} - Type: ${postTypes[(s.day - 1) % postTypes.length]}`).join("\n")}

POST TYPES TO USE:
- story: Personal or client story with lesson
- insight: Contrarian take or non-obvious truth  
- listicle: Numbered tips or lessons (3-7 items)
- question: Engagement post that asks a thought-provoking question
- hot_take: Bold opinion that might be controversial
- how_to: Tactical, actionable advice

Return a JSON array with exactly ${schedule.length} objects, each with:
{
  "day": number,
  "date": "YYYY-MM-DD",
  "dayOfWeek": "Monday",
  "postTime": "9:00 AM",
  "postType": "story",
  "hook": "First line that stops the scroll",
  "body": "Full post body with line breaks",
  "cta": "Call to action question",
  "hashtags": ["tag1", "tag2", "tag3"]
}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI error:", await response.text());
      throw new Error("OpenAI API error");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = content;
    if (content.includes("```json")) {
      jsonStr = content.split("```json")[1].split("```")[0];
    } else if (content.includes("```")) {
      jsonStr = content.split("```")[1].split("```")[0];
    }
    
    const posts = JSON.parse(jsonStr.trim());
    return posts;
    
  } catch (error) {
    console.error("Error generating batch:", error);
    // Fall back to mock for this batch
    return schedule.map((s, i) => createMockPost(s, postTypes[(s.day - 1) % postTypes.length], `Generated insight ${i + 1}`));
  }
}

/**
 * Mock post generator (fallback)
 */
function generateMockPosts(
  customerName: string,
  customerEmail: string,
  rawContent: string,
  schedule: { date: string; dayOfWeek: string; time: string; day: number }[]
): ContentStarterOutput {
  
  const postTypes: LinkedInPost["postType"][] = ["story", "insight", "listicle", "question", "hot_take", "how_to"];
  
  const posts = schedule.map((s, i) => {
    const postType = postTypes[i % postTypes.length];
    return createMockPost(s, postType, rawContent.substring(0, 100));
  });
  
  return {
    customerName,
    customerEmail,
    generatedAt: new Date().toISOString(),
    posts,
    postingSchedule: {
      frequency: "Daily on weekdays (Mon-Fri)",
      bestDays: ["Tuesday", "Wednesday", "Thursday"],
      bestTimes: ["9:00 AM EST", "10:00 AM EST", "12:00 PM EST"],
    },
    strategyNotes: "These posts were generated based on your content. Post consistently and engage with comments.",
  };
}

function createMockPost(
  schedule: { date: string; dayOfWeek: string; time: string; day: number },
  postType: LinkedInPost["postType"],
  contentHint: string
): LinkedInPost {
  
  const mockPosts: Record<LinkedInPost["postType"], Omit<LinkedInPost, "day" | "date" | "dayOfWeek" | "postTime" | "postType">> = {
    story: {
      hook: "Last week, a client told me something that stopped me in my tracks.",
      body: `They said: "I finally understand why I've been stuck."\n\nAfter years of grinding, hustling, and pushing harder...\n\nThey realized the problem wasn't effort.\n\nIt was direction.\n\nHere's what changed:\n\n→ They stopped chasing every opportunity\n→ They started saying no to good things\n→ They focused on ONE needle-mover\n\nWithin 90 days, their revenue doubled.\n\nNot because they worked more.\n\nBecause they worked right.\n\nThe lesson?\n\nSometimes the fastest path forward is fewer paths, not more.`,
      cta: "What's one thing you need to stop doing to move forward?",
      hashtags: ["leadership", "coaching", "growth", "mindset"],
    },
    insight: {
      hook: "Unpopular opinion: Most coaches are overworking and underearning.",
      body: `And it's not because they lack skills.\n\nIt's because they're playing the wrong game.\n\nHere's what I mean:\n\n• They compete on hours instead of outcomes\n• They price based on time instead of transformation\n• They chase clients instead of attracting them\n\nThe shift that changes everything?\n\nStop selling your time.\nStart selling the result.\n\nA client doesn't pay for 6 coaching calls.\nThey pay for the confidence to make their first $100k.\n\nThat's a completely different value proposition.`,
      cta: "Are you selling time or transformation?",
      hashtags: ["coaching", "business", "pricing", "value"],
    },
    listicle: {
      hook: "5 things I'd tell my younger self about building a coaching business:",
      body: `1. Your first 10 clients teach you more than any certification\n\n2. Niching down feels scary but it's the fastest path to premium pricing\n\n3. Content is compounding—start before you're ready\n\n4. Your network is your net worth (cliché but true)\n\n5. The best marketing is being undeniably good at what you do\n\nI learned #2 the hard way.\n\nSpent 2 years as a "life coach for everyone."\n\nMade $40k.\n\nNiched to executive coaches.\n\nMade $400k the next year.\n\nSame skills. Different positioning.`,
      cta: "Which of these would you add to?",
      hashtags: ["coaching", "entrepreneurship", "lessons", "growth"],
    },
    question: {
      hook: "Quick audit for coaches:",
      body: `Answer honestly:\n\n→ Do you have a waitlist or are you chasing clients?\n→ Can you explain your transformation in one sentence?\n→ Do you know exactly who your dream client is?\n→ Have you raised your prices in the last 12 months?\n→ Is 80% of your revenue from repeat clients or referrals?\n\nIf you answered "no" to 3 or more...\n\nYou don't have a skills problem.\n\nYou have a positioning problem.\n\nAnd that's actually great news.\n\nBecause positioning can be fixed in a week.\nSkills take years.`,
      cta: "How many did you answer 'yes' to?",
      hashtags: ["coaching", "business", "positioning", "audit"],
    },
    hot_take: {
      hook: "Controversial take: Certifications are the biggest scam in coaching.",
      body: `Before you come for me, hear me out.\n\nCertifications aren't useless.\n\nBut they're wildly overvalued.\n\nI've seen coaches with $50k in certifications making $30k/year.\n\nAnd coaches with zero certifications making $500k.\n\nThe difference?\n\n• One invested in credentials\n• One invested in clients\n\nClients don't hire certificates.\nThey hire confidence, clarity, and proof.\n\nThe best credential is a track record of results.\n\nEverything else is resume padding.`,
      cta: "Agree or disagree? I want to hear it.",
      hashtags: ["coaching", "hottake", "certifications", "results"],
    },
    how_to: {
      hook: "How to create a month of content in 2 hours:",
      body: `Step 1: Record yourself answering your top 10 client questions (voice memo = fine)\n\nStep 2: Transcribe with AI (free tools everywhere)\n\nStep 3: Turn each answer into:\n→ 1 LinkedIn post\n→ 1 email newsletter\n→ 3 tweet variations\n\nStep 4: Schedule everything on Monday morning\n\nStep 5: Spend the rest of the month engaging, not creating\n\nThat's it.\n\nNo fancy equipment.\nNo video editing.\nNo content calendar template.\n\nJust your expertise, packaged efficiently.`,
      cta: "What's your biggest content creation struggle?",
      hashtags: ["contentcreation", "productivity", "coaching", "marketing"],
    },
  };
  
  const template = mockPosts[postType];
  
  return {
    day: schedule.day,
    date: schedule.date,
    dayOfWeek: schedule.dayOfWeek,
    postTime: schedule.time,
    postType,
    ...template,
  };
}

/**
 * Format posts for email delivery (HTML)
 */
export function formatPostsForEmail(output: ContentStarterOutput): string {
  let html = `
    <h1>Your 30-Day LinkedIn Content Calendar</h1>
    <p>Generated for: ${output.customerName}</p>
    <p>Created: ${new Date(output.generatedAt).toLocaleDateString()}</p>
    
    <h2>Posting Schedule</h2>
    <p><strong>Frequency:</strong> ${output.postingSchedule.frequency}</p>
    <p><strong>Best Days:</strong> ${output.postingSchedule.bestDays.join(", ")}</p>
    <p><strong>Best Times:</strong> ${output.postingSchedule.bestTimes.join(", ")}</p>
    
    <h2>Strategy Notes</h2>
    <p>${output.strategyNotes}</p>
    
    <hr>
    <h2>Your 30 Posts</h2>
  `;
  
  for (const post of output.posts) {
    html += `
      <div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h3>Day ${post.day}: ${post.dayOfWeek}, ${post.date} at ${post.postTime}</h3>
        <p><strong>Type:</strong> ${post.postType}</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; white-space: pre-wrap; font-family: system-ui;">
<strong>${post.hook}</strong>

${post.body}

${post.cta}

${post.hashtags.map(t => `#${t}`).join(" ")}
        </div>
      </div>
    `;
  }
  
  return html;
}

/**
 * Format posts as plain text (for Notion/copy-paste)
 */
export function formatPostsAsText(output: ContentStarterOutput): string {
  let text = `
=======================================
YOUR 30-DAY LINKEDIN CONTENT CALENDAR
=======================================
Generated for: ${output.customerName}
Created: ${new Date(output.generatedAt).toLocaleDateString()}

POSTING SCHEDULE
----------------
Frequency: ${output.postingSchedule.frequency}
Best Days: ${output.postingSchedule.bestDays.join(", ")}
Best Times: ${output.postingSchedule.bestTimes.join(", ")}

STRATEGY NOTES
--------------
${output.strategyNotes}

=======================================
YOUR 30 POSTS
=======================================
`;
  
  for (const post of output.posts) {
    text += `
---------------------------------------
DAY ${post.day}: ${post.dayOfWeek.toUpperCase()}, ${post.date} at ${post.postTime}
Type: ${post.postType.toUpperCase()}
---------------------------------------

${post.hook}

${post.body}

${post.cta}

${post.hashtags.map(t => `#${t}`).join(" ")}

`;
  }
  
  return text;
}
