import http from "k6/http";
import { sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { registryBGTest, registryBPPTest } from "./registry.js";

const i = 4;

export const options = {
  scenarios: {
    scenario_registry_bpp: {
      executor: "per-vu-iterations",
      vus: 100,
      iterations: i,
      maxDuration: "20m",
      exec: "scenario_registry_bpp"
    },
    scenario_registry_bg: {
      executor: "per-vu-iterations",
      vus: 100,
      iterations: i,
      maxDuration: "20m",
      exec: "scenario_registry_bg"
    }
  }
};

export function scenario_registry_bpp() {
  registryBPPTest();
  sleep(0);
}

export function scenario_registry_bg() {
  registryBGTest();
  sleep(0);
}

export default function () {
  scenario_registry_bpp();
  scenario_registry_bg();
}

export function handleSummary(data) {
  return {
    "registry.html": htmlReport(data)
  };
}
