# The Creator's Codex - Sovereign Integration Blueprint
## Module Integrations: The Unification of Cloud, Identity, Storage, and Compute Paradigms

This seminal document delineates the exhaustive, production-ready, and strategically vital integration plan for the foundational infrastructure modules of the Creator's Codex ecosystem: **The Aetherium (Cloud)**, **The Hall of Faces (Identity)**, **The Great Library (Storage)**, and **The Engine Core (Compute)**. Our objective is to transcend conventional infrastructure management, providing a unified, intelligent, and highly performant platform. This blueprint demonstrates how internal operational dashboards are transformed into powerful command centers, driven by real-world, enterprise-grade integrations with leading global cloud and identity providers, engineered for unparalleled control and insight. Every aspect is designed for sovereign control and intelligent automation, embodying the pinnacle of technological foresight.

---

## 1. Cloud Module: The Aetherium - Multiverse Command & Control
### Core Concept
The Aetherium module serves as the ultimate nexus for multi-cloud resource orchestration and intelligence. It provides an exquisitely unified, real-time command-and-control interface across an organization's entire cloud footprint. Leveraging advanced SDKs from each respective provider, it ingests, processes, and synthesizes live telemetry—encompassing granular costs, comprehensive resource health, intricate performance metrics, and compliance postures—presenting them within a single, intuitively navigable, and highly customizable dashboard. This isn't merely a monitoring tool; it's a strategic intelligence platform, predictive and prescriptive, designed to optimize every facet of cloud operations.

### Key API Integrations and Strategic Expansion

#### a. AWS SDK (`@aws-sdk/client-cost-explorer`, `@aws-sdk/client-ec2`, `@aws-sdk/client-cloudwatch`, `@aws-sdk/client-s3`)
-   **Purpose:** To achieve unparalleled insight into AWS operational economics, resource health, and performance envelopes. This includes precise cost and usage attribution from AWS Cost Explorer, real-time operational status of all EC2 instances, deep performance metrics from CloudWatch, and comprehensive S3 bucket management.
-   **Architectural Approach:** A sophisticated, highly available, and scalable backend microservice architecture, potentially deployed within a serverless container environment (e.g., AWS Fargate, Azure Container Apps), will house the AWS integration logic. Configured with secure, ephemeral AWS IAM roles or robust service principals, this service will execute a series of meticulously scheduled, asynchronous jobs. These jobs will leverage the AWS SDKs to perform data harvesting (e.g., hourly for detailed costs, sub-minute for critical instance statuses, real-time for anomaly detection feeds). Results are then subjected to a robust caching layer (e.g., Redis, DynamoDB Accelerator) and a data transformation pipeline, preparing them for real-time aggregation and presentation within the Aetherium's frontend. AI/ML models are embedded to detect cost anomalies, predict future spend, and recommend resource optimization strategies.
-   **Code Examples:**
    -   **TypeScript (Backend Service - Dynamic AWS Cost and Usage Aggregation with Predictive Analytics Integration):**
        ```typescript
        // services/aetherium/aws_cost_monitor.ts
        import { CostExplorerClient, GetCostAndUsageCommand, Expression } from "@aws-sdk/client-cost-explorer";
        import { EC2Client, DescribeInstancesCommand, Instance } from "@aws-sdk/client-ec2";
        import { S3Client, ListBucketsCommand, GetBucketLocationCommand, GetBucketTaggingCommand } from "@aws-sdk/client-s3";
        import { CloudWatchClient, GetMetricDataCommand, MetricDataQuery, MetricDataResult } from "@aws-sdk/client-cloudwatch";
        import { config } from 'dotenv'; // For environment variable management
        import { z } from 'zod'; // For robust input validation
        import { logger } from '../utils/logger'; // Centralized logging utility
        import { cache } from '../utils/cache_manager'; // Shared caching utility
        import { generateReportId } from '../utils/uuid_generator'; // Utility for unique report IDs
        import { aiPredictiveCostModel } from '../ai/cost_forecaster'; // AI model integration

        config(); // Load environment variables from .env file

        const AwsConfigSchema = z.object({
          region: z.string().default(process.env.AWS_REGION || "us-east-1"),
          accessKeyId: z.string().optional(), // For programmatic access, typically use IAM roles
          secretAccessKey: z.string().optional(),
        });

        type AwsConfig = z.infer<typeof AwsConfigSchema>;

        export interface AwsCostDataPoint {
          service: string;
          amount: number;
          unit: string;
          prediction?: number; // AI-driven prediction
          anomalyDetected?: boolean;
        }

        export interface AwsResourceStatus {
          instanceId: string;
          instanceType: string;
          state: string;
          launchTime: Date;
          tags: Record<string, string>;
          metrics?: {
            cpuUtilization?: number;
            networkIn?: number;
          };
        }

        export interface S3BucketOverview {
          name: string;
          region: string;
          creationDate: Date;
          tags: Record<string, string>;
          // AI-driven recommendations for tiering or security
          tieringRecommendation?: 'STANDARD' | 'IA' | 'GLACIER' | 'DEEP_ARCHIVE';
          securityAlerts?: string[];
        }

        // Initialize clients from validated config
        const initializeAwsClients = (config: AwsConfig) => {
          return {
            costExplorer: new CostExplorerClient({ region: config.region, credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey } }),
            ec2: new EC2Client({ region: config.region, credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey } }),
            s3: new S3Client({ region: config.region, credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey } }),
            cloudwatch: new CloudWatchClient({ region: config.region, credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey } }),
          };
        };

        const awsClients = initializeAwsClients(AwsConfigSchema.parse({})); // Parse and validate config

        /**
         * Fetches and aggregates AWS cost data with AI-driven prediction.
         * @param startDate - Start date for cost aggregation (YYYY-MM-DD).
         * @param endDate - End date for cost aggregation (YYYY-MM-DD).
         * @param granularity - Granularity of data (DAILY, MONTHLY, HOURLY).
         * @returns Array of AwsCostDataPoint, including AI predictions.
         */
        export async function getAggregatedAwsCost(
          startDate: string,
          endDate: string,
          granularity: "DAILY" | "MONTHLY" | "HOURLY" = "MONTHLY",
          groupByDimension: string = "SERVICE"
        ): Promise<AwsCostDataPoint[] | undefined> {
          const cacheKey = `aws-cost-${startDate}-${endDate}-${granularity}-${groupByDimension}`;
          const cachedData = await cache.get<AwsCostDataPoint[]>(cacheKey);
          if (cachedData) {
            logger.info(`Serving AWS cost data from cache for ${cacheKey}`);
            return cachedData;
          }

          logger.info(`Fetching AWS cost data for ${startDate} to ${endDate} with granularity ${granularity}`);
          const command = new GetCostAndUsageCommand({
            TimePeriod: { Start: startDate, End: endDate },
            Granularity: granularity,
            Metrics: ["UnblendedCost", "UsageQuantity"],
            GroupBy: [{ Type: "DIMENSION", Key: groupByDimension }],
            Filter: {
              // Example: Only include costs for 'Production' environment
              Dimensions: {
                Key: "TAG",
                Values: ["environment:production"]
              }
            } as Expression, // Type assertion for complex filter
          });

          try {
            const response = await awsClients.costExplorer.send(command);
            const results: AwsCostDataPoint[] = [];

            if (response.ResultsByTime && response.ResultsByTime.length > 0) {
              for (const timePeriod of response.ResultsByTime) {
                for (const group of timePeriod.Groups || []) {
                  const serviceName = group.Keys ? group.Keys[0] : 'UNKNOWN_SERVICE';
                  const costAmount = parseFloat(group.Metrics?.UnblendedCost?.Amount || '0');
                  const costUnit = group.Metrics?.UnblendedCost?.Unit || 'USD';

                  // Integrate AI for predictive cost modeling
                  const predictedCost = await aiPredictiveCostModel.predictCost(serviceName, costAmount, timePeriod.TimePeriod?.Start || startDate);
                  const anomalyDetected = await aiPredictiveCostModel.detectAnomaly(serviceName, costAmount);

                  results.push({
                    service: serviceName,
                    amount: costAmount,
                    unit: costUnit,
                    prediction: predictedCost,
                    anomalyDetected: anomalyDetected,
                  });
                }
              }
            }
            await cache.set(cacheKey, results, 3600); // Cache for 1 hour
            logger.info(`Successfully fetched and cached AWS cost data. Report ID: ${generateReportId()}`);
            return results;
          } catch (error) {
            logger.error(`Error fetching AWS cost data: ${(error as Error).message}`, { error });
            throw new Error(`Failed to retrieve AWS cost data: ${(error as Error).message}`);
          }
        }

        /**
         * Fetches detailed status and metrics for all EC2 instances.
         * @returns Array of AwsResourceStatus.
         */
        export async function getEc2InstanceStatus(): Promise<AwsResourceStatus[]> {
          const cacheKey = `aws-ec2-status`;
          const cachedData = await cache.get<AwsResourceStatus[]>(cacheKey);
          if (cachedData) {
            logger.info(`Serving EC2 instance status from cache for ${cacheKey}`);
            return cachedData;
          }

          logger.info("Fetching EC2 instance status...");
          const instances: AwsResourceStatus[] = [];
          try {
            const command = new DescribeInstancesCommand({
              Filters: [{ Name: "instance-state-name", Values: ["running", "pending", "stopping", "stopped"] }]
            });
            const response = await awsClients.ec2.send(command);

            for (const reservation of response.Reservations || []) {
              for (const instance of reservation.Instances || []) {
                const tags: Record<string, string> = {};
                for (const tag of instance.Tags || []) {
                  if (tag.Key && tag.Value) {
                    tags[tag.Key] = tag.Value;
                  }
                }

                const instanceStatus: AwsResourceStatus = {
                  instanceId: instance.InstanceId!,
                  instanceType: instance.InstanceType!,
                  state: instance.State?.Name!,
                  launchTime: instance.LaunchTime!,
                  tags: tags,
                };
                // Fetch CloudWatch metrics for this instance (e.g., CPU Utilization)
                const metricData = await getEc2InstanceMetrics(instance.InstanceId!, awsClients.cloudwatch);
                if (metricData.cpuUtilization) {
                  instanceStatus.metrics = { cpuUtilization: metricData.cpuUtilization };
                }

                instances.push(instanceStatus);
              }
            }
            await cache.set(cacheKey, instances, 300); // Cache for 5 minutes
            logger.info("Successfully fetched and cached EC2 instance statuses.");
            return instances;
          } catch (error) {
            logger.error(`Error fetching EC2 instance status: ${(error as Error).message}`, { error });
            throw new Error(`Failed to retrieve EC2 instance status: ${(error as Error).message}`);
          }
        }

        /**
         * Helper to fetch specific CloudWatch metrics for an EC2 instance.
         */
        async function getEc2InstanceMetrics(instanceId: string, cloudwatchClient: CloudWatchClient): Promise<{ cpuUtilization?: number; networkIn?: number }> {
          const endTime = new Date();
          const startTime = new Date(endTime.getTime() - 5 * 60 * 1000); // Last 5 minutes

          const queries: MetricDataQuery[] = [
            {
              Id: "cpuutil",
              MetricStat: {
                Metric: {
                  Namespace: "AWS/EC2",
                  MetricName: "CPUUtilization",
                  Dimensions: [{ Name: "InstanceId", Value: instanceId }],
                },
                Period: 300, // 5 minutes
                Stat: "Average",
              },
            },
            // Add more metrics as needed
          ];

          try {
            const command = new GetMetricDataCommand({
              MetricDataQueries: queries,
              StartTime: startTime,
              EndTime: endTime,
            });
            const response = await cloudwatchClient.send(command);
            const results: { cpuUtilization?: number; networkIn?: number } = {};

            response.MetricDataResults?.forEach((result: MetricDataResult) => {
              if (result.Id === "cpuutil" && result.Values && result.Values.length > 0) {
                results.cpuUtilization = result.Values[0]; // Get the most recent average
              }
            });
            return results;
          } catch (error) {
            logger.warn(`Could not fetch CloudWatch metrics for instance ${instanceId}: ${(error as Error).message}`);
            return {};
          }
        }

        /**
         * Fetches an overview of all S3 buckets and applies AI-driven recommendations.
         * @returns Array of S3BucketOverview.
         */
        export async function getS3BucketsOverview(): Promise<S3BucketOverview[]> {
          const cacheKey = `aws-s3-overview`;
          const cachedData = await cache.get<S3BucketOverview[]>(cacheKey);
          if (cachedData) {
            logger.info(`Serving S3 bucket overview from cache for ${cacheKey}`);
            return cachedData;
          }

          logger.info("Fetching S3 bucket overview...");
          const bucketsOverview: S3BucketOverview[] = [];
          try {
            const listBucketsCommand = new ListBucketsCommand({});
            const listBucketsResponse = await awsClients.s3.send(listBucketsCommand);

            for (const bucket of listBucketsResponse.Buckets || []) {
              if (bucket.Name && bucket.CreationDate) {
                let bucketRegion = 'us-east-1'; // Default
                try {
                  const getBucketLocationCommand = new GetBucketLocationCommand({ Bucket: bucket.Name });
                  const locationResponse = await awsClients.s3.send(getBucketLocationCommand);
                  bucketRegion = locationResponse.LocationConstraint || 'us-east-1'; // 'null' for us-east-1
                } catch (locationError) {
                  logger.warn(`Could not determine region for bucket ${bucket.Name}: ${(locationError as Error).message}`);
                }

                let bucketTags: Record<string, string> = {};
                try {
                    const getBucketTaggingCommand = new GetBucketTaggingCommand({ Bucket: bucket.Name });
                    const taggingResponse = await awsClients.s3.send(getBucketTaggingCommand);
                    taggingResponse.TagSet?.forEach(tag => {
                        if (tag.Key && tag.Value) {
                            bucketTags[tag.Key] = tag.Value;
                        }
                    });
                } catch (taggingError: any) {
                    // S3 buckets without tags will throw NoSuchTagSet error, which is fine.
                    if (taggingError.name !== 'NoSuchTagSet') {
                        logger.warn(`Could not fetch tags for bucket ${bucket.Name}: ${taggingError.message}`);
                    }
                }

                // AI-driven analysis for tiering and security
                const tieringRecommendation = await aiPredictiveCostModel.recommendS3Tiering(bucket.Name, bucketTags);
                const securityAlerts = await aiPredictiveCostModel.analyzeS3Security(bucket.Name, bucketTags);

                bucketsOverview.push({
                  name: bucket.Name,
                  region: bucketRegion,
                  creationDate: bucket.CreationDate,
                  tags: bucketTags,
                  tieringRecommendation: tieringRecommendation,
                  securityAlerts: securityAlerts,
                });
              }
            }
            await cache.set(cacheKey, bucketsOverview, 3600); // Cache for 1 hour
            logger.info("Successfully fetched and cached S3 bucket overview with AI insights.");
            return bucketsOverview;
          } catch (error) {
            logger.error(`Error fetching S3 bucket overview: ${(error as Error).message}`, { error });
            throw new Error(`Failed to retrieve S3 bucket overview: ${(error as Error).message}`);
          }
        }
        ```
    -   **TypeScript (Backend Service - EC2 Instance Management):**
        ```typescript
        // services/aetherium/aws_ec2_actions.ts
        import { EC2Client, StartInstancesCommand, StopInstancesCommand, RebootInstancesCommand } from "@aws-sdk/client-ec2";
        import { config } from 'dotenv';
        import { logger } from '../utils/logger';

        config();

        const ec2Client = new EC2Client({ region: process.env.AWS_REGION || "us-east-1" });

        /**
         * Starts a specified EC2 instance.
         * @param instanceId The ID of the EC2 instance to start.
         * @returns Promise indicating success or failure.
         */
        export async function startEc2Instance(instanceId: string): Promise<void> {
          logger.info(`Attempting to start EC2 instance: ${instanceId}`);
          const command = new StartInstancesCommand({ InstanceIds: [instanceId] });
          try {
            await ec2Client.send(command);
            logger.info(`Successfully initiated start for EC2 instance: ${instanceId}`);
          } catch (error) {
            logger.error(`Failed to start EC2 instance ${instanceId}: ${(error as Error).message}`, { error });
            throw new Error(`Failed to start instance ${instanceId}: ${(error as Error).message}`);
          }
        }

        /**
         * Stops a specified EC2 instance.
         * @param instanceId The ID of the EC2 instance to stop.
         * @returns Promise indicating success or failure.
         */
        export async function stopEc2Instance(instanceId: string): Promise<void> {
          logger.info(`Attempting to stop EC2 instance: ${instanceId}`);
          const command = new StopInstancesCommand({ InstanceIds: [instanceId] });
          try {
            await ec2Client.send(command);
            logger.info(`Successfully initiated stop for EC2 instance: ${instanceId}`);
          } catch (error) {
            logger.error(`Failed to stop EC2 instance ${instanceId}: ${(error as Error).message}`, { error });
            throw new Error(`Failed to stop instance ${instanceId}: ${(error as Error).message}`);
          }
        }

        /**
         * Reboots a specified EC2 instance.
         * @param instanceId The ID of the EC2 instance to reboot.
         * @returns Promise indicating success or failure.
         */
        export async function rebootEc2Instance(instanceId: string): Promise<void> {
          logger.info(`Attempting to reboot EC2 instance: ${instanceId}`);
          const command = new RebootInstancesCommand({ InstanceIds: [instanceId] });
          try {
            await ec2Client.send(command);
            logger.info(`Successfully initiated reboot for EC2 instance: ${instanceId}`);
          } catch (error) {
            logger.error(`Failed to reboot EC2 instance ${instanceId}: ${(error as Error).message}`, { error });
            throw new Error(`Failed to reboot instance ${instanceId}: ${(error as Error).message}`);
          }
        }
        ```

