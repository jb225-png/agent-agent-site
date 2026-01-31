/* eslint-disable react/no-unescaped-entities */
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: "2px solid #000",
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.5,
    marginBottom: 8,
  },
  bulletList: {
    marginLeft: 15,
  },
  bulletItem: {
    fontSize: 11,
    marginBottom: 6,
    lineHeight: 1.4,
  },
  contentBox: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    marginBottom: 12,
    borderRadius: 4,
  },
  contentBoxTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
  },
  contentBoxText: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  platformBadge: {
    backgroundColor: "#000",
    color: "#fff",
    padding: "4 8",
    fontSize: 9,
    marginRight: 6,
    marginBottom: 6,
  },
  platformRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  calendarEntry: {
    flexDirection: "row",
    borderBottom: "1px solid #eee",
    paddingVertical: 8,
  },
  calendarDate: {
    width: 80,
    fontSize: 10,
    fontWeight: "bold",
  },
  calendarPlatform: {
    width: 80,
    fontSize: 10,
  },
  calendarContent: {
    flex: 1,
    fontSize: 10,
  },
  ctaBox: {
    backgroundColor: "#000",
    color: "#fff",
    padding: 20,
    marginTop: 30,
    textAlign: "center",
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 12,
    marginBottom: 15,
  },
  ctaPrice: {
    fontSize: 24,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: "center",
    fontSize: 9,
    color: "#999",
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 50,
    fontSize: 9,
    color: "#999",
  },
});

// Type definitions
interface AuditData {
  clientName: string;
  businessName?: string;
  email: string;
  platforms: string[];
  contentTypes: string[];
  
  // From Archivist
  themes: string[];
  contentType: string;
  qualityBand: string;
  keyInsights: string[];
  
  // From Placement
  primaryPlatform: string;
  secondaryPlatforms: string[];
  contentPotential: string;
  
  // From Repurposer - sample outputs
  sampleOutputs: {
    platform: string;
    format: string;
    content: string;
  }[];
  
  // From Executive - calendar preview
  calendarPreview: {
    date: string;
    platform: string;
    contentType: string;
  }[];
  
  // Gaps identified
  gaps: string[];
  
  generatedAt: string;
}

interface AuditPDFProps {
  data: AuditData;
}

