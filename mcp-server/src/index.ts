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

// Helper function for making NWS API requests
async function makeNWSRequest<T>(url: string): Promise<T | null> {
  const headers = {
    "User-Agent": USER_AGENT,
    Accept: "application/geo+json",
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making NWS request:", error);
    return null;
  }
}

interface AlertFeature {
  properties: {
    event?: string;
    areaDesc?: string;
    severity?: string;
    status?: string;
    headline?: string;
  };
}

// Format alert data
function formatAlert(feature: AlertFeature): string {
  const props = feature.properties;
  return [
    `Event: ${props.event || "Unknown"}`,
    `Area: ${props.areaDesc || "Unknown"}`,
    `Severity: ${props.severity || "Unknown"}`,
    `Status: ${props.status || "Unknown"}`,
    `Headline: ${props.headline || "No headline"}`,
    "---",
  ].join("\n");
}

interface ForecastPeriod {
  name?: string;
  temperature?: number;
  temperatureUnit?: string;
  windSpeed?: string;
  windDirection?: string;
  shortForecast?: string;
}

interface AlertsResponse {
  features: AlertFeature[];
}

interface PointsResponse {
  properties: {
    forecast?: string;
  };
}

interface ForecastResponse {
  properties: {
    periods: ForecastPeriod[];
  };
}

// Register weather tools
// server.tool(
//   "get-alerts",
//   "Get weather alerts for a state",
//   {
//     state: z.string().length(2).describe("Two-letter state code (e.g. CA, NY)"),
//   },
//   async ({ state }) => {
//     const stateCode = state.toUpperCase();
//     const alertsUrl = `${NWS_API_BASE}/alerts?area=${stateCode}`;
//     const alertsData = await makeNWSRequest<AlertsResponse>(alertsUrl);

//     if (!alertsData) {
//       return {
//         content: [
//           {
//             type: "text",
//             text: "Failed to retrieve alerts data",
//           },
//         ],
//       };
//     }

//     const features = alertsData.features || [];
//     if (features.length === 0) {
//       return {
//         content: [
//           {
//             type: "text",
//             text: `No active alerts for ${stateCode}`,
//           },
//         ],
//       };
//     }

//     const formattedAlerts = features.map(formatAlert);
//     const alertsText = `Active alerts for ${stateCode}:\n\n${formattedAlerts.join("\n")}`;

//     return {
//       content: [
//         {
//           type: "text",
//           text: alertsText,
//         },
//       ],
//     };
//   },
// );

// server.tool(
//   "get-forecast",
//   "Get weather forecast for a location",
//   {
//     latitude: z.number().min(-90).max(90).describe("Latitude of the location"),
//     longitude: z.number().min(-180).max(180).describe("Longitude of the location"),
//   },
//   async ({ latitude, longitude }) => {
//     // Get grid point data
//     const pointsUrl = `${NWS_API_BASE}/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`;
//     const pointsData = await makeNWSRequest<PointsResponse>(pointsUrl);

//     if (!pointsData) {
//       return {
//         content: [
//           {
//             type: "text",
//             text: `Failed to retrieve grid point data for coordinates: ${latitude}, ${longitude}. This location may not be supported by the NWS API (only US locations are supported).`,
//           },
//         ],
//       };
//     }

//     const forecastUrl = pointsData.properties?.forecast;
//     if (!forecastUrl) {
//       return {
//         content: [
//           {
//             type: "text",
//             text: "Failed to get forecast URL from grid point data",
//           },
//         ],
//       };
//     }

//     // Get forecast data
//     const forecastData = await makeNWSRequest<ForecastResponse>(forecastUrl);
//     if (!forecastData) {
//       return {
//         content: [
//           {
//             type: "text",
//             text: "Failed to retrieve forecast data",
//           },
//         ],
//       };
//     }

//     const periods = forecastData.properties?.periods || [];
//     if (periods.length === 0) {
//       return {
//         content: [
//           {
//             type: "text",
//             text: "No forecast periods available",
//           },
//         ],
//       };
//     }

//     // Format forecast periods
//     const formattedForecast = periods.map((period: ForecastPeriod) =>
//       [
//         `${period.name || "Unknown"}:`,
//         `Temperature: ${period.temperature || "Unknown"}°${period.temperatureUnit || "F"}`,
//         `Wind: ${period.windSpeed || "Unknown"} ${period.windDirection || ""}`,
//         `${period.shortForecast || "No forecast available"}`,
//         "---",
//       ].join("\n"),
//     );

//     const forecastText = `Forecast for ${latitude}, ${longitude}:\n\n${formattedForecast.join("\n")}`;

//     return {
//       content: [
//         {
//           type: "text",
//           text: forecastText,
//         },
//       ],
//     };
//   },
// );

// Add Beckn search tool
server.tool(
  "beckn-search",
  "Search for products or services across Beckn networks (auto-generates most parameters)",
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
  console.log(`Weather MCP Server running on http://localhost:${port}`);
  console.log(`SSE endpoint: http://localhost:${port}/sse`);
  console.log(`Messages endpoint: http://localhost:${port}/messages`);
});