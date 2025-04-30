import { generateUUID } from "../scripts/generateUUID.js";

export const retailSelect = () => {
  return {
    context: {
      domain: "retail:1.1.0",
      bpp_id: "bpp-ps-network-sandbox-vistaar.becknprotocol.io",
      bpp_uri: "https://bpp-ps-network-sandbox-vistaar.becknprotocol.io",
      bap_id: "bap-ps-network-vistaar.becknprotocol.io",
      action: "select",
      bap_uri: "https://bap-ps-network-vistaar.becknprotocol.io",
      version: "1.1.0",
      transaction_id: generateUUID(),
      message_id: generateUUID(),
      location: {
        country: {
          name: "India",
          code: "IND"
        },
        city: {
          name: "Bangalore",
          code: "std:080"
        }
      },
      ttl: "PT10M",
      timestamp: "2024-06-17T08:44:36.418Z"
    },
    message: {
      order: {
        provider: {
          id: "./retail.kirana/ind.blr/33@tourism-bpp-infra2.becknprotocol.io.provider"
        },
        items: [
          {
            id: "./retail.kirana/ind.blr/247@tourism-bpp-infra2.becknprotocol.io.item",
            quantity: {
              selected: {
                count: 2
              }
            }
          }
        ],
        fulfillments: [
          {
            id: "f1",
            stops: [
              {
                location: {
                  gps: "13.2008459,77.708736"
                }
              }
            ]
          }
        ]
      }
    }
  };
};

export const retailInit = () => {
  return {
    context: {
      domain: "retail:1.1.0",
      action: "init",
      version: "1.1.0",
      bap_id: "bap-ps-network-vistaar.becknprotocol.io",
      bap_uri: "https://bap-ps-network-vistaar.becknprotocol.io",
      bpp_id: "bpp-ps-network-sandbox-vistaar.becknprotocol.io",
      bpp_uri: "https://bpp-ps-network-sandbox-vistaar.becknprotocol.io",
      transaction_id: generateUUID(),
      message_id: generateUUID(),
      location: {
        country: {
          name: "India",
          code: "IND"
        },
        city: {
          name: "Bangalore",
          code: "std:080"
        }
      },
      timestamp: "2023-02-06T09:55:41.161Z"
    },
    message: {
      order: {
        provider: {
          id: "./retail.kirana/ind.blr/33@tourism-bpp-infra2.becknprotocol.io.provider"
        },
        items: [
          {
            id: "./retail.kirana/ind.blr/247@tourism-bpp-infra2.becknprotocol.io.item",
            quantity: {
              selected: {
                count: 2
              }
            }
          }
        ],
        fulfillments: [
          {
            type: "Delivery",
            stops: [
              {
                location: {
                  gps: "13.2008459,77.708736",
                  address:
                    "123, Terminal 1, Kempegowda Int'l Airport Rd, A - Block, Gangamuthanahalli, Karnataka 560300, India",
                  city: {
                    name: "Gangamuthanahalli"
                  },
                  state: {
                    name: "Karnataka"
                  },
                  country: {
                    code: "IND"
                  },
                  area_code: "75001"
                },
                contact: {
                  phone: "919246394908",
                  email: "nc.rehman@gmail.com"
                }
              }
            ],
            customer: {
              person: {
                name: "Motiur Rehman"
              },
              contact: {
                phone: "919122343344"
              }
            }
          }
        ],
        billing: {
          name: "Motiur Rehman",
          phone: "9191223433",
          email: "nc.rehman@gmail.com",
          address:
            "123, Terminal 1, Kempegowda Int'l Airport Rd, A - Block, Gangamuthanahalli, Karnataka 560300, India",
          city: {
            name: "Gangamuthanahalli"
          },
          state: {
            name: "Karnataka"
          }
        }
      }
    }
  };
};

export const retailConfirm = () => {
  return {
    context: {
      domain: "retail:1.1.0",
      action: "confirm",
      version: "1.1.0",
      bap_id: "bap-ps-network-vistaar.becknprotocol.io",
      bap_uri: "https://bap-ps-network-vistaar.becknprotocol.io",
      bpp_id: "bpp-ps-network-sandbox-vistaar.becknprotocol.io",
      bpp_uri: "https://bpp-ps-network-sandbox-vistaar.becknprotocol.io",
      transaction_id: generateUUID(),
      message_id: generateUUID(),
      location: {
        country: {
          name: "India",
          code: "IND"
        },
        city: {
          name: "Bangalore",
          code: "std:080"
        }
      },
      timestamp: "2023-02-06T09:55:41.161Z"
    },
    message: {
      order: {
        provider: {
          id: "./retail.kirana/ind.blr/33@tourism-bpp-infra2.becknprotocol.io.provider"
        },
        items: [
          {
            id: "./retail.kirana/ind.blr/247@tourism-bpp-infra2.becknprotocol.io.item",
            quantity: {
              selected: {
                count: 2
              }
            }
          }
        ],
        fulfillments: [
          {
            type: "Delivery",
            stops: [
              {
                location: {
                  gps: "13.2008459,77.708736",
                  address:
                    "123, Terminal 1, Kempegowda Int'l Airport Rd, A - Block, Gangamuthanahalli, Karnataka 560300, India",
                  city: {
                    name: "Gangamuthanahalli"
                  },
                  state: {
                    name: "Karnataka"
                  },
                  country: {
                    code: "IND"
                  },
                  area_code: "75001"
                },
                contact: {
                  phone: "919246394908",
                  email: "nc.rehman@gmail.com"
                }
              }
            ],
            customer: {
              person: {
                name: "Motiur Rehman"
              },
              contact: {
                phone: "919122343344"
              }
            }
          }
        ],
        billing: {
          name: "Motiur Rehman",
          phone: "9191223433",
          email: "nc.rehman@gmail.com",
          address:
            "123, Terminal 1, Kempegowda Int'l Airport Rd, A - Block, Gangamuthanahalli, Karnataka 560300, India",
          city: {
            name: "Gangamuthanahalli"
          },
          state: {
            name: "Karnataka"
          }
        },
        payments: [
          {
            status: "PAID",
            type: "PRE-FULFILLMENT",
            params: {
              amount: "1500",
              currency: "INR",
              bank_code: "INB0004321",
              bank_account_number: "1234002341",
              transaction_id: "jhdasjd8ee783"
            }
          }
        ]
      }
    }
  };
};

export const retailStatus = () => {
  return {
    context: {
      domain: "retail:1.1.0",
      action: "status",
      version: "1.1.0",
      bap_id: "bap-ps-network-vistaar.becknprotocol.io",
      bap_uri: "https://bap-ps-network-vistaar.becknprotocol.io",
      bpp_id: "bpp-ps-network-sandbox-vistaar.becknprotocol.io",
      bpp_uri: "https://bpp-ps-network-sandbox-vistaar.becknprotocol.io",
      transaction_id: generateUUID(),
      message_id: generateUUID(),
      location: {
        country: {
          name: "India",
          code: "IND"
        },
        city: {
          name: "Bangalore",
          code: "std:080"
        }
      },
      timestamp: "2023-02-06T09:55:41.161Z"
    },
    message: {
      order_id: "1690976236928"
    }
  };
};
