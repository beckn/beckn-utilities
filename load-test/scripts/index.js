import http from "k6/http";
import { check, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { dsepJobsTest } from "./dsepJobs.js";
import { dsepMentoringTest } from "./dsepMentoring.js";
import { dsepScholarshipsTest } from "./dsepScholarships.js";
import { retailTest } from "./retail.js";
const i = 5; // Number of Iterations
function divideIntoFourParts(number) {
  const baseValue = Math.floor(number / 4);
  const remainder = number % 4;
  const part1 = baseValue + (remainder >= 1 ? 1 : 0);
  const part2 = baseValue + (remainder >= 2 ? 1 : 0);
  const part3 = baseValue + (remainder >= 3 ? 1 : 0);
  const part4 = baseValue;
  return [part1, part2, part3, part4];
}

const vu = divideIntoFourParts(600); // Number of Virtual Users

export const options = {
  scenarios: {
    scenario_dsep_jobs: {
      executor: "per-vu-iterations",
      vus: vu[0],
      iterations: i,
      maxDuration: "20m",
      exec: "scenario_dsep_jobs"
    },
    scenario_dsep_scholarships: {
      executor: "per-vu-iterations",
      vus: vu[1],
      iterations: i,
      maxDuration: "20m",
      exec: "scenario_dsep_scholarships"
    },
    scenario_dsep_mentoring: {
      executor: "per-vu-iterations",
      vus: vu[2],
      iterations: i,
      exec: "scenario_dsep_mentoring",
      maxDuration: "20m"
    },
    scenario_retail: {
      executor: "per-vu-iterations",
      vus: vu[3],
      exec: "scenario_retail",
      iterations: i,
      maxDuration: "20m"
    }
  }
};

export function scenario_dsep_jobs() {
  dsepJobsTest();
  sleep(0);
}

export function scenario_dsep_scholarships() {
  dsepScholarshipsTest();
  sleep(0);
}

export function scenario_dsep_mentoring() {
  dsepMentoringTest();
  sleep(0);
}

export function scenario_retail() {
  retailTest();
  sleep(0);
}

export default function () {
  scenario_dsep_jobs();
  scenario_mentoring_jobs();
  scenario_dsep_scholarships();
  scenario_retail();
}

export function handleSummary(data) {
  return {
    "protocol-server.html": htmlReport(data)
  };
}
