import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { BecknSearchParamsSchema, BecknSearchParamsSchemaShape, createBecknSearchRequest, processBecknSearchResponse, callBecknAPI } from "./beckn-utils.js";

const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "weather-app/1.0";

// Create Express app
const app = express();

// Create server instance
const server = new McpServer({
  name: "beckn-gateway",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});








// Add Beckn search tool
server.tool(
  "beckn-search",
  "Search for products or services across Beckn networks (e.g., 'Find pizza in Bangalore', 'Search for smartphones')",
  BecknSearchParamsSchemaShape,
  async (params) => {
    try {
      // Convert MCP params to Beckn search request
      const becknRequest = createBecknSearchRequest(params);
      
      // Log the request for debugging
      console.log("Sending Beckn search request:", JSON.stringify(becknRequest, null, 2));
      
      // Make the actual API call to the BAP client
      let becknResponse;
      try {
        becknResponse = await callBecknAPI("search", becknRequest);
      } catch (apiError) {
        console.error("API call failed:", apiError);
        return {
          content: [
            {
              type: "text",
              text: `Error calling Beckn API: ${apiError instanceof Error ? apiError.message : String(apiError)}`,
            },
          ],
        };
      }
      
      // Process and format the response
      const formattedResponse = processBecknSearchResponse(becknResponse);
      
      // Check if there was an error in processing
      if (formattedResponse.error) {
        return {
          content: [
            {
              type: "text",
              text: `Error processing search results: ${formattedResponse.message}\n${formattedResponse.details || ''}`,
            },
          ],
        };
      }
      
      // Format the response for display
      let responseText = `Search results for "${params.name}" in domain: ${params.domain || 'retail'}\n\n`;
      
      // Add provider and item information
      if (formattedResponse.providers && formattedResponse.providers.length > 0) {
        responseText += `Found ${formattedResponse.providers.length} providers with matching items:\n\n`;
        
        formattedResponse.providers.forEach((provider: any, index: number) => {
          responseText += `Provider ${index + 1}: ${provider.name} (ID: ${provider.id})\n`;
          
          if (provider.items && provider.items.length > 0) {
            responseText += `Items (${provider.items.length}):\n`;
            
            provider.items.forEach((item: any, itemIndex: number) => {
              responseText += `  ${itemIndex + 1}. ${item.name}\n`;
              responseText += `     Price: ${item.price}\n`;
              responseText += `     Description: ${item.description}\n`;
              responseText += `     Category: ${item.category}\n`;
              responseText += `     In Stock: ${item.inStock ? 'Yes' : 'No'}\n\n`;
            });
          } else {
            responseText += `No items available from this provider.\n\n`;
          }
        });
      } else {
        responseText += `No matching items found. Try a different search term.\n\n`;
      }
      
      // Add any additional message
      if (formattedResponse.message) {
        responseText += `Message: ${formattedResponse.message}\n`;
      }
      
      return {
        content: [
          {
            type: "text",
            text: responseText,
          },
        ],
      };
    } catch (error) {
      console.error("Error in beckn-search tool:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error performing Beckn search: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
);

let transport: SSEServerTransport | null = null;

// Set up SSE endpoint
app.get("/sse", (req, res) => {
   transport = new SSEServerTransport("/messages", res);
   server.connect(transport);
});

app.post("/messages", (req, res) => {
  if (transport) {
    transport.handlePostMessage(req, res);
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Beckn MCP Server running on http://localhost:${port}`);
  console.log(`SSE endpoint: http://localhost:${port}/sse`);
  console.log(`Messages endpoint: http://localhost:${port}/messages`);
});