export function AuditPDF({ data }: AuditPDFProps) {
  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={{ marginTop: 150 }}>
          <Text style={{ fontSize: 36, fontWeight: "bold", marginBottom: 20 }}>
            Content Audit Report
          </Text>
          <Text style={{ fontSize: 18, marginBottom: 40 }}>
            Prepared for {data.clientName}
            {data.businessName && ` • ${data.businessName}`}
          </Text>
          <Text style={{ fontSize: 12, color: "#666" }}>
            Generated {data.generatedAt}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text>Agent-Agent • Content Operations for Executive Coaches</Text>
        </View>
      </Page>

      {/* Analysis Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Analysis</Text>
          <Text style={styles.paragraph}>
            We analyzed your content sample and here's what we found:
          </Text>
          
          <View style={styles.contentBox}>
            <Text style={styles.contentBoxTitle}>Content Type</Text>
            <Text style={styles.contentBoxText}>{data.contentType}</Text>
          </View>
          
          <View style={styles.contentBox}>
            <Text style={styles.contentBoxTitle}>Quality Assessment</Text>
            <Text style={styles.contentBoxText}>
              {data.qualityBand === "A" && "Excellent content with high repurposing potential"}
              {data.qualityBand === "B" && "Strong content with good repurposing potential"}
              {data.qualityBand === "C" && "Solid content that can be enhanced through repurposing"}
            </Text>
          </View>
          
          <View style={styles.contentBox}>
            <Text style={styles.contentBoxTitle}>Key Themes Identified</Text>
            <View style={styles.bulletList}>
              {data.themes.map((theme, i) => (
                <Text key={i} style={styles.bulletItem}>• {theme}</Text>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platform Recommendations</Text>
          <Text style={styles.paragraph}>
            Based on your content and audience, here's where it should go:
          </Text>
          
          <View style={styles.contentBox}>
            <Text style={styles.contentBoxTitle}>Primary Platform</Text>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>{data.primaryPlatform}</Text>
            <Text style={styles.contentBoxText}>
              Content potential: {data.contentPotential}
            </Text>
          </View>
          
          {data.secondaryPlatforms.length > 0 && (
            <View style={styles.contentBox}>
              <Text style={styles.contentBoxTitle}>Secondary Platforms</Text>
              <View style={styles.platformRow}>
                {data.secondaryPlatforms.map((p, i) => (
                  <Text key={i} style={styles.platformBadge}>{p}</Text>
                ))}
              </View>
            </View>
          )}
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </Page>

      {/* Sample Outputs Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sample Repurposed Content</Text>
          <Text style={styles.paragraph}>
            Here is a preview of what we created from your single content piece:
          </Text>
          
          {data.sampleOutputs.slice(0, 3).map((output, i) => (
            <View key={i} style={styles.contentBox}>
              <Text style={styles.contentBoxTitle}>
                {output.platform} • {output.format}
              </Text>
              <Text style={styles.contentBoxText}>
                {output.content.slice(0, 500)}
                {output.content.length > 500 && "..."}
              </Text>
            </View>
          ))}
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </Page>

      {/* Calendar Preview Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>30-Day Calendar Preview</Text>
          <Text style={styles.paragraph}>
            Here is how we would schedule your content for maximum impact:
          </Text>
          
          <View style={{ marginTop: 15 }}>
            <View style={[styles.calendarEntry, { borderBottom: "2px solid #000" }]}>
              <Text style={[styles.calendarDate, { fontWeight: "bold" }]}>Date</Text>
              <Text style={[styles.calendarPlatform, { fontWeight: "bold" }]}>Platform</Text>
              <Text style={[styles.calendarContent, { fontWeight: "bold" }]}>Content Type</Text>
            </View>
            {data.calendarPreview.slice(0, 15).map((entry, i) => (
              <View key={i} style={styles.calendarEntry}>
                <Text style={styles.calendarDate}>{entry.date}</Text>
                <Text style={styles.calendarPlatform}>{entry.platform}</Text>
                <Text style={styles.calendarContent}>{entry.contentType}</Text>
              </View>
            ))}
          </View>
        </View>

        {data.gaps.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Content Gaps Identified</Text>
            <View style={styles.bulletList}>
              {data.gaps.map((gap, i) => (
                <Text key={i} style={styles.bulletItem}>• {gap}</Text>
              ))}
            </View>
          </View>
        )}

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </Page>

      {/* CTA Page */}
      <Page size="A4" style={styles.page}>
        <View style={{ marginTop: 80 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
            Ready to Scale Your Content?
          </Text>
          <Text style={[styles.paragraph, { fontSize: 14 }]}>
            This audit shows what is possible from just ONE piece of content.
            Imagine what we could do with your entire library.
          </Text>
        </View>

        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>What You Get as a Client</Text>
          <View style={[styles.bulletList, { color: "#fff", marginTop: 15 }]}>
            <Text style={[styles.bulletItem, { color: "#fff" }]}>
              • 20-30 pieces of repurposed content per month
            </Text>
            <Text style={[styles.bulletItem, { color: "#fff" }]}>
              • Complete 30-day publishing calendar
            </Text>
            <Text style={[styles.bulletItem, { color: "#fff" }]}>
              • Platform-specific formatting
            </Text>
            <Text style={[styles.bulletItem, { color: "#fff" }]}>
              • Monthly strategy call
            </Text>
          </View>
          <Text style={[styles.ctaPrice, { marginTop: 20 }]}>
            Starting at $2,500/month
          </Text>
        </View>

        <View style={{ marginTop: 30 }}>
          <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 10 }}>
            Next Steps:
          </Text>
          <Text style={styles.paragraph}>
            1. Book your strategy call (if you have not already)
          </Text>
          <Text style={styles.paragraph}>
            2. We'll walk through this audit together
          </Text>
          <Text style={styles.paragraph}>
            3. Choose your tier and get started
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>Questions? Reply to this email or book at agent-agent.com/call</Text>
        </View>
      </Page>
    </Document>
  );
}

export type { AuditData };
