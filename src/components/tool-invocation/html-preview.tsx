import { useCopy } from "@/hooks/use-copy";
import { ToolUIPart } from "ai";
import { cn, toAny } from "lib/utils";
import {
  CheckIcon,
  ChevronRight,
  CopyIcon,
  ExternalLinkIcon,
  MaximizeIcon,
  MinimizeIcon,
} from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { CodeBlock } from "ui/CodeBlock";
import { Button } from "ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui/tabs";

export const HtmlPreview = memo(function HtmlPreview({
  part,
  onResult,
}: {
  part: ToolUIPart;
  onResult?: (result?: any) => void;
}) {
  const { copy, copied } = useCopy();
  const [isExpanded, setIsExpanded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasRendered = useRef(false);

  const input = toAny(part.input);
  const html = input?.html || "";
  const title = input?.title || "HTML Preview";

  useEffect(() => {
    if (!hasRendered.current && html && part.state.startsWith("input")) {
      hasRendered.current = true;
      onResult?.({
        success: true,
        message: "HTML preview rendered successfully",
        guide:
          "The HTML page has been rendered in a live preview above. Users can see and interact with the page directly.",
      });
    }
  }, [html, part.state, onResult]);

  const handleOpenInNewTab = useCallback(() => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }, [html]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <ChevronRight className="size-4" />
            <span>{title}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={toggleExpanded}
            title={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? (
              <MinimizeIcon className="size-4" />
            ) : (
              <MaximizeIcon className="size-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={handleOpenInNewTab}
            title="Open in new tab"
          >
            <ExternalLinkIcon className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => copy(html)}
            title="Copy HTML"
          >
            {copied ? (
              <CheckIcon className="size-4 text-green-500" />
            ) : (
              <CopyIcon className="size-4" />
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">HTML Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="mt-3">
          <div
            className={cn(
              "relative w-full rounded-lg border bg-white overflow-hidden transition-all",
              isExpanded ? "h-[80vh]" : "h-[500px]",
            )}
          >
            <iframe
              ref={iframeRef}
              srcDoc={html}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin"
              title={title}
            />
          </div>
        </TabsContent>
        <TabsContent value="code" className="mt-3">
          <div className="relative">
            <CodeBlock
              code={html}
              language="html"
              className="max-h-[500px] overflow-auto"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
});
