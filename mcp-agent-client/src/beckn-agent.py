# beckn_agent.py
import asyncio
import os
from agents import Agent, Runner, gen_trace_id, trace
from agents.mcp import MCPServerSse
import json

# Set your OpenAI API key
# os.environ["OPENAI_API_KEY"] = "your-openai-api-key"

async def print_tool_info(mcp_server):
    """Helper function to print available tools and their metadata"""
    print("\n=== Available Tools ===")
    for tool in mcp_server.tools:
        print(f"\nTool Name: {tool.name}")
        print(f"Description: {tool.description}")
        print("Parameters:")
        try:
            params = json.loads(tool.parameters_schema)
            print(json.dumps(params, indent=2))
        except:
            print(f"Raw schema: {tool.parameters_schema}")
        print("Return Schema:")
        try:
            returns = json.loads(tool.returns_schema)
            print(json.dumps(returns, indent=2))
        except:
            print(f"Raw schema: {tool.returns_schema}")
        print("-" * 50)

async def main():
    # Connect to our Beckn MCP server using SSE transport
    async with MCPServerSse(
        name="Beckn MCP Server",
        params={
            "url": "http://localhost:3000/sse",  # SSE endpoint of our server
            "post_url": "http://localhost:3000/messages",  # Messages endpoint
        },
    ) as mcp_server:
        # Print available tools and their metadata
        await print_tool_info(mcp_server)
        
        # Create an agent that uses our MCP server
        beckn_agent = Agent(
            name="Beckn Shopping Assistant",
            instructions="""
            You are a shopping assistant that helps users find products and services.
            Before performing any search:
            1. Greet the user and understand their requirements
            2. Ask clarifying questions if needed
            3. Only use the beckn-search tool when you have clear search parameters
            4. Explain what you're going to do before searching
            """,
            mcp_servers=[mcp_server],
        )
        
        # Generate a trace ID for debugging
        trace_id = gen_trace_id()
        with trace(workflow_name="Beckn Shopping Assistant", trace_id=trace_id):
            print(f"\nView trace: https://platform.openai.com/traces/trace?trace_id={trace_id}\n")
            
            # Start with a greeting instead of a direct search query
            user_query = "Hi, I'm looking for something to eat"
            print(f"User query: {user_query}")
            
            result = await Runner.run(starting_agent=beckn_agent, input=user_query)
            print("\nAgent response:")
            print(result.final_output)

if __name__ == "__main__":
    asyncio.run(main())