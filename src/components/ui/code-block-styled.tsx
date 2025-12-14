"use client"

import { Geist_Mono } from 'next/font/google';
import { highlight } from 'sugar-high';
import React, { useCallback, useMemo, useState, lazy, Suspense } from 'react';
import { cn } from "lib/utils"
import { Check, Copy, WrapText, ArrowLeftRight } from 'lucide-react';

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  preload: true,
  display: 'swap',
});

interface CodeBlockProps {
  language: string | undefined;
  children: string;
  elementKey: string;
}

// Lazy-loaded CodeBlock component for large blocks
const LazyCodeBlockComponent: React.FC<CodeBlockProps> = ({ children, language, elementKey }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isWrapped, setIsWrapped] = useState(false);
  const lineCount = useMemo(() => children.split('\n').length, [children]);

  // Synchronous highlighting for better performance
  const highlightedCode = useMemo(() => {
    try {
      return children.length < 10000 ? highlight(children) : children;
    } catch (error) {
      console.warn('Syntax highlighting failed, using plain text:', error);
      return children;
    }
  }, [children]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(children);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  }, [children]);

  const toggleWrap = useCallback(() => {
    setIsWrapped((prev) => !prev);
  }, []);

  return (
    <div className="group relative my-5 rounded-xl border border-border bg-accent overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-accent border-b border-border">
        <div className="flex items-center gap-2">
          {language && (
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{language}</span>
          )}
          <span className="text-xs text-muted-foreground">{lineCount} lines</span>
        </div>

        <div className="flex gap-1">
          <button
            onClick={toggleWrap}
            className={cn(
              'p-1 rounded border border-border bg-background shadow-sm transition-colors',
              isWrapped ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
            title={isWrapped ? 'Disable wrap' : 'Enable wrap'}
          >
            {isWrapped ? <ArrowLeftRight size={12} /> : <WrapText size={12} />}
          </button>
          <button
            onClick={handleCopy}
            className={cn(
              'p-1 rounded border border-border bg-background shadow-sm transition-colors',
              isCopied ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
            title={isCopied ? 'Copied!' : 'Copy code'}
          >
            {isCopied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          className={cn(
            'font-mono text-sm leading-relaxed p-2',
            isWrapped && 'whitespace-pre-wrap break-words',
            !isWrapped && 'whitespace-pre overflow-x-auto',
          )}
          style={{
            fontFamily: geistMono.style.fontFamily,
          }}
          dangerouslySetInnerHTML={{
            __html: highlightedCode,
          }}
        />
      </div>
    </div>
  );
};

const LazyCodeBlock = lazy(() => Promise.resolve({ default: LazyCodeBlockComponent }));

// Synchronous CodeBlock component for smaller blocks
const SyncCodeBlock: React.FC<CodeBlockProps> = ({ language, children, elementKey }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isWrapped, setIsWrapped] = useState(false);
  const lineCount = useMemo(() => children.split('\n').length, [children]);

  const highlightedCode = useMemo(() => {
    try {
      return highlight(children);
    } catch (error) {
      console.warn('Syntax highlighting failed, using plain text:', error);
      return children;
    }
  }, [children]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(children);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  }, [children]);

  const toggleWrap = useCallback(() => {
    setIsWrapped((prev) => !prev);
  }, []);

  return (
    <div className="group relative my-5 rounded-xl border border-border bg-accent overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-accent border-b border-border">
        <div className="flex items-center gap-2">
          {language && (
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{language}</span>
          )}
          <span className="text-xs text-muted-foreground">{lineCount} lines</span>
        </div>

        <div className="flex gap-1">
          <button
            onClick={toggleWrap}
            className={cn(
              'p-1 rounded border border-border bg-background shadow-sm transition-colors',
              isWrapped ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
            title={isWrapped ? 'Disable wrap' : 'Enable wrap'}
          >
            {isWrapped ? <ArrowLeftRight size={12} /> : <WrapText size={12} />}
          </button>
          <button
            onClick={handleCopy}
            className={cn(
              'p-1 rounded border border-border bg-background shadow-sm transition-colors',
              isCopied ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
            title={isCopied ? 'Copied!' : 'Copy code'}
          >
            {isCopied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          className={cn(
            'font-mono text-sm leading-relaxed p-4',
            'selection:bg-primary/20 selection:text-foreground',
            isWrapped && 'whitespace-pre-wrap break-words',
            !isWrapped && 'whitespace-pre overflow-x-auto',
          )}
          style={{
            fontFamily: geistMono.style.fontFamily,
            lineHeight: '1.6',
          }}
          dangerouslySetInnerHTML={{
            __html: highlightedCode,
          }}
        />
      </div>
    </div>
  );
};

const StyledCodeBlock: React.FC<CodeBlockProps> = React.memo(
  ({ language, children, elementKey }) => {
    // Use lazy loading for large code blocks
    if (children.length > 5000) {
      return (
        <Suspense fallback={
          <div className="group relative my-5 rounded-xl border border-border bg-accent overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-accent border-b border-border">
              <div className="flex items-center gap-2">
                {language && (
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{language}</span>
                )}
                <span className="text-xs text-muted-foreground">{children.split('\n').length} lines</span>
              </div>
            </div>
            <div className="font-mono text-sm leading-relaxed p-4 text-muted-foreground">
              <div className="animate-pulse">Loading code block...</div>
            </div>
          </div>
        }>
          <LazyCodeBlock language={language} elementKey={elementKey}>
            {children}
          </LazyCodeBlock>
        </Suspense>
      );
    }

    // Use synchronous rendering for smaller blocks
    return <SyncCodeBlock language={language} elementKey={elementKey}>{children}</SyncCodeBlock>;
  },
  (prevProps, nextProps) => {
    return (
      prevProps.children === nextProps.children &&
      prevProps.language === nextProps.language &&
      prevProps.elementKey === nextProps.elementKey
    );
  },
);

StyledCodeBlock.displayName = 'StyledCodeBlock';

export { StyledCodeBlock };
