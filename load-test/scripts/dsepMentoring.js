import http from "k6/http";
import { check, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import {
  dsepMentoringSelect,
  dsepMentoringInit,
  dsepMentoringConfirm,
  dsepMentoringStatus
} from "../payloads/dsepMentoringPayloads.js";

export function dsepMentoringTest() {
  const selectRes = http.post(
    "https://bap-ps-client-vistaar.becknprotocol.io/select",
    JSON.stringify(dsepMentoringSelect()),
    {
      headers: { "Content-Type": "application/json" }
    }
  );

  check(selectRes, {
    "Success DSEP Mentoring Select Call": (r) => {
      if (JSON.parse(r.body).responses) {
        if (JSON.parse(r.body).responses.length) {
          console.log(
            `Success:${JSON.parse(r.body).context.action}:${
              JSON.parse(r.body).responses.length > 0
            }, ${r.status}`
          );
        } else {
          console.log(
            `DSEP Mentoring Failed ${
              JSON.parse(r.body).context.action
            } Message Id->${JSON.parse(r.body).context.message_id}`
          );
        }
        return JSON.parse(r.body).responses.length > 0;
      }
    }
  });
  sleep(0);
  const initRes = http.post(
    "https://bap-ps-client-vistaar.becknprotocol.io/init",
    JSON.stringify(dsepMentoringInit()),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
  check(initRes, {
    "Success DSEP Mentoring Init Call": (r) => {
      if (JSON.parse(r.body).responses) {
        if (JSON.parse(r.body).responses.length) {
          console.log(
            `Success:${JSON.parse(r.body).context.action}:${
              JSON.parse(r.body).responses.length > 0
            }, ${r.status}`
          );
        } else {
          console.log(
            `DSEP Mentoring Failed ${
              JSON.parse(r.body).context.action
            } Message Id->${JSON.parse(r.body).context.message_id}`
          );
        }
        return JSON.parse(r.body).responses.length > 0;
      }
    }
  });
  sleep(0);
  const confirmRes = http.post(
    "https://bap-ps-client-vistaar.becknprotocol.io/confirm",
    JSON.stringify(dsepMentoringConfirm()),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
  check(confirmRes, {
    "Success DSEP Mentoring Confirm Call": (r) => {
      if (JSON.parse(r.body).responses) {
        if (JSON.parse(r.body).responses.length) {
          console.log(
            `Success:${JSON.parse(r.body).context.action}:${
              JSON.parse(r.body).responses.length > 0
            }, ${r.status}`
          );
        } else {
          console.log(
            `DSEP Mentoring Failed ${
              JSON.parse(r.body).context.action
            } Message Id->${JSON.parse(r.body).context.message_id}`
          );
        }
        return JSON.parse(r.body).responses.length > 0;
      }
    }
  });
  sleep(0);
  const statusRes = http.post(
    "https://bap-ps-client-vistaar.becknprotocol.io/status",
    JSON.stringify(dsepMentoringStatus()),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
  check(statusRes, {
    "Success DSEP Mentoring Status Call": (r) => {
      if (JSON.parse(r.body).responses) {
        if (JSON.parse(r.body).responses.length) {
          console.log(
            `Success:${JSON.parse(r.body).context.action}:${
              JSON.parse(r.body).responses.length > 0
            }, ${r.status}`
          );
        } else {
          console.log(
            `DSEP Mentoring Failed ${
              JSON.parse(r.body).context.action
            } Message Id->${JSON.parse(r.body).context.message_id}`
          );
        }
        return JSON.parse(r.body).responses.length > 0;
      }
    }
  });
  sleep(0);
}
