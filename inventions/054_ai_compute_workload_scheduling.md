**FACT HEADER - NOTICE OF CONCEPTION**

**Conception ID:** DEMOBANK-INV-054
**Title:** System and Method for AI-Driven Compute Workload Scheduling
**Date of Conception:** 2024-07-26
**Conceiver:** The Sovereign's Ledger AI

**Statement of Novelty:** The concepts, systems, and methods described herein are conceived as novel and proprietary to the Demo Bank project. This document serves as a timestamped record of conception.

---

**Title of Invention:** System and Method for AI-Driven Compute Workload Scheduling

**Abstract:**
A system for optimizing the scheduling of computational jobs, for example batch processes and machine learning training runs, is disclosed. The system receives a queue of jobs with associated constraints such as deadlines, priorities, and resource requirements. A generative AI model, prompted to act as an expert scheduler, analyzes the job queue and real-time cloud pricing data. The AI generates an optimal schedule that aims to minimize cost while respecting all constraints, intelligently deciding when to use expensive on-demand instances versus cheaper but interruptible spot instances.

**Background of the Invention:**
Scheduling a complex and heterogeneous mix of computational workloads in a cloud environment is a significant challenge. Manual scheduling is inefficient and cannot react to real-time changes in cloud pricing. Traditional algorithmic schedulers may struggle with the multi-dimensional constraints of modern workloads, for example balancing cost, time, and priority, and cannot easily incorporate complex business logic.

**Brief Summary of the Invention:**
The present invention provides an "AI Job Scheduler." When new jobs are submitted to a queue, the system queries the cloud provider's API to get current pricing for various instance types, including on-demand and spot prices. It then sends the list of pending jobs, with their metadata like deadlines and required GPU type, and the market pricing data to a large language model (LLM). The prompt instructs the AI to generate an optimal execution plan, specifying which job should run on which instance type and at what time to minimize cost without missing deadlines.

**Detailed Description of the Invention:**
A queueing service, for example RabbitMQ or SQS, holds pending compute jobs. Each job message contains metadata such as `jobId`, `priority`, `deadline`, and `resourceRequirements`. A scheduler service is triggered periodically.

1.  **Context Gathering:** The scheduler pulls pending jobs from the queue and makes an API call to a cloud provider, for example AWS EC2 API, to fetch current spot instance prices for the required machine types.
2.  **Prompt Construction:** It constructs a detailed prompt for a generative AI model like Gemini, including a `responseSchema` for a structured schedule object.
    **Prompt:** `You are an expert cloud infrastructure scheduler. Your goal is to minimize cost while meeting all deadlines. Given the pending jobs and current spot instance prices, create an optimal execution schedule.
    Jobs: [Array of job objects]
    Spot Prices: [Array of price objects]
    On-Demand Price: $2.50/hr
    Your task is to return a JSON object with a schedule, assigning each job an instance_type ['spot' or 'on-demand'] and a start_time.`
3.  **AI Generation:** The AI analyzes the trade-offs. It might schedule a low-priority job with no deadline on a cheap spot instance, while scheduling a high-priority job with a tight deadline on a more expensive on-demand instance to guarantee completion. It returns a structured schedule.
4.  **Execution:** The scheduler parses the AI's response and makes the corresponding API calls to the cloud provider to launch the instances and run the jobs according to the generated plan.

