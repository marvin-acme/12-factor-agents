import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">12 Factor Agents - Principles for building great LLM applications</h1>
      
      <p className="italic mb-8">In the spirit of <a href="https://12factor.net/" className="text-blue-500 hover:underline">12 Factor Apps</a>. The source for this project is public at <a href="https://github.com/humanlayer/12-factor-agents" className="text-blue-500 hover:underline">https://github.com/humanlayer/12-factor-agents</a>, and I welcome your feedback and contributions. Let's figure this out together!</p>

      <div className="mb-8">
        <Image 
          src="/027-agent-loop-animation.gif"
          alt="Agent Loop Animation"
          width={907}
          height={500}
          className="w-full"
        />
      </div>

      <div className="mb-8">
        <p>Hi, I'm Dex. I've been hacking on AI agents for a while.</p>
        <p className="font-bold mt-4">I've tried every agent framework out there</p>
        <p>From the plug-and-play crew/langchains to the "minimalist" smolagents of the world to the "production grade" langraph, griptape, etc.</p>
      </div>

      <h2 className="text-2xl font-bold mb-4">The 12 Factors</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          ["Factor 1: Natural Language to Tool Calls", "110-natural-language-tool-calls.png"],
          ["Factor 2: Own your prompts", "120-own-your-prompts.png"],
          ["Factor 3: Own your context window", "130-own-your-context-building.png"],
          ["Factor 4: Tools are just structured outputs", "140-tools-are-just-structured-outputs.png"],
          ["Factor 5: Unify execution state", "150-unify-state.png"],
          ["Factor 6: Launch/Pause/Resume with simple APIs", "160-pause-resume-with-simple-apis.png"],
          ["Factor 7: Contact humans with tool calls", "170-contact-humans-with-tools.png"],
          ["Factor 8: Own your control flow", "180-control-flow.png"],
          ["Factor 9: Compact Errors into Context Window", "195-factor-9-errors.gif"],
          ["Factor 10: Small, Focused Agents", "1a0-small-focused-agents.png"],
          ["Factor 11: Trigger from anywhere", "1b0-trigger-from-anywhere.png"],
          ["Factor 12: Make your agent a stateless reducer", "1c0-stateless-reducer.png"],
        ].map(([title, img], i) => (
          <div key={i} className="border rounded p-4 hover:shadow-lg transition-shadow">
            <Image
              src={`/${img}`}
              alt={title}
              width={300}
              height={200}
              className="w-full mb-2"
            />
            <p className="text-sm">{title}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">How we got here</h2>
      <div className="mb-8">
        <Image
          src="/010-software-dag.png"
          alt="Software DAG"
          width={800}
          height={400}
          className="w-full mb-4"
        />
        <p>We're gonna talk a lot about Directed Graphs (DGs) and their Acyclic friends, DAGs. I'll start by pointing out that...well...software is a directed graph. There's a reason we used to represent programs as flow charts.</p>
      </div>

      <div className="text-center mt-16">
        <a href="https://github.com/humanlayer/12-factor-agents" className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors">
          View on GitHub
        </a>
      </div>
    </div>
  );
}
