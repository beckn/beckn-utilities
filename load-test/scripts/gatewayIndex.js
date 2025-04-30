import http from "k6/http";
import { check, sleep } from "k6";
import { gatewayBroadcastPayload } from "../payloads/gatewayPayloads.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const domains = [
  "retail:1.1.0",
  "dsep:jobs",
  "dsep:mentoring",
  "dsep:scholarships"
];

const i = 3;

export const options = {
  scenarios: {
    scenario_gateway: {
      executor: "per-vu-iterations",
      vus: 2000,
      iterations: i,
      maxDuration: "20m",
      exec: "scenario_gateway"
    }
  }
};

export function scenario_gateway() {
  gatewayBroadcastTest();
  sleep(0);
}

export default function () {
  scenario_gateway();
}

export function gatewayBroadcastTest() {
  const gatewayResponse = http.post(
    "https://gateway-vistaar.becknprotocol.io/bg/search",
    JSON.stringify(gatewayBroadcastPayload(domains[Math.random() * 4])),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
  check(gatewayResponse, {
    "Got ACK from Gateway": (r) =>
      JSON.parse(r.body).message.ack.status === "ACK"
  });
  sleep(0);
}

export function handleSummary(data) {
  return {
    "gateway.html": htmlReport(data)
  };
}
