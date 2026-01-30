import { z } from "zod";
import {
  ArchivistOutputSchema,
  PlacementOutputSchema,
  RepurposeOutputSchema,
  CompilerOutputSchema,
  ExecutiveOutputSchema,
  StrategistOutputSchema,
  StrategistInput,
} from "./schemas";

type AgentName =
  | "archivist"
  | "placement"
  | "compiler"
  | "repurposer"
  | "executive"
  | "strategist";

interface AgentInput {
  piece?: {
    id: string;
    title: string;
    body: string;
    wordCount: number;
  };
  pieces?: Array<{
    id: string;
    title: string;
    body: string;
    wordCount: number;
    archivistTags?: any;
    placement?: any;
  }>;
  strategistInput?: StrategistInput;
  clientContext?: {
    niche: string;
    audience: string;
    platforms: string[];
  };
}

const LLM_MODE = process.env.LLM_MODE || "mock";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Main LLM abstraction layer
 */
export async function runAgent(
  agentName: AgentName,
  input: AgentInput
): Promise<any> {
  if (LLM_MODE === "mock") {
    return runMockAgent(agentName, input);
  } else if (LLM_MODE === "openai") {
    return runOpenAIAgent(agentName, input);
  } else {
    throw new Error(`Unknown LLM_MODE: ${LLM_MODE}`);
  }
}

/**
 * Mock agent implementation for demo/testing
 */
function runMockAgent(agentName: AgentName, input: AgentInput): any {
  switch (agentName) {
    case "archivist":
      return mockArchivist(input.piece!);
    case "placement":
      return mockPlacement(input.piece!);
    case "compiler":
      return mockCompiler(input.pieces!);
    case "repurposer":
      return mockRepurposer(input.piece!);
    case "executive":
      return mockExecutive(input.pieces!);
    case "strategist":
      return mockStrategist(input.strategistInput!);
    default:
      throw new Error(`Unknown agent: ${agentName}`);
  }
}

function mockArchivist(piece: any) {
  const wordCount = piece.wordCount;
  const isTranscript = piece.title.toLowerCase().includes("transcript") || 
                       piece.title.toLowerCase().includes("podcast") ||
                       piece.title.toLowerCase().includes("episode");

  return {
    themes: ["leadership", "mindset", "business growth", "client results"],
    voice_tags: ["authoritative", "conversational", "practical"],
    content_type: isTranscript ? "PODCAST_TRANSCRIPT" : "WRITTEN_CONTENT",
    status: wordCount > 500 ? "READY" : "RAW",
    quality_band: wordCount > 2000 ? "A" : wordCount > 800 ? "B" : "C",
    key_insights: [
      "Key insight about leadership extracted from content",
      "Actionable tip about business growth",
      "Memorable quote or story",
    ],
    notes: `${wordCount}-word piece. ${isTranscript ? "Transcript with good repurposing potential." : "Written content ready for distribution."} Contains ${wordCount > 2000 ? "extensive" : "moderate"} material for repurposing.`,
  };
}

function mockPlacement(piece: any) {
  const wordCount = piece.wordCount;

  return {
    primary_platform: "LINKEDIN",
    secondary_platforms: ["TWITTER", "EMAIL"],
    content_potential: wordCount > 2000 ? "HIGH" : wordCount > 800 ? "MEDIUM" : "LOW",
    recommended_formats: [
      "LinkedIn story post",
      "Twitter thread",
      "Email newsletter excerpt",
      "Instagram carousel",
    ],
    reasoning: `${wordCount}-word piece with strong insights. Best suited for LinkedIn thought leadership, with repurposing potential across Twitter and email.`,
  };
}

function mockCompiler(pieces: any[]) {
  if (pieces.length < 2) {
    return { content_series: [], standalone_pieces: pieces.map(p => p.id) };
  }

  return {
    content_series: [
      {
        title: "Leadership Insights Series",
        description: "A curated series on leadership principles extracted from coaching sessions and content.",
        theme: "leadership",
        included_piece_ids: pieces.slice(0, 3).map(p => p.id),
        recommended_sequence: pieces.slice(0, 3).map(p => p.id),
        series_type: "EMAIL_SEQUENCE",
        estimated_pieces: 5,
        gaps: ["Introduction piece", "Conclusion with CTA"],
      },
    ],
    standalone_pieces: pieces.slice(3).map(p => p.id),
  };
}

