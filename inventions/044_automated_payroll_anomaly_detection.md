
**Title of Invention:** System and Method for Anomaly Detection in Payroll Processing

**Abstract:**
A system for identifying anomalies in payroll data is disclosed. Before a payroll run is executed, the system compares the current payroll data against historical runs. It uses a generative AI model to analyze the comparison and identify significant deviations, such as an employee's pay changing drastically, a new employee being added with an unusually high salary, or a terminated employee remaining on the payroll. The AI generates a plain-English summary of any detected anomalies, allowing a payroll administrator to investigate before processing.

**Background of the Invention:**
Payroll errors can be costly and damaging to employee morale. Manually checking every line item in a payroll run is tedious and prone to human error, especially in large organizations. There is a need for an automated system that can intelligently flag potential errors before the payroll is processed.

**Detailed Description of the Invention:**
When an administrator initiates a pay run, the system first compiles the current run's data and the data from the previous run. It sends a summary of this data to an LLM with a prompt: `You are a payroll auditor. Compare this upcoming pay run to the previous one and identify any anomalies. Pay attention to large salary changes, new hires with high salaries, and employees present in the last run but missing in this one. Upcoming: [data]. Previous: [data].` The AI's response is a list of potential issues, which are displayed as warnings to the administrator before they can confirm the pay run.

**Claims:**
1. A method for detecting payroll anomalies, comprising:
   a. Accessing data for a current payroll run and at least one historical payroll run.
   b. Transmitting said data to a generative AI model.
   c. Prompting the model to identify significant deviations between the current and historical data.
   d. Displaying the identified deviations to a user as anomalies.
