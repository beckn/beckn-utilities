import { z } from "zod";

// BAP URLs
export const BAP_URI = "https://bap-ps-network-prod.becknprotocol.io";
export const BAP_CLIENT_URI = "https://bap-ps-client-prod.becknprotocol.io";
export const BPP_URI = "http://bpp-ps-network-strapi1-prod.becknprotocol.io";
export const BPP_ID = "bpp-ps-network-strapi1-prod.becknprotocol.io";

// Basic location schema shape (without z.object wrapper)
export const LocationSchemaShape = {
  latitude: z.number().describe("Latitude coordinate"),
  longitude: z.number().describe("Longitude coordinate"),
};

// Create the full schema for use in validation
export const LocationSchema = z.object(LocationSchemaShape);

// Basic item schema shape for search intent
export const SearchItemSchemaShape = {
  name: z.string().describe("Name of the item being searched for"),
  category: z.string().optional().describe("Category of the item (optional)"),
};

export const SearchItemSchema = z.object(SearchItemSchemaShape);

// Provider schema shape for search intent
export const SearchProviderSchemaShape = {
  name: z.string().optional().describe("Name of the provider to search for"),
  id: z.string().optional().describe("ID of the provider to search for"),
};

export const SearchProviderSchema = z.object(SearchProviderSchemaShape);

// Fulfillment schema shape for search intent
export const SearchFulfillmentSchemaShape = {
  type: z.string().optional().describe("Type of fulfillment (e.g., delivery, pickup)"),
  location: LocationSchema.optional().describe("Location for fulfillment"),
};

export const SearchFulfillmentSchema = z.object(SearchFulfillmentSchemaShape);

// Tag schema shape for additional search parameters
export const SearchTagSchemaShape = {
  name: z.string().describe("Name of the tag"),
  value: z.string().describe("Value of the tag"),
};

export const SearchTagSchema = z.object(SearchTagSchemaShape);

// Simplified search parameters schema shape for retail
export const BecknSearchParamsSchemaShape = {
  name: z.string().describe("Name or description of the product to search for"),
  domain: z.string().default("retail").describe("Domain for the search (defaults to retail)"),
  // Optional parameters
  location: LocationSchema.optional().describe("Location context for the search (auto-generated if not provided)"),
  category: z.string().optional().describe("Product category (e.g., Electronics, Apparel)"),
  priceRange: z.object({
    min: z.number().optional(),
    max: z.number().optional()
  }).optional().describe("Price range for filtering products"),
};

// Create the full schema for validation
export const BecknSearchParamsSchema = z.object(BecknSearchParamsSchemaShape);

// Add a simple UUID generator function
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Function to make the actual API call to the BAP client
export async function callBecknAPI(endpoint: string, payload: any) {
  try {
    const url = `${BAP_CLIENT_URI}/${endpoint}`;
    console.log(`Making API call to: ${url}`);
    console.log(`Payload: ${JSON.stringify(payload, null, 2)}`);
    
    // Use a more direct approach with fewer abstractions
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    // Handle non-OK responses differently
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
      return { error: true, status: response.status, message: errorText };
    }
    
    const data = await response.json();
    console.log(`Response: ${JSON.stringify(data, null, 2)}`);
    return data;
  } catch (error) {
    console.error('Error calling Beckn API:', error);
    return { error: true, message: String(error) };
  }
}

// Function to convert MCP search params to Beckn search request
export function createBecknSearchRequest(params: z.infer<typeof BecknSearchParamsSchema>) {
  // Create a request that exactly matches the curl example
  return {
    context: {
      domain: "retail:1.1.0",
      location: {
        country: {
          code: "IND"
        },
        city: {
          code: "std:080"
        }
      },
      action: "search",
      version: "1.1.0",
      bap_id: "bap-ps-network-prod.becknprotocol.io",
      bap_uri: "https://bap-ps-network-prod.becknprotocol.io",
      bpp_id: "bpp-ps-network-strapi1-prod.becknprotocol.io",
      bpp_uri: "http://bpp-ps-network-strapi1-prod.becknprotocol.io",
      transaction_id: generateUUID(),
      message_id: generateUUID(),
      timestamp: new Date().toISOString()
    },
    message: {
      intent: {
        item: {
          descriptor: {
            name: params.name
          }
        },
        fulfillment: {
          type: "Delivery",
          stops: [
            {
              location: {
                gps: "28.4594965,77.0266383"
              }
            }
          ]
        }
      }
    }
  };
}

// Function to convert Beckn search response to MCP tool response
export function processBecknSearchResponse(becknResponse: any) {
  // Check if this is a real response or our placeholder
  if (becknResponse.message === "This is a placeholder for the Beckn search response") {
    // Return our mock retail catalog response (keep existing mock code)
    return {
      providers: [
        {
          id: "provider_1",
          name: "SuperMart Retail",
          items: [
            {
              id: "item_1",
              name: "Premium Smartphone",
              price: "₹49,999",
              description: "Latest model with advanced camera and long battery life",
              category: "Electronics",
              inStock: true
            },
            {
              id: "item_2",
              name: "Wireless Earbuds",
              price: "₹8,999",
              description: "True wireless earbuds with noise cancellation",
              category: "Electronics",
              inStock: true
            }
          ]
        },
        {
          id: "provider_2",
          name: "Fashion World",
          items: [
            {
              id: "item_3",
              name: "Designer T-Shirt",
              price: "₹1,499",
              description: "Premium cotton t-shirt with unique design",
              category: "Apparel",
              inStock: true
            },
            {
              id: "item_4",
              name: "Leather Wallet",
              price: "₹2,999",
              description: "Genuine leather wallet with multiple card slots",
              category: "Accessories",
              inStock: false
            }
          ]
        }
      ],
      message: "These are mock retail results. In a real implementation, this would show actual search results from the Beckn network."
    };
  }
  
  try {
    // Process a real Beckn response
    // The response structure will depend on the specific BAP implementation
    // This is a general approach that should work with most Beckn implementations
    
    const result: any = {
      providers: [],
      message: "Search results from Beckn network"
    };
    
    // Check if we have a message and catalog in the response
    if (becknResponse.message && becknResponse.message.catalog) {
      const catalog = becknResponse.message.catalog;
      
      // Process providers if available
      if (catalog.providers && Array.isArray(catalog.providers)) {
        result.providers = catalog.providers.map((provider: any) => {
          const providerResult: any = {
            id: provider.id || "unknown",
            name: provider.descriptor?.name || "Unnamed Provider",
            items: []
          };
          
          // Process items if available
          if (provider.items && Array.isArray(provider.items)) {
            providerResult.items = provider.items.map((item: any) => {
              return {
                id: item.id || "unknown",
                name: item.descriptor?.name || "Unnamed Item",
                price: item.price?.value ? `${item.price.currency || '₹'}${item.price.value}` : "Price not available",
                description: item.descriptor?.long_desc || item.descriptor?.short_desc || "No description available",
                category: item.category_id || "Uncategorized",
                inStock: true // Assuming in stock by default
              };
            });
          }
          
          return providerResult;
        });
      }
      
      // If we have a message in the catalog, use it
      if (catalog.descriptor && catalog.descriptor.name) {
        result.message = catalog.descriptor.name;
      }
    } else if (becknResponse.error) {
      // Handle error responses
      return {
        error: true,
        message: becknResponse.error.message || "An error occurred during the search",
        code: becknResponse.error.code || "unknown_error"
      };
    }
    
    return result;
  } catch (error) {
    console.error("Error processing Beckn response:", error);
    return {
      error: true,
      message: "Failed to process the search response",
      details: String(error)
    };
  }
}