function mockRepurposer(piece: any) {
  return {
    source_piece_id: piece.id,
    linkedin_posts: [
      {
        format: "story",
        hook: "Last week, a client asked me something that stopped me in my tracks...",
        body: "They said: 'How do I know if I'm actually making progress?'\n\nHere's what I told them:\n\nProgress isn't always visible. Sometimes the biggest growth happens in the moments that feel the most stuck.\n\nThe question isn't 'Am I moving fast enough?'\n\nIt's 'Am I moving in the right direction?'\n\n3 signs you're on the right track (even when it doesn't feel like it):\n\n1. You're asking better questions than you were 6 months ago\n2. The problems you're solving have gotten bigger\n3. You're uncomfortable in new ways, not the same old ways",
        cta: "What's one sign of progress you've noticed in yourself lately?",
        hashtags: ["leadership", "coaching", "growth"],
      },
      {
        format: "listicle",
        hook: "5 things nobody tells you about scaling past $500k:",
        body: "1. Your calendar becomes your biggest liability\n2. The skills that got you here won't get you there\n3. Delegation isn't about tasks—it's about decisions\n4. Your identity has to evolve faster than your revenue\n5. The loneliness is real, but it's not permanent\n\nI learned #3 the hard way.\n\nFor years, I delegated tasks but hoarded decisions. I thought I was being a 'good leader' by staying involved.\n\nWhat I was actually doing: creating a bottleneck and burning out my team.\n\nThe shift? Start delegating decisions, not just tasks.",
        cta: "Which of these hit home for you?",
        hashtags: ["entrepreneurship", "scale", "leadership"],
      },
      {
        format: "insight",
        hook: "The difference between a $100k coach and a $1M coach isn't what they know.",
        body: "It's what they're willing to stop doing.\n\n$100k coaches: Add more. More offers. More content. More hustle.\n\n$1M coaches: Subtract ruthlessly. Fewer clients. Higher prices. Deeper work.\n\nThe math is simple:\n• 100 clients at $1k = $100k\n• 20 clients at $50k = $1M\n\nBut the mindset shift is hard.\n\nBecause saying no to $1k clients when you need money feels terrifying.\n\nUntil you realize: every $1k client you take is a $50k client you can't serve.",
        cta: "What do you need to stop doing?",
        hashtags: ["coaching", "business", "pricing"],
      },
    ],
    twitter_threads: [
      {
        hook_tweet: "The biggest lie in the coaching industry:\n\n'Just add more value and the money will follow.'\n\nHere's the truth nobody wants to hear 🧵",
        tweets: [
          { text: "The biggest lie in the coaching industry:\n\n'Just add more value and the money will follow.'\n\nHere's the truth nobody wants to hear 🧵", position: 1 },
          { text: "Value without positioning is just volunteering.\n\nI see coaches pouring their hearts out, giving away their best stuff, wondering why they're broke.\n\nThe issue isn't the value. It's that nobody knows why YOUR value is different.", position: 2 },
          { text: "Here's what actually works:\n\n1. Pick a specific person with a specific problem\n2. Create a specific outcome you can deliver\n3. Price it based on the outcome, not your time\n4. Say no to everyone else", position: 3 },
          { text: "The coaches making $1M+ aren't 10x better than you.\n\nThey're 10x more specific.\n\nThey've made decisions you're still avoiding.", position: 4 },
          { text: "Your homework:\n\nWrite down the ONE person you help best.\nWrite down the ONE outcome you deliver.\nDouble your price.\n\nWatch what happens.", position: 5 },
        ],
      },
    ],
    instagram_captions: [
      {
        hook: "The question that changed everything for my clients",
        caption: "The question that changed everything for my clients ⬇️\n\n\"What would you do if you weren't afraid of being seen as selfish?\"\n\nMost coaches I work with aren't stuck because they don't know what to do.\n\nThey're stuck because they're afraid of what people will think.\n\n• Afraid to charge more\n• Afraid to say no\n• Afraid to put themselves first\n\nBut here's the thing:\n\nThe best thing you can do for your clients is take care of yourself first.\n\nYou can't pour from an empty cup.\n\nAnd you can't lead others where you haven't gone yourself.\n\nSo I'll ask you:\n\nWhat would you do if you weren't afraid of being seen as selfish?\n\nDrop your answer below 👇",
        hashtags: ["coaching", "leadership", "mindset", "selfcare", "entrepreneur", "businesscoach", "executivecoach"],
        carousel_slides: [
          "The question that changed everything",
          "\"What would you do if you weren't afraid of being seen as selfish?\"",
          "Most coaches aren't stuck because they don't know what to do",
          "They're stuck because they're afraid of what people will think",
          "The best thing you can do for your clients is take care of yourself first",
        ],
      },
    ],
    email_drafts: [
      {
        subject_line: "The question nobody wants to answer",
        preview_text: "It changed everything for my clients...",
        body: "Hey there,\n\nLast week I asked a client a question that made them go silent for a full minute.\n\n\"What would you do if you weren't afraid of being seen as selfish?\"\n\nThe silence was loud.\n\nBecause the answer was obvious. They knew exactly what they'd do:\n\n- Raise their prices\n- Stop taking calls on weekends\n- Say no to the client who drains them\n- Take that vacation they've been putting off\n\nBut they hadn't done any of it.\n\nWhy?\n\nBecause somewhere along the way, they learned that putting yourself first is selfish. And selfish is bad.\n\nBut here's what I've learned after coaching hundreds of high-performers:\n\nThe most generous thing you can do is take care of yourself first.\n\nYou can't pour from an empty cup.\nYou can't lead where you haven't gone.\nYou can't give what you don't have.\n\nSo this week, I want you to try something:\n\nDo one \"selfish\" thing. Just one.\n\nAnd notice what happens.\n\nTalk soon,\n[Name]",
        cta: "Hit reply and tell me what you chose",
      },
    ],
    blog_outlines: [
      {
        title: "The Selfish Question: Why Self-Care Isn't Selfish for Coaches",
        meta_description: "Discover why the most successful coaches prioritize themselves first—and how one powerful question can unlock your next level of growth.",
        sections: [
          {
            heading: "The Question That Changes Everything",
            key_points: [
              "Story of client going silent",
              "The question: What would you do if you weren't afraid of being seen as selfish?",
              "Why this hits so hard for high-achievers",
            ],
          },
          {
            heading: "The Selfish Paradox",
            key_points: [
              "Cultural conditioning around selfishness",
              "Why coaches especially struggle with this",
              "The empty cup metaphor (with a twist)",
            ],
          },
          {
            heading: "What 'Selfish' Looks Like in Practice",
            key_points: [
              "Raising prices",
              "Setting boundaries",
              "Saying no to draining clients",
              "Taking real time off",
            ],
          },
          {
            heading: "The Permission Slip You Need",
            key_points: [
              "Reframing selfish as generous",
              "How self-care benefits your clients",
              "Practical first step",
            ],
          },
        ],
        estimated_word_count: 1500,
      },
    ],
  };
}

