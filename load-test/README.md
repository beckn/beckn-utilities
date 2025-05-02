# Load Testing with k6

This directory contains scripts, payloads, and result files for performing load testing on various APIs and services within the Beckn ecosystem using [k6](https://k6.io/). These load tests simulate real-world usage patterns to measure the performance, reliability, and scalability of the services.

---

## Structure

### Scripts (`load-test/scripts`)

The `scripts` folder contains JavaScript files that define test scenarios for specific functionalities or modules. Each script targets a set of APIs and performs various operations, such as sending requests, validating responses, and generating logs.

**Key scripts:**

- `retail.js`: Tests retail APIs, including `select`, `init`, `confirm`, and `status`.
- `dsepJobs.js`: Tests job-related APIs in the Digital Services Ecosystem Protocol (DSEP) module.
- `dsepMentoring.js`: Tests mentoring-related APIs in the DSEP module.
- `dsepScholarships.js`: Tests scholarship-related APIs in the DSEP module.
- `gatewayIndex.js`: Tests gateway or entry-point services.
- `registry.js`: Tests registry APIs.

### Payloads (`load-test/payloads`)

The `payloads` folder contains pre-defined data structures used by the scripts. These payloads are sent as part of the requests to simulate real-world data.

**Key payload files:**

- `retailPayloads.js`: Payloads for retail APIs.
- `dsepJobsPayloads.js`: Payloads for job-related APIs in DSEP.
- `dsepMentoringPayloads.js`: Payloads for mentoring-related APIs in DSEP.
- `dsepScholarshipsPayload.js`: Payloads for scholarship-related APIs in DSEP.
- `gatewayPayloads.js`: Payloads for gateway services.
- `registryPayloads.js`: Payloads for registry APIs.

### Results

The results of the load testing are documented in the following Excel sheets located in this folder:

1. `Horizontal Load Testing.xlsx`: Contains the results and observations of horizontal scaling tests.
2. `Vertical Load Test Matrix.xlsx`: Contains the results and observations of vertical scaling tests.

These files provide a detailed analysis of the performance metrics collected during the tests.

---

## Prerequisites

1. Install [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/).
2. Ensure you have access to the APIs being tested and their associated credentials (if required).

---

## How to Run a Test

1. Clone the repository and navigate to the `load-test` directory:

```bash
git clone https://github.com/beckn/beckn-utilities.git
cd beckn-utilities/load-test
```

2. Execute a specific test script with k6:

```bash
k6 run scripts/<script-name>.js
```

For example, to run the retail test:

```bash
k6 run scripts/retail.js
```

3. (Optional) Generate a performance report:

Some scripts have a built-in reporter to generate an HTML summary. Uncomment the `handleSummary` function in the script to enable it.

---

## What These Tests Do

- **Simulate API Calls**: Perform operations like `select`, `init`, `confirm`, and `status` for retail and similar workflows for other modules.
- **Validate Responses**: Check the correctness of API responses and log the results.
- **Stress Test Services**: Simulate multiple concurrent users to evaluate performance under load.

---

## Example Usage

To test the retail APIs:

1. Navigate to the `scripts` folder.
2. Open `retail.js` and review the configurations.
3. Run the script using k6:

```bash
k6 run scripts/retail.js
```

You can customize the payloads in the `payloads` folder and adjust the number of users and duration in the script to fit your testing requirements.

---

## Notes

- Ensure the target APIs are accessible and ready for testing before running these scripts.
- For more advanced configurations, refer to the [k6 documentation](https://k6.io/docs/).
