import Image from "next/image";
import { Github } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black selection:bg-orange-100 selection:text-orange-900 dark:selection:bg-orange-900 dark:selection:text-orange-100">
      <nav className="nav-fixed fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <a 
              href="/" 
              className="header-brand text-xl font-black cursor-pointer"
            >
              <strong>12 Factor Agents</strong>
            </a>
            <a 
              href="https://github.com/humanlayer/12-factor-agents" 
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 transition-all duration-300">
                <Github size={20} />
                <span>GitHub</span>
              </div>
            </a>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        <header className="py-12 px-4 relative overflow-hidden">
          <div className="max-w-3xl mx-auto relative z-10">
            <h1 className="text-5xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 animate-gradient">
              12 Factor Agents
            </h1>
            <div className="space-y-4">
              <h2 className="text-xl text-gray-600 dark:text-gray-300">
                Principles for building great LLM applications
              </h2>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                In the spirit of <a href="https://12factor.net/">12 Factor Apps</a>. 
                The source for this project is public at <a href="https://github.com/humanlayer/12-factor-agents">github.com/humanlayer/12-factor-agents</a>.
                I welcome your feedback and contributions. Let's figure this out together!
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Special thanks to <a href="https://www.github.com/hellovai">@hellovai</a>, <a href="https://www.github.com/stantonk">@stantonk</a>, <a href="https://www.github.com/balanceiskey">@balanceiskey</a>, <a href="https://github.com/iantbutler01">@iantbutler01</a>, <a href="https://github.com/tnm">@tnm</a>, <a href="https://www.github.com/pfbyjy">@pfbyjy</a>, <a href="https://www.github.com/a-churchill">@a-churchill</a>, and the SF MLOps community for early feedback on this guide.
              </p>
            </div>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--color-orange-50)_0%,transparent_100%)] dark:bg-[radial-gradient(circle_at_top,var(--color-orange-900)_0%,transparent_100%)] pointer-events-none opacity-30"></div>
        </header>

        <main className="max-w-4xl mx-auto px-4 pb-16">
          <div className="mb-16 space-y-6 text-lg">
            <p>Hi, I'm Dex. I've been hacking on AI agents for a while.</p>
            
            <p><strong>I've tried every agent framework out there</strong>, from the plug-and-play crew/langchains to the "minimalist" smolagents of the world to the "production grade" langraph, griptape, etc.</p>
            
            <p><strong>I've talked to a lot of really strong founders</strong>, in and out of YC, who are all building really impressive things with AI. Most of them are rolling the stack themselves. Almost none of them are using a "framework".</p>
            
            <p><strong>I've been surprised to find</strong> that most of the products out there billing themselves as "AI Agents" are not all that agentic. A lot of them are mostly deterministic code, with LLM steps sprinkled in at just the right points to make the experience truly magical.</p>
            
            <p>Agents, at least the good ones, don't follow the <a href="https://www.anthropic.com/engineering/building-effective-agents#agents">"here's your prompt, here's a bag of tools, loop until you hit the goal"</a> pattern. Rather, they are comprised of mostly just software.</p>
            
            <blockquote className="border-l-2 border-gray-200 dark:border-gray-800 pl-6 py-4 my-8">
              <h3 className="text-2xl font-bold">What are the principles we can use to build LLM-powered software that is actually good enough to put in the hands of production customers?</h3>
            </blockquote>
            
            <p>Welcome to 12-factor agents. As every Chicago mayor since Daley has consistently plastered all over the city's major airports, we're glad you're here.</p>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 animate-gradient">
              Why 12-factor agents?
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>At the end of the day, this approach just doesn't work as well as we want it to.</p>
              <p>In building HumanLayer, I've talked to at least 100 SaaS builders (mostly technical founders) looking to make their existing product more agentic. The journey usually goes something like:</p>
              <ol className="list-decimal pl-6 mb-8">
                <li>Decide you want to build an agent</li>
                <li>Product design, UX mapping, what problems to solve</li>
                <li>Want to move fast, so grab $FRAMEWORK and <em>get to building</em></li>
                <li>Get to 70-80% quality bar</li>
                <li>Realize that 80% isn't good enough for most customer-facing features</li>
                <li>Realize that getting past 80% requires reverse-engineering the framework, prompts, flow, etc</li>
                <li>Start over from scratch</li>
              </ol>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 animate-gradient">
              The 12 Factors
            </h2>
            <p className="mb-12 text-lg text-center">
              Even if LLMs <a href="https://github.com/humanlayer/12-factor-agents/blob/main/content/factor-10-small-focused-agents.md#what-if-llms-get-smarter" className="hover:text-black dark:hover:text-white hover:underline">continue to get exponentially more powerful</a>, 
              there will be core engineering techniques that make LLM-powered software more reliable, more scalable, and easier to maintain.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                ["Factor 1: Natural Language to Tool Calls", "110-natural-language-tool-calls.png", "./content/factor-1-natural-language-to-tool-calls.md"],
                ["Factor 2: Own your prompts", "120-own-your-prompts.png", "./content/factor-2-own-your-prompts.md"],
                ["Factor 3: Own your context window", "130-own-your-context-building.png", "./content/factor-3-own-your-context-window.md"],
                ["Factor 4: Tools are just structured outputs", "140-tools-are-just-structured-outputs.png", "./content/factor-4-tools-are-structured-outputs.md"],
                ["Factor 5: Unify execution state", "150-unify-state.png", "./content/factor-5-unify-execution-state.md"],
                ["Factor 6: Launch/Pause/Resume with simple APIs", "160-pause-resume-with-simple-apis.png", "./content/factor-6-launch-pause-resume.md"],
                ["Factor 7: Contact humans with tool calls", "170-contact-humans-with-tools.png", "./content/factor-7-contact-humans-with-tools.md"],
                ["Factor 8: Own your control flow", "180-control-flow.png", "./content/factor-8-own-your-control-flow.md"],
                ["Factor 9: Compact Errors into Context Window", "195-factor-9-errors.gif", "./content/factor-9-compact-errors.md"],
                ["Factor 10: Small, Focused Agents", "1a0-small-focused-agents.png", "./content/factor-10-small-focused-agents.md"],
                ["Factor 11: Trigger from anywhere", "1b0-trigger-from-anywhere.png", "./content/factor-11-trigger-from-anywhere.md"],
                ["Factor 12: Make your agent a stateless reducer", "1c0-stateless-reducer.png", "./content/factor-12-stateless-reducer.md"],
              ].map(([title, img, link], i) => (
                <a 
                  key={i} 
                  href={link}
                  className="card group focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
                >
                  <div className="overflow-hidden rounded-t-lg">
                    <Image
                      src={`/${img}`}
                      alt={title}
                      width={300}
                      height={200}
                      className="w-full transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                      {title}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 animate-gradient">
              Additional Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card border border-gray-100 dark:border-gray-900 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-700">
                <h3 className="text-xl font-bold mb-4">How We Got Here</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">A brief history of software and the evolution of agent architectures.</p>
                <a href="./content/brief-history-of-software.md">Read more →</a>
              </div>
              
              <div className="card border border-gray-100 dark:border-gray-900 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-700">
                <h3 className="text-xl font-bold mb-4">Factor 13</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Pre-fetch all the context you might need.</p>
                <a href="./content/appendix-13-pre-fetch.md">Read more →</a>
              </div>
              
              <div className="card border border-gray-100 dark:border-gray-900 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-700">
                <h3 className="text-xl font-bold mb-4">More Resources</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li><a href="https://theouterloop.substack.com" className="hover:text-black dark:hover:text-white hover:underline">The Outer Loop</a></li>
                  <li><a href="https://github.com/got-agents/agents" className="hover:text-black dark:hover:text-white hover:underline">OSS Agents</a></li>
                  <li><a href="https://github.com/humanlayer/kubechain" className="hover:text-black dark:hover:text-white hover:underline">Kubechain</a></li>
                </ul>
              </div>
            </div>
          </section>

          <div className="text-center mt-16">
            <a 
              href="https://github.com/humanlayer/12-factor-agents" 
              className="button inline-flex items-center px-8 py-4 rounded-lg text-lg font-medium text-white hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 transition-all duration-300"
            >
              View on GitHub
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
