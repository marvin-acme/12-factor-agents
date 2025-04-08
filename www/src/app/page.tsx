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

      <div className="mb-8 space-y-4">
        <p>Hi, I'm Dex. I've been hacking on AI agents for a while.</p>
        
        <p><strong>I've tried every agent framework out there</strong>, from the plug-and-play crew/langchains to the "minimalist" smolagents of the world to the "production grade" langraph, griptape, etc.</p>
        
        <p><strong>I've talked to a lot of really strong founders</strong>, in and out of YC, who are all building really impressive things with AI. Most of them are rolling the stack themselves. Almost none of them are using a "framework".</p>
        
        <p><strong>I've been surprised to find</strong> that most of the products out there billing themselves as "AI Agents" are not all that agentic. A lot of them are mostly deterministic code, with LLM steps sprinkled in at just the right points to make the experience truly magical.</p>
        
        <p>Agents, at least the good ones, don't follow the <a href="https://www.anthropic.com/engineering/building-effective-agents#agents" className="text-blue-500 hover:underline">"here's your prompt, here's a bag of tools, loop until you hit the goal"</a> pattern. Rather, they are comprised of mostly just software.</p>
        
        <blockquote className="border-l-4 border-blue-500 pl-4 my-4">
          <h3 className="text-xl font-bold">What are the principles we can use to build LLM-powered software that is actually good enough to put in the hands of production customers?</h3>
        </blockquote>
        
        <p>Welcome to 12-factor agents. As every Chicago mayor since Daley has consistently plastered all over the city's major airports, we're glad you're here.</p>
      </div>

      <h2 className="text-2xl font-bold mb-4">The Short Version: The 12 Factors</h2>
      <p className="mb-8">Even if LLMs <a href="https://github.com/humanlayer/12-factor-agents/blob/main/content/factor-10-small-focused-agents.md#what-if-llms-get-smarter" className="text-blue-500 hover:underline">continue to get exponentially more powerful</a>, there will be core engineering techniques that make LLM-powered software more reliable, more scalable, and easier to maintain.</p>

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
        <h3 className="text-xl font-bold mb-4">The promise of agents</h3>
        <p>We're gonna talk a lot about Directed Graphs (DGs) and their Acyclic friends, DAGs. I'll start by pointing out that...well...software is a directed graph. There's a reason we used to represent programs as flow charts.</p>
        <Image
          src="/010-software-dag.png"
          alt="Software DAG"
          width={800}
          height={400}
          className="w-full my-4"
        />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">From code to DAGs</h3>
        <p>Around 20 years ago, we started to see DAG orchestrators become popular. We're talking classics like <a href="https://airflow.apache.org/" className="text-blue-500 hover:underline">Airflow</a>, <a href="https://www.prefect.io/" className="text-blue-500 hover:underline">Prefect</a>, some predecessors, and some newer ones like <a href="https://dagster.io/" className="text-blue-500 hover:underline">dagster</a>, <a href="https://www.inngest.dev/" className="text-blue-500 hover:underline">inggest</a>, <a href="https://www.windmill.dev/" className="text-blue-500 hover:underline">windmill</a>. These followed the same graph pattern, with the added benefit of observability, modularity, retries, administration, etc.</p>
        <Image
          src="/015-dag-orchestrators.png"
          alt="DAG Orchestrators"
          width={800}
          height={400}
          className="w-full my-4"
        />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Agents as loops</h3>
        <p>Let's dive one step deeper - with agents you've got this loop consisting of 3 steps:</p>
        <ol className="list-decimal pl-5 mb-4">
          <li>LLM determines the next step in the workflow, outputting structured json ("tool calling")</li>
          <li>Deterministic code executes the tool call</li>
          <li>The result is appended to the context window</li>
          <li>repeat until the next step is determined to be "done"</li>
        </ol>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
          <code>{`initial_event = {"message": "..."}
context = [initial_event]
while True:
  next_step = await llm.determine_next_step(context)
  context.append(next_step)

  if (next_step.intent === "done"):
    return next_step.final_answer

  result = await execute_step(next_step)
  context.append(result)`}</code>
        </pre>
      </div>

      <div className="text-center mt-16">
        <a href="https://github.com/humanlayer/12-factor-agents" className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors">
          View on GitHub
        </a>
      </div>
    </div>
  );
}
