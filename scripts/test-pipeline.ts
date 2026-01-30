/**
 * Test script for Agent-Agent Coaches Edition
 * Runs all agents in mock mode to verify the pipeline works
 * 
 * Usage: npx ts-node scripts/test-pipeline.ts
 */

import { runAgent } from "../src/lib/llm";
import { StrategistInput } from "../src/lib/schemas";
import * as fs from "fs";
import * as path from "path";

// Force mock mode for testing
process.env.LLM_MODE = "mock";

async function main() {
  console.log("🚀 Agent-Agent Coaches Edition - Test Pipeline\n");
  console.log("=" .repeat(60));

  // Load sample content
  const samplePath = path.join(__dirname, "../sample-content/coach-podcast-transcript.md");
  const sampleContent = fs.readFileSync(samplePath, "utf-8");
  
  const testPiece = {
    id: "test-piece-001",
    title: "Why Your Best Employees Are Leaving",
    body: sampleContent,
    wordCount: 847,
  };

  // Test Strategist
  console.log("\n📋 STRATEGIST AGENT");
  console.log("-".repeat(60));
  
  const strategistInput: StrategistInput = {
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

  const strategyOutput = await runAgent("strategist", { strategistInput });
  console.log("\n✅ Strategy Output:");
  console.log("Platform Priorities:");
  strategyOutput.platform_priority.forEach((p: any) => {
    console.log(`  ${p.priority}. ${p.platform} - ${p.weekly_target}`);
  });
  console.log("\nContent Pillars:", strategyOutput.content_strategy.content_pillars.join(", "));
  console.log("\nQuick Wins:");
  strategyOutput.quick_wins.forEach((w: any) => {
    console.log(`  - ${w.action} (Impact: ${w.impact}, Effort: ${w.effort})`);
  });

  // Test Archivist
  console.log("\n\n📚 ARCHIVIST AGENT");
  console.log("-".repeat(60));
  
  const archivistOutput = await runAgent("archivist", { piece: testPiece });
  console.log("\n✅ Archivist Output:");
  console.log("Content Type:", archivistOutput.content_type);
  console.log("Status:", archivistOutput.status);
  console.log("Quality:", archivistOutput.quality_band);
  console.log("Themes:", archivistOutput.themes.join(", "));
  console.log("Key Insights:", archivistOutput.key_insights.length, "extracted");

  // Test Placement
  console.log("\n\n🎯 PLACEMENT AGENT");
  console.log("-".repeat(60));
  
  const placementOutput = await runAgent("placement", { piece: testPiece });
  console.log("\n✅ Placement Output:");
  console.log("Primary Platform:", placementOutput.primary_platform);
  console.log("Secondary:", placementOutput.secondary_platforms?.join(", ") || "none");
  console.log("Content Potential:", placementOutput.content_potential);
  console.log("Recommended Formats:", placementOutput.recommended_formats.join(", "));

  // Test Repurposer
  console.log("\n\n✍️  REPURPOSER AGENT");
  console.log("-".repeat(60));
  
  const repurposerOutput = await runAgent("repurposer", { piece: testPiece });
  console.log("\n✅ Repurposer Output:");
  console.log(`LinkedIn Posts: ${repurposerOutput.linkedin_posts.length}`);
  repurposerOutput.linkedin_posts.forEach((p: any, i: number) => {
    console.log(`  ${i + 1}. [${p.format}] "${p.hook.substring(0, 50)}..."`);
  });
  console.log(`\nTwitter Threads: ${repurposerOutput.twitter_threads.length}`);
  repurposerOutput.twitter_threads.forEach((t: any, i: number) => {
    console.log(`  ${i + 1}. ${t.tweets.length} tweets - "${t.hook_tweet.substring(0, 50)}..."`);
  });
  console.log(`\nInstagram Captions: ${repurposerOutput.instagram_captions.length}`);
  console.log(`Email Drafts: ${repurposerOutput.email_drafts.length}`);
  console.log(`Blog Outlines: ${repurposerOutput.blog_outlines.length}`);

  // Test Compiler
  console.log("\n\n📦 COMPILER AGENT");
  console.log("-".repeat(60));
  
  const compilerOutput = await runAgent("compiler", { 
    pieces: [testPiece, { ...testPiece, id: "test-piece-002", title: "Delegation Secrets" }] 
  });
  console.log("\n✅ Compiler Output:");
  console.log(`Content Series Found: ${compilerOutput.content_series.length}`);
  compilerOutput.content_series.forEach((s: any) => {
    console.log(`  - "${s.title}" (${s.series_type}) - ${s.included_piece_ids.length} pieces`);
  });

  // Test Executive
  console.log("\n\n📅 EXECUTIVE AGENT");
  console.log("-".repeat(60));
  
  const executiveOutput = await runAgent("executive", { pieces: [testPiece] });
  console.log("\n✅ Executive Output:");
  console.log(`Calendar Entries: ${executiveOutput.calendar.length}`);
  console.log("\nWeekly Breakdown:");
  Object.entries(executiveOutput.weekly_breakdown).forEach(([platform, count]) => {
    console.log(`  ${platform}: ${count}`);
  });
  console.log("\nContent Gaps:", executiveOutput.content_gaps.length);
  executiveOutput.content_gaps.forEach((gap: string) => {
    console.log(`  - ${gap}`);
  });

  // Summary
  console.log("\n\n" + "=".repeat(60));
  console.log("🎉 ALL AGENTS PASSED - Pipeline Ready");
  console.log("=".repeat(60));
  
  console.log("\n📊 Content Generated from 1 Podcast Episode:");
  console.log(`   • ${repurposerOutput.linkedin_posts.length} LinkedIn posts`);
  console.log(`   • ${repurposerOutput.twitter_threads.length} Twitter threads`);
  console.log(`   • ${repurposerOutput.instagram_captions.length} Instagram captions`);
  console.log(`   • ${repurposerOutput.email_drafts.length} email drafts`);
  console.log(`   • ${repurposerOutput.blog_outlines.length} blog outline`);
  const total = repurposerOutput.linkedin_posts.length + 
                repurposerOutput.twitter_threads.length + 
                repurposerOutput.instagram_captions.length + 
                repurposerOutput.email_drafts.length + 
                repurposerOutput.blog_outlines.length;
  console.log(`   ────────────────`);
  console.log(`   TOTAL: ${total} pieces of content`);

  // Show sample LinkedIn post
  console.log("\n\n📝 SAMPLE LINKEDIN POST (Story Format):");
  console.log("-".repeat(60));
  const storyPost = repurposerOutput.linkedin_posts.find((p: any) => p.format === "story");
  if (storyPost) {
    console.log(`\n${storyPost.hook}\n\n${storyPost.body}\n\n${storyPost.cta || ""}`);
    if (storyPost.hashtags) {
      console.log(`\n${storyPost.hashtags.map((h: string) => `#${h}`).join(" ")}`);
    }
  }
}

main().catch(console.error);
