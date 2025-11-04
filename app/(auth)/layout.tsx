'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { useState, useEffect } from 'react';
import Autoplay from 'embla-carousel-autoplay';

const testimonials = [
  {
    content:
      '"AJ STUDIOZ provides incredible AI-powered search capabilities that understand exactly what you need. The results are fast, accurate, and comprehensive!"',
    author: 'Tech Enthusiast',
    handle: '@techuser',
    link: '#',
  },
  {
    content: '"AJ STUDIOZ makes research and information discovery incredibly efficient and intuitive"',
    author: 'Power User',
    handle: '@poweruser',
    link: '#',
  },
  {
    content:
      "The AI research capabilities of AJ STUDIOZ are outstanding. It finds exactly what I need with remarkable accuracy.",
    author: 'Research Professional',
    handle: '@researcher',
    link: '#',
  },
  {
    content:
      '"AJ STUDIOZ has transformed how I search for information. The AI understands context and delivers perfect results every time!"',
    author: 'Digital Creator',
    handle: '@creator',
    link: '#',
  },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="flex items-center justify-between h-screen bg-background">
      <div className="hidden lg:flex lg:w-1/2 h-full bg-muted/30 flex-col">
        <div className="flex-1 flex flex-col justify-between p-12">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/aj-logo.jpg" alt="AJ STUDIOZ" width={32} height={32} className="rounded" />
              <span className="text-lg font-bold">AJ STUDIOZ</span>
            </Link>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-semibold text-foreground mb-3">AI Search that actually understands you</h2>
              <p className="text-muted-foreground">Skip the ads. Get real answers. From the latest AI models.</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                What people are saying
              </h3>

              <Carousel
                className="w-full"
                opts={{ loop: true }}
                setApi={setApi}
                plugins={[
                  Autoplay({
                    delay: 4000,
                    stopOnInteraction: true,
                    stopOnMouseEnter: true,
                  }),
                ]}
              >
                <CarouselContent>
                  {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index}>
                      <Link href={testimonial.link} target="_blank" className="block group h-full">
                        <blockquote className="relative h-full flex flex-col bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 transition-all duration-200 hover:bg-background/70">
                          <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1 text-balance">
                            {testimonial.content}
                          </div>
                          <footer className="mt-3">
                            <div className="flex items-center gap-2">
                              <cite className="text-sm font-medium not-italic text-foreground">
                                {testimonial.author}
                              </cite>
                              <span className="text-xs text-muted-foreground">{testimonial.handle}</span>
                            </div>
                          </footer>
                        </blockquote>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex items-center justify-center gap-1 mt-4">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => api?.scrollTo(index)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${index === current ? 'bg-foreground' : 'bg-muted-foreground/30'
                        }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </Carousel>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="https://github.com/kamesh6592-cell/meowihh" target="_blank" className="hover:text-foreground transition-colors">
                Open Source
              </a>
              <span>•</span>
              <span>Live Search</span>
              <span>•</span>
              <span>1M+ Searches served</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Featured on{' '}
              <a
                href="https://vercel.com/blog/ai-sdk-4-1"
                target="_blank"
                className="hover:text-foreground transition-colors"
              >
                Vercel
              </a>{' '}
              •{' '}
              <a
                href="https://meowihh.vercel.app"
                target="_blank"
                className="hover:text-foreground transition-colors"
              >
                #1 Product of the Week on Peerlist
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center px-4 md:px-8">{children}</div>
    </div>
  );
}
