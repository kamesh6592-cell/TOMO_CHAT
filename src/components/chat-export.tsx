"use client";

import { useState } from "react";
import {
  Download,
  FileText,
  FileDown,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "ui/dropdown-menu";
import { UIMessage } from "ai";
import jsPDF from "jspdf";

interface ChatExportProps {
  messages: UIMessage[];
  chatTitle?: string;
}

export function ChatExport({ messages, chatTitle }: ChatExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportToMarkdown = async () => {
    setIsExporting(true);
    try {
      let markdown = `# ${chatTitle || "Chat Export"}\n\n`;
      markdown += `**Exported from TOMO**\n`;
      markdown += `**Date:** ${formatDate()}\n`;
      markdown += `**Total Messages:** ${messages.length}\n\n`;
      markdown += `---\n\n`;

      messages.forEach((message, index) => {
        const role = message.role === "user" ? "You" : "TOMO";
        markdown += `## ${role}\n\n`;

        // Extract text from parts
        const textContent = message.parts
          .filter((part: any) => part.type === "text")
          .map((part: any) => part.text)
          .join("\n\n");

        markdown += `${textContent || ""}\n\n`;

        if (index < messages.length - 1) {
          markdown += `---\n\n`;
        }
      });

      markdown += `\n---\n\n`;
      markdown += `*This chat was exported from TOMO - Your AI Assistant*\n`;
      markdown += `*Visit: https://tomo.com*\n`;

      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tomo-chat-${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
    } catch (error) {
      console.error("Markdown export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      // Generate HTML instead of direct PDF for better styling
      let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${chatTitle || "Chat Export"}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: #ffffff;
            padding: 60px 80px;
            line-height: 1.6;
            color: #1f2937;
        }
        
        .logo {
            display: flex;
            align-items: center;
            margin-bottom: 40px;
        }
        
        .logo-icon {
            width: 32px;
            height: 32px;
            margin-right: 12px;
        }
        
        .logo-text {
            font-size: 24px;
            font-weight: 400;
            color: #1f2937;
            letter-spacing: -0.5px;
        }
        
        h1 {
            font-size: 20px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 8px;
        }
        
        .subtitle {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 30px;
        }
        
        h2 {
            font-size: 14px;
            font-weight: 600;
            color: #111827;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        
        .text-content {
            font-size: 13px;
            color: #4b5563;
            line-height: 1.7;
            margin-bottom: 20px;
        }
        
        .code-block {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 25px;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.6;
            overflow-x: auto;
        }
        
        .code-block pre {
            margin: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        .keyword { color: #7c3aed; font-weight: 600; }
        .class-name { color: #0891b2; font-weight: 600; }
        .method { color: #0891b2; }
        .string { color: #059669; }
        .comment { color: #6b7280; font-style: italic; }
        .number { color: #ea580c; }
        
        .footer {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer p {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 20px;
        }
        
        .footer-icon {
            text-align: center;
            font-size: 20px;
            color: #9ca3af;
            margin: 30px 0;
        }
        
        @media print {
            body { padding: 40px; }
            .code-block { break-inside: avoid; }
            h2 { break-after: avoid; }
        }
    </style>
</head>
<body>
    <div class="logo">
        <img src="/aj-logo.jpg" alt="Logo" class="logo-icon" />
        <div class="logo-text">TOMO Chat</div>
    </div>
    
    <h1>${chatTitle || "Chat Export"}</h1>
    <p class="subtitle">Exported on ${formatDate()}</p>
`;

      let messageCount = 0;
      messages.forEach((message) => {
        const textContent =
          message.parts
            ?.filter((part: any) => part.type === "text")
            .map((part: any) => part.text)
            .join("\n\n") || "";

        if (!textContent.trim()) return;
        
        messageCount++;
        const role = message.role === "user" ? "Question" : "Response";
        
        html += `    <h2>${messageCount}) ${role}</h2>\n`;
        
        // Check if content has code
        const hasCode = textContent.includes('```') || 
                       textContent.match(/\b(class|function|import|public|void)\b/);
        
        if (hasCode) {
          let codeContent = textContent.replace(/```[\w]*\n?/g, '').trim();
          
          // Apply syntax highlighting
          codeContent = codeContent
            .replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/\b(public|class|static|void|import|return|if|else|for|while|int|String|new|private|protected|extends|implements|package|try|catch|finally|throw|throws)\b/g, '<span class="keyword">$1</span>')
            .replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, '<span class="class-name">$1</span>')
            .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
            .replace(/\/\/(.*)/g, '<span class="comment">//$1</span>')
            .replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
          
          html += `    <div class="code-block"><pre>${codeContent}</pre></div>\n`;
        } else {
          html += `    <p class="text-content">${textContent.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</p>\n`;
        }
      });

      html += `
    <div class="footer">
        <p>Total messages: ${messageCount} | Chat: ${chatTitle || "Untitled"}</p>
        <div class="footer-icon">☘</div>
    </div>
</body>
</html>`;

      // Open HTML in new window for print/save as PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        
        // Wait for content to load then trigger print dialog
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 250);
        };
      }

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
      
      return; // Skip old PDF code
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let yPosition = 20;

      // Add AJ Logo image
      try {
        const logoImg = await fetch('/aj-logo.jpg').then(res => res.blob()).then(blob => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        });
        doc.addImage(logoImg as string, 'JPEG', margin, yPosition - 5, 10, 10);
      } catch (e) {
        console.warn('Logo load failed, using fallback');
      }
      
      doc.setTextColor(31, 41, 55); // Dark gray
      doc.setFontSize(18);
      doc.setFont("helvetica", "normal");
      doc.text("TOMO Chat", margin + 14, yPosition);
      
      yPosition += 15;

      // Main title - exactly like image
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(17, 24, 39); // Near black
      const titleText = chatTitle || "Chat Export from TOMO";
      doc.text(titleText, margin, yPosition);
      yPosition += 7;

      // Subtitle - gray descriptive text
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(75, 85, 99); // Medium gray
      doc.text(`Here is your exported conversation.`, margin, yPosition);
      yPosition += 15;

      // Process messages - each as numbered section
      let pdfMessageCount = 0;
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        
        // Only show non-empty messages
        const textContent =
          message.parts
            ?.filter((part: any) => part.type === "text")
            .map((part: any) => part.text)
            .join("\n\n") || "";

        if (!textContent.trim()) continue;
        
        pdfMessageCount++;

        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = margin;
        }

        // Section number/header - bold, black
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(17, 24, 39);
        const role = message.role === "user" ? "Question" : "Response";
        doc.text(`${pdfMessageCount}) ${role}`, margin, yPosition);
        yPosition += 8;

        // Detect if content contains code
        const hasCodeBlock = textContent.includes('```') || 
                            textContent.includes('public class') ||
                            textContent.includes('function') ||
                            textContent.includes('import ') ||
                            textContent.includes('{') && textContent.includes('}');

        if (hasCodeBlock) {
          // Remove markdown code fences if present
          const codeContent = textContent.replace(/```[\w]*\n?/g, '').trim();
          
          const lines = doc.splitTextToSize(codeContent, contentWidth - 12);
          const boxHeight = lines.length * 4.2 + 10;

          // Dark code block background (like VS Code)
          doc.setFillColor(249, 250, 251); // Light gray background
          doc.setDrawColor(229, 231, 235); // Border
          doc.roundedRect(margin, yPosition - 2, contentWidth, boxHeight, 2, 2, "FD");

          // Code text with syntax-like coloring
          doc.setFontSize(7.5);
          doc.setFont("courier", "normal");

          let lineY = yPosition + 3;
          for (const line of lines) {
            if (lineY > pageHeight - 30) {
              doc.addPage();
              lineY = margin;
            }
            
            // Color keywords differently
            if (line.match(/\b(public|class|static|void|import|return|if|else|for|while|int|String|new)\b/)) {
              doc.setTextColor(124, 58, 237); // Purple for keywords
            } else if (line.match(/["'].*["']/)) {
              doc.setTextColor(5, 150, 105); // Green for strings
            } else if (line.match(/\/\/.*/)) {
              doc.setTextColor(107, 114, 128); // Gray for comments
            } else {
              doc.setTextColor(31, 41, 55); // Dark gray default
            }
            
            doc.text(line, margin + 6, lineY);
            lineY += 4.2;
          }

          yPosition = lineY + 5;
        } else {
          // Regular text (non-code) - cleaner formatting
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(31, 41, 55);
          
          const lines = doc.splitTextToSize(textContent, contentWidth - 4);
          
          let lineY = yPosition;
          for (const line of lines) {
            if (lineY > pageHeight - 30) {
              doc.addPage();
              lineY = margin;
            }
            doc.text(line, margin, lineY);
            lineY += 5;
          }

          yPosition = lineY + 8;
        }
      }

      // Footer section - exactly like perplexity
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = margin;
      }

      yPosition += 10;

      // Suggestion text (like "If you say which level...")
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text(
        `Exported from TOMO Chat on ${formatDate()}. Total messages: ${messageCount}`,
        margin,
        yPosition
      );
      yPosition += 15;

      // Separator line
      doc.setDrawColor(229, 231, 235);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;

      // Decorative clover icon
      doc.setTextColor(156, 163, 175); // Light gray
      doc.setFontSize(16);
      doc.text("☘", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 15;

      // Reference-style footer links (smaller text)
      doc.setFontSize(7);
      doc.setTextColor(107, 114, 128);
      const footerLinks = [
        "1. https://tomo-chat.com",
        "2. Generated with TOMO AI Assistant",
        "3. Visit us for more conversations"
      ];
      
      footerLinks.forEach((link, idx) => {
        doc.text(link, margin, yPosition);
        yPosition += 5;
      });

      // Save PDF
      doc.save(`tomo-chat-export-${Date.now()}.pdf`);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
    } catch (error) {
      console.error("PDF export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={isExporting || messages.length === 0}
        >
          {isExporting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : exportSuccess ? (
            <CheckCircle2 className="size-4 text-green-500" />
          ) : (
            <Download className="size-4" />
          )}
          <span className="hidden sm:inline">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={exportToPDF}
          className="gap-2 cursor-pointer"
        >
          <FileDown className="size-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={exportToMarkdown}
          className="gap-2 cursor-pointer"
        >
          <FileText className="size-4" />
          Export as Markdown
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
