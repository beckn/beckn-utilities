import { generateUUID } from "../scripts/generateUUID.js";

export const gatewayBroadcastPayload = (domain) => {
  return {
    context: {
      domain: "dsep:jobs",
      action: "search",
      version: "1.1.0",
      bap_id: "bap-ps-network-vistaar.becknprotocol.io",
      bap_uri: "https://bap-ps-network-vistaar.becknprotocol.io",
      location: {
        country: {
          code: "IND"
        },
        city: {
          code: "std:080"
        }
      },
      transaction_id: generateUUID(),
      message_id: generateUUID(),
      timestamp: "2024-06-17T08:44:36.418Z"
    },
    message: {
      intent: {
        item: {
          descriptor: {
            name: "Engineer"
          }
        },
        provider: {
          descriptor: {
            name: "Affinidi"
          },
          locations: [
            {
              city: {
                name: "Bangalore"
              }
            }
          ]
        }
      }
    }
  };
};
