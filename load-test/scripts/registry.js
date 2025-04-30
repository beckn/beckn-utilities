import http from "k6/http";
import { check, sleep } from "k6";
import {
  registryLookupForBG,
  registryLookupForSpecificBPP
} from "../payloads/registryPayloads.js";

const domains = [
  "retail:1.1.0",
  "dsep:jobs",
  "dsep:mentoring",
  "dsep:scholarships"
];

export function registryBGTest() {
  const BGs = http.post(
    "https://registry-vistaar.becknprotocol.io/subscribers/lookup",
    JSON.stringify(registryLookupForBG(domains[Math.random() * 4])),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
  check(BGs, { "Got List of BGs": (r) => JSON.parse(r.body).length > 0 });
  sleep(0);
}

export function registryBPPTest() {
  const BPPs = http.post(
    "https://registry-vistaar.becknprotocol.io/subscribers/lookup",
    JSON.stringify(
      registryLookupForSpecificBPP(
        "bpp-ps-network-sandbox-vistaar.becknprotocol.io",
        domains[Math.random() * 4]
      )
    ),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
  check(BPPs, { "Got List of BPPs": (r) => JSON.parse(r.body).length > 0 });
  sleep(0);
}