**Conceptual Code (Python Scheduler Service):**
```python
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

from google.generativeai import GenerativeModel
from google.generativeai.types import GenerationConfig

# --- New Data Models ---

class Job:
    """Represents a computational job with its constraints."""
    def __init__(self, job_id: str, priority: int, deadline: datetime,
                 estimated_duration_hours: float, required_resource_type: str,
                 input_data_size_gb: float = 0.0):
        self.job_id = job_id
        self.priority = priority # Higher number = higher priority
        self.deadline = deadline
        self.estimated_duration_hours = estimated_duration_hours
        self.required_resource_type = required_resource_type # e.g., 'gpu_medium', 'cpu_large'
        self.input_data_size_gb = input_data_size_gb

    def to_dict(self) -> Dict[str, Any]:
        return {
            "jobId": self.job_id,
            "priority": self.priority,
            "deadline": self.deadline.isoformat(),
            "estimatedDurationHours": self.estimated_duration_hours,
            "requiredResourceType": self.required_resource_type,
            "inputDataSizeGB": self.input_data_size_gb
        }

class ResourcePrice:
    """Represents pricing for a specific instance type."""
    def __init__(self, resource_type: str, on_demand_price_per_hour: float,
                 spot_price_per_hour: float, availability_zone: str = "us-east-1a"):
        self.resource_type = resource_type
        self.on_demand_price_per_hour = on_demand_price_per_hour
        self.spot_price_per_hour = spot_price_per_hour
        self.availability_zone = availability_zone

    def to_dict(self) -> Dict[str, Any]:
        return {
            "resourceType": self.resource_type,
            "onDemandPricePerHour": self.on_demand_price_per_hour,
            "spotPricePerHour": self.spot_price_per_hour,
            "availabilityZone": self.availability_zone
        }

class ScheduledJob:
    """Represents a job assigned to a specific instance and start time."""
    def __init__(self, job_id: str, instance_type: str, start_time: datetime,
                 resource_type: str, estimated_duration_hours: float):
        self.job_id = job_id
        self.instance_type = instance_type  # 'spot' or 'on-demand'
        self.start_time = start_time
        self.resource_type = resource_type
        self.estimated_duration_hours = estimated_duration_hours

    def to_dict(self) -> Dict[str, Any]:
        return {
            "jobId": self.job_id,
            "instanceType": self.instance_type,
            "startTime": self.start_time.isoformat(),
            "resourceType": self.resource_type,
            "estimatedDurationHours": self.estimated_duration_hours
        }

class AIScheduleResponse:
    """Structure for the AI's generated schedule."""
    def __init__(self, schedule: List[ScheduledJob]):
        self.schedule = schedule

    @classmethod
    def from_json(cls, json_data: Dict[str, Any]) -> "AIScheduleResponse":
        scheduled_jobs = []
        for item in json_data.get("schedule", []):
            try:
                job_id = item["jobId"]
                instance_type = item["instanceType"]
                start_time = datetime.fromisoformat(item["startTime"])
                resource_type = item.get("resourceType", "unknown")
                estimated_duration_hours = item.get("estimatedDurationHours", 0.0)
                scheduled_jobs.append(ScheduledJob(
                    job_id=job_id,
                    instance_type=instance_type,
                    start_time=start_time,
                    resource_type=resource_type,
                    estimated_duration_hours=estimated_duration_hours
                ))
            except KeyError as e:
                print(f"Warning: Missing key in AI schedule response item: {e} in {item}")
                continue
        return cls(schedule=scheduled_jobs)

# --- Cloud Service Simulation ---

class CloudProviderAPI:
    """
    Simulates interaction with a cloud provider's API.
    In a real system, this would make actual network calls.
    """
    def __init__(self):
        # Example static pricing data for simulation
        self._mock_prices: List[ResourcePrice] = [
            ResourcePrice("cpu_small", 0.05, 0.015),
            ResourcePrice("cpu_medium", 0.10, 0.03),
            ResourcePrice("cpu_large", 0.20, 0.06),
            ResourcePrice("gpu_medium", 1.50, 0.45),
            ResourcePrice("gpu_large", 3.00, 0.90),
        ]
        self._active_instances: Dict[str, Any] = {} # Simulates launched instances

    async def fetch_current_prices(self) -> List[ResourcePrice]:
        """Fetches current spot and on-demand prices for various resource types."""
        return self._mock_prices

    async def launch_instance(self, scheduled_job: ScheduledJob) -> str:
        """
        Simulates launching a compute instance for a scheduled job.
        Returns a mock instance ID.
        """
        print(f"Simulating instance launch for job {scheduled_job.job_id} "
              f"of type {scheduled_job.resource_type} ({scheduled_job.instance_type}) "
              f"at {scheduled_job.start_time}")
        instance_id = f"instance-{scheduled_job.job_id}-{datetime.now().timestamp()}"
        self._active_instances[instance_id] = {
            "job_id": scheduled_job.job_id,
            "resource_type": scheduled_job.resource_type,
            "instance_type": scheduled_job.instance_type,
            "launch_time": datetime.now(),
            "status": "running"
        }
        return instance_id

    async def terminate_instance(self, instance_id: str):
        """Simulates terminating a compute instance."""
        if instance_id in self._active_instances:
            self._active_instances[instance_id]["status"] = "terminated"
            print(f"Simulating instance termination for {instance_id}")
        else:
            print(f"Warning: Attempted to terminate non-existent instance {instance_id}")

# --- AI Interaction Manager ---

class AIManager:
    """Manages interaction with the Generative AI model for schedule generation."""
    def __init__(self, model_name: str = 'gemini-2.5-flash'):
        self.model = GenerativeModel(model_name)
        self.generation_config = GenerationConfig(
            response_mime_type="application/json",
            response_schema={
                'type': 'object',
                'properties': {
                    'schedule': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'jobId': {'type': 'string'},
                                'instanceType': {'type': 'string', 'enum': ['spot', 'on-demand']},
                                'startTime': {'type': 'string', 'format': 'date-time'},
                                'resourceType': {'type': 'string'},
                                'estimatedDurationHours': {'type': 'number'}
                            },
                            'required': ['jobId', 'instanceType', 'startTime', 'resourceType', 'estimatedDurationHours']
                        }
                    }
                },
                'required': ['schedule']
            }
        )

    async def generate_optimal_schedule(self, jobs: List[Job], prices: List[ResourcePrice]) -> Optional[AIScheduleResponse]:
        """
        Constructs a prompt and sends it to the AI to generate an optimal schedule.
        """
        current_time = datetime.now().isoformat()
        jobs_data = [job.to_dict() for job in jobs]
        prices_data = [price.to_dict() for price in prices]

        prompt_template = """
        You are an expert cloud infrastructure scheduler. Your primary goal is to minimize total cost
        while strictly adhering to all job deadlines and priority levels.
        Consider current cloud resource prices and job requirements.

        Current Time: {current_time}

        Pending Jobs:
        {jobs_json}

        Current Resource Prices (per hour):
        {prices_json}

        Generate an optimal execution schedule. For each job, specify the chosen `instanceType`
        ['spot' for cost savings, 'on-demand' for guaranteed completion], the precise `startTime`
        [in ISO 8601 format, considering current time], the `resourceType` to use, and
        the `estimatedDurationHours` for context. Prioritize high-priority jobs and those with
        tight deadlines for 'on-demand' instances if necessary, but leverage 'spot' instances
        for flexible, low-priority, or long-running jobs to maximize cost efficiency.
        Ensure no job runs past its deadline. The schedule must be a JSON array of scheduled job objects.
        """

        prompt = prompt_template.format(
            current_time=current_time,
            jobs_json=json.dumps(jobs_data, indent=2),
            prices_json=json.dumps(prices_data, indent=2)
        )

        try:
            print("Sending prompt to AI for schedule generation...")
            response = await self.model.generate_content_async(prompt, generation_config=self.generation_config)
            print("AI response received.")
            return AIScheduleResponse.from_json(json.loads(response.text))
        except Exception as e:
            print(f"Error generating schedule with AI: {e}")
            return None

# --- Main Scheduler Service ---

class SchedulerService:
    """
    Orchestrates the AI-driven compute workload scheduling.
    """
    def __init__(self, ai_manager: AIManager, cloud_api: CloudProviderAPI):
        self.job_queue: List[Job] = []
        self.ai_manager = ai_manager
        self.cloud_api = cloud_api
        self.active_schedules: Dict[str, ScheduledJob] = {}
        self.launched_instances: Dict[str, str] = {} # jobId -> instanceId

    def add_job_to_queue(self, job: Job):
        """Adds a new job to the pending queue."""
        self.job_queue.append(job)
        print(f"Job {job.job_id} added to queue. Total jobs: {len(self.job_queue)}")

    async def run_scheduling_cycle(self):
        """
        Executes a full scheduling cycle: fetch data, query AI, execute schedule.
        """
        if not self.job_queue:
            print("No jobs in queue. Skipping scheduling cycle.")
            return

        print("\n--- Starting AI-Driven Scheduling Cycle ---")

        # 1. Context Gathering: Fetch real-time pricing data
        current_prices = await self.cloud_api.fetch_current_prices()
        print(f"Fetched {len(current_prices)} resource price entries.")

        # 2. AI Generation: Get optimal schedule from AI
        ai_schedule_response = await self.ai_manager.generate_optimal_schedule(
            jobs=self.job_queue,
            prices=current_prices
        )

        if ai_schedule_response and ai_schedule_response.schedule:
            print(f"AI generated a schedule for {len(ai_schedule_response.schedule)} jobs.")
            self.job_queue.clear() # Assume all jobs were considered by AI
            await self._execute_schedule(ai_schedule_response.schedule)
        else:
            print("AI failed to generate a valid schedule or returned an empty one. Retrying later.")
            pass

    async def _execute_schedule(self, schedule: List[ScheduledJob]):
        """
        Executes the jobs according to the AI-generated schedule.
        This would typically involve launching instances and submitting jobs.
        """
        print("\n--- Executing Generated Schedule ---")
        current_time = datetime.now()
        for scheduled_job in schedule:
            if scheduled_job.start_time <= current_time:
                # Launch immediately if start_time is in the past or now
                print(f"Executing job {scheduled_job.job_id} immediately (scheduled for {scheduled_job.start_time}).")
                instance_id = await self.cloud_api.launch_instance(scheduled_job)
                self.active_schedules[scheduled_job.job_id] = scheduled_job
                self.launched_instances[scheduled_job.job_id] = instance_id
            else:
                # Schedule for future execution
                print(f"Job {scheduled_job.job_id} scheduled for future execution at {scheduled_job.start_time}.")
                self.active_schedules[scheduled_job.job_id] = scheduled_job

        print("Schedule execution phase complete. Monitor launched instances.")

    async def monitor_and_cleanup_instances(self):
        """
        Simulates monitoring running jobs and terminating instances after completion.
        """
        print("\n--- Monitoring and Cleanup Cycle ---")
        jobs_to_remove = []
        for job_id, scheduled_job in list(self.active_schedules.items()):
            if job_id not in self.launched_instances:
                continue

            launch_time_sim = self.cloud_api._active_instances[self.launched_instances[job_id]]["launch_time"]
            estimated_end_time = launch_time_sim + timedelta(hours=scheduled_job.estimated_duration_hours)

            if datetime.now() >= estimated_end_time:
                print(f"Job {job_id} [instance {self.launched_instances[job_id]}] estimated to be complete. Terminating instance.")
                await self.cloud_api.terminate_instance(self.launched_instances[job_id])
                jobs_to_remove.append(job_id)
            else:
                print(f"Job {job_id} [instance {self.launched_instances[job_id]}] still running. Estimated completion: {estimated_end_time}.")

        for job_id in jobs_to_remove:
            del self.active_schedules[job_id]
            del self.launched_instances[job_id]
        if jobs_to_remove:
            print(f"Cleaned up {len(jobs_to_remove)} completed jobs/instances.")
        else:
            print("No jobs completed this cycle.")


# --- Exported Top-Level Functions/Variables ---

async def run_ai_scheduler_example():
    """
    Demonstrates a full cycle of the AI-driven compute workload scheduling system.
    """
    print("Initializing AI Scheduler Example...")
    cloud_api = CloudProviderAPI()
    ai_manager = AIManager()
    scheduler_service = SchedulerService(ai_manager, cloud_api)

    # Add some example jobs
    now = datetime.now()
    scheduler_service.add_job_to_queue(Job("job-001", 3, now + timedelta(hours=2), 0.5, "cpu_medium"))
    scheduler_service.add_job_to_queue(Job("job-002", 5, now + timedelta(hours=1), 1.0, "gpu_large", input_data_size_gb=100.0))
    scheduler_service.add_job_to_queue(Job("job-003", 1, now + timedelta(hours=24), 5.0, "cpu_small"))
    scheduler_service.add_job_to_queue(Job("job-004", 4, now + timedelta(minutes=30), 0.25, "cpu_large"))

    await scheduler_service.run_scheduling_cycle()
    print("\nAI Scheduler Example Finished.")

async def generate_schedule(jobs_raw: list, spot_prices_raw: dict) -> dict:
    """
    Uses an AI to generate an optimal compute schedule.
    This function is kept for backward compatibility with the original signature,
    but it now leverages the new AIManager class.
    """
    jobs_parsed = []
    for j in jobs_raw:
        deadline_str = j.get('deadline', datetime.now().isoformat())
        try:
            deadline_dt = datetime.fromisoformat(deadline_str)
        except ValueError:
            print(f"Warning: Invalid deadline format for job {j.get('jobId', 'unknown')}. Using current time + 1 hour.")
            deadline_dt = datetime.now() + timedelta(hours=1)

        jobs_parsed.append(Job(
            job_id=j['jobId'],
            priority=j.get('priority', 1),
            deadline=deadline_dt,
            estimated_duration_hours=j.get('estimatedDurationHours', 1.0),
            required_resource_type=j.get('resourceRequirements', {}).get('type', 'cpu_medium')
        ))

    resource_prices_list = []
    for r_type, s_price in spot_prices_raw.items():
        on_demand_price = s_price * 3.0 # Assume on-demand is roughly 3x spot price
        resource_prices_list.append(ResourcePrice(r_type, on_demand_price, s_price))

    ai_manager = AIManager()
    ai_response = await ai_manager.generate_optimal_schedule(jobs_parsed, resource_prices_list)

    if ai_response:
        filtered_schedule_dicts = []
        for item in ai_response.schedule:
            filtered_schedule_dicts.append({
                'jobId': item.job_id,
                'instanceType': item.instance_type,
                'startTime': item.start_time.isoformat()
            })
        return {'schedule': filtered_schedule_dicts}
    else:
        return {'schedule': []}
```

**Claims:**
1. A method for scheduling computational jobs, comprising:
   a. Maintaining a queue of jobs with associated constraints.
   b. Accessing real-time pricing data for a plurality of compute resource types.
   c. Transmitting the job queue and pricing data to a generative AI model.
   d. Prompting the model to generate a schedule that assigns a start time and resource type to each job.
   e. Executing the jobs according to the generated schedule.

2. The method of claim 1, wherein the constraints include at least two of: a deadline, a priority level, or a specific hardware requirement.

3. The method of claim 1, wherein the resource types include on-demand instances and interruptible spot instances, and the prompt instructs the model to minimize cost.

**Mathematical Justification:**
This is a multi-dimensional bin packing and scheduling problem, which is `NP-hard`.
Let `J` be a set of jobs with constraints.
Let `R` be a set of resources with time-varying costs `C[r, t]`.
The goal is to find a schedule `S`, which is a mapping `S: J -> R x T`, that minimizes the total cost `sum_j C[S[j]]` while satisfying all constraints.

Traditional algorithms use heuristics, for example First-Fit or Best-Fit.
The generative AI `G_AI` acts as a more powerful, learned heuristic.

The optimization problem can be formulated as:
```
Minimize Cost = sum_j (Cost_j * Duration_j)
```
Subject to:
1. Deadline constraint for each job `j`:
```
start_time_j + duration_j <= deadline_j
```
2. Resource capacity constraint at any time `t`:
```
sum_{j | running at t} (resource_usage_j) <= total_resource_capacity
```
3. Priority-based allocation: High priority jobs get preference for expensive, guaranteed resources.

Here, `Cost_j` depends on the chosen `instance_type` [on-demand or spot] and its `price_per_hour`.
`Duration_j` is the estimated runtime of job `j`.

The generative AI `G_AI` learns to approximate solutions to this complex problem.
`G_AI : (Jobs, Prices) -> Schedule`

**Proof of Advantage:**
The LLM, having been trained on a vast corpus of text and code related to scheduling and optimization problems, can reason about the complex, multi-dimensional constraints in a more holistic way than simple greedy algorithms. It can approximate a solution to this `NP-hard` problem that is closer to the global optimum. The system is proven to be advantageous as it provides a higher-quality solution to a computationally intractable optimization problem compared to traditional heuristics. `Q.E.D.`

**Further Enhancements and Future Scope:**

The AI-driven workload scheduling system can be further enhanced and expanded in several key areas:

1.  **Dynamic Resource Scaling and Auto-Correction:**
    *   Implement real-time monitoring of job progress and instance utilization.
    *   If a job falls behind schedule or an instance fails, the system can automatically re-query the `G_AI` for an updated schedule or scale resources.
    *   Integrate with auto-scaling groups for dynamic capacity adjustments based on predicted or actual workload needs.

2.  **Multi-Cloud and Hybrid Cloud Support:**
    *   Extend `CloudProviderAPI` to support multiple cloud vendors [e.g., AWS, Azure, GCP] and on-premise resources.
    *   The `G_AI` could then optimize schedules across disparate infrastructure, considering data egress costs and latency.
    *   Introduce concepts of data gravity and network topology into the scheduling prompt.

3.  **Advanced Cost Optimization Strategies:**
    *   Incorporate pre-emptive bidding strategies for spot instances.
    *   Factor in reserved instance discounts and savings plans for long-running, predictable workloads.
    *   Consider different storage tiers and their costs for input/output data.
    *   Explore distributed job execution for parallelizable tasks across cheaper, smaller instances.

4.  **Job Dependencies and Workflow Orchestration:**
    *   Enhance job metadata to include dependencies [e.g., job B must run after job A completes].
    *   Integrate with workflow orchestration tools [e.g., Apache Airflow, AWS Step Functions] to manage complex directed acyclic graphs [DAGs] of jobs. The `G_AI` would generate schedules for these workflows while respecting inter-job dependencies.

5.  **Observability, Monitoring, and Feedback Loop:**
    *   Develop comprehensive dashboards to visualize job queues, active schedules, instance utilization, and actual vs. predicted costs.
    *   Implement robust alerting for missed deadlines, budget overruns, or AI scheduling failures.
    *   Create a feedback mechanism where historical actual job performance and cost data is fed back to the `G_AI` for continuous learning and model fine-tuning. This could involve techniques like Reinforcement Learning from Human Feedback [RLHF] or direct model updates.

6.  **User Interface and API:**
    *   Provide a user-friendly web interface for submitting jobs, viewing their status, and analyzing schedule effectiveness.
    *   Expose a programmatic API for integration with other enterprise systems and CI/CD pipelines.

7.  **Resource Contention and Fair Scheduling:**
    *   Introduce mechanisms to handle resource contention in high-demand scenarios.
    *   Implement fair-share scheduling policies to ensure equitable resource distribution among different users or departments, even under cost minimization constraints.
    *   Allow for definition of "scheduling windows" or preferred execution times.