function mockExecutive(pieces: any[]) {
  const today = new Date();
  const calendar = [];
  
  // Generate 30 days of content
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    
    // Skip weekends for LinkedIn, lighter posting
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // LinkedIn: Tue, Wed, Thu
      if (dayOfWeek >= 2 && dayOfWeek <= 4) {
        calendar.push({
          date: dateStr,
          time: "08:00",
          platform: "LINKEDIN",
          content_type: "Story post",
          piece_id: pieces[0]?.id,
          notes: "Morning engagement window",
        });
      }
      
      // Twitter: Daily on weekdays
      calendar.push({
        date: dateStr,
        time: "12:00",
        platform: "TWITTER",
        content_type: i % 3 === 0 ? "Thread" : "Single tweet",
        piece_id: pieces[0]?.id,
        notes: "Lunch engagement peak",
      });
    }
    
    // Email: Tuesday
    if (dayOfWeek === 2 && i % 7 === 0) {
      calendar.push({
        date: dateStr,
        time: "06:00",
        platform: "EMAIL",
        content_type: "Newsletter",
        piece_id: pieces[0]?.id,
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
    strategy_notes: "Focus on LinkedIn as primary platform for B2B coaching. Use Twitter for daily touchpoints and engagement. Email weekly to nurture existing audience. Instagram optional for behind-the-scenes content.",
    content_gaps: [
      "Need more case study content for social proof",
      "Missing video content for YouTube/Instagram Reels",
      "Could use more personal story content",
    ],
  };
}

function mockStrategist(input: StrategistInput) {
  return {
    platform_priority: [
      {
        platform: "LinkedIn",
        priority: 1,
        reasoning: "Primary platform for B2B coaching. Your niche aligns perfectly with LinkedIn's professional audience.",
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
      primary_content_type: "Thought leadership posts with actionable insights",
      content_pillars: [
        "Client transformation stories",
        "Contrarian industry takes",
        "Tactical how-tos",
        "Personal journey/lessons learned",
      ],
      posting_cadence: "LinkedIn 3x/week (Tue-Thu 8am), Twitter daily, Email weekly (Tuesday 6am)",
      engagement_strategy: "Spend 15-20 min after each LinkedIn post engaging with comments. Comment on 5-10 posts from ideal clients daily. Build relationships before pitching.",
    },
    quick_wins: [
      {
        action: "Turn your best podcast episode into a LinkedIn carousel + Twitter thread",
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
        action: "Set up a simple lead magnet from existing content",
        impact: "high",
        effort: "medium",
        timeframe: "Next 2 weeks",
      },
    ],
    recommendations: [
      "Your podcast is an untapped goldmine. One episode should generate 20+ pieces of content.",
      "Focus on LinkedIn for 90 days before expanding to other platforms.",
      "Build email list aggressively—it's the only audience you truly own.",
      "Document client wins religiously. Social proof drives conversions.",
      "Batch content creation: One 2-hour session can create a month of content.",
    ],
  };
}

/**
 * Sleep helper for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * OpenAI agent implementation with retry logic
 */
async function runOpenAIAgent(
  agentName: AgentName,
  input: AgentInput
): Promise<any> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY not set");
  }

  const systemPrompt = getSystemPrompt(agentName, input);
  const userPrompt = getUserPrompt(agentName, input);
  const schema = getSchema(agentName);

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delayMs = Math.pow(2, attempt) * 1000;
        console.log(`Retry attempt ${attempt} for ${agentName} after ${delayMs}ms delay`);
        await sleep(delayMs);
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7, // Slightly higher for more creative content
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 429 && attempt < maxRetries) {
          console.warn(`Rate limited on ${agentName}, will retry...`);
          lastError = new Error(`OpenAI API error: Too Many Requests`);
          continue;
        }
        throw new Error(`OpenAI API error: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      const parsed = JSON.parse(content);

      const validated = schema.parse(parsed);
      return validated;
    } catch (error: any) {
      lastError = error;
      if (error.name === "ZodError") {
        console.warn("Invalid JSON from LLM, falling back to mock...");
        return runMockAgent(agentName, input);
      }
      if (attempt < maxRetries && (error.message.includes("Too Many Requests") || error.message.includes("fetch"))) {
        continue;
      }
      throw error;
    }
  }

  console.error(`Agent ${agentName} failed after ${maxRetries} retries:`, lastError);
  throw new Error(`Agent ${agentName} failed: ${lastError?.message}`);
}

function getSystemPrompt(agentName: AgentName, input: AgentInput): string {
  const baseRules = `You are an expert content strategist for executive coaches and high-ticket service providers. You understand the coaching industry deeply. You write content that converts. No fluff. No generic advice. Every piece should feel like it was written by a coach who's been in the trenches.`;

  const clientContext = input.clientContext 
    ? `\n\nClient context:\n- Niche: ${input.clientContext.niche}\n- Target audience: ${input.clientContext.audience}\n- Active platforms: ${input.clientContext.platforms.join(", ")}`
    : "";

  switch (agentName) {
    case "archivist":
      return `${baseRules}${clientContext}\n\nYou are The Archivist. Analyze content (podcasts, videos, voice memos, written pieces) and extract its essence. Identify themes, voice tags, content type, quality, and most importantly: extract the KEY INSIGHTS that can be turned into standalone content pieces. These insights should be quotable, shareable moments. Return valid JSON only.`;
    
    case "placement":
      return `${baseRules}${clientContext}\n\nYou are The Placement Agent. Decide which platforms each piece of content is best suited for. Consider: LinkedIn for thought leadership and B2B, Twitter for quick insights and threads, Instagram for personal brand and visual content, Email for deep engagement and sales, Blog for SEO and evergreen content. Assess content potential (how many pieces can be generated from this). Return valid JSON only.`;
    
    case "compiler":
      return `${baseRules}${clientContext}\n\nYou are The Compiler. Look across all content and identify opportunities for content series: email sequences, blog series, LinkedIn series, lead magnets, or course modules. Group related pieces together. Identify gaps that need to be filled. Return valid JSON only.`;
    
    case "repurposer":
      return `${baseRules}${clientContext}\n\nYou are The Repurposer. This is the most important agent. Take source content and transform it into platform-native content that feels like it was written specifically for each platform.\n\nFor LinkedIn: Write hooks that stop the scroll. Use line breaks for readability. End with engagement-driving CTAs. Mix formats: stories, listicles, insights, hot takes, how-tos.\n\nFor Twitter: Write punchy threads. First tweet must hook. Each tweet should stand alone but flow together. Keep tweets under 280 chars.\n\nFor Instagram: Write hooks that show before "more". Use emojis sparingly. Include hashtags. Think carousel content.\n\nFor Email: Write like you're talking to a friend. Strong subject lines. Preview text that creates curiosity. Clear CTA.\n\nFor Blog: SEO-friendly outlines with clear structure.\n\nReturn valid JSON only.`;
    
    case "executive":
      return `${baseRules}${clientContext}\n\nYou are The Executive. Create a 30-day content calendar that balances consistency with sanity. Consider:\n- Platform optimal posting times and days\n- Content variety (don't post similar content back-to-back)\n- Sustainable cadence (3-5 LinkedIn/week, daily Twitter, 1-2 emails/week)\n- Strategic sequencing\n\nIdentify content gaps that need to be filled. Provide strategy notes. Return valid JSON only.`;
    
    case "strategist":
      return `${baseRules}\n\nYou are The Strategist. Analyze a coach's current situation and create a personalized content strategy. Consider their niche, audience, revenue level, current platforms, available time, and goals. Provide platform priorities with clear reasoning, content pillars, posting cadence, engagement strategy, quick wins, and actionable recommendations. Be specific and actionable. Return valid JSON only.`;
    
    default:
      return baseRules;
  }
}

function getUserPrompt(agentName: AgentName, input: AgentInput): string {
  switch (agentName) {
    case "archivist":
      return `Analyze this content piece:\n\nTitle: ${input.piece!.title}\nWord Count: ${input.piece!.wordCount}\nContent:\n${input.piece!.body.substring(0, 4000)}\n\nReturn JSON with: themes, voice_tags, content_type, status, quality_band, key_insights (extractable quotes/insights), notes.`;
    
    case "placement":
      return `Decide platform placement for this content:\n\nTitle: ${input.piece!.title}\nWord Count: ${input.piece!.wordCount}\nContent:\n${input.piece!.body.substring(0, 2000)}\n\nReturn JSON with: primary_platform, secondary_platforms, content_potential, recommended_formats, reasoning.`;
    
    case "compiler":
      return `Analyze these content pieces and identify series opportunities:\n\n${input.pieces!.map((p) => `- ${p.title} (${p.wordCount} words)\n  Themes: ${p.archivistTags?.themesJson || "unknown"}`).join("\n\n")}\n\nReturn JSON with: content_series (array), standalone_pieces (array of IDs that don't fit series).`;
    
    case "repurposer":
      return `Transform this content into platform-native pieces:\n\nTitle: ${input.piece!.title}\nContent:\n${input.piece!.body.substring(0, 6000)}\n\nGenerate:\n- 5-7 LinkedIn posts (mix of formats: story, listicle, insight, question, hot_take)\n- 3-5 Twitter threads (3-15 tweets each)\n- 3-5 Instagram captions with carousel ideas\n- 1-2 email newsletter drafts\n- 1 blog post outline\n\nMake each piece feel native to its platform. Hooks must stop the scroll. Content must provide real value. CTAs must drive engagement.\n\nReturn JSON with: source_piece_id, linkedin_posts, twitter_threads, instagram_captions, email_drafts, blog_outlines.`;
    
    case "executive":
      return `Create a 30-day content calendar from these pieces:\n\n${input.pieces!.map((p) => `- ${p.title}: ${p.placement?.primaryPlatform || "unprocessed"}`).join("\n")}\n\nConsider optimal posting times:\n- LinkedIn: Tue-Thu, 8am/12pm/5pm\n- Twitter: Weekdays, 9am/12pm/3pm/6pm\n- Instagram: Mon/Wed/Fri, 11am/2pm/7pm\n- Email: Tue/Thu, 6am/10am\n\nReturn JSON with: calendar (array of entries with date, time, platform, content_type), weekly_breakdown, strategy_notes, content_gaps.`;
    
    case "strategist":
      const si = input.strategistInput!;
      return `Create a content strategy for this coach:\n\nNiche: ${si.coaching_niche}\nTarget Audience: ${si.target_audience}\nCurrent Revenue: ${si.current_revenue}\nCurrent Platforms: ${si.current_platforms.join(", ")}\nAudience Size:\n${Object.entries(si.audience_size).map(([k, v]) => `  - ${k}: ${v || 0}`).join("\n")}\nWeekly Hours for Content: ${si.content_time_weekly_hours}\nPrimary Goal: ${si.primary_goal}\nContent Sources: ${si.current_content_sources.join(", ")}\n\nReturn JSON with: platform_priority, content_strategy, quick_wins, recommendations.`;
    
    default:
      return "";
  }
}

function getSchema(agentName: AgentName): z.ZodSchema {
  switch (agentName) {
    case "archivist":
      return ArchivistOutputSchema;
    case "placement":
      return PlacementOutputSchema;
    case "compiler":
      return CompilerOutputSchema;
    case "repurposer":
      return RepurposeOutputSchema;
    case "executive":
      return ExecutiveOutputSchema;
    case "strategist":
      return StrategistOutputSchema;
    default:
      throw new Error(`No schema for agent: ${agentName}`);
  }
}