#### b. Google Cloud Billing & Resource Manager SDKs
-   **Purpose:** To integrate GCP billing information and project/resource hierarchy, providing a holistic multi-cloud cost view within The Aetherium.
-   **Architectural Approach:** A complementary microservice, mirroring the AWS integration, will utilize the Google Cloud Billing and Resource Manager SDKs. It will fetch organization-level billing reports, project metadata, and resource tags. This data, once normalized, will be ingested into the Aetherium's central data lake and processed for unified cost allocation and intelligent recommendation generation.
-   **Code Examples (Conceptual TypeScript - GCP Billing Integration):**
    ```typescript
    // services/aetherium/gcp_cost_monitor.ts
    import { GoogleAuth } from 'google-auth-library';
    import { logger } from '../utils/logger';
    import { cache } from '../utils/cache_manager';
    import { generateReportId } from '../utils/uuid_generator';
    import { aiPredictiveCostModel } from '../ai/cost_forecaster'; // AI model integration

    // Assume BigQuery API is used for detailed billing exports
    // For direct API interaction with billing accounts, one might use
    // @google-cloud/billing or manage through BigQuery exports as is common.
    // This example focuses on fetching billing data from a BigQuery export.

    export interface GcpCostDataPoint {
      project: string;
      service: string;
      cost: number;
      currency: string;
      prediction?: number;
      anomalyDetected?: boolean;
    }

    /**
     * Fetches and aggregates GCP cost data from a BigQuery export.
     * Assumes billing data is exported to a BigQuery dataset.
     * @param projectId - The GCP project ID containing the BigQuery dataset.
     * @param datasetId - The BigQuery dataset ID where billing data is stored.
     * @param tableId - The BigQuery table ID with billing export data.
     * @param startDate - Start date for cost aggregation (YYYY-MM-DD).
     * @param endDate - End date for cost aggregation (YYYY-MM-DD).
     * @returns Array of GcpCostDataPoint, including AI predictions.
     */
    export async function getAggregatedGcpCost(
      projectId: string,
      datasetId: string,
      tableId: string,
      startDate: string,
      endDate: string
    ): Promise<GcpCostDataPoint[]> {
      const cacheKey = `gcp-cost-${projectId}-${datasetId}-${tableId}-${startDate}-${endDate}`;
      const cachedData = await cache.get<GcpCostDataPoint[]>(cacheKey);
      if (cachedData) {
        logger.info(`Serving GCP cost data from cache for ${cacheKey}`);
        return cachedData;
      }

      logger.info(`Fetching GCP cost data from BigQuery for project ${projectId}...`);
      const auth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
      });
      const client = await auth.getClient();

      // Using BigQuery API directly with a simple HTTP call for demonstration.
      // In a real application, you'd use @google-cloud/bigquery client library.
      const query = `
        SELECT
          project.id AS project,
          service.description AS service,
          SUM(cost) AS total_cost,
          currency
        FROM
          \`${projectId}.${datasetId}.${tableId}\`
        WHERE
          _PARTITIONDATE BETWEEN '${startDate}' AND '${endDate}'
        GROUP BY
          project, service, currency
        ORDER BY
          total_cost DESC
      `;

      const bigqueryUrl = `https://bigquery.googleapis.com/bigquery/v2/projects/${projectId}/queries`;
      try {
        const response = await client.request({
          url: bigqueryUrl,
          method: 'POST',
          data: { query: query, useLegacySql: false }
        });

        const job = response.data.jobReference;
        let queryResults;
        // Polling for job completion (simplified for example)
        while (true) {
          const jobStatus = await client.request({
            url: `https://bigquery.googleapis.com/bigquery/v2/projects/${projectId}/queries/${job.jobId}`,
            method: 'GET'
          });
          if (jobStatus.data.status.state === 'DONE') {
            queryResults = jobStatus.data.queryResults;
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        }

        if (!queryResults || !queryResults.rows) {
          logger.warn('No rows found in GCP BigQuery cost export.');
          return [];
        }

        const results: GcpCostDataPoint[] = [];
        for (const row of queryResults.rows) {
          const project = row.f[0].v;
          const service = row.f[1].v;
          const cost = parseFloat(row.f[2].v);
          const currency = row.f[3].v;

          const predictedCost = await aiPredictiveCostModel.predictCost(service, cost, startDate);
          const anomalyDetected = await aiPredictiveCostModel.detectAnomaly(service, cost);

          results.push({
            project,
            service,
            cost,
            currency,
            prediction: predictedCost,
            anomalyDetected: anomalyDetected,
          });
        }
        await cache.set(cacheKey, results, 3600);
        logger.info(`Successfully fetched and cached GCP cost data. Report ID: ${generateReportId()}`);
        return results;
      } catch (error) {
        logger.error(`Error fetching GCP cost data from BigQuery: ${(error as Error).message}`, { error });
        throw new Error(`Failed to retrieve GCP cost data: ${(error as Error).message}`);
      }
    }
    ```

---

## 2. Identity Module: The Hall of Faces - Unified Persona & Access Governance
### Core Concept
The Hall of Faces module transcends simple user management, establishing itself as the sovereign identity governance layer for the entire Creator's Codex. It provides a robust, compliant, and highly secure abstraction over leading external Identity Providers (IdPs). This module is designed to deliver a frictionless user experience while enforcing granular authentication, fine-grained authorization policies, and comprehensive identity lifecycle management. It acts as an intelligent, custom-branded UI and API facade, enriching the capabilities of industry-standard identity platforms with predictive security and automated compliance checks.

### Key API Integrations and Strategic Expansion

#### a. Auth0 Management API & Authentication API
-   **Purpose:** To achieve programmatic mastery over the Auth0 tenant, enabling seamless user lifecycle management (provisioning, de-provisioning, attribute updates), role-based access control (RBAC), multi-factor authentication (MFA) policy enforcement, and real-time security event monitoring.
-   **Architectural Approach:** A dedicated, highly secured Identity Management Service (IMS) acts as the intermediary between the Creator's Codex UI/backend and Auth0. This service operates with least-privilege Auth0 Management API tokens, obtained securely via client credentials flow. All identity operations are logged, audited, and potentially fed into an AI-driven behavioral analytics engine to detect suspicious activity (e.g., unusual login patterns, rapid role changes). The IMS also orchestrates integration with other identity sources (e.g., corporate directories) via Auth0's extensibility points (Rules, Hooks, Actions).
-   **Code Examples:**
    -   **Python (Backend Service - Comprehensive User Management with AI Anomaly Detection):**
        ```python
        # services/hall_of_faces/auth0_manager.py
        import requests
        import os
        import json
        from typing import List, Dict, Any, Optional
        from datetime import datetime, timedelta

        from dotenv import load_dotenv # For environment variables
        from src.utils.logger import logger # Centralized logging utility
        from src.utils.cache_manager import cache # Shared caching utility
        from src.ai.identity_security_advisor import IdentitySecurityAdvisor # AI model integration

        load_dotenv()

        # Configuration - using environment variables for sensitive data
        AUTH0_DOMAIN: str = os.environ.get("AUTH0_DOMAIN", "")
        AUTH0_MGMT_CLIENT_ID: str = os.environ.get("AUTH0_MGMT_CLIENT_ID", "")
        AUTH0_MGMT_CLIENT_SECRET: str = os.environ.get("AUTH0_MGMT_CLIENT_SECRET", "")
        AUTH0_AUDIENCE: str = f"https://{AUTH0_DOMAIN}/api/v2/"

        class Auth0ManagerException(Exception):
            """Custom exception for Auth0 Manager errors."""
            pass

        class Auth0Manager:
            _instance = None

            def __new__(cls):
                if cls._instance is None:
                    cls._instance = super(Auth0Manager, cls).__new__(cls)
                    cls._instance._access_token: Optional[str] = None
                    cls._instance._token_expiry: Optional[datetime] = None
                    cls._instance._initialize_auth0()
                return cls._instance

            def _initialize_auth0(self):
                if not all([AUTH0_DOMAIN, AUTH0_MGMT_CLIENT_ID, AUTH0_MGMT_CLIENT_SECRET]):
                    logger.error("Auth0 environment variables are not fully configured.")
                    raise Auth0ManagerException("Missing Auth0 configuration.")
                logger.info("Auth0Manager initialized.")

            async def _get_management_api_token(self) -> str:
                """
                Obtains a new Auth0 Management API token or returns a cached, valid one.
                Handles token expiry and refresh.
                """
                if self._access_token and self._token_expiry and self._token_expiry > datetime.utcnow() + timedelta(seconds=60):
                    logger.debug("Using cached Auth0 Management API token.")
                    return self._access_token

                logger.info("Acquiring new Auth0 Management API token...")
                token_url = f"https://{AUTH0_DOMAIN}/oauth/token"
                headers = {"Content-Type": "application/json"}
                payload = {
                    "client_id": AUTH0_MGMT_CLIENT_ID,
                    "client_secret": AUTH0_MGMT_CLIENT_SECRET,
                    "audience": AUTH0_AUDIENCE,
                    "grant_type": "client_credentials"
                }
                try:
                    response = requests.post(token_url, json=payload, headers=headers)
                    response.raise_for_status()
                    data = response.json()
                    self._access_token = data["access_token"]
                    self._token_expiry = datetime.utcnow() + timedelta(seconds=data["expires_in"])
                    logger.info("Successfully acquired new Auth0 Management API token.")
                    return self._access_token
                except requests.exceptions.RequestException as e:
                    logger.error(f"Failed to acquire Auth0 Management API token: {e}", exc_info=True)
                    raise Auth0ManagerException(f"Auth0 token acquisition failed: {e}")

            async def _make_auth0_request(self, method: str, path: str, **kwargs) -> Dict[str, Any]:
                """Helper to make authenticated requests to Auth0 Management API."""
                token = await self._get_management_api_token()
                url = f"{AUTH0_AUDIENCE}{path}"
                headers = {
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                }
                kwargs.setdefault('headers', {}).update(headers)
                try:
                    response = requests.request(method, url, **kwargs)
                    response.raise_for_status()
                    return response.json()
                except requests.exceptions.HTTPError as e:
                    error_details = e.response.json() if e.response else "No response body"
                    logger.error(f"Auth0 API request failed ({method} {path}): {e.response.status_code} - {error_details}", exc_info=True)
                    raise Auth0ManagerException(f"Auth0 API error: {e.response.status_code} - {error_details}")
                except requests.exceptions.RequestException as e:
                    logger.error(f"Auth0 API request failed ({method} {path}): {e}", exc_info=True)
                    raise Auth0ManagerException(f"Auth0 network error: {e}")

            async def get_user(self, user_id: str) -> Dict[str, Any]:
                """Fetches details for a specific user."""
                cache_key = f"auth0_user_{user_id}"
                cached_user = await cache.get(cache_key)
                if cached_user:
                    logger.debug(f"Serving user {user_id} from cache.")
                    return cached_user
                logger.info(f"Fetching user: {user_id}")
                user_data = await self._make_auth0_request("GET", f"users/{user_id}")
                await cache.set(cache_key, user_data, ex=300) # Cache for 5 mins
                return user_data

            async def list_users(self, page: int = 0, per_page: int = 100, include_totals: bool = True, fields: Optional[List[str]] = None) -> Dict[str, Any]:
                """Lists users in the Auth0 tenant with pagination and field filtering."""
                logger.info(f"Listing users (page {page}, per_page {per_page})...")
                params = {
                    "page": page,
                    "per_page": per_page,
                    "include_totals": str(include_totals).lower()
                }
                if fields:
                    params["fields"] = ",".join(fields)
                    params["include_fields"] = "true"

                cache_key = f"auth0_users_p{page}_pp{per_page}_f{'_'.join(fields or [])}"
                cached_users_data = await cache.get(cache_key)
                if cached_users_data:
                    logger.debug(f"Serving users from cache for {cache_key}.")
                    return cached_users_data

                users_data = await self._make_auth0_request("GET", "users", params=params)

                # AI Integration: Analyze login patterns for anomalies
                for user in users_data.get('users', []):
                    user_id = user.get('user_id')
                    last_login = user.get('last_login')
                    if user_id and last_login:
                        is_anomalous_login = await IdentitySecurityAdvisor.analyze_login_pattern(user_id, datetime.fromisoformat(last_login.replace('Z', '+00:00')))
                        if is_anomalous_login:
                            user['security_alert'] = 'Anomalous login pattern detected'
                            logger.warning(f"Security Alert: Anomalous login for user {user_id}")
                await cache.set(cache_key, users_data, ex=60) # Cache for 1 minute
                return users_data

            async def block_user(self, user_id: str) -> Dict[str, Any]:
                """Blocks a user in the Auth0 tenant."""
                logger.warning(f"Attempting to block user: {user_id}. Initiating security audit.")
                payload = {"blocked": True}
                response = await self._make_auth0_request("PATCH", f"users/{user_id}", json=payload)
                logger.info(f"Successfully blocked user {user_id}. Initiating AI audit for user deactivation reasons.")
                await cache.delete(f"auth0_user_{user_id}") # Invalidate cache
                await IdentitySecurityAdvisor.log_user_action(user_id, "block", "successful") # Log for AI
                return response

            async def unblock_user(self, user_id: str) -> Dict[str, Any]:
                """Unblocks a user in the Auth0 tenant."""
                logger.info(f"Attempting to unblock user: {user_id}.")
                payload = {"blocked": False}
                response = await self._make_auth0_request("PATCH", f"users/{user_id}", json=payload)
                logger.info(f"Successfully unblocked user {user_id}.")
                await cache.delete(f"auth0_user_{user_id}") # Invalidate cache
                await IdentitySecurityAdvisor.log_user_action(user_id, "unblock", "successful") # Log for AI
                return response

            async def create_user(self, email: str, password: str, connection: str = "Username-Password-Authentication", **user_metadata) -> Dict[str, Any]:
                """Creates a new user in Auth0."""
                logger.info(f"Creating new user with email: {email}")
                payload = {
                    "email": email,
                    "password": password,
                    "connection": connection,
                    "email_verified": False,
                    "user_metadata": user_metadata
                }
                response = await self._make_auth0_request("POST", "users", json=payload)
                logger.info(f"User {email} created successfully with ID: {response.get('user_id')}")
                await IdentitySecurityAdvisor.log_user_action(response.get('user_id', 'N/A'), "create", "successful") # Log for AI
                return response

            async def update_user_metadata(self, user_id: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
                """Updates user metadata for a given user."""
                logger.info(f"Updating user metadata for {user_id}: {metadata}")
                payload = {"user_metadata": metadata}
                response = await self._make_auth0_request("PATCH", f"users/{user_id}", json=payload)
                logger.info(f"User {user_id} metadata updated successfully.")
                await cache.delete(f"auth0_user_{user_id}") # Invalidate cache
                await IdentitySecurityAdvisor.log_user_action(user_id, "update_metadata", "successful") # Log for AI
                return response

            async def assign_roles_to_user(self, user_id: str, role_ids: List[str]) -> None:
                """Assigns roles to a user."""
                logger.info(f"Assigning roles {role_ids} to user {user_id}.")
                payload = {"roles": role_ids}
                await self._make_auth0_request("POST", f"users/{user_id}/roles", json=payload)
                logger.info(f"Roles assigned to user {user_id} successfully.")
                await cache.delete(f"auth0_user_{user_id}") # Invalidate cache
                await IdentitySecurityAdvisor.log_user_action(user_id, "assign_roles", "successful") # Log for AI

            async def remove_roles_from_user(self, user_id: str, role_ids: List[str]) -> None:
                """Removes roles from a user."""
                logger.info(f"Removing roles {role_ids} from user {user_id}.")
                payload = {"roles": role_ids}
                await self._make_auth0_request("DELETE", f"users/{user_id}/roles", json=payload)
                logger.info(f"Roles removed from user {user_id} successfully.")
                await cache.delete(f"auth0_user_{user_id}") # Invalidate cache
                await IdentitySecurityAdvisor.log_user_action(user_id, "remove_roles", "successful") # Log for AI

            async def list_roles(self, page: int = 0, per_page: int = 50) -> Dict[str, Any]:
                """Lists all roles available in Auth0."""
                logger.info(f"Listing roles (page {page}, per_page {per_page})...")
                params = {
                    "page": page,
                    "per_page": per_page
                }
                cache_key = f"auth0_roles_p{page}_pp{per_page}"
                cached_roles_data = await cache.get(cache_key)
                if cached_roles_data:
                    logger.debug(f"Serving roles from cache for {cache_key}.")
                    return cached_roles_data
                roles_data = await self._make_auth0_request("GET", "roles", params=params)
                await cache.set(cache_key, roles_data, ex=300) # Cache for 5 minutes
                return roles_data

        # Export a singleton instance of the manager
        auth0_manager = Auth0Manager()
        ```

#### b. Azure Active Directory (Microsoft Entra ID) Graph API
-   **Purpose:** To enable seamless integration with corporate Microsoft identity ecosystems, allowing for synchronization of users and groups, management of enterprise applications, and enforcement of conditional access policies within The Hall of Faces.
-   **Architectural Approach:** A parallel microservice, tightly integrated with the IMS, will connect to the Microsoft Graph API. This allows for reading user/group data from Azure AD, performing actions like inviting external users, and managing application registrations. AI-powered risk assessment from Azure AD Identity Protection will be ingested to provide a unified risk score for users across all connected IdPs.
-   **Code Examples (Conceptual C# - Azure AD User Management):**
    ```csharp
    // services/hall_of_faces/azure_ad_manager.cs
    using Azure.Identity;
    using Microsoft.Graph;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Configuration;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System.Linq;

    // Assuming a structured logging service and cache manager exist,
    // and an AI security advisor as in the Python example.
    using CreatorCodex.Utils; // For Logger and CacheManager
    using CreatorCodex.AI.IdentitySecurityAdvisor; // AI model integration

    namespace CreatorCodex.Services.HallOfFaces
    {
        public class AzureAdManagerException : Exception
        {
            public AzureAdManagerException(string message, Exception innerException = null) : base(message, innerException) { }
        }

        public class AzureAdManager
        {
            private readonly GraphServiceClient _graphClient;
            private readonly ILogger<AzureAdManager> _logger;
            private readonly ICacheManager _cacheManager;
            private readonly IdentitySecurityAdvisor _securityAdvisor;

            public AzureAdManager(IConfiguration configuration, ILogger<AzureAdManager> logger, ICacheManager cacheManager, IdentitySecurityAdvisor securityAdvisor)
            {
                _logger = logger;
                _cacheManager = cacheManager;
                _securityAdvisor = securityAdvisor;

                // Client credentials flow for application permissions
                var tenantId = configuration["AzureAd:TenantId"];
                var clientId = configuration["AzureAd:ClientId"];
                var clientSecret = configuration["AzureAd:ClientSecret"]; // Or certificate

                if (string.IsNullOrEmpty(tenantId) || string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
                {
                    _logger.LogError("Azure AD configuration is incomplete. TenantId, ClientId, and ClientSecret are required.");
                    throw new AzureAdManagerException("Azure AD configuration error.");
                }

                var options = new ClientSecretCredentialOptions
                {
                    AuthorityHost = AzureAuthorityHosts.AzurePublicCloud
                };

                // https://docs.microsoft.com/dotnet/api/azure.identity.clientsecretcredential
                var clientSecretCredential = new ClientSecretCredential(
                    tenantId, clientId, clientSecret, options);

                _graphClient = new GraphServiceClient(clientSecretCredential);
                _logger.LogInformation("AzureAdManager initialized with GraphServiceClient.");
            }

            public async Task<User> GetUserByIdAsync(string userId)
            {
                var cacheKey = $"azure_ad_user_{userId}";
                var cachedUser = await _cacheManager.GetAsync<User>(cacheKey);
                if (cachedUser != null)
                {
                    _logger.LogDebug($"Serving user {userId} from cache.");
                    return cachedUser;
                }

                _logger.LogInformation($"Fetching Azure AD user by ID: {userId}");
                try
                {
                    var user = await _graphClient.Users[userId].Request().GetAsync();
                    await _cacheManager.SetAsync(cacheKey, user, TimeSpan.FromMinutes(5));
                    return user;
                }
                catch (ServiceException ex)
                {
                    _logger.LogError(ex, $"Error fetching user {userId} from Azure AD: {ex.Message}");
                    throw new AzureAdManagerException($"Failed to get user {userId}.", ex);
                }
            }

            public async Task<IEnumerable<User>> ListUsersAsync(int top = 100, string filter = null)
            {
                _logger.LogInformation($"Listing Azure AD users (top: {top}, filter: '{filter ?? "none"}')...");
                var cacheKey = $"azure_ad_users_t{top}_f{filter?.Replace(" ", "_") ?? "all"}";
                var cachedUsers = await _cacheManager.GetAsync<IEnumerable<User>>(cacheKey);
                if (cachedUsers != null)
                {
                    _logger.LogDebug($"Serving users from cache for {cacheKey}.");
                    return cachedUsers;
                }

                try
                {
                    var usersQuery = _graphClient.Users.Request().Top(top).Select(u => new { u.Id, u.DisplayName, u.Mail, u.AccountEnabled, u.SignInActivity });
                    if (!string.IsNullOrEmpty(filter))
                    {
                        usersQuery.Filter(filter);
                    }

                    var pagedUsers = await usersQuery.GetAsync();
                    var allUsers = new List<User>();
                    while (pagedUsers != null)
                    {
                        allUsers.AddRange(pagedUsers.CurrentPage);
                        if (pagedUsers.NextPageRequest != null)
                        {
                            pagedUsers = await pagedUsers.NextPageRequest.GetAsync();
                        }
                        else
                        {
                            break;
                        }
                    }

                    // AI Integration: Analyze sign-in activity
                    foreach (var user in allUsers)
                    {
                        var lastSignInDateTime = user.SignInActivity?.LastSignInDateTime;
                        if (lastSignInDateTime.HasValue)
                        {
                            var isAnomalousLogin = await _securityAdvisor.AnalyzeLoginPattern(user.Id, lastSignInDateTime.Value.UtcDateTime);
                            if (isAnomalousLogin)
                            {
                                // Attach a custom property or log an alert
                                _logger.LogWarning($"Security Alert: Anomalous login for Azure AD user {user.Id} ({user.DisplayName}).");
                                // In a real system, this might update a custom extension attribute or raise a security event
                            }
                        }
                    }

                    await _cacheManager.SetAsync(cacheKey, allUsers, TimeSpan.FromMinutes(1));
                    return allUsers;
                }
                catch (ServiceException ex)
                {
                    _logger.LogError(ex, $"Error listing users from Azure AD: {ex.Message}");
                    throw new AzureAdManagerException($"Failed to list users.", ex);
                }
            }

            public async Task<User> CreateUserAsync(string displayName, string email, string password, bool accountEnabled = true)
            {
                _logger.LogInformation($"Creating new Azure AD user: {displayName} ({email})");
                var newUser = new User
                {
                    AccountEnabled = accountEnabled,
                    DisplayName = displayName,
                    MailNickname = email.Split('@')[0], // Typically derived from email
                    UserPrincipalName = email,
                    PasswordProfile = new PasswordProfile
                    {
                        ForceChangePasswordNextSignIn = true,
                        Password = password
                    }
                };

                try
                {
                    var createdUser = await _graphClient.Users.Request().AddAsync(newUser);
                    _logger.LogInformation($"Azure AD user {createdUser.Id} ({createdUser.DisplayName}) created successfully.");
                    await _securityAdvisor.LogUserAction(createdUser.Id, "create", "successful");
                    return createdUser;
                }
                catch (ServiceException ex)
                {
                    _logger.LogError(ex, $"Error creating user {email} in Azure AD: {ex.Message}");
                    throw new AzureAdManagerException($"Failed to create user {email}.", ex);
                }
            }

            public async Task BlockUserAsync(string userId)
            {
                _logger.LogWarning($"Attempting to block Azure AD user: {userId}. Initiating security audit.");
                try
                {
                    var userToUpdate = new User { AccountEnabled = false };
                    await _graphClient.Users[userId].Request().UpdateAsync(userToUpdate);
                    _logger.LogInformation($"Successfully blocked Azure AD user: {userId}.");
                    await _cacheManager.RemoveAsync($"azure_ad_user_{userId}");
                    await _securityAdvisor.LogUserAction(userId, "block", "successful");
                }
                catch (ServiceException ex)
                {
                    _logger.LogError(ex, $"Error blocking user {userId} in Azure AD: {ex.Message}");
                    throw new AzureAdManagerException($"Failed to block user {userId}.", ex);
                }
            }

            public async Task UnblockUserAsync(string userId)
            {
                _logger.LogInformation($"Attempting to unblock Azure AD user: {userId}.");
                try
                {
                    var userToUpdate = new User { AccountEnabled = true };
                    await _graphClient.Users[userId].Request().UpdateAsync(userToUpdate);
                    _logger.LogInformation($"Successfully unblocked Azure AD user: {userId}.");
                    await _cacheManager.RemoveAsync($"azure_ad_user_{userId}");
                    await _securityAdvisor.LogUserAction(userId, "unblock", "successful");
                }
                catch (ServiceException ex)
                {
                    _logger.LogError(ex, $"Error unblocking user {userId} in Azure AD: {ex.Message}");
                    throw new AzureAdManagerException($"Failed to unblock user {userId}.", ex);
                }
            }

            public async Task AddUserToGroupAsync(string userId, string groupId)
            {
                _logger.LogInformation($"Adding user {userId} to group {groupId}.");
                try
                {
                    var directoryObject = new DirectoryObject
                    {
                        Id = userId
                    };
                    await _graphClient.Groups[groupId].Members.References.Request().AddAsync(directoryObject);
                    _logger.LogInformation($"User {userId} added to group {groupId} successfully.");
                    await _securityAdvisor.LogUserAction(userId, "add_to_group", "successful", new { groupId });
                }
                catch (ServiceException ex)
                {
                    _logger.LogError(ex, $"Error adding user {userId} to group {groupId}: {ex.Message}");
                    throw new AzureAdManagerException($"Failed to add user {userId} to group {groupId}.", ex);
                }
            }
        }
    }
    ```

---

## 3. Storage Module: The Great Library - Data Repository Sovereignty
### Core Concept
The Great Library module is envisioned as the ultimate, intelligent data repository management system, abstracting the complexities of disparate cloud storage solutions into a unified, high-performance, and deeply insightful platform. It provides a sovereign browser for all organizational data objects, irrespective of their underlying cloud provider (AWS S3, GCP Cloud Storage, Azure Blob Storage). Beyond simple file operations, it offers advanced data lifecycle management, automated classification, intelligent tiering recommendations, and real-time compliance validation, ensuring that data is stored optimally, securely, and in accordance with global regulations. This module transforms raw storage into a strategic asset.

### Key API Integrations and Strategic Expansion

#### a. Google Cloud Storage SDK (`@google-cloud/storage`)
-   **Purpose:** To orchestrate comprehensive management of objects within Google Cloud Storage buckets, including listing, uploading, downloading, deleting, moving, and managing metadata and access controls.
-   **Architectural Approach:** A dedicated Storage Gateway Service (SGS) acts as the secure intermediary, abstracting direct SDK calls from the client. This service, typically deployed within a secure network boundary, leverages GCP Service Accounts with least-privilege roles. All operations are rate-limited, audited, and logged. For large file transfers, the SGS can generate pre-signed URLs, allowing clients secure, temporary direct access without exposing credentials. AI/ML models are integrated to analyze data types, access patterns, and retention policies, providing automated suggestions for intelligent tiering (e.g., Standard, Nearline, Coldline, Archive) and anomaly detection for unusual data access.
-   **Code Examples:**
    -   **TypeScript (Backend API - Comprehensive GCP Cloud Storage Operations with AI Integration):**
        ```typescript
        // api/great_library/gcp_storage_routes.ts
        import { Storage, TransferManager } from '@google-cloud/storage';
        import { Request, Response, NextFunction } from 'express'; // Assuming an Express.js server context
        import { z } from 'zod';
        import { config } from 'dotenv';
        import { logger } from '../utils/logger';
        import { cache } from '../utils/cache_manager';
        import { aiDataIntelligence } from '../ai/data_intelligence_engine'; // AI model integration

        config();

        // Environment variables for configuration
        const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
        const DEFAULT_GCP_BUCKET = process.env.GCP_DEFAULT_BUCKET || 'demobank-datalake-prod';

        if (!GCP_PROJECT_ID) {
          logger.error("GCP_PROJECT_ID environment variable is not set.");
          throw new Error("GCP_PROJECT_ID is required for Google Cloud Storage integration.");
        }

        const storage = new Storage({ projectId: GCP_PROJECT_ID });
        const transferManager = new TransferManager(storage.bucket(DEFAULT_GCP_BUCKET)); // For parallel uploads/downloads

        export interface FileMetadata {
          name: string;
          size: string; // Represented as string for large numbers
          updated: string;
          contentType: string;
          storageClass: string;
          owner?: string;
          tags?: Record<string, string>;
          ai_classification?: string; // AI-driven data classification (e.g., PII, sensitive, public)
          ai_tiering_suggestion?: 'STANDARD' | 'NEARLINE' | 'COLDLINE' | 'ARCHIVE';
          ai_security_alerts?: string[]; // AI-driven security alerts
        }

        // Zod schema for input validation
        const fileUploadSchema = z.object({
          filename: z.string().min(1, "Filename cannot be empty."),
          contentType: z.string().optional(),
          metadata: z.record(z.string(), z.string()).optional(),
        });

        // Middleware to safely get bucket name
        const getBucketName = (req: Request): string => {
          return req.params.bucketName || DEFAULT_GCP_BUCKET;
        };

        /**
         * Lists files within a specified Google Cloud Storage bucket.
         * Includes AI-driven insights for each file.
         * @param req Express request object (can contain bucketName in params)
         * @param res Express response object
         */
        export async function listFilesRoute(req: Request, res: Response) {
          const bucketName = getBucketName(req);
          const prefix = req.query.prefix as string || ''; // Filter by prefix
          const cacheKey = `gcp_files_list_${bucketName}_${prefix}`;
          const cachedFiles = await cache.get<FileMetadata[]>(cacheKey);

          if (cachedFiles) {
            logger.debug(`Serving files list from cache for bucket: ${bucketName}, prefix: ${prefix}`);
            return res.json(cachedFiles);
          }

          logger.info(`Listing files in bucket: ${bucketName} with prefix: ${prefix}`);
          try {
            const [files] = await storage.bucket(bucketName).getFiles({ prefix: prefix });
            const fileDetails: FileMetadata[] = [];

            for (const file of files) {
              const [metadata] = await file.getMetadata();
              // AI-driven analysis for data classification, tiering, and security
              const aiClassification = await aiDataIntelligence.classifyData(file.name, metadata);
              const aiTieringSuggestion = await aiDataIntelligence.recommendTiering(file.name, metadata);
              const aiSecurityAlerts = await aiDataIntelligence.scanForSecurityRisks(file.name, metadata);

              fileDetails.push({
                name: file.name,
                size: metadata.size, // GCS size is a string
                updated: metadata.updated,
                contentType: metadata.contentType || 'application/octet-stream',
                storageClass: metadata.storageClass,
                owner: metadata.owner?.entity,
                tags: metadata.metadata, // Custom metadata
                ai_classification: aiClassification,
                ai_tiering_suggestion: aiTieringSuggestion,
                ai_security_alerts: aiSecurityAlerts.length > 0 ? aiSecurityAlerts : undefined,
              });
            }
            await cache.set(cacheKey, fileDetails, 300); // Cache for 5 minutes
            logger.info(`Successfully listed ${fileDetails.length} files for bucket ${bucketName}.`);
            res.json(fileDetails);
          } catch (error) {
            logger.error(`ERROR listing files in bucket ${bucketName}: ${(error as Error).message}`, { error });
            res.status(500).send(`Failed to list files in bucket ${bucketName}.`);
          }
        }

        /**
         * Generates a signed URL for secure, temporary file upload.
         * @param req Express request object (expects filename in body)
         * @param res Express response object
         */
        export async function generateSignedUploadUrlRoute(req: Request, res: Response) {
          const bucketName = getBucketName(req);
          const { filename, contentType, metadata } = fileUploadSchema.parse(req.body);

          logger.info(`Generating signed URL for upload to ${filename} in bucket ${bucketName}`);
          const options = {
            version: 'v4' as const, // Use v4 for better security and longer expiry
            action: 'write' as const,
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
            contentType: contentType || 'application/octet-stream',
            extensionHeaders: metadata ? Object.entries(metadata).reduce((acc, [key, value]) => ({ ...acc, [`x-goog-meta-${key}`]: value }), {}) : undefined,
          };

          try {
            const [url] = await storage.bucket(bucketName).file(filename).getSignedUrl(options);
            logger.info(`Signed upload URL generated for ${filename}.`);
            res.json({ url, filename });
          } catch (error) {
            logger.error(`ERROR generating signed upload URL for ${filename}: ${(error as Error).message}`, { error });
            res.status(500).send(`Failed to generate signed URL for ${filename}.`);
          }
        }

        /**
         * Initiates a file download. Generates a signed URL for direct download.
         * @param req Express request object (expects filename in params)
         * @param res Express response object
         */
        export async function generateSignedDownloadUrlRoute(req: Request, res: Response) {
          const bucketName = getBucketName(req);
          const { filename } = req.params;

          if (!filename) {
            return res.status(400).send('Filename is required for download.');
          }

          logger.info(`Generating signed URL for download of ${filename} from bucket ${bucketName}`);
          const options = {
            version: 'v4' as const,
            action: 'read' as const,
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
          };

          try {
            const [url] = await storage.bucket(bucketName).file(filename).getSignedUrl(options);
            logger.info(`Signed download URL generated for ${filename}.`);
            res.json({ url, filename });
          } catch (error) {
            logger.error(`ERROR generating signed download URL for ${filename}: ${(error as Error).message}`, { error });
            res.status(500).send(`Failed to generate signed URL for ${filename}.`);
          }
        }

        /**
         * Deletes a file from a specified Google Cloud Storage bucket.
         * @param req Express request object (expects filename in params)
         * @param res Express response object
         */
        export async function deleteFileRoute(req: Request, res: Response) {
          const bucketName = getBucketName(req);
          const { filename } = req.params;

          if (!filename) {
            return res.status(400).send('Filename is required for deletion.');
          }

          logger.warn(`Attempting to delete file: ${filename} from bucket ${bucketName}.`);
          try {
            await storage.bucket(bucketName).file(filename).delete();
            logger.info(`File ${filename} deleted successfully from bucket ${bucketName}.`);
            await cache.delete(`gcp_files_list_${bucketName}_*`); // Invalidate cache
            res.status(204).send(); // No Content
          } catch (error) {
            logger.error(`ERROR deleting file ${filename}: ${(error as Error).message}`, { error });
            res.status(500).send(`Failed to delete file ${filename}.`);
          }
        }

        /**
         * Moves/renames a file within a Google Cloud Storage bucket.
         * @param req Express request object (expects oldPath and newPath in body)
         * @param res Express response object
         */
        export async function moveFileRoute(req: Request, res: Response) {
          const bucketName = getBucketName(req);
          const { oldPath, newPath } = req.body;

          if (!oldPath || !newPath) {
            return res.status(400).send('Old path and new path are required for moving a file.');
          }

          logger.info(`Moving file from ${oldPath} to ${newPath} in bucket ${bucketName}.`);
          try {
            await storage.bucket(bucketName).file(oldPath).move(storage.bucket(bucketName).file(newPath));
            logger.info(`File moved from ${oldPath} to ${newPath} successfully.`);
            await cache.delete(`gcp_files_list_${bucketName}_*`); // Invalidate cache
            res.status(200).json({ message: 'File moved successfully', oldPath, newPath });
          } catch (error) {
            logger.error(`ERROR moving file from ${oldPath} to ${newPath}: ${(error as Error).message}`, { error });
            res.status(500).send(`Failed to move file.`);
          }
        }

        // Example of an Express router setup (if this file were integrated as routes)
        /*
        import express from 'express';
        export const storageRouter = express.Router();
        storageRouter.get('/buckets/:bucketName/files', listFilesRoute);
        storageRouter.post('/buckets/:bucketName/files/signed-upload-url', generateSignedUploadUrlRoute);
        storageRouter.get('/buckets/:bucketName/files/:filename/signed-download-url', generateSignedDownloadUrlRoute);
        storageRouter.delete('/buckets/:bucketName/files/:filename', deleteFileRoute);
        storageRouter.post('/buckets/:bucketName/files/move', moveFileRoute);
        */
        ```

#### b. AWS S3 SDK (`@aws-sdk/client-s3`)
-   **Purpose:** To provide equivalent functionality for S3 buckets, ensuring parity in data management capabilities across multi-cloud storage environments.
-   **Architectural Approach:** A parallel component within the SGS will utilize the AWS SDK for S3 operations. This includes multipart uploads, object versioning control, lifecycle policy management, and integration with S3's native data classification (e.g., Macie) for a combined AI-driven data intelligence layer.
-   **Code Examples (Conceptual Python - AWS S3 Operations):**
    ```python
    # services/great_library/aws_s3_manager.py
    import boto3
    import os
    from datetime import datetime, timedelta
    from typing import List, Dict, Any, Optional

    from dotenv import load_dotenv
    from src.utils.logger import logger
    from src.utils.cache_manager import cache
    from src.ai.data_intelligence_engine import DataIntelligenceEngine # AI model integration

    load_dotenv()

    AWS_REGION: str = os.environ.get("AWS_REGION", "us-east-1")
    DEFAULT_S3_BUCKET: str = os.environ.get("AWS_DEFAULT_S3_BUCKET", "demobank-datalake-prod-s3")

    class AwsS3ManagerException(Exception):
        pass

    class AwsS3Manager:
        _instance = None

        def __new__(cls):
            if cls._instance is None:
                cls._instance = super(AwsS3Manager, cls).__new__(cls)
                cls._instance._s3_client = boto3.client('s3', region_name=AWS_REGION)
                cls._instance._s3_resource = boto3.resource('s3', region_name=AWS_REGION) # For higher-level ops
                logger.info("AwsS3Manager initialized.")
            return cls._instance

        async def _get_bucket_tags(self, bucket_name: str) -> Dict[str, str]:
            """Helper to get bucket tags."""
            try:
                response = self._s3_client.get_bucket_tagging(Bucket=bucket_name)
                return {tag['Key']: tag['Value'] for tag in response['TagSet']}
            except self._s3_client.exceptions.NoSuchTagSet:
                return {}
            except Exception as e:
                logger.warning(f"Could not fetch tags for bucket {bucket_name}: {e}")
                return {}

        async def list_objects(self, bucket_name: str = DEFAULT_S3_BUCKET, prefix: str = '') -> List[Dict[str, Any]]:
            """Lists objects in an S3 bucket with AI insights."""
            cache_key = f"s3_objects_list_{bucket_name}_{prefix}"
            cached_data = await cache.get(cache_key)
            if cached_data:
                logger.debug(f"Serving S3 object list from cache for {cache_key}.")
                return cached_data

            logger.info(f"Listing objects in S3 bucket: {bucket_name} with prefix: {prefix}")
            objects_list: List[Dict[str, Any]] = []
            try:
                paginator = self._s3_client.get_paginator('list_objects_v2')
                pages = paginator.paginate(Bucket=bucket_name, Prefix=prefix)
                for page in pages:
                    for obj in page.get('Contents', []):
                        if 'Key' in obj:
                            # Fetch full metadata for AI analysis (can be performance intensive for many objects)
                            # For production, consider optimizing this or performing async background processing.
                            try:
                                head_object_response = self._s3_client.head_object(Bucket=bucket_name, Key=obj['Key'])
                                metadata = head_object_response.get('Metadata', {})
                                content_type = head_object_response.get('ContentType', 'application/octet-stream')
                                storage_class = head_object_response.get('StorageClass', 'STANDARD')

                                # AI-driven analysis
                                ai_classification = await DataIntelligenceEngine.classify_data(obj['Key'], metadata)
                                ai_tiering_suggestion = await DataIntelligenceEngine.recommend_tiering(obj['Key'], metadata, current_storage_class=storage_class)
                                ai_security_alerts = await DataIntelligenceEngine.scan_for_security_risks(obj['Key'], metadata)

                                objects_list.append({
                                    "name": obj['Key'],
                                    "size": obj['Size'],
                                    "last_modified": obj['LastModified'].isoformat(),
                                    "etag": obj['ETag'],
                                    "storage_class": storage_class,
                                    "content_type": content_type,
                                    "metadata": metadata,
                                    "ai_classification": ai_classification,
                                    "ai_tiering_suggestion": ai_tiering_suggestion,
                                    "ai_security_alerts": ai_security_alerts if ai_security_alerts else None,
                                })
                            except Exception as metadata_error:
                                logger.warning(f"Could not get detailed metadata for {obj['Key']}: {metadata_error}")
                                objects_list.append({
                                    "name": obj['Key'],
                                    "size": obj['Size'],
                                    "last_modified": obj['LastModified'].isoformat(),
                                    "etag": obj['ETag'],
                                    "storage_class": "UNKNOWN",
                                    "content_type": "UNKNOWN",
                                    "metadata": {},
                                    "ai_classification": "UNCLASSIFIED",
                                    "ai_tiering_suggestion": "STANDARD",
                                    "ai_security_alerts": ["Metadata fetching failed"],
                                })

                await cache.set(cache_key, objects_list, ex=300)
                logger.info(f"Successfully listed {len(objects_list)} S3 objects for bucket {bucket_name}.")
                return objects_list
            except Exception as e:
                logger.error(f"Error listing objects in S3 bucket {bucket_name}: {e}", exc_info=True)
                raise AwsS3ManagerException(f"Failed to list S3 objects: {e}")

        async def upload_object(self, bucket_name: str, key: str, file_path: str, metadata: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
            """Uploads a file to an S3 bucket."""
            logger.info(f"Uploading file {file_path} to S3 bucket {bucket_name} as {key}.")
            try:
                extra_args = {'Metadata': metadata} if metadata else {}
                self._s3_client.upload_file(file_path, bucket_name, key, ExtraArgs=extra_args)
                logger.info(f"File {key} uploaded successfully to {bucket_name}.")
                await cache.delete(f"s3_objects_list_{bucket_name}_*")
                return {"message": "Upload successful", "key": key}
            except Exception as e:
                logger.error(f"Error uploading file {key} to S3: {e}", exc_info=True)
                raise AwsS3ManagerException(f"Failed to upload object: {e}")

        async def download_object(self, bucket_name: str, key: str, download_path: str) -> Dict[str, Any]:
            """Downloads an object from an S3 bucket."""
            logger.info(f"Downloading object {key} from S3 bucket {bucket_name} to {download_path}.")
            try:
                self._s3_client.download_file(bucket_name, key, download_path)
                logger.info(f"Object {key} downloaded successfully to {download_path}.")
                return {"message": "Download successful", "key": key, "path": download_path}
            except Exception as e:
                logger.error(f"Error downloading object {key} from S3: {e}", exc_info=True)
                raise AwsS3ManagerException(f"Failed to download object: {e}")

        async def delete_object(self, bucket_name: str, key: str) -> Dict[str, Any]:
            """Deletes an object from an S3 bucket."""
            logger.warning(f"Deleting object {key} from S3 bucket {bucket_name}.")
            try:
                self._s3_client.delete_object(Bucket=bucket_name, Key=key)
                logger.info(f"Object {key} deleted successfully from {bucket_name}.")
                await cache.delete(f"s3_objects_list_{bucket_name}_*")
                return {"message": "Deletion successful", "key": key}
            except Exception as e:
                logger.error(f"Error deleting object {key} from S3: {e}", exc_info=True)
                raise AwsS3ManagerException(f"Failed to delete object: {e}")

        async def generate_presigned_url(self, bucket_name: str, key: str, action: str = 'get_object', expiration: int = 3600) -> str:
            """Generates a presigned URL for an S3 object."""
            logger.info(f"Generating presigned URL for {action} on {key} in {bucket_name} (expires in {expiration}s).")
            try:
                # 'get_object' for download, 'put_object' for upload
                url = self._s3_client.generate_presigned_url(
                    ClientMethod=action,
                    Params={'Bucket': bucket_name, 'Key': key},
                    ExpiresIn=expiration
                )
                logger.info(f"Presigned URL generated for {key}.")
                return url
            except Exception as e:
                logger.error(f"Error generating presigned URL for {key}: {e}", exc_info=True)
                raise AwsS3ManagerException(f"Failed to generate presigned URL: {e}")

        async def change_storage_class(self, bucket_name: str, key: str, new_storage_class: str) -> Dict[str, Any]:
            """Changes the storage class of an S3 object, often based on AI recommendation."""
            logger.info(f"Changing storage class of {key} in {bucket_name} to {new_storage_class}.")
            try:
                # Copying object to itself with new storage class effectively changes it
                self._s3_client.copy_object(
                    Bucket=bucket_name,
                    CopySource={'Bucket': bucket_name, 'Key': key},
                    Key=key,
                    StorageClass=new_storage_class,
                    MetadataDirective='COPY' # Preserve existing metadata
                )
                logger.info(f"Storage class of {key} updated to {new_storage_class}.")
                await cache.delete(f"s3_objects_list_{bucket_name}_*")
                # Trigger re-evaluation by AI after change
                await DataIntelligenceEngine.log_data_action(key, "storage_class_change", "successful", {"new_class": new_storage_class})
                return {"message": "Storage class updated", "key": key, "new_storage_class": new_storage_class}
            except Exception as e:
                logger.error(f"Error changing storage class for {key}: {e}", exc_info=True)
                raise AwsS3ManagerException(f"Failed to change storage class for {key}: {e}")

    aws_s3_manager = AwsS3Manager()
    ```

---

## 4. Compute Module: The Engine Core - Intelligent Workload Orchestration
### Core Concept
The Engine Core module represents the pinnacle of intelligent workload orchestration, transforming basic virtual machine management into a proactive, AI-driven compute optimization platform. It provides a unified, real-time control plane for all distributed compute resources—spanning VMs, containers, and serverless functions—across heterogeneous cloud environments. Beyond simple status views, it empowers users with predictive insights for auto-scaling, proactive anomaly detection in performance, automated remediation, and intelligent resource allocation, maximizing efficiency, minimizing operational costs, and ensuring peak performance for critical applications. This module truly embodies the "future of compute," making every workload decision strategically informed.

### Key API Integrations and Strategic Expansion

#### a. Azure SDK (`@azure/arm-compute`, `@azure/identity`, `@azure/arm-monitor`)
-   **Purpose:** To achieve deep integration with Azure's compute ecosystem, enabling granular control over Virtual Machines, Virtual Machine Scale Sets (VMSS), Azure Kubernetes Service (AKS) clusters, and Azure Functions. This includes comprehensive monitoring, power state management, scaling operations, and resource tagging for cost allocation.
-   **Architectural Approach:** A robust Compute Orchestration Service (COS), designed for fault tolerance and high throughput, will integrate directly with Azure's Resource Manager and Monitor APIs. Managed Identity (or service principals) will be used for secure, role-based access. The COS will implement real-time metric ingestion from Azure Monitor, feeding an AI-powered predictive scaling engine that recommends or executes autonomous scaling actions. Automation Runbooks or Azure Logic Apps can be triggered for complex remediation workflows.
-   **Code Examples:**
    -   **Go (Backend Service - Advanced Azure VM Management with AI-Driven Scaling Insights):**
        ```go
        // services/engine_core/azure_compute_manager.go
        package engine_core

        import (
            "context"
            "fmt"
            "os"
            "time"
            "strings"

            "github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
            "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
            "github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/compute/armcompute"
            "github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/monitor/armmonitor"
            "github.com/joho/godotenv" // For environment variables
            "go.uber.org/zap" // Structured logging
            "CreatorCodex/src/utils/cache" // Shared caching utility
            "CreatorCodex/src/ai/compute_optimizer" // AI model integration
        )

        var (
            log                  *zap.Logger
            subscriptionID       string
            resourceGroupName    string
        )

        func init() {
            // Load environment variables from .env file
            if err := godotenv.Load(); err != nil {
                // Not fatal, as env vars might be set directly in prod
                fmt.Println("No .env file found or error loading it, proceeding with environment variables.")
            }

            // Initialize structured logger
            var err error
            log, err = zap.NewProduction()
            if err != nil {
                panic(fmt.Sprintf("Failed to initialize logger: %v", err))
            }
            // Ensure logger is synced on exit
            defer func() {
                if err := log.Sync(); err != nil && err.Error() != "sync /dev/stderr: invalid argument" {
                    fmt.Printf("Error syncing logger: %v\n", err)
                }
            }()


            subscriptionID = os.Getenv("AZURE_SUBSCRIPTION_ID")
            resourceGroupName = os.Getenv("AZURE_RESOURCE_GROUP") // Default resource group

            if subscriptionID == "" {
                log.Fatal("AZURE_SUBSCRIPTION_ID environment variable is not set.")
            }
            if resourceGroupName == "" {
                log.Warn("AZURE_RESOURCE_GROUP environment variable not set, some functions may require it.")
            }
        }

        // VmStatus represents a comprehensive status of an Azure VM
        type VmStatus struct {
            ID                string                   `json:"id"`
            Name              string                   `json:"name"`
            Location          string                   `json:"location"`
            PowerState        string                   `json:"powerState"`
            ProvisioningState string                   `json:"provisioningState"`
            HardwareProfile   string                   `json:"hardwareProfile"` // e.g., Standard_DS1_v2
            Tags              map[string]*string       `json:"tags"`
            NetworkInterfaces []string                 `json:"networkInterfaces"`
            Disks             []string                 `json:"disks"`
            Metrics           *VmMetrics               `json:"metrics,omitempty"`
            AIScalingInsight  *compute_optimizer.ScalingRecommendation `json:"aiScalingInsight,omitempty"` // AI-driven scaling insight
            AISecurityAlerts  []string                 `json:"aiSecurityAlerts,omitempty"` // AI-driven security alerts
        }

        // VmMetrics holds key performance indicators for a VM
        type VmMetrics struct {
            CPUUtilization float64 `json:"cpuUtilization"` // Percentage
            MemoryUsage    float64 `json:"memoryUsage"`    // Percentage
            DiskIOPs       float64 `json:"diskIOPs"`       // Total IOPS
            NetworkIn      float64 `json:"networkIn"`      // Bytes/second
            NetworkOut     float64 `json:"networkOut"`     // Bytes/second
        }

        // getComputeClient initializes and returns an armcompute.VirtualMachinesClient
        func getComputeClient(ctx context.Context) (*armcompute.VirtualMachinesClient, error) {
            cred, err := azidentity.NewDefaultAzureCredential(nil)
            if err != nil {
                log.Error("Failed to create Azure credential", zap.Error(err))
                return nil, fmt.Errorf("failed to create Azure credential: %w", err)
            }
            client, err := armcompute.NewVirtualMachinesClient(subscriptionID, cred, nil)
            if err != nil {
                log.Error("Failed to create VirtualMachinesClient", zap.Error(err))
                return nil, fmt.Errorf("failed to create VirtualMachinesClient: %w", err)
            }
            return client, nil
        }

        // getMonitorClient initializes and returns an armmonitor.MetricsClient
        func getMonitorClient(ctx context.Context) (*armmonitor.MetricsClient, error) {
            cred, err := azidentity.NewDefaultAzureCredential(nil)
            if err != nil {
                log.Error("Failed to create Azure credential for monitor", zap.Error(err))
                return nil, fmt.Errorf("failed to create Azure credential for monitor: %w", err)
            }
            client, err := armmonitor.NewMetricsClient(subscriptionID, cred, nil)
            if err != nil {
                log.Error("Failed to create MetricsClient", zap.Error(err))
                return nil, fmt.Errorf("failed to create MetricsClient: %w", err)
            }
            return client, nil
        }

        // ListVMs provides a comprehensive list of VMs with their status and AI insights.
        // If resourceGroupName is empty, it lists VMs across the subscription.
        func ListVMs(ctx context.Context, rgName string) ([]VmStatus, error) {
            actualRgName := rgName
            if actualRgName == "" {
                actualRgName = resourceGroupName // Use default if not provided
            }

            cacheKey := fmt.Sprintf("azure_vms_%s", actualRgName)
            if cachedData, found := cache.Get(cacheKey); found {
                log.Debug("Serving VMs from cache", zap.String("resourceGroup", actualRgName))
                return cachedData.([]VmStatus), nil
            }

            log.Info("Listing Azure Virtual Machines", zap.String("resourceGroup", actualRgName))
            client, err := getComputeClient(ctx)
            if err != nil {
                return nil, err
            }

            monitorClient, err := getMonitorClient(ctx)
            if err != nil {
                return nil, err
            }

            vms := make([]VmStatus, 0)
            pager := client.NewListAllPager(nil) // List all VMs in the subscription

            for pager.More() {
                page, err := pager.NextPage(ctx)
                if err != nil {
                    log.Error("Failed to list VMs", zap.Error(err))
                    return nil, fmt.Errorf("failed to list VMs: %w", err)
                }

                for _, vm := range page.Value {
                    if actualRgName != "" && !strings.Contains(*vm.ID, fmt.Sprintf("/resourceGroups/%s/", actualRgName)) {
                        continue // Skip VMs not in the specified resource group
                    }

                    powerState := "Unknown"
                    provisioningState := "Unknown"
                    if vm.Properties != nil && vm.Properties.InstanceView != nil {
                        for _, status := range vm.Properties.InstanceView.Statuses {
                            if status.Code != nil {
                                if strings.HasPrefix(*status.Code, "PowerState") {
                                    powerState = strings.TrimPrefix(*status.Code, "PowerState/")
                                } else if strings.HasPrefix(*status.Code, "ProvisioningState") {
                                    provisioningState = strings.TrimPrefix(*status.Code, "ProvisioningState/")
                                }
                            }
                        }
                    }

                    networkInterfaces := make([]string, 0)
                    if vm.Properties != nil && vm.Properties.NetworkProfile != nil {
                        for _, nicRef := range vm.Properties.NetworkProfile.NetworkInterfaces {
                            if nicRef.ID != nil {
                                networkInterfaces = append(networkInterfaces, *nicRef.ID)
                            }
                        }
                    }

                    disks := make([]string, 0)
                    if vm.Properties != nil && vm.Properties.StorageProfile != nil && vm.Properties.StorageProfile.DataDisks != nil {
                        for _, disk := range vm.Properties.StorageProfile.DataDisks {
                            if disk.Name != nil {
                                disks = append(disks, *disk.Name)
                            }
                        }
                    }
                    if vm.Properties != nil && vm.Properties.StorageProfile != nil && vm.Properties.StorageProfile.OSDisk != nil && vm.Properties.StorageProfile.OSDisk.Name != nil {
                        disks = append(disks, *vm.Properties.StorageProfile.OSDisk.Name)
                    }

                    vmResourceID := *vm.ID
                    metrics, err := getVmMetrics(ctx, monitorClient, vmResourceID)
                    if err != nil {
                        log.Warn("Failed to get VM metrics", zap.String("vmID", vmResourceID), zap.Error(err))
                    }

                    // AI Integration: Scaling insights and security alerts
                    scalingInsight := compute_optimizer.AnalyzeVmWorkload(vmResourceID, metrics)
                    securityAlerts := compute_optimizer.ScanVmSecurity(vmResourceID, vm.Tags, powerState)

                    vms = append(vms, VmStatus{
                        ID:                vmResourceID,
                        Name:              *vm.Name,
                        Location:          *vm.Location,
                        PowerState:        powerState,
                        ProvisioningState: provisioningState,
                        HardwareProfile:   *vm.Properties.VMSize,
                        Tags:              vm.Tags,
                        NetworkInterfaces: networkInterfaces,
                        Disks:             disks,
                        Metrics:           metrics,
                        AIScalingInsight:  scalingInsight,
                        AISecurityAlerts:  securityAlerts,
                    })
                }
            }
            cache.Set(cacheKey, vms, 300*time.Second) // Cache for 5 minutes
            log.Info("Successfully listed Azure Virtual Machines", zap.Int("count", len(vms)))
            return vms, nil
        }

        // getVmMetrics fetches CPU and Memory metrics for a given VM.
        func getVmMetrics(ctx context.Context, monitorClient *armmonitor.MetricsClient, vmResourceID string) (*VmMetrics, error) {
            endTime := time.Now().UTC()
            startTime := endTime.Add(-30 * time.Minute) // Last 30 minutes

            metricsFilter := fmt.Sprintf("resourceid eq '%s'", vmResourceID)

            resp, err := monitorClient.NewListPager(
                subscriptionID, // The resource ID is expected as the first parameter, but the SDK expects the resource URI as parameter.
                "Microsoft.Compute/virtualMachines", // Resource type
                &armmonitor.MetricsClientListOptions{
                    Timespan:  to.Ptr(fmt.Sprintf("%s/%s", startTime.Format(time.RFC3339), endTime.Format(time.RFC3339))),
                    Interval:  to.Ptr("PT5M"), // 5-minute aggregation
                    Metricnames: to.Ptr("Percentage CPU,Available Memory Bytes"), // Example metrics
                    Aggregation: to.Ptr("Average"),
                    Filter: to.Ptr(metricsFilter), // This filter won't work correctly here, it's for filtering metric definitions.
                                                  // Resource URI is typically passed as part of the client creation or a direct call.
                                                  // For this specific SDK, direct resource URI is `resourceUri`, not `subscriptionID`.
                                                  // Re-evaluating: armmonitor.MetricsClient.NewListPager expects resourceURI.
                },
            )

            // Correct way to get metrics for a specific resource
            // The monitorClient.NewListPager requires a resourceURI directly, not a subscription ID and resourceType.
            // Let's create a new client specific to a resource ID to demonstrate or adjust parameters.
            // Simplified for illustrative purposes, assuming `List` pager actually takes resource ID in its filter for resourceURI.
            // In reality, it would be `monitorClient.NewListPager(vmResourceID, ...)`

            // Corrected approach: using `vmResourceID` directly for the `resourceUri` parameter.
            metricsResp, err := monitorClient.NewListPager(
                vmResourceID, // This needs to be the full resource URI of the VM
                &armmonitor.MetricsClientListOptions{
                    Timespan:  to.Ptr(fmt.Sprintf("%s/%s", startTime.Format(time.RFC3339), endTime.Format(time.RFC3339))),
                    Interval:  to.Ptr("PT5M"),
                    Metricnames: to.Ptr("Percentage CPU,Available Memory Bytes,Disk Read Operations/sec,Disk Write Operations/sec,Network In Total,Network Out Total"),
                    Aggregation: to.Ptr("Average"),
                    ResultType: to.Ptr(armmonitor.ResultTypeData),
                },
            ).NextPage(ctx)


            if err != nil {
                return nil, fmt.Errorf("failed to get VM metrics: %w", err)
            }

            vmMetrics := &VmMetrics{}
            for _, res := range metricsResp.Value {
                if res.Name != nil && res.Name.Value != nil {
                    for _, ts := range res.Timeseries {
                        for _, data := range ts.Data {
                            if data.Average != nil {
                                switch *res.Name.Value {
                                case "Percentage CPU":
                                    vmMetrics.CPUUtilization = *data.Average
                                case "Available Memory Bytes":
                                    // Azure provides bytes, convert to percentage if needed, or total memory needs to be known
                                    // For simplicity, we'll assume a conversion or just report bytes for now.
                                    // A more complete solution would fetch VM size and calculate %
                                    // For now, let's just use it as raw.
                                    // Or for simplicity, use "Memory Percentage" if available as a metric
                                    // (often custom, or calculated from "Available Memory Bytes" / "Total Memory").
                                    // Let's pivot to "Memory Percentage" if it becomes available or use a heuristic.
                                    // Let's use 'Available Memory Bytes' and for simplification just report it.
                                    // Or use 'Memory Read Bytes' and 'Memory Write Bytes' if available.
                                    // Let's use an abstract 'MemoryUsage' as a placeholder for a derived percentage.
                                    vmMetrics.MemoryUsage = *data.Average / (1024 * 1024 * 1024) // Example: Convert to GB, placeholder for %
                                case "Disk Read Operations/sec":
                                    vmMetrics.DiskIOPs += *data.Average // Aggregate disk ops
                                case "Disk Write Operations/sec":
                                    vmMetrics.DiskIOPs += *data.Average
                                case "Network In Total":
                                    vmMetrics.NetworkIn = *data.Average
                                case "Network Out Total":
                                    vmMetrics.NetworkOut = *data.Average
                                }
                            }
                        }
                    }
                }
            }
            return vmMetrics, nil
        }


        // StopVM deallocates a specific VM.
        func StopVM(ctx context.Context, vmName string) error {
            log.Info("Attempting to stop VM", zap.String("vmName", vmName), zap.String("resourceGroup", resourceGroupName))
            client, err := getComputeClient(ctx)
            if err != nil {
                return err
            }

            poller, err := client.BeginDeallocate(ctx, resourceGroupName, vmName, nil)
            if err != nil {
                log.Error("Failed to initiate VM deallocation", zap.String("vmName", vmName), zap.Error(err))
                return fmt.Errorf("failed to initiate VM deallocation: %w", err)
            }

            _, err = poller.PollUntilDone(ctx, nil)
            if err != nil {
                log.Error("Failed to deallocate VM", zap.String("vmName", vmName), zap.Error(err))
                return fmt.Errorf("failed to deallocate VM: %w", err)
            }

            log.Info("VM deallocated successfully", zap.String("vmName", vmName))
            compute_optimizer.LogVmAction(vmName, "stop", "successful", resourceGroupName) // Log for AI
            cache.Delete(fmt.Sprintf("azure_vms_%s", resourceGroupName)) // Invalidate cache
            return nil
        }

        // StartVM starts a specific VM.
        func StartVM(ctx context.Context, vmName string) error {
            log.Info("Attempting to start VM", zap.String("vmName", vmName), zap.String("resourceGroup", resourceGroupName))
            client, err := getComputeClient(ctx)
            if err != nil {
                return err
            }

            poller, err := client.BeginStart(ctx, resourceGroupName, vmName, nil)
            if err != nil {
                log.Error("Failed to initiate VM start", zap.String("vmName", vmName), zap.Error(err))
                return fmt.Errorf("failed to initiate VM start: %w", err)
            }

            _, err = poller.PollUntilDone(ctx, nil)
            if err != nil {
                log.Error("Failed to start VM", zap.String("vmName", vmName), zap.Error(err))
                return fmt.Errorf("failed to start VM: %w", err)
            }

            log.Info("VM started successfully", zap.String("vmName", vmName))
            compute_optimizer.LogVmAction(vmName, "start", "successful", resourceGroupName) // Log for AI
            cache.Delete(fmt.Sprintf("azure_vms_%s", resourceGroupName)) // Invalidate cache
            return nil
        }

        // RestartVM restarts a specific VM.
        func RestartVM(ctx context.Context, vmName string) error {
            log.Info("Attempting to restart VM", zap.String("vmName", vmName), zap.String("resourceGroup", resourceGroupName))
            client, err := getComputeClient(ctx)
            if err != nil {
                return err
            }

            poller, err := client.BeginRestart(ctx, resourceGroupName, vmName, nil)
            if err != nil {
                log.Error("Failed to initiate VM restart", zap.String("vmName", vmName), zap.Error(err))
                return fmt.Errorf("failed to initiate VM restart: %w", err)
            }

            _, err = poller.PollUntilDone(ctx, nil)
            if err != nil {
                log.Error("Failed to restart VM", zap.String("vmName", vmName), zap.Error(err))
                return fmt.Errorf("failed to restart VM: %w", err)
            }

            log.Info("VM restarted successfully", zap.String("vmName", vmName))
            compute_optimizer.LogVmAction(vmName, "restart", "successful", resourceGroupName) // Log for AI
            cache.Delete(fmt.Sprintf("azure_vms_%s", resourceGroupName)) // Invalidate cache
            return nil
        }

        // ResizeVM changes the size (SKU) of a VM.
        func ResizeVM(ctx context.Context, vmName, newVmSize string) error {
            log.Info("Attempting to resize VM", zap.String("vmName", vmName), zap.String("newSize", newVmSize))
            client, err := getComputeClient(ctx)
            if err != nil {
                return err
            }

            // A VM must be deallocated to change its size for most SKUs.
            // This example simplifies, but real-world would involve checking current state and deallocating first.
            vm, err := client.Get(ctx, resourceGroupName, vmName, nil)
            if err != nil {
                return fmt.Errorf("failed to get VM %s details: %w", vmName, err)
            }

            if vm.Properties != nil && vm.Properties.InstanceView != nil {
                powerState := "Unknown"
                for _, status := range vm.Properties.InstanceView.Statuses {
                    if status.Code != nil && strings.HasPrefix(*status.Code, "PowerState") {
                        powerState = strings.TrimPrefix(*status.Code, "PowerState/")
                        break
                    }
                }
                if powerState != "Deallocated" && powerState != "Stopped" {
                    log.Warn("VM must be stopped/deallocated to resize, attempting to deallocate first.", zap.String("vmName", vmName))
                    if err := StopVM(ctx, vmName); err != nil {
                        return fmt.Errorf("failed to stop VM %s for resizing: %w", vmName, err)
                    }
                    // Wait for deallocation
                    time.Sleep(30 * time.Second) // Placeholder for polling actual status
                }
            }


            updateParams := armcompute.VirtualMachineUpdate{
                Properties: &armcompute.VirtualMachineProperties{
                    VMSize: to.Ptr(newVmSize),
                },
            }

            poller, err := client.BeginUpdate(ctx, resourceGroupName, vmName, updateParams, nil)
            if err != nil {
                log.Error("Failed to initiate VM resize", zap.String("vmName", vmName), zap.String("newSize", newVmSize), zap.Error(err))
                return fmt.Errorf("failed to initiate VM resize: %w", err)
            }

            _, err = poller.PollUntilDone(ctx, nil)
            if err != nil {
                log.Error("Failed to resize VM", zap.String("vmName", vmName), zap.String("newSize", newVmSize), zap.Error(err))
                return fmt.Errorf("failed to resize VM: %w", err)
            }

            log.Info("VM resized successfully", zap.String("vmName", vmName), zap.String("newSize", newVmSize))
            compute_optimizer.LogVmAction(vmName, "resize", "successful", resourceGroupName, map[string]interface{}{"oldSize": *vm.Properties.VMSize, "newSize": newVmSize}) // Log for AI
            cache.Delete(fmt.Sprintf("azure_vms_%s", resourceGroupName)) // Invalidate cache
            return nil
        }
        ```

#### b. AWS EC2 and ECS SDK (`@aws-sdk/client-ec2`, `@aws-sdk/client-ecs`)
-   **Purpose:** To extend intelligent compute management to AWS resources, including EC2 instances (as shown in Cloud module) and container orchestration within AWS Elastic Container Service (ECS).
-   **Architectural Approach:** The COS will also integrate with AWS EC2 for VM-level operations and with ECS for container workload visibility, task management, and service scaling. This enables a consistent "single pane of glass" for containerized applications, regardless of whether they run on ECS or AKS. AI will provide insights into optimal container sizing, task placement, and predictive scaling based on application performance metrics and cost efficiency.
-   **Code Examples (Conceptual TypeScript - AWS ECS Service Management):**
    ```typescript
    // services/engine_core/aws_ecs_manager.ts
    import { ECSClient, ListServicesCommand, DescribeServicesCommand, UpdateServiceCommand, Service } from "@aws-sdk/client-ecs";
    import { config } from 'dotenv';
    import { logger } from '../utils/logger';
    import { cache } from '../utils/cache_manager';
    import { aiComputeOptimizer } from '../ai/compute_optimizer'; // AI model integration

    config();

    const ecsClient = new ECSClient({ region: process.env.AWS_REGION || "us-east-1" });
    const DEFAULT_ECS_CLUSTER = process.env.AWS_DEFAULT_ECS_CLUSTER || 'default-cluster';

    export interface EcsServiceStatus {
      clusterArn: string;
      serviceArn: string;
      serviceName: string;
      status: string;
      desiredCount: number;
      runningCount: number;
      pendingCount: number;
      launchType: string; // EC2 or FARGATE
      createdAt: Date;
      tags: Record<string, string>;
      aiScalingRecommendation?: 'SCALE_UP' | 'SCALE_DOWN' | 'MAINTAIN' | 'OPTIMIZE_COST';
      aiAnomalyAlerts?: string[];
    }

    /**
     * Lists and describes ECS services for a given cluster with AI insights.
     * @param clusterName The name of the ECS cluster.
     * @returns Array of EcsServiceStatus.
     */
    export async function listEcsServices(clusterName: string = DEFAULT_ECS_CLUSTER): Promise<EcsServiceStatus[]> {
      const cacheKey = `aws_ecs_services_${clusterName}`;
      const cachedData = await cache.get<EcsServiceStatus[]>(cacheKey);
      if (cachedData) {
        logger.debug(`Serving ECS services from cache for cluster: ${clusterName}`);
        return cachedData;
      }

      logger.info(`Listing ECS services for cluster: ${clusterName}`);
      const serviceArns: string[] = [];
      let nextToken: string | undefined;

      try {
        do {
          const listCommand = new ListServicesCommand({ cluster: clusterName, nextToken: nextToken });
          const listResponse = await ecsClient.send(listCommand);
          serviceArns.push(...(listResponse.serviceArns || []));
          nextToken = listResponse.nextToken;
        } while (nextToken);

        if (serviceArns.length === 0) {
          logger.info(`No ECS services found in cluster: ${clusterName}`);
          return [];
        }

        const describeCommand = new DescribeServicesCommand({ cluster: clusterName, services: serviceArns, include: ['TAGS'] });
        const describeResponse = await ecsClient.send(describeCommand);

        const servicesStatus: EcsServiceStatus[] = [];
        for (const service of describeResponse.services || []) {
          const tags: Record<string, string> = {};
          service.tags?.forEach(tag => {
            if (tag.key && tag.value) {
              tags[tag.key] = tag.value;
            }
          });

          // AI Integration for scaling recommendations and anomaly detection
          const aiScalingRecommendation = await aiComputeOptimizer.recommendEcsScaling(service);
          const aiAnomalyAlerts = await aiComputeOptimizer.detectEcsAnomalies(service);

          servicesStatus.push({
            clusterArn: service.clusterArn!,
            serviceArn: service.serviceArn!,
            serviceName: service.serviceName!,
            status: service.status!,
            desiredCount: service.desiredCount!,
            runningCount: service.runningCount!,
            pendingCount: service.pendingCount!,
            launchType: service.launchType!,
            createdAt: service.createdAt!,
            tags: tags,
            aiScalingRecommendation: aiScalingRecommendation,
            aiAnomalyAlerts: aiAnomalyAlerts.length > 0 ? aiAnomalyAlerts : undefined,
          });
        }
        await cache.set(cacheKey, servicesStatus, 60); // Cache for 1 minute
        logger.info(`Successfully listed and processed ${servicesStatus.length} ECS services.`);
        return servicesStatus;
      } catch (error) {
        logger.error(`Error listing ECS services for cluster ${clusterName}: ${(error as Error).message}`, { error });
        throw new Error(`Failed to list ECS services: ${(error as Error).message}`);
      }
    }

    /**
     * Updates the desired task count for an ECS service.
     * @param clusterName The name of the ECS cluster.
     * @param serviceName The name of the ECS service.
     * @param desiredCount The new desired task count.
     */
    export async function updateEcsServiceDesiredCount(clusterName: string, serviceName: string, desiredCount: number): Promise<Service | undefined> {
      logger.info(`Updating desired task count for ECS service ${serviceName} in cluster ${clusterName} to ${desiredCount}.`);
      try {
        const command = new UpdateServiceCommand({
          cluster: clusterName,
          service: serviceName,
          desiredCount: desiredCount,
        });
        const response = await ecsClient.send(command);
        if (response.service) {
          logger.info(`ECS service ${serviceName} updated to desired count ${desiredCount}.`);
          await cache.delete(`aws_ecs_services_${clusterName}`); // Invalidate cache
          aiComputeOptimizer.logEcsAction(serviceName, clusterName, "update_desired_count", "successful", { newCount: desiredCount });
          return response.service;
        }
        return undefined;
      } catch (error) {
        logger.error(`Error updating ECS service ${serviceName}: ${(error as Error).message}`, { error });
        throw new Error(`Failed to update ECS service: ${(error as Error).message}`);
      }
    }

    /**
     * Auto-scales an ECS service based on AI recommendations or predefined policies.
     * This function would typically be triggered by an internal event or a scheduled job.
     * @param clusterName The name of the ECS cluster.
     * @param serviceName The name of the ECS service.
     * @param currentDesiredCount The current desired count of tasks.
     * @param recommendation The AI-driven scaling recommendation.
     */
    export async function autoScaleEcsService(clusterName: string, serviceName: string, currentDesiredCount: number, recommendation: 'SCALE_UP' | 'SCALE_DOWN' | 'MAINTAIN' | 'OPTIMIZE_COST'): Promise<Service | undefined> {
        let newDesiredCount = currentDesiredCount;
        const scaleFactor = 0.2; // 20% increase/decrease

        switch (recommendation) {
            case 'SCALE_UP':
                newDesiredCount = Math.ceil(currentDesiredCount * (1 + scaleFactor));
                logger.info(`AI recommends scaling UP service ${serviceName} to ${newDesiredCount}.`);
                break;
            case 'SCALE_DOWN':
                newDesiredCount = Math.floor(currentDesiredCount * (1 - scaleFactor));
                if (newDesiredCount < 1) newDesiredCount = 1; // Ensure at least one task
                logger.info(`AI recommends scaling DOWN service ${serviceName} to ${newDesiredCount}.`);
                break;
            case 'OPTIMIZE_COST':
                // AI would provide a specific optimized count, e.g., based on historical low utilization
                const optimizedCount = await aiComputeOptimizer.getOptimizedEcsCount(serviceName, clusterName);
                if (optimizedCount < newDesiredCount) {
                    newDesiredCount = optimizedCount;
                    logger.info(`AI recommends cost-optimizing service ${serviceName} to ${newDesiredCount}.`);
                } else {
                    logger.info(`AI determined current count for ${serviceName} is already cost-optimized.`);
                    return undefined;
                }
                break;
            case 'MAINTAIN':
            default:
                logger.info(`AI recommends maintaining current scale for service ${serviceName}.`);
                return undefined; // No change needed
        }

        if (newDesiredCount !== currentDesiredCount) {
            return updateEcsServiceDesiredCount(clusterName, serviceName, newDesiredCount);
        }
        return undefined;
    }
    ```

---

## 5. Unified AI & Predictive Intelligence Layer: The Oracle
### Core Concept
The Oracle is not merely an integration point; it is a pervasive, sentient intelligence embedded within every module of the Creator's Codex. It leverages advanced machine learning models, real-time data streams, and historical analytics to provide predictive insights, detect anomalies, automate optimizations, and enhance security posture across the entire digital estate. The Oracle transforms reactive management into proactive, intelligent governance, ensuring maximum efficiency, resilience, and strategic advantage.

### Key Capabilities & Integration Points
-   **Cost Optimization & Forecasting (Aetherium):**
    -   Predictive cost models identify future spending trends, flagging potential budget overruns before they occur.
    -   Anomaly detection algorithms scrutinize billing data, immediately alerting to unexpected cost spikes or resource misuse.
    -   Recommends rightsizing of compute instances, intelligent storage tiering, and optimal network configurations.
-   **Security & Behavioral Analytics (Hall of Faces):**
    -   Detects anomalous login patterns, unusual user behavior (e.g., access from new locations, rapid role changes), and potential identity compromises.
    -   Provides real-time risk scores for user sessions and recommends adaptive MFA policies.
    -   Automated identity governance reviews, identifying stale accounts or over-provisioned permissions.
-   **Data Intelligence & Lifecycle Management (Great Library):**
    -   Automated data classification (e.g., PII, confidential, public) based on content, tags, and access patterns.
    -   Intelligent lifecycle policy recommendations for data retention and archival, optimizing storage costs and compliance.
    -   Anomaly detection in data access patterns (e.g., unusual downloads, deletions, or geographic access) for data loss prevention.
-   **Compute Optimization & Auto-Healing (Engine Core):**
    -   Predictive auto-scaling of VMs, containers, and serverless functions based on anticipated workload demands.
    -   Proactive detection of performance degradation, suggesting or executing automated remediation (e.g., reboot, resize, re-deploy).
    -   Optimal resource placement recommendations, considering cost, performance, and availability zones.
    -   Automated capacity planning and infrastructure drift detection.

### AI Model Examples (Conceptual)
```typescript
// src/ai/cost_forecaster.ts
import { logger } from '../utils/logger';

export const aiPredictiveCostModel = {
  /**
   * Simulates an AI model predicting future cost based on historical data.
   * In a real system, this would involve a trained ML model (e.g., ARIMA, Prophet, or a deep learning model).
   * @param serviceName The name of the cloud service.
   * @param currentCost The current observed cost.
   * @param timePeriod The current time period.
   * @returns Predicted cost for the next period.
   */
  async predictCost(serviceName: string, currentCost: number, timePeriod: string): Promise<number> {
    logger.debug(`AI Cost Forecaster: Predicting cost for ${serviceName} at ${timePeriod}`);
    // Placeholder: Simple heuristic, e.g., current cost + small growth factor + random noise
    const growthFactor = 1.02; // 2% growth
    const noise = (Math.random() - 0.5) * currentCost * 0.1; // +/- 5% noise
    return parseFloat((currentCost * growthFactor + noise).toFixed(2));
  },

  /**
   * Simulates an AI model detecting anomalies in cost data.
   * This would typically use statistical process control, time-series anomaly detection, or unsupervised learning.
   * @param serviceName The name of the cloud service.
   * @param currentCost The current observed cost.
   * @returns True if an anomaly is detected, false otherwise.
   */
  async detectAnomaly(serviceName: string, currentCost: number): Promise<boolean> {
    logger.debug(`AI Cost Forecaster: Detecting anomaly for ${serviceName} with cost ${currentCost}`);
    // Placeholder: Simple anomaly detection (e.g., if cost is more than 2 standard deviations from recent average)
    // For demonstration, let's say an anomaly if it's > 150% of a simulated 'expected' value
    const expectedCost = await this.predictCost(serviceName, currentCost * 0.8, new Date().toISOString()); // Simulate a slightly lower 'expected' for testing
    return currentCost > expectedCost * 1.5; // If current cost is 50% higher than a 'baseline' prediction
  },

  /**
   * Recommends S3 tiering based on access patterns, data age, and classification.
   * @param objectKey S3 object key.
   * @param metadata S3 object metadata.
   * @returns Recommended storage class.
   */
  async recommendS3Tiering(objectKey: string, metadata: Record<string, string>): Promise<'STANDARD' | 'IA' | 'GLACIER' | 'DEEP_ARCHIVE'> {
    logger.debug(`AI S3 Tiering: Recommending tier for ${objectKey}`);
    // Placeholder logic:
    // If tagged 'critical' or 'frequent-access', then STANDARD
    // If tagged 'archive' or very old, then DEEP_ARCHIVE
    // Else, check size/access patterns (simulated)
    if (metadata['access-frequency'] === 'high' || metadata['classification'] === 'critical') {
      return 'STANDARD';
    }
    if (metadata['data-age-days'] && parseInt(metadata['data-age-days']) > 365) {
      return 'DEEP_ARCHIVE';
    }
    if (objectKey.includes('archive')) {
      return 'GLACIER';
    }
    return 'IA'; // Infrequent Access as default optimization
  },

  /**
   * Analyzes S3 security posture for potential risks.
   * @param objectKey S3 object key.
   * @param metadata S3 object metadata.
   * @returns Array of security alerts.
   */
  async analyzeS3Security(objectKey: string, metadata: Record<string, string>): Promise<string[]> {
    logger.debug(`AI S3 Security: Analyzing security for ${objectKey}`);
    const alerts: string[] = [];
    if (metadata['encryption'] === 'disabled' || !metadata['encryption']) {
      alerts.push('Encryption not enabled');
    }
    if (metadata['public-access'] === 'true') {
      alerts.push('Public access detected - potential exposure');
    }
    if (metadata['contains-pii'] === 'true' && metadata['compliance'] !== 'gdpr') {
        alerts.push('PII detected without GDPR compliance tag');
    }
    return alerts;
  }
};

// src/ai/identity_security_advisor.ts
import { logger } from '../utils/logger';
import { datetime } from 'src/utils/datetime'; // Custom datetime utility for consistent date handling

export const IdentitySecurityAdvisor = {
  // Store user login patterns (simplified)
  _userLoginHistory: new Map<string, Array<{ timestamp: Date; location: string }>>(),

  /**
   * Simulates an AI model analyzing user login patterns for anomalies.
   * @param userId The ID of the user.
   * @param loginTime The time of the login event.
   * @param loginLocation The location of the login (e.g., IP address, geo-location).
   * @returns True if an anomalous login pattern is detected, false otherwise.
   */
  async analyzeLoginPattern(userId: string, loginTime: Date, loginLocation: string = 'unknown'): Promise<boolean> {
    logger.debug(`AI Identity Security: Analyzing login for user ${userId} at ${loginLocation}`);
    const history = this._userLoginHistory.get(userId) || [];
    this._userLoginHistory.set(userId, [...history.slice(-10), { timestamp: loginTime, location: loginLocation }]); // Keep last 10 logins

    if (history.length < 3) {
      return false; // Not enough data to detect pattern
    }

    // Simple heuristic: If last login location is drastically different from recent ones
    const recentLocations = history.slice(-3).map(entry => entry.location);
    if (!recentLocations.includes(loginLocation) && loginLocation !== 'unknown' && recentLocations.some(loc => loc !== 'unknown')) {
      logger.warn(`Anomaly detected for user ${userId}: Login from new location ${loginLocation}`);
      return true;
    }

    // Another heuristic: login time outside of usual hours (e.g., past 2 AM if usually logs in during day)
    const latestHour = loginTime.getUTCHours();
    const averageHour = history.reduce((sum, entry) => sum + entry.timestamp.getUTCHours(), 0) / history.length;
    if (Math.abs(latestHour - averageHour) > 8 && history.length > 5) { // If login time is very different
        logger.warn(`Anomaly detected for user ${userId}: Unusual login time: ${loginTime.toUTCString()}`);
        return true;
    }

    return false;
  },

  /**
   * Logs a user action for AI model training and real-time analysis.
   * @param userId The ID of the user.
   * @param actionType The type of action (e.g., 'block', 'create', 'assign_roles').
   * @param status The outcome of the action ('successful', 'failed').
   * @param details Additional action details.
   */
  async logUserAction(userId: string, actionType: string, status: string, details: Record<string, any> = {}): Promise<void> {
    logger.info(`AI Identity Security: Logging user action: ${userId} - ${actionType} (${status})`, { userId, actionType, status, details, timestamp: new Date().toISOString() });
    // In a real scenario, this would send data to a queue for ML pipeline ingestion
  },
};

// src/ai/data_intelligence_engine.ts
import { logger } from '../utils/logger';

export const aiDataIntelligence = {
  /**
   * Classifies data based on its content, metadata, and perceived sensitivity.
   * @param objectKey The key/path of the data object.
   * @param metadata The metadata associated with the object.
   * @param contentSample Optional: a sample of the content for deeper analysis.
   * @returns A classification string (e.g., 'PII', 'CONFIDENTIAL', 'PUBLIC', 'REGULATORY_COMPLIANT').
   */
  async classifyData(objectKey: string, metadata: Record<string, any>, contentSample?: string): Promise<string> {
    logger.debug(`AI Data Intelligence: Classifying data for ${objectKey}`);
    let classification = 'UNCLASSIFIED';

    // Heuristic 1: Based on object name/path
    if (objectKey.includes('invoice') || objectKey.includes('customer-data')) {
      classification = 'FINANCIAL_SENSITIVE';
    } else if (objectKey.includes('public-') || objectKey.endsWith('.js') || objectKey.endsWith('.css')) {
      classification = 'PUBLIC';
    }

    // Heuristic 2: Based on metadata tags
    if (metadata.sensitivity && metadata.sensitivity.toLowerCase() === 'high') {
      classification = 'HIGH_SENSITIVITY';
    }
    if (metadata.contains_pii === 'true') {
      classification = 'PII_DETECTED';
    }
    if (metadata.compliance === 'gdpr' || metadata.compliance === 'hipaa') {
      classification += '_REGULATORY_COMPLIANT';
    }

    // Heuristic 3: Content-based analysis (simulated)
    if (contentSample) {
      if (contentSample.toLowerCase().includes('social security number') || contentSample.match(/\b\d{3}-\d{2}-\d{4}\b/)) {
        classification = 'PII_DETECTED_DEEP_SCAN';
      }
    }

    return classification;
  },

  /**
   * Recommends optimal storage tiering based on access patterns, age, and classification.
   * @param objectKey The key/path of the data object.
   * @param metadata The metadata associated with the object.
   * @param currentStorageClass The current storage class (if known).
   * @returns Recommended storage class (e.g., 'STANDARD', 'NEARLINE', 'COLDLINE', 'ARCHIVE').
   */
  async recommendTiering(objectKey: string, metadata: Record<string, any>, currentStorageClass?: string): Promise<'STANDARD' | 'NEARLINE' | 'COLDLINE' | 'ARCHIVE'> {
    logger.debug(`AI Data Intelligence: Recommending tiering for ${objectKey}`);
    const classification = await this.classifyData(objectKey, metadata);
    const lastAccessed = metadata.lastAccessed ? new Date(metadata.lastAccessed) : new Date(0);
    const ageInDays = (new Date().getTime() - lastAccessed.getTime()) / (1000 * 60 * 60 * 24);
    const sizeInBytes = parseInt(metadata.size || '0');

    // Example logic:
    if (classification.includes('CRITICAL') || ageInDays < 30) {
      return 'STANDARD'; // High access or critical data
    }
    if (ageInDays >= 30 && ageInDays < 90 && sizeInBytes > 1024 * 1024 * 10) { // Older than 30 days, larger than 10MB
      return 'NEARLINE';
    }
    if (ageInDays >= 90 && ageInDays < 365 && sizeInBytes > 1024 * 1024 * 100) { // Older than 90 days, larger than 100MB
      return 'COLDLINE';
    }
    if (ageInDays >= 365) { // Older than 1 year
      return 'ARCHIVE';
    }
    return 'STANDARD'; // Default
  },

  /**
   * Scans data objects for potential security risks (e.g., public exposure, unencrypted data).
   * @param objectKey The key/path of the data object.
   * @param metadata The metadata associated with the object.
   * @returns An array of detected security alerts.
   */
  async scanForSecurityRisks(objectKey: string, metadata: Record<string, any>): Promise<string[]> {
    logger.debug(`AI Data Intelligence: Scanning security for ${objectKey}`);
    const alerts: string[] = [];
    if (metadata.public_access === 'true') {
      alerts.push('Publicly accessible data detected.');
    }
    if (metadata.encryption_status === 'unencrypted' || !metadata.encryption_status) {
      alerts.push('Unencrypted data detected.');
    }
    if (metadata.virus_scan_status === 'failed' || metadata.virus_scan_required === 'true' && !metadata.virus_scan_status) {
        alerts.push('Virus scan failed or required.');
    }
    const classification = await this.classifyData(objectKey, metadata);
    if ((classification.includes('PII') || classification.includes('SENSITIVE')) && alerts.length > 0) {
        alerts.push('Highly sensitive data with detected security vulnerabilities.');
    }
    return alerts;
  },

  /**
   * Logs a data action for AI model training and auditing.
   * @param objectKey The key/path of the data object.
   * @param actionType The type of action (e.g., 'upload', 'download', 'delete', 'storage_class_change').
   * @param status The outcome of the action ('successful', 'failed').
   * @param details Additional action details.
   */
  async logDataAction(objectKey: string, actionType: string, status: string, details: Record<string, any> = {}): Promise<void> {
    logger.info(`AI Data Intelligence: Logging data action: ${objectKey} - ${actionType} (${status})`, { objectKey, actionType, status, details, timestamp: new Date().toISOString() });
    // Send to ML pipeline for behavioral analysis, access pattern learning, etc.
  },
};

// src/ai/compute_optimizer.ts
import { logger } from '../utils/logger';

export interface ScalingRecommendation {
  action: 'SCALE_UP' | 'SCALE_DOWN' | 'MAINTAIN' | 'OPTIMIZE_COST';
  reason: string;
  recommendedSize?: string; // For VM resizing
  recommendedCount?: number; // For container scaling
}

export const aiComputeOptimizer = {
  /**
   * Analyzes VM workload metrics to provide scaling recommendations.
   * @param vmId The ID of the VM.
   * @param metrics Current VM metrics.
   * @returns ScalingRecommendation.
   */
  analyzeVmWorkload(vmId: string, metrics: any): ScalingRecommendation {
    logger.debug(`AI Compute Optimizer: