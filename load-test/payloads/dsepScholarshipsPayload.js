import { generateUUID } from "../scripts/generateUUID.js";

export const dsepScholarshipsSelect = () => {
  return {
    context: {
      domain: "dsep:scholarships",
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
          id: "13"
        },
        items: [
          {
            id: "6"
          }
        ]
      }
    }
  };
};

export const dsepScholarshipsInit = () => {
  return {
    context: {
      domain: "dsep:scholarships",
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
          id: "1"
        },
        items: [
          {
            id: "D7F8606A370DA9966DF15E62A81C374B"
          }
        ],
        fulfillments: [
          {
            id: "1",
            customer: {
              person: {
                name: "John Doe",
                languages: [
                  {
                    code: "ENG"
                  },
                  {
                    code: "HIN"
                  }
                ],
                url: "https://linkedin.com/john-doe",
                creds: [
                  {
                    url: "https://cbse.nic.in/link/to/college-marksheet.json",
                    type: "application/vc+json"
                  },
                  {
                    url: "https://drive.google.com/link/to/pass-certificate.json",
                    type: "application/vc+json"
                  },
                  {
                    url: "https://digilocker.com/link/to/python-skill-certificate.json",
                    type: "application/vc+json"
                  },
                  {
                    url: "https://drive.google.com/link/to/python-skill-certificate.pdf",
                    type: "application/pdf"
                  },
                  {
                    url: "https://drive.google.com/link/to/experience-certificate.pdf",
                    type: "application/pdf"
                  }
                ],
                skills: [
                  {
                    name: "NodeJS"
                  },
                  {
                    name: "React"
                  },
                  {
                    name: "Project Management"
                  },
                  {
                    name: "Enterprise Architecture"
                  }
                ]
              }
            }
          }
        ],
        xinput: {
          data: {
            resume:
              "data:application/pdf;base64,JVBERi0xLjUKJd...c3RyZWFtCnjarVhLc9s2...",
            "work-mode": "hybrid",
            "exp-years": "10",
            sop: "I am interested in this job because my prior experience is highly relevant to this role."
          },
          submission_id: 12345
        }
      }
    }
  };
};

export const dsepScholarshipsConfirm = () => {
  return {
    context: {
      domain: "dsep:scholarships",
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
        id: "jdhflks",
        items: [
          {
            id: "8A690F158A37965A2CC0E69EC8B360B2",
            fulfillment_ids: ["1"]
          }
        ],
        fulfillments: [
          {
            id: "1",
            customer: {
              person: {
                name: "Sanjay",
                gender: "M",
                creds: [
                  {
                    id: "claimId:af7e0b1b5c4858eb",
                    type: "GenderData",
                    url: "https://cloud-wallet-api.prod.affinity-project.org/api/v1/share/b8a2c0cbc5a02da03d2aecb59094672a8e0b16a1c845456bd18678529d6901df?key=beda347c431e02319bd31c63e5f5f5f5e14939efdb6697ce4d93c87eade27c47"
                  },
                  {
                    id: "claimId:af7e0b1b5c4858eb",
                    type: "ResumeVC",
                    url: "https://cloud-wallet-api.prod.affinity-project.org/api/v1/share/b8a2c0cbc5a02da03d2aecb59094672a8e0b16a1c845456bd18678529d6901df?key=beda347c431e02319bd31c63e5f5f5f5e14939efdb6697ce4d93c87eade27c47"
                  }
                ],
                tags: [
                  {
                    code: "func_skills",
                    list: [
                      {
                        code: "Android"
                      },
                      {
                        code: "AWS"
                      }
                    ]
                  }
                ]
              },
              contact: {
                phone: "9999999999999",
                email: "abc@abc.bc"
              }
            }
          }
        ]
      }
    }
  };
};

export const dsepScholarshipsStatus = () => {
  return {
    context: {
      domain: "dsep:scholarships",
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
