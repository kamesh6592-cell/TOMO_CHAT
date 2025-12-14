"use client";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { useTheme } from "next-themes";
import { Fragment, useLayoutEffect, useState } from "react";
import type { JSX, ReactNode } from "react";
import { codeToHast } from "shiki/bundle/web";
import { safe } from "ts-safe";
import { jsx, jsxs } from "react/jsx-runtime";
import { cn } from "lib/utils";
import { StyledCodeBlock } from "./code-block-styled";

export function CodeBlock({
  code,
  lang,
  fallback,
  className,
  showLineNumbers = true,
  useStyledVariant = false,
}: {
  code?: string;
  lang: string;
  fallback?: ReactNode;
  className?: string;
  showLineNumbers?: boolean;
  useStyledVariant?: boolean;
}) {
  const { theme } = useTheme();

  const [component, setComponent] = useState<JSX.Element | null>(null);

  // Use styled variant if requested
  if (useStyledVariant && code) {
    return (
      <StyledCodeBlock 
        language={lang}
        elementKey={`${lang}-${code.slice(0, 50)}`}
      >
        {code}
      </StyledCodeBlock>
    );
  }

  useLayoutEffect(() => {
    safe()
      .map(async () => {
        const out = await codeToHast(code || "", {
          lang: lang,
          theme: theme == "dark" ? "dark-plus" : "github-light",
        });
        return toJsxRuntime(out, {
          Fragment,
          jsx,
          jsxs,
          components: {
            pre: (props) => (
              <pre
                {...props}
                lang={lang}
                style={undefined}
                className={cn(props.className, className)}
              >
                <div className={cn(showLineNumbers && "pl-12 relative")}>
                  {showLineNumbers && (
                    <div className="absolute left-0 top-0 w-6 flex flex-col select-none text-right text-muted-foreground">
                      {code?.split("\n").map((_, index) => (
                        <span key={index}>{index + 1}</span>
                      ))}
                    </div>
                  )}
                  {props.children}
                </div>
              </pre>
            ),
          },
        }) as JSX.Element;
      })
      .ifOk(setComponent);
  }, [theme, lang, code]);

  if (!code) return fallback;

  return component ?? fallback;
}
