import http from "k6/http";
import { check, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import {
  retailSelect,
  retailInit,
  retailConfirm,
  retailStatus
} from "../payloads/retailPayloads.js";

export function retailTest() {
  const selectRes = http.post(
    "https://bap-ps-client-vistaar.becknprotocol.io/select",
    JSON.stringify(retailSelect()),
    {
      headers: { "Content-Type": "application/json" }
    }
  );

  check(selectRes, {
    "Success Retail Select Call": (r) => {
      if (JSON.parse(r.body).responses) {
        if (JSON.parse(r.body).responses.length) {
          console.log(
            `Success:${JSON.parse(r.body).context.action}:${
              JSON.parse(r.body).responses.length > 0
            }, ${r.status}`
          );
        } else {
          console.log(
            `Retail Failed ${JSON.parse(r.body).context.action} Message Id->${
              JSON.parse(r.body).context.message_id
            }`
          );
        }
        return JSON.parse(r.body).responses.length > 0;
      }
    }
  });
  sleep(0);
  const initRes = http.post(
    "https://bap-ps-client-vistaar.becknprotocol.io/init",
    JSON.stringify(retailInit()),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
  check(initRes, {
    "Success Retail Init Call": (r) => {
      if (JSON.parse(r.body).responses) {
        if (JSON.parse(r.body).responses.length) {
          console.log(
            `Success:${JSON.parse(r.body).context.action}:${
              JSON.parse(r.body).responses.length > 0
            }, ${r.status}`
          );
        } else {
          console.log(
            `Retail Failed ${JSON.parse(r.body).context.action} Message Id->${
              JSON.parse(r.body).context.message_id
            }`
          );
        }

        return JSON.parse(r.body).responses.length > 0;
      }
    }
  });
  sleep(0);
  const confirmRes = http.post(
    "https://bap-ps-client-vistaar.becknprotocol.io/confirm",
    JSON.stringify(retailConfirm()),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
  check(confirmRes, {
    "Success Retail Confirm Call": (r) => {
      if (JSON.parse(r.body).responses) {
        if (JSON.parse(r.body).responses.length) {
          console.log(
            `Success:${JSON.parse(r.body).context.action}:${
              JSON.parse(r.body).responses.length > 0
            }, ${r.status}`
          );
        } else {
          console.log(
            `Retail Failed ${JSON.parse(r.body).context.action} Message Id->${
              JSON.parse(r.body).context.message_id
            }`
          );
        }
        return JSON.parse(r.body).responses.length > 0;
      }
    }
  });
  sleep(0);
  const statusRes = http.post(
    "https://bap-ps-client-vistaar.becknprotocol.io/status",
    JSON.stringify(retailStatus()),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
  check(statusRes, {
    "Success Retail Status Call": (r) => {
      if (JSON.parse(r.body).responses) {
        if (JSON.parse(r.body).responses.length) {
          console.log(
            `Success:${JSON.parse(r.body).context.action}:${
              JSON.parse(r.body).responses.length > 0
            }, ${r.status}`
          );
        } else {
          console.log(
            `Retail Failed ${JSON.parse(r.body).context.action} Message Id->${
              JSON.parse(r.body).context.message_id
            }`
          );
        }
        return JSON.parse(r.body).responses.length > 0;
      }
    }
  });
  sleep(0);
}

// export function handleSummary(data) {
//   return {
//     "summary.html": htmlReport(data)
//   };
// }
