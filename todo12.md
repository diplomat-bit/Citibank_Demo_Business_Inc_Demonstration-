# The Creator's Codex - Integration Plan, Part 12/10
## Module Integrations: The Pantheon of Connectivity - API Gateway, Graph Explorer, DBQL Orchestration

This document transcends a mere plan; it presents the fully realized, high-fidelity integration blueprint for the **API Gateway**, **Graph Explorer**, and **DBQL** modules. This is a strategic imperative to elevate our internal platform tools, connecting them seamlessly to a curated selection of industry-leading external systems. The aim is to forge an unparalleled ecosystem for API lifecycle management, advanced graph data analytics, and intelligent query orchestration, establishing Demo Bank's foundational layer for next-generation financial services. Every integration detailed herein is designed for maximum scalability, security, and extensibility, setting a new benchmark for enterprise architecture.

---

## 1. API Gateway Module: The Grand Central Station of Digital Commerce
### Core Concept: The Universal Conduit and Traffic Maestro
The API Gateway module is engineered as the enterprise's singular ingress point for all digital interactions. It's not merely a proxy; it's a sophisticated orchestration layer that will integrate with premier API management platforms, empowering developers to seamlessly publish, rigorously secure, meticulously monitor, and strategically monetize Demo Bank APIs. This module constructs an impenetrable, yet highly flexible, bridge between our deeply integrated internal microservices and the expansive external developer ecosystem, fostering innovation and accelerating market reach. It serves as the intelligent router, policy enforcer, and analytical nexus for billions of transactions, ensuring optimal performance and uncompromising security.

### Strategic Objectives:
*   **Unified API Lifecycle Management:** Automate the entire API journey from design and development to deployment, versioning, deprecation, and retirement.
*   **Enhanced Security Posture:** Implement multi-layered security protocols, including OAuth2, JWT validation, API key management, and robust threat protection.
*   **Advanced Traffic Management:** Enable dynamic routing, rate limiting, caching, circuit breakers, and load balancing for unparalleled service resilience and performance.
*   **Comprehensive Observability:** Provide real-time analytics, logging, and tracing across all API interactions for proactive monitoring and rapid issue resolution.
*   **Developer Experience Excellence:** Offer a self-service developer portal, interactive documentation, and SDK generation capabilities to foster a vibrant developer community.
*   **Monetization Enablement:** Lay the groundwork for flexible API productization and consumption-based billing models.

### Key API Integrations: Architects of Connectivity

#### a. Apigee API Management (Google Cloud)
*   **Purpose:** To programmatically create, configure, deploy, and manage API proxies, API products, and developer applications within a dedicated Apigee Edge or Apigee X instance. This deep integration transforms our internal API Gateway into an intelligent control plane, orchestrating Apigee resources as first-class citizens.
*   **Architectural Approach:** A dedicated, highly-available backend microservice, the `ApigeeProvisioningService`, will serve as the authoritative control plane. It will translate Demo Bank's internal service definitions (e.g., from a Service Discovery registry or OpenAPI specifications) into idempotent Apigee API calls. When a new service is registered internally or an existing service's contract evolves, this service will automatically trigger the creation, update, or deployment of the corresponding API proxy, associated policies (security, traffic management, transformation), API products, and even developer applications within Apigee. This ensures a "GitOps"-like approach to API management, where desired state is continuously reconciled.

*   **Code Examples:**
    *   **Python (Apigee Provisioning Service - Comprehensive API Management)**
        ```python
        # services/apigee_manager.py
        import requests
        import os
        import json
        import logging
        from typing import Dict, Any, Optional, List

        # Configure robust logging
        logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
        logger = logging.getLogger(__name__)

        # Environment variables for secure configuration
        APIGEE_ORG = os.environ.get("APIGEE_ORG", "demobank-prod")
        APIGEE_TOKEN = os.environ.get("APIGEE_TOKEN") # OAuth2 Bearer token, refreshable
        APIGEE_ENV = os.environ.get("APIGEE_ENV", "prod") # Default deployment environment
        BASE_URL = f"https://api.enterprise.apigee.com/v1/organizations/{APIGEE_ORG}"

        if not APIGEE_TOKEN:
            logger.error("APIGEE_TOKEN environment variable is not set. API calls will fail.")
            raise ValueError("APIGEE_TOKEN is required for Apigee integration.")

        class ApigeeManager:
            """
            Manages the lifecycle of API proxies, products, and developer apps in Apigee.
            Encapsulates all interactions with the Apigee Management API.
            """
            def __init__(self, org: str, token: str, env: str):
                self.org = org
                self.token = token
                self.env = env
                self.base_url = f"https://api.enterprise.apigee.com/v1/organizations/{org}"
                self.headers = {
                    "Authorization": f"Bearer {self.token}",
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }

            def _make_request(self, method: str, path: str, data: Optional[Dict[str, Any]] = None, files: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
                """Internal helper to make HTTP requests to Apigee API."""
                url = f"{self.base_url}/{path}"
                try:
                    if files:
                        # For bundle uploads, content-type is set by requests
                        response = requests.request(method, url, files=files, headers={"Authorization": self.headers["Authorization"]})
                    else:
                        response = requests.request(method, url, json=data, headers=self.headers)

                    response.raise_for_status() # Raises HTTPError for bad responses (4xx or 5xx)
                    logger.info(f"Apigee API {method} {path} successful. Status: {response.status_code}")
                    return response.json()
                except requests.exceptions.HTTPError as e:
                    logger.error(f"Apigee API {method} {path} failed: {e.response.text}")
                    raise RuntimeError(f"Apigee API call failed: {e.response.text}") from e
                except requests.exceptions.RequestException as e:
                    logger.error(f"Apigee API {method} {path} connection error: {e}")
                    raise RuntimeError(f"Apigee API connection error: {e}") from e

            def create_or_update_api_proxy(self, proxy_name: str, target_url: str, openapi_spec_path: Optional[str] = None) -> Dict[str, Any]:
                """
                Creates or updates an API proxy. For production, requires an API proxy bundle upload.
                This function provides a placeholder for sophisticated bundle generation.
                """
                path = f"apis/{proxy_name}"
                logger.info(f"Attempting to create/update API proxy '{proxy_name}' pointing to '{target_url}'")

                # In a real-world scenario, you would generate a proxy bundle dynamically
                # based on the OpenAPI spec, target URL, and predefined policy templates.
                # This bundle would include policies for security, rate limiting, caching, etc.
                # For demonstration, we'll simulate a bundle upload or a basic update.

                # Simplified example: Check if proxy exists. If not, create. If yes, update.
                try:
                    self._make_request("GET", path)
                    logger.info(f"Proxy '{proxy_name}' already exists. Initiating update process (e.g., uploading new revision).")
                    # Real update would involve POST to /apis/{proxy_name}/revisions
                    # and uploading a ZIP bundle.
                    # For simplicity, we'll just log and assume.
                    return {"name": proxy_name, "status": "updated_simulated", "revision": "latest"}
                except RuntimeError as e:
                    if "404 Not Found" in str(e): # Proxy does not exist
                        logger.info(f"Proxy '{proxy_name}' does not exist. Creating new proxy.")
                        # A full creation involves uploading a proxy bundle.
                        # This example simulates the *result* of a successful creation.
                        # The actual payload for creating via ZIP upload is different.
                        # For direct creation (limited features):
                        payload = {
                            "name": proxy_name,
                            "target": {
                                "uri": target_url
                            },
                            "basePath": f"/{proxy_name.lower()}",
                            "description": f"Managed API for {proxy_name} service."
                        }
                        # This simplified payload is often used for creating a blank proxy.
                        # The real magic happens with policy attachments and flow definitions.
                        response = self._make_request("POST", "apis", data=payload)
                        return response
                    raise # Re-raise other errors

            def deploy_api_proxy(self, proxy_name: str, revision: int) -> Dict[str, Any]:
                """Deploys a specific revision of an API proxy to the configured environment."""
                path = f"environments/{self.env}/apis/{proxy_name}/revisions/{revision}/deployments"
                logger.info(f"Deploying API proxy '{proxy_name}' revision '{revision}' to environment '{self.env}'")
                response = self._make_request("POST", path)
                return response

            def create_api_product(self, product_name: str, display_name: str, description: str, apis: List[str], scopes: List[str]) -> Dict[str, Any]:
                """Creates an API Product, bundling multiple APIs for consumption."""
                path = "apiproducts"
                logger.info(f"Creating API Product '{product_name}' with APIs: {apis}")
                payload = {
                    "name": product_name,
                    "displayName": display_name,
                    "description": description,
                    "apiResources": [f"/{api}/**" for api in apis], # Grant access to all paths under the API
                    "proxies": apis,
                    "scopes": scopes,
                    "environments": [self.env]
                }
                response = self._make_request("POST", path, data=payload)
                return response

            def create_developer_app(self, developer_id: str, app_name: str, api_products: List[str], callback_url: Optional[str] = None) -> Dict[str, Any]:
                """Registers a new developer application."""
                path = f"developers/{developer_id}/apps"
                logger.info(f"Registering developer app '{app_name}' for developer '{developer_id}' with products: {api_products}")
                payload = {
                    "name": app_name,
                    "apiProducts": api_products,
                    "callbackUrl": callback_url or "https://example.com/callback",
                    "status": "approved"
                }
                response = self._make_request("POST", path, data=payload)
                return response

            # Placeholder for advanced features:
            def configure_traffic_management(self, proxy_name: str, rate_limit: str = "100pm") -> None:
                """
                Simulates configuring traffic management policies (e.g., Spike Arrest, Quota).
                In Apigee, this involves updating the proxy bundle with XML policy files.
                """
                logger.info(f"Configuring advanced traffic management for '{proxy_name}': Rate limit to {rate_limit}")
                # Actual implementation would involve:
                # 1. Fetching the current proxy bundle.
                # 2. Modifying or adding policy XML files (e.g., SpikeArrest-1.xml).
                # 3. Updating the proxy's PreFlow/PostFlow to attach the policy.
                # 4. Uploading the new revision.
                # 5. Deploying the new revision.
                print(f"[{proxy_name}] Traffic management policies set.")

            def configure_security_policies(self, proxy_name: str, jwt_validation_url: str) -> None:
                """
                Simulates configuring security policies (e.g., JWT validation, OAuth2).
                """
                logger.info(f"Configuring advanced security policies for '{proxy_name}': JWT validation via {jwt_validation_url}")
                # Similar to traffic management, this involves bundle modification and deployment.
                print(f"[{proxy_name}] Security policies configured.")


        # Example usage:
        # apigee_manager = ApigeeManager(APIGEE_ORG, APIGEE_TOKEN, APIGEE_ENV)
        # try:
        #     # 1. Define internal service
        #     service_name = "transactions-v1"
        #     internal_target = "https://internal.demobank.com/api/v1/transactions"
        #     openapi_spec = "./specs/transactions-v1.yaml" # Assume this exists

        #     # 2. Create/Update API Proxy in Apigee
        #     proxy_response = apigee_manager.create_or_update_api_proxy(service_name, internal_target, openapi_spec)
        #     current_revision = proxy_response.get("revision", 1) # Assuming a way to get revision

        #     # 3. Deploy the proxy to a specific environment
        #     apigee_manager.deploy_api_proxy(service_name, current_revision)

        #     # 4. Configure advanced policies (simulated)
        #     apigee_manager.configure_traffic_management(service_name, rate_limit="500ps")
        #     apigee_manager.configure_security_policies(service_name, "https://auth.demobank.com/jwt/verify")

        #     # 5. Create an API Product for developers
        #     product_name = "PremiumTransactions"
        #     apigee_manager.create_api_product(
        #         product_name=product_name,
        #         display_name="Premium Transaction API",
        #         description="Access to high-volume transaction data for partners.",
        #         apis=[service_name],
        #         scopes=["read", "write"]
        #     )

        #     # 6. Register a developer app
        #     dev_id = "partner-fintech-xyz"
        #     app_name = "FintechAnalyticsApp"
        #     apigee_manager.create_developer_app(dev_id, app_name, [product_name], "https://fintech-xyz.com/auth/callback")

        # except RuntimeError as e:
        #     logger.exception(f"Failed to provision Apigee resources: {e}")
        ```

#### b. AWS API Gateway (Amazon Web Services)
*   **Purpose:** To programmatically define, deploy, and manage RESTful and WebSocket APIs using AWS API Gateway. This enables seamless exposure of internal services as highly scalable and resilient AWS-managed endpoints, integrating natively with other AWS services.
*   **Architectural Approach:** A `CloudFormation` or `CDK` driven infrastructure-as-code (IaC) approach will be adopted, orchestrated by a dedicated `AwsApiGatewayProvisioner` service. This service will dynamically generate and apply `CloudFormation` templates or `CDK` constructs based on our internal API definitions. It will support automatic creation of API Gateway resources, including routes, integration types (Lambda, HTTP, mock), request/response transformations, custom authorizers (Lambda, Cognito), usage plans, and domain name mappings.
*   **Code Examples:**
    *   **Python (AWS CDK - Defining a Serverless API Gateway with Lambda Integration)**
        ```python
        # infra/aws_api_gateway_stack.py
        from aws_cdk import (
            core as cdk,
            aws_lambda as _lambda,
            aws_apigateway as apigw,
            aws_iam as iam,
            aws_ssm as ssm
        )
        from constructs import Construct
        import os
        import json

        class DemoBankApiGatewayStack(cdk.Stack):
            """
            CDK Stack for provisioning a production-grade AWS API Gateway
            integrated with internal Lambda functions for various services.
            """
            def __init__(self, scope: Construct, id: str, **kwargs) -> None:
                super().__init__(scope, id, **kwargs)

                # --- Centralized Configuration Management (SSM Parameter Store) ---
                # Retrieve common configuration parameters for the environment
                api_domain_name = ssm.StringParameter.from_string_parameter_name(
                    self, "APIDomain", "/demobank/prod/api/domainName"
                ).string_value
                certificate_arn = ssm.StringParameter.from_string_parameter_name(
                    self, "CertificateARN", "/demobank/prod/api/certificateArn"
                ).string_value
                
                # --- Core API Gateway Definition ---
                self.api = apigw.RestApi(
                    self, "DemoBankPublicApi",
                    rest_api_name="DemoBankPublicApi",
                    description="Public API Gateway for Demo Bank Microservices",
                    deploy_options=apigw.StageOptions(
                        stage_name="prod",
                        logging_level=apigw.MethodLoggingLevel.INFO,
                        data_trace_enabled=True,
                        metrics_enabled=True
                    ),
                    default_cors_preflight_options=apigw.CorsOptions(
                        allow_origins=apigw.Cors.ALL_ORIGINS,
                        allow_methods=apigw.Cors.ALL_METHODS,
                        allow_headers=["Content-Type", "X-Amz-Date", "Authorization", "X-Api-Key", "X-Amz-Security-Token", "X-Amz-User-Agent"]
                    )
                )

                # --- Custom Domain Configuration ---
                # Requires a hosted zone and ACM certificate
                domain = apigw.DomainName(
                    self, "CustomApiDomain",
                    domain_name=api_domain_name,
                    certificate=cdk.aws_certificatemanager.Certificate.from_certificate_arn(self, "ApiCert", certificate_arn)
                )
                domain.add_base_path_mapping(self.api)

                # --- Centralized Request Authorizer (e.g., Lambda Authorizer) ---
                authorizer_lambda = _lambda.Function(
                    self, "DemoBankAuthorizerLambda",
                    runtime=_lambda.Runtime.PYTHON_3_9,
                    handler="authorizer.handler",
                    code=_lambda.Code.from_asset("lambda/authorizer"), # Path to authorizer lambda code
                    environment={
                        "AUTH_SERVICE_ENDPOINT": os.environ.get("AUTH_SERVICE_ENDPOINT", "https://auth.demobank.com/validate")
                    },
                    timeout=cdk.Duration.seconds(10),
                    memory_size=128
                )
                # Grant API Gateway permissions to invoke the Lambda Authorizer
                authorizer_lambda.add_permission(
                    "ApiGatewayInvokeAuthorizerPermission",
                    principal=iam.ServicePrincipal("apigateway.amazonaws.com"),
                    action="lambda:InvokeFunction",
                    source_arn=self.api.arn_for_uri(f"arn:{cdk.Aws.PARTITION}:execute-api:{cdk.Aws.REGION}:{cdk.Aws.ACCOUNT_ID}:*/*")
                )

                self.request_authorizer = apigw.TokenAuthorizer(
                    self, "DemoBankTokenAuthorizer",
                    handler=authorizer_lambda,
                    identity_sources=[apigw.IdentitySource.HEADER("Authorization")],
                    result_cache_tts=cdk.Duration.minutes(5) # Cache authorizer responses
                )

                # --- API Resource and Method Definitions (Dynamic from service registry) ---
                # This part would be dynamically generated or read from a configuration.
                # Example: "/transactions" endpoint integrated with a Lambda function.

                # Provision a Lambda for the Transactions Service
                transactions_lambda = _lambda.Function(
                    self, "TransactionsServiceLambda",
                    runtime=_lambda.Runtime.PYTHON_3_9,
                    handler="transactions.handler",
                    code=_lambda.Code.from_asset("lambda/transactions"), # Path to transactions lambda code
                    environment={
                        "DB_CONNECTION_STRING": os.environ.get("TRANSACTIONS_DB_CONN")
                    },
                    timeout=cdk.Duration.seconds(30),
                    memory_size=256
                )
                transactions_lambda.grant_invoke(_lambda.ServicePrincipal("apigateway.amazonaws.com"))

                # Create /transactions resource
                transactions_resource = self.api.root.add_resource("transactions")

                # Add a GET method with Lambda integration and custom authorizer
                transactions_resource.add_method(
                    "GET",
                    apigw.LambdaIntegration(transactions_lambda),
                    authorizer=self.request_authorizer,
                    method_responses=[
                        apigw.MethodResponse(status_code="200"),
                        apigw.MethodResponse(status_code="401", response_models={"application/json": apigw.Model.ERROR_MODEL}),
                        apigw.MethodResponse(status_code="500", response_models={"application/json": apigw.Model.ERROR_MODEL})
                    ],
                    request_parameters={
                        "method.request.querystring.accountId": True
                    },
                    request_models={
                        "application/json": apigw.Model(
                            self, "GetTransactionsRequestModel",
                            rest_api=self.api,
                            content_type="application/json",
                            schema=apigw.JsonSchema(
                                type=apigw.JsonSchemaType.OBJECT,
                                properties={
                                    "accountId": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING)
                                },
                                required=["accountId"]
                            )
                        )
                    }
                )

                # Add a POST method for creating transactions
                transactions_resource.add_method(
                    "POST",
                    apigw.LambdaIntegration(transactions_lambda),
                    authorizer=self.request_authorizer,
                    method_responses=[
                        apigw.MethodResponse(status_code="201"),
                        apigw.MethodResponse(status_code="400", response_models={"application/json": apigw.Model.ERROR_MODEL})
                    ],
                    request_models={
                        "application/json": apigw.Model(
                            self, "CreateTransactionRequestModel",
                            rest_api=self.api,
                            content_type="application/json",
                            schema=apigw.JsonSchema(
                                type=apigw.JsonSchemaType.OBJECT,
                                properties={
                                    "fromAccount": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                                    "toAccount": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING),
                                    "amount": apigw.JsonSchema(type=apigw.JsonSchemaType.NUMBER),
                                    "currency": apigw.JsonSchema(type=apigw.JsonSchemaType.STRING)
                                },
                                required=["fromAccount", "toAccount", "amount", "currency"]
                            )
                        )
                    }
                )

                # --- Outputs ---
                cdk.CfnOutput(self, "ApiGatewayUrl", value=self.api.url)
                cdk.CfnOutput(self, "CustomDomainUrl", value=f"https://{api_domain_name}")

        # Example of how this stack would be used in an app.py
        # app = cdk.App()
        # DemoBankApiGatewayStack(app, "DemoBankProdApiGatewayStack", env=cdk.Environment(
        #     account=os.getenv("CDK_DEFAULT_ACCOUNT"),
        #     region=os.getenv("CDK_DEFAULT_REGION")
        # ))
        # app.synth()
        ```

---

## 2. Graph Explorer Module: The Cartographer's Room - Unveiling Interconnected Insights
### Core Concept: Dynamic Graph Data Visualization and Advanced Analytics Platform
The Graph Explorer is designed as a sophisticated engine for empowering users to externalize, visualize, and analyze their interconnected data in powerful, dedicated graph database platforms. This capability moves beyond static, built-in visualizations, unlocking advanced relational analytics, pattern detection, anomaly identification, and predictive modeling crucial for fraud detection, customer journey mapping, and compliance. It offers a "data scientist's workbench" for exploring the hidden relationships within Demo Bank's vast datasets.

### Strategic Objectives:
*   **Deep Relational Insight:** Enable exploration of complex relationships between entities (customers, accounts, transactions, devices) that are difficult to discern in traditional tabular data.
*   **Platform Agnostic Export:** Support seamless data export to leading commercial and open-source graph databases.
*   **Interactive Visualization:** Facilitate integration with powerful graph visualization tools for intuitive and dynamic data exploration.
*   **Security & Compliance:** Ensure data anonymization, encryption, and strict access controls during export and within the target graph platform.
*   **Performance at Scale:** Optimize export mechanisms for large datasets, ensuring efficiency and minimal impact on source systems.
*   **Actionable Intelligence:** Bridge the gap between raw data and business value by making complex relationships understandable and actionable.

### Key API Integrations: Bridging to the Graph Universe

#### a. Neo4j (Cypher over Bolt/HTTP)
*   **Purpose:** To export a precisely defined subgraph from the Demo Bank platform's operational data stores (or analytical data lake) into a Neo4j instance. This enables leveraging Neo4j's native graph processing capabilities, its declarative Cypher query language, and advanced visualization tools like Neo4j Bloom, AuraDB, or custom applications built with `neovis.js`.
*   **Architectural Approach:** The backend service, `GraphDataExportService`, will expose a robust "Export to Neo4j" feature. This service will orchestrate the following:
    1.  **Data Extraction:** Query the internal operational graph or relational data, extracting nodes and relationships based on user-defined criteria or pre-configured data models.
    2.  **Data Transformation & Mapping:** Transform the extracted data into a schema-agnostic, yet semantically rich, format suitable for graph import. This includes handling property types, merging nodes, and creating appropriate relationship types.
    3.  **Cypher Statement Generation:** Dynamically generate optimized Cypher `MERGE` or `CREATE` statements (preferring `MERGE` for idempotent updates) to efficiently represent the graph data.
    4.  **Secure Execution:** Execute these Cypher statements against the user's specified Neo4j instance, utilizing the official Neo4j Bolt driver for performance and security (SSL/TLS, authentication).
    5.  **Status Monitoring & Auditing:** Provide real-time status updates for large exports and log all operations for auditability.

*   **Code Examples:**
    *   **TypeScript (Backend Service - Enterprise-Grade Neo4j Exporter with Batching and Error Handling)**
        ```typescript
        // services/neo4j_exporter.ts
        import neo4j, { Driver, Session, auth, Transaction, Result } from 'neo4j-driver';
        import { v4 as uuidv4 } from 'uuid';
        import EventEmitter from 'events';

        // Define interfaces for a more structured graph data model
        export interface NodeData {
          id: string; // Unique identifier from source system
          label: string; // Neo4j Node Label (e.g., 'Customer', 'Account', 'Transaction')
          properties: { [key: string]: any }; // All node properties
          _rawSourceId?: string; // Original ID from source system for tracking
        }

        export interface RelationshipData {
          source: string; // ID of the source node
          target: string; // ID of the target node
          type: string; // Neo4j Relationship Type (e.g., 'OWNS', 'PERFORMED', 'SENT_TO')
          properties: { [key: string]: any }; // All relationship properties
          _rawSourceRelId?: string; // Original ID for tracking
        }

        export interface GraphExportData {
          nodes: NodeData[];
          relationships: RelationshipData[];
        }

        export interface ExportOptions {
          clearExistingData?: boolean; // Whether to clear all data before export (caution!)
          batchSize?: number; // Number of statements per transaction batch
          labelPropertyMap?: { [sourceLabel: string]: string }; // Map source labels to Neo4j labels
          idProperty?: string; // Property to use for unique identification (default 'id')
          mergeNodes?: boolean; // Use MERGE instead of CREATE for nodes
          mergeRelationships?: boolean; // Use MERGE instead of CREATE for relationships
        }

        // Exportable class for managing Neo4j exports
        export class Neo4jGraphExporter extends EventEmitter {
          private driver: Driver;
          private logger = console; // Replace with a more sophisticated logging solution (e.g., Winston, Pino)

          constructor(neo4jUri: string, neo4jUser: string, neo4jPass: string) {
            super();
            this.driver = neo4j.driver(neo4jUri, auth.basic(neo4jUser, neo4jPass), {
              connectionTimeout: 60 * 1000, // 60 seconds
              maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 hours
              maxConnectionPoolSize: 50,
              // For production, configure trusted certificates
              // encrypted: 'ENCRYPTION_ON',
              // trust: 'TRUST_CUSTOM_CA_SIGNED_CERTIFICATES',
              // trustedCertificates: ['/path/to/my/ca.pem']
            });

            // Verify connectivity on initialization
            this.driver.verifyConnectivity()
              .then(() => this.logger.info('Neo4j Driver initialized and connected successfully.'))
              .catch(error => {
                this.logger.error('Neo4j Driver failed to connect:', error);
                throw new Error('Failed to connect to Neo4j database.');
              });
          }

          /**
           * Transforms source data into a structured GraphExportData format.
           * This method would typically query various internal services/DBs
           * and map their data models to graph concepts.
           * @param dataCriteria Criteria to fetch data, e.g., customer ID, time range.
           * @returns A promise resolving to GraphExportData.
           */
          public async prepareGraphData(dataCriteria: any): Promise<GraphExportData> {
            this.logger.info(`Preparing graph data based on criteria: ${JSON.stringify(dataCriteria)}`);
            // This is a placeholder for actual data retrieval and transformation logic.
            // In a real system, this would involve complex queries to SQL/NoSQL databases,
            // or even an internal graph service, followed by mapping to nodes and relationships.

            // Example: Fetching customer, account, and transaction data
            const rawCustomers = [{ customerId: 'C1001', name: 'Alice Smith', email: 'alice@example.com' }];
            const rawAccounts = [{ accountId: 'A001', customerId: 'C1001', balance: 15000, type: 'Checking' }];
            const rawTransactions = [{ transactionId: 'T001', fromAccount: 'A001', toAccount: 'A002', amount: 500, date: new Date().toISOString() }];

            const nodes: NodeData[] = [];
            const relationships: RelationshipData[] = [];

            // Transform raw data to NodeData
            rawCustomers.forEach(c => nodes.push({ id: c.customerId, label: 'Customer', properties: { name: c.name, email: c.email, uuid: uuidv4() } }));
            rawAccounts.forEach(a => nodes.push({ id: a.accountId, label: 'Account', properties: { balance: a.balance, type: a.type, uuid: uuidv4() } }));
            rawTransactions.forEach(t => nodes.push({ id: t.transactionId, label: 'Transaction', properties: { amount: t.amount, date: t.date, uuid: uuidv4() } }));

            // Transform raw data to RelationshipData
            rawAccounts.forEach(a => relationships.push({ source: a.customerId, target: a.accountId, type: 'OWNS', properties: {} }));
            rawTransactions.forEach(t => {
              relationships.push({ source: t.fromAccount, target: t.transactionId, type: 'INITIATED', properties: {} });
              relationships.push({ source: t.transactionId, target: t.toAccount, type: 'TO_ACCOUNT', properties: {} });
            });

            // Simulate more data for exponential expansion
            for (let i = 0; i < 50; i++) {
                const customerId = `C${1002 + i}`;
                const accountId = `A${1003 + i}`;
                const transactionId = `T${1002 + i}`;
                nodes.push({ id: customerId, label: 'Customer', properties: { name: `Customer ${i}`, email: `customer${i}@example.com`, uuid: uuidv4() } });
                nodes.push({ id: accountId, label: 'Account', properties: { balance: Math.random() * 100000, type: 'Savings', uuid: uuidv4() } });
                nodes.push({ id: transactionId, label: 'Transaction', properties: { amount: Math.random() * 1000, date: new Date().toISOString(), uuid: uuidv4() } });
                relationships.push({ source: customerId, target: accountId, type: 'OWNS', properties: {} });
                relationships.push({ source: accountId, target: transactionId, type: 'PERFORMED', properties: { status: 'completed' } });
            }


            this.logger.info(`Prepared ${nodes.length} nodes and ${relationships.length} relationships.`);
            return { nodes, relationships };
          }

          /**
           * Exports structured graph data to a Neo4j instance.
           * @param graphData The data to export.
           * @param options Export configuration.
           * @returns A promise resolving when export is complete.
           */
          public async exportGraphData(graphData: GraphExportData, options: ExportOptions = {}): Promise<void> {
            const { clearExistingData = false, batchSize = 1000, idProperty = 'id', mergeNodes = true, mergeRelationships = true } = options;
            const session = this.driver.session();
            this.emit('export_started', { totalNodes: graphData.nodes.length, totalRelationships: graphData.relationships.length });

            try {
              if (clearExistingData) {
                this.logger.warn('Clearing ALL existing data in Neo4j (MATCH (n) DETACH DELETE n). Use with EXTREME CAUTION.');
                await session.run('MATCH (n) DETACH DELETE n');
                this.emit('status_update', 'Cleared existing Neo4j data.');
              }

              // --- Batch Node Creation/Merging ---
              this.logger.info(`Processing ${graphData.nodes.length} nodes in batches of ${batchSize}...`);
              for (let i = 0; i < graphData.nodes.length; i += batchSize) {
                const nodeBatch = graphData.nodes.slice(i, i + batchSize);
                const query = mergeNodes ?
                  `UNWIND $nodes as node_data MERGE (n:${node_data.label} {${idProperty}: node_data.${idProperty}}) SET n += node_data.properties` :
                  `UNWIND $nodes as node_data CREATE (n:${node_data.label}) SET n += node_data.properties, n.${idProperty} = node_data.${idProperty}`;
                await session.run(query, { nodes: nodeBatch });
                this.emit('progress', { type: 'nodes', processed: Math.min(i + batchSize, graphData.nodes.length) });
              }
              this.logger.info(`Successfully processed ${graphData.nodes.length} nodes.`);

              // --- Batch Relationship Creation/Merging ---
              this.logger.info(`Processing ${graphData.relationships.length} relationships in batches of ${batchSize}...`);
              for (let i = 0; i < graphData.relationships.length; i += batchSize) {
                const relBatch = graphData.relationships.slice(i, i + batchSize);
                const query = mergeRelationships ?
                  `UNWIND $links as link_data
                   MATCH (a {${idProperty}: link_data.source})
                   MATCH (b {${idProperty}: link_data.target})
                   MERGE (a)-[r:${link_data.type}]->(b)
                   SET r += link_data.properties` :
                  `UNWIND $links as link_data
                   MATCH (a {${idProperty}: link_data.source})
                   MATCH (b {${idProperty}: link_data.target})
                   CREATE (a)-[r:${link_data.type}]->(b)
                   SET r += link_data.properties`;
                await session.run(query, { links: relBatch });
                this.emit('progress', { type: 'relationships', processed: Math.min(i + batchSize, graphData.relationships.length) });
              }
              this.logger.info(`Successfully processed ${graphData.relationships.length} relationships.`);

              this.emit('export_completed', 'Graph data successfully exported to Neo4j.');
            } catch (error) {
              this.logger.error('Error during Neo4j export:', error);
              this.emit('export_failed', error);
              throw error;
            } finally {
              await session.close();
            }
          }

          /**
           * Closes the Neo4j driver connection. Should be called when the exporter is no longer needed.
           */
          public async close(): Promise<void> {
            await this.driver.close();
            this.logger.info('Neo4j Driver closed.');
          }
        }

        // Example Usage (conceptual, in a separate orchestrator service)
        // const NEO4J_URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
        // const NEO4J_USER = process.env.NEO4J_USER || 'neo4j';
        // const NEO4J_PASS = process.env.NEO4J_PASS || 'password';

        // async function orchestrateNeo4jExport(exportCriteria: any, options?: ExportOptions) {
        //   const exporter = new Neo4jGraphExporter(NEO4J_URI, NEO4J_USER, NEO4J_PASS);

        //   exporter.on('export_started', (data) => console.log(`Export started: ${JSON.stringify(data)}`));
        //   exporter.on('status_update', (msg) => console.log(`Status: ${msg}`));
        //   exporter.on('progress', (data) => console.log(`Progress: ${data.type} processed: ${data.processed}`));
        //   exporter.on('export_completed', (msg) => console.log(`Export complete: ${msg}`));
        //   exporter.on('export_failed', (error) => console.error(`Export failed: ${error}`));

        //   try {
        //     const dataToExport = await exporter.prepareGraphData(exportCriteria);
        //     await exporter.exportGraphData(dataToExport, { ...options, clearExistingData: true, batchSize: 500 });
        //   } catch (error) {
        //     console.error("Orchestration failed:", error);
        //   } finally {
        //     await exporter.close();
        //   }
        // }

        // To make `orchestrateNeo4jExport` callable if it were a top-level function
        // if (require.main === module) {
        //   orchestrateNeo4jExport({ customerId: 'C1001' }, { mergeNodes: true, mergeRelationships: true });
        // }
        ```

#### b. Amazon Neptune (AWS)
*   **Purpose:** To export and query graph data within Amazon's fully managed graph database service, supporting both Gremlin and openCypher (a variant of Cypher) query languages. This is ideal for organizations heavily invested in the AWS ecosystem seeking high scalability, performance, and durability for their graph workloads.
*   **Architectural Approach:** Similar to Neo4j, a dedicated `NeptuneExporterService` will facilitate the process. This service will translate internal data models into either Gremlin traversal steps or openCypher statements. It will leverage the AWS SDK for efficient bulk loading using Amazon S3 for intermediate storage of CSV or Gremlin/openCypher script files, optimizing for large-scale data ingestion into Neptune. Real-time updates could use Neptune Streams.
*   **Code Examples:**
    *   **Python (AWS Lambda/Fargate - Batch Export to Amazon Neptune via S3)**
        ```python
        # services/neptune_exporter.py
        import boto3
        import os
        import json
        import csv
        import logging
        from io import StringIO
        from typing import List, Dict, Any, Tuple

        logger = logging.getLogger(__name__)
        logger.setLevel(logging.INFO)

        # Environment variables
        NEPTUNE_CLUSTER_ENDPOINT = os.environ.get("NEPTUNE_CLUSTER_ENDPOINT")
        NEPTUNE_PORT = os.environ.get("NEPTUNE_PORT", "8182")
        S3_BUCKET_NAME = os.environ.get("NEPTUNE_S3_BUCKET")
        AWS_REGION = os.environ.get("AWS_REGION", "us-east-1") # Example region

        if not all([NEPTUNE_CLUSTER_ENDPOINT, S3_BUCKET_NAME]):
            logger.error("NEPTUNE_CLUSTER_ENDPOINT and NEPTUNE_S3_BUCKET must be set.")
            raise ValueError("Neptune configuration missing.")

        class NeptuneBulkLoader:
            """
            Manages bulk loading of graph data into Amazon Neptune using S3.
            Supports CSV format for nodes and edges, compatible with Neptune's bulk loader.
            """
            def __init__(self, cluster_endpoint: str, s3_bucket: str, region: str, port: str = "8182"):
                self.neptune_endpoint = f"https://{cluster_endpoint}:{port}"
                self.s3_bucket = s3_bucket
                self.region = region
                self.s3_client = boto3.client('s3', region_name=self.region)
                self.neptune_client = boto3.client('neptune', region_name=self.region) # For starting loader jobs

            def _upload_csv_to_s3(self, data: List[Dict[str, Any]], key_prefix: str, file_name: str, headers: List[str]) -> str:
                """Helper to upload a list of dicts as CSV to S3."""
                csv_buffer = StringIO()
                writer = csv.DictWriter(csv_buffer, fieldnames=headers)
                writer.writeheader()
                for row in data:
                    writer.writerow(row)
                
                s3_key = f"{key_prefix}/{file_name}"
                self.s3_client.put_object(Bucket=self.s3_bucket, Key=s3_key, Body=csv_buffer.getvalue())
                logger.info(f"Uploaded {len(data)} rows to s3://{self.s3_bucket}/{s3_key}")
                return f"s3://{self.s3_bucket}/{s3_key}"

            def prepare_neptune_csvs(self, graph_data: GraphExportData) -> Tuple[str, str]:
                """
                Transforms GraphExportData into Neptune-compatible CSV formats
                and uploads them to S3.
                Returns S3 paths for nodes and edges.
                """
                nodes_csv_data = []
                edges_csv_data = []

                # Neptune CSV header format:
                # Nodes: ~id, ~label, property1:type, property2:type
                # Edges: ~id, ~from, ~to, ~label, property1:type, property2:type
                
                # Deduplicate and extract all unique node properties for headers
                node_properties_set = set()
                for node in graph_data.nodes:
                    node_properties_set.update(node.properties.keys())
                node_headers = ["~id", "~label"] + sorted(list(node_properties_set))

                for node in graph_data.nodes:
                    row = {"~id": node.id, "~label": node.label}
                    for prop_key, prop_val in node.properties.items():
                        # Basic type inference for Neptune; more complex logic might be needed
                        # E.g., handling lists, different numeric types, booleans
                        if isinstance(prop_val, int):
                            row[prop_key + ":int"] = prop_val
                        elif isinstance(prop_val, float):
                            row[prop_key + ":double"] = prop_val
                        elif isinstance(prop_val, bool):
                            row[prop_key + ":boolean"] = prop_val
                        elif isinstance(prop_val, list):
                             row[prop_key + ":string[]"] = json.dumps(prop_val) # Store as JSON string list
                        else:
                            row[prop_key] = prop_val # Default to string
                    nodes_csv_data.append(row)

                # Deduplicate and extract all unique edge properties for headers
                edge_properties_set = set()
                for rel in graph_data.relationships:
                    edge_properties_set.update(rel.properties.keys())
                edge_headers = ["~id", "~from", "~to", "~label"] + sorted(list(edge_properties_set))

                for i, rel in enumerate(graph_data.relationships):
                    # Neptune edges require a unique ~id
                    row = {"~id": f"e{i}-{rel.source}-{rel.target}", "~from": rel.source, "~to": rel.target, "~label": rel.type}
                    for prop_key, prop_val in rel.properties.items():
                        if isinstance(prop_val, int):
                            row[prop_key + ":int"] = prop_val
                        elif isinstance(prop_val, float):
                            row[prop_key + ":double"] = prop_val
                        elif isinstance(prop_val, bool):
                            row[prop_key + ":boolean"] = prop_val
                        else:
                            row[prop_key] = prop_val
                    edges_csv_data.append(row)

                # Upload to S3
                timestamp = cdk.CfnParameter(self, "Timestamp", type="String", description="Timestamp for S3 folder").value_as_string
                s3_key_prefix = f"neptune-bulk-load/{timestamp}"

                nodes_s3_path = self._upload_csv_to_s3(nodes_csv_data, s3_key_prefix, "nodes.csv", node_headers)
                edges_s3_path = self._upload_csv_to_s3(edges_csv_data, s3_key_prefix, "edges.csv", edge_headers)

                return nodes_s3_path, edges_s3_path

            def start_neptune_bulk_load(self, nodes_s3_path: str, edges_s3_path: str, iam_role_arn: str) -> Dict[str, Any]:
                """
                Starts a Neptune bulk load job.
                The IAM role must have read access to the S3 bucket.
                """
                logger.info(f"Starting Neptune bulk load from nodes: {nodes_s3_path}, edges: {edges_s3_path}")
                try:
                    response = self.neptune_client.start_loader_job(
                        Source=[nodes_s3_path, edges_s3_path],
                        Format='csv', # Can also be 'gremlin' or 'opencypher'
                        ClusterIdentifier=self.neptune_endpoint.split('//')[1].split('.')[0], # Extract cluster ID
                        RoleArn=iam_role_arn,
                        FailOnError=True,
                        Parallelism='HIGH', # Or 'MEDIUM', 'LOW'
                        UpdateSingleCardinalityProperties='TRUE' # Overwrite existing properties
                    )
                    logger.info(f"Neptune bulk load job initiated: {response}")
                    return response
                except Exception as e:
                    logger.error(f"Failed to start Neptune bulk load job: {e}")
                    raise

        # Example Usage (assuming GraphExportData structure from Neo4j_exporter.ts is available here)
        # from neo4j_exporter import GraphExportData, NodeData, RelationshipData, ExportOptions # Example cross-module import

        # async def orchestrate_neptune_export(graph_data: GraphExportData, iam_role_arn: str):
        #     neptune_loader = NeptuneBulkLoader(NEPTUNE_CLUSTER_ENDPOINT, S3_BUCKET_NAME, AWS_REGION)
        #     try:
        #         nodes_s3, edges_s3 = await neptune_loader.prepare_neptune_csvs(graph_data)
        #         load_job_response = await neptune_loader.start_neptune_bulk_load(nodes_s3, edges_s3, iam_role_arn)
        #         # Poll the job status using neptune_client.get_loader_job_status(LoaderId=load_job_response['payload']['loadId'])
        #         logger.info(f"Neptune load job ID: {load_job_response['payload']['loadId']}")
        #     except Exception as e:
        #         logger.error(f"Neptune export orchestration failed: {e}")
        ```

---

## 3. DBQL Module: The Oracle's Tongue - Intelligent Query Language and Data Abstraction Layer
### Core Concept: The Universal Data Access and Intelligent Query Fabric
The DBQL (Demo Bank Query Language) module is a revolutionary, domain-specific query language designed to abstract away the complexities of underlying data stores. It provides a unified, semantic interface for accessing, transforming, and analyzing data across heterogeneous systems. This module takes center stage by integrating with advanced GraphQL infrastructure, enabling developers to expose their sophisticated DBQL queries as secure, strongly typed, and performant GraphQL endpoints. This effectively transforms raw data into a coherent, navigable data graph accessible through a modern, developer-friendly API.

### Strategic Objectives:
*   **Data Source Agnosticism:** Shield consumers from the intricacies of underlying databases (SQL, NoSQL, graph, document stores).
*   **Semantic Querying:** Allow queries to be expressed in business terms, not technical table/column names.
*   **Unified Data View:** Present a cohesive, federated view of data residing in disparate systems.
*   **GraphQL Native Exposure:** Automate the generation of GraphQL schemas and resolvers from DBQL queries.
*   **Real-time Capabilities:** Support subscriptions for real-time data updates.
*   **Security & Governance:** Enforce granular access control and data masking at the query level.
*   **AI-Driven Query Optimization:** Integrate AI for query performance prediction, optimization, and auto-completion.

### Key API Integrations: Unleashing Data with GraphQL

#### a. Apollo Server (GraphQL Federation & Gateway)
*   **Purpose:** To seamlessly expose DBQL queries as federated GraphQL services. This enables Demo Bank's microservices architecture to consume data via a standardized, performant GraphQL gateway. Each DBQL query becomes a granular data service within a larger data graph.
*   **Architectural Approach:** We will establish a fleet of highly scalable `DBQLGraphQLAdapter` microservices. Each adapter will host a lightweight Apollo Server instance. This server will dynamically construct its GraphQL schema based on the DBQL queries it's configured to expose. The resolvers for these GraphQL fields will internally invoke the `DBQLEngine`, pass the translated GraphQL arguments as DBQL parameters, and return the structured results. Crucially, these adapters will integrate with an Apollo Federation Gateway, allowing for a single, unified GraphQL endpoint that intelligently routes queries to the appropriate DBQL adapter service. This architecture promotes modularity, independent deployment, and scalable data access.

*   **Code Examples:**
    *   **TypeScript (Apollo Server Adapter - Federated DBQL Gateway)**
        ```typescript
        // services/dbql_graphql_adapter.ts
        import { ApolloServer, gql } from 'apollo-server';
        import { buildFederatedSchema } from '@apollo/federation';
        import { GraphQLScalarType, Kind } from 'graphql';
        import { dbqlEngine, DBQLQueryConfig, DBQLExecutionResult } from './dbqlEngine'; // Assume dbqlEngine exists
        import { ILogger, ConsoleLogger } from './utils/logger'; // Custom logger utility
        import { AuthService, AuthContext } from './utils/authService'; // Authentication & Authorization
        import { PrometheusMetrics } from './utils/metrics'; // Prometheus metrics for observability
        import os from 'os';

        // --- Configuration ---
        const PORT = process.env.PORT || 4001;
        const SERVICE_NAME = process.env.SERVICE_NAME || 'dbql-transactions-service';
        const SERVICE_VERSION = process.env.SERVICE_VERSION || '1.0.0';
        const LOGGER: ILogger = new ConsoleLogger(SERVICE_NAME);
        const AUTH_SERVICE = new AuthService();
        const METRICS = new PrometheusMetrics(SERVICE_NAME);

        // --- Custom Scalar: JSON (for flexible data types) ---
        const JSONScalar = new GraphQLScalarType({
          name: 'JSON',
          description: 'The `JSON` scalar type represents JSON values as specified by ECMA-404',
          serialize(value: any): any {
            return value;
          },
          parseValue(value: any): any {
            return value;
          },
          parseLiteral(ast): any {
            switch (ast.kind) {
              case Kind.STRING:
              case Kind.BOOLEAN:
                return ast.value;
              case Kind.INT:
              case Kind.FLOAT:
                return parseFloat(ast.value);
              case Kind.OBJECT:
                return JSON.parse(JSON.stringify(ast)); // Deep clone objects
              case Kind.LIST:
                return JSON.parse(JSON.stringify(ast)); // Deep clone lists
              default:
                return null;
            }
          },
        });

        // --- Dynamic Schema Generation from DBQL Query Definitions ---
        // This is a powerful feature: automatically generating GraphQL types
        // based on pre-defined DBQL queries and their expected output structure.
        // For expansion, we'll create a more specific schema,
        // but keep the JSON scalar for dynamic results.

        interface DBQLServiceDefinition {
          name: string;
          dbqlQuery: string;
          description: string;
          arguments: { [key: string]: string }; // Argument name -> GraphQL Type (e.g., "id": "ID!", "limit": "Int")
          outputType: string; // GraphQL output type name (e.g., "Transaction", "AccountSummary")
          // In a full implementation, `outputType` could reference dynamically generated types
          // based on DBQL query result introspection.
        }

        // Pre-defined DBQL services to expose. In a real system, these would be loaded from a config store.
        const DBQL_SERVICE_DEFINITIONS: DBQLServiceDefinition[] = [
          {
            name: "getTransactionsByAccount",
            dbqlQuery: "SELECT * FROM Transactions WHERE accountId = :accountId LIMIT :limit",
            description: "Fetches transactions for a given account.",
            arguments: { accountId: "ID!", limit: "Int = 10" },
            outputType: "Transaction"
          },
          {
            name: "getCustomerProfile",
            dbqlQuery: "SELECT name, email, address FROM Customers WHERE customerId = :customerId",
            description: "Retrieves a customer's profile details.",
            arguments: { customerId: "ID!" },
            outputType: "CustomerProfile"
          },
          {
              name: "getFraudAlerts",
              dbqlQuery: "CALL FraudDetection.getAlerts(:threshold)",
              description: "Retrieves recent fraud alerts above a certain threshold.",
              arguments: { threshold: "Float!" },
              outputType: "FraudAlert"
          }
          // Add more DBQL services here
        ];

        // Dynamically build typeDefs and resolvers based on DBQL_SERVICE_DEFINITIONS
        let queryFields = '';
        let typeDefinitions = `
          scalar JSON

          type Transaction {
            id: ID!
            accountId: ID!
            amount: Float!
            currency: String!
            type: String!
            timestamp: String!
            description: String
            recipient: String
          }

          type CustomerProfile {
            customerId: ID!
            name: String!
            email: String!
            address: String
            phone: String
          }

          type FraudAlert {
            alertId: ID!
            timestamp: String!
            type: String!
            severity: String!
            description: String!
            entityId: ID!
            resolutionStatus: String
          }
          # Placeholder for other types inferred from DBQL
          # type GenericDBQLResult { key: String, value: JSON } # Fallback for complex results
        `;

        const dynamicResolvers: { [key: string]: Function } = {};

        DBQL_SERVICE_DEFINITIONS.forEach(service => {
          // Construct GraphQL argument string for the field
          const args = Object.entries(service.arguments)
                             .map(([argName, argType]) => `${argName}: ${argType}`)
                             .join(', ');
          queryFields += `
            ${service.name}(${args}): [${service.outputType}] @shareable @cost(complexity: 5, multipliers: ["limit"])
          `;

          // Create a resolver for each defined DBQL service
          dynamicResolvers[service.name] = async (
            _: any,
            args: { [key: string]: any },
            context: { auth: AuthContext, logger: ILogger, metrics: PrometheusMetrics }
          ): Promise<DBQLExecutionResult | any[]> => {
            const { auth, logger, metrics } = context;

            // --- Authentication and Authorization Check ---
            if (!auth.isAuthenticated) {
              logger.warn(`Unauthorized access attempt for DBQL service: ${service.name}`);
              metrics.incrementCounter('dbql_graphql_auth_failures_total');
              throw new Error('Authentication required to access DBQL services.');
            }
            if (!AUTH_SERVICE.hasPermission(auth.userRoles, `dbql:${service.name}:execute`)) {
                logger.warn(`Unauthorized role for DBQL service '${service.name}' for user '${auth.userId}'.`);
                metrics.incrementCounter('dbql_graphql_auth_denials_total');
                throw new Error('Unauthorized to execute this DBQL query.');
            }

            logger.info(`Executing DBQL query via GraphQL: ${service.name} with args: ${JSON.stringify(args)}`);
            metrics.incrementCounter(`dbql_graphql_query_total`, { query_name: service.name });
            const timer = metrics.startTimer(`dbql_graphql_query_duration_seconds`, { query_name: service.name });

            try {
              // Convert GraphQL args to DBQL params
              const dbqlParams = args; // Assuming direct mapping for now
              const results = await dbqlEngine.execute(service.dbqlQuery, dbqlParams);
              metrics.incrementCounter(`dbql_graphql_query_success_total`, { query_name: service.name });
              return results; // Return results as a JSON scalar, or map to specific types
            } catch (error) {
              logger.error(`Error executing DBQL query '${service.name}':`, error);
              metrics.incrementCounter(`dbql_graphql_query_failure_total`, { query_name: service.name });
              throw new Error(`Failed to execute DBQL query '${service.name}': ${error.message}`);
            } finally {
              timer(); // Stop the timer and record duration
            }
          };
        });

        // Assemble the final typeDefs
        const typeDefs = gql`
          ${typeDefinitions}

          extend type Query {
            ${queryFields}
          }
        `;

        // Assemble the final resolvers
        const resolvers = {
          JSON: JSONScalar, // Register the custom JSON scalar
          Query: dynamicResolvers,
          // If using federation and extending other types, add __resolveReference
        };

        // --- Apollo Server Instance ---
        export const dbqlApolloServer = new ApolloServer({
          schema: buildFederatedSchema([{ typeDefs, resolvers }]),
          context: async ({ req }) => {
            // Build context for authentication and logging
            const token = req.headers.authorization || '';
            const authContext = await AUTH_SERVICE.authenticate(token); // Authenticate user
            return {
              auth: authContext,
              logger: LOGGER,
              metrics: METRICS,
              dbqlEngine: dbqlEngine // Make engine available in context if needed
            };
          },
          formatError: (error) => {
            LOGGER.error('GraphQL Error:', error);
            // Optionally hide internal error details in production
            return process.env.NODE_ENV === 'production' && !error.extensions?.code ?
                   new Error('Internal server error occurred.') : error;
          },
          // Enable GraphQL Playground or Studio for development
          introspection: process.env.NODE_ENV !== 'production',
          playground: process.env.NODE_ENV !== 'production',
        });

        // --- Server Startup ---
        if (require.main === module) { // Only listen if directly run
          dbqlApolloServer.listen({ port: PORT }).then(({ url }) => {
            LOGGER.info(`🚀 DBQL GraphQL federation service '${SERVICE_NAME}' ready at ${url}`);
            LOGGER.info(`Hostname: ${os.hostname()}, PID: ${process.pid}`);
            METRICS.incrementCounter('dbql_graphql_service_starts_total');
            // Expose Prometheus metrics endpoint
            // METRICS.exposeMetricsEndpoint('/metrics', PORT + 1); // Example, run separate metrics server
          });
        }

        // Dummy/Placeholder DBQL Engine and Auth Service for compilation
        // In a real scenario, these would be robust, fully implemented modules.
        export const dbqlEngine = {
          async execute(query: string, params: { [key: string]: any }): Promise<DBQLExecutionResult> {
            LOGGER.debug(`Simulating DBQL execution: ${query} with params: ${JSON.stringify(params)}`);
            // Simulate database latency
            await new Promise(resolve => setTimeout(Math.random() * 500, resolve));
            // Simulate various results based on query name or structure
            if (query.includes("Transactions")) {
                const limit = params.limit || 10;
                const transactions = [];
                for (let i = 0; i < limit; i++) {
                    transactions.push({
                        id: `T-${uuidv4()}`,
                        accountId: params.accountId,
                        amount: parseFloat((Math.random() * 1000).toFixed(2)),
                        currency: 'USD',
                        type: i % 2 === 0 ? 'DEBIT' : 'CREDIT',
                        timestamp: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(), // Last 30 days
                        description: `Transaction ${i + 1} for account ${params.accountId}`,
                        recipient: `Merchant ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
                    });
                }
                return transactions;
            } else if (query.includes("Customers")) {
                return [{
                    customerId: params.customerId,
                    name: `Customer ${params.customerId}`,
                    email: `${params.customerId.toLowerCase()}@demobank.com`,
                    address: `123 Main St, Anytown, USA`,
                    phone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`
                }];
            } else if (query.includes("FraudDetection")) {
                return [{
                    alertId: `F-${uuidv4()}`,
                    timestamp: new Date().toISOString(),
                    type: 'Suspicious Activity',
                    severity: 'HIGH',
                    description: `Multiple large transactions from unusual location. Threshold: ${params.threshold}`,
                    entityId: uuidv4(),
                    resolutionStatus: 'OPEN'
                }]
            }
            return { data: `DBQL results for: ${query}`, params: params, simulated: true };
          },
        };

        export type DBQLExecutionResult = any;

        export interface DBQLQueryConfig {
            query: string;
            params: { [key: string]: any };
        }

        export class AuthService {
            public async authenticate(token: string): Promise<AuthContext> {
                if (token && token.startsWith('Bearer ')) {
                    const jwt = token.substring(7);
                    // Simulate JWT validation and parsing
                    if (jwt === "VALID_DEMOBANK_TOKEN") {
                        return { isAuthenticated: true, userId: 'demo_user', userRoles: ['admin', 'developer', 'dbql:getTransactionsByAccount:execute', 'dbql:getCustomerProfile:execute'] };
                    }
                }
                return { isAuthenticated: false, userId: 'anonymous', userRoles: [] };
            }

            public hasPermission(userRoles: string[], requiredPermission: string): boolean {
                return userRoles.includes(requiredPermission) || userRoles.includes('admin'); // 'admin' role grants all permissions
            }
        }

        export interface AuthContext {
            isAuthenticated: boolean;
            userId: string;
            userRoles: string[];
        }

        export interface ILogger {
            info(message: string, ...args: any[]): void;
            warn(message: string, ...args: any[]): void;
            error(message: string, ...args: any[]): void;
            debug(message: string, ...args: any[]): void;
        }

        export class ConsoleLogger implements ILogger {
            private prefix: string;
            constructor(serviceName: string) {
                this.prefix = `[${serviceName}]`;
            }
            info(message: string, ...args: any[]): void { console.log(`${this.prefix} INFO: ${message}`, ...args); }
            warn(message: string, ...args: any[]): void { console.warn(`${this.prefix} WARN: ${message}`, ...args); }
            error(message: string, ...args: any[]): void { console.error(`${this.prefix} ERROR: ${message}`, ...args); }
            debug(message: string, ...args: any[]): void { if (process.env.NODE_ENV !== 'production') console.debug(`${this.prefix} DEBUG: ${message}`, ...args); }
        }

        export class PrometheusMetrics {
            private metrics: { [key: string]: number } = {};
            private timers: { [key: string]: number } = {};
            private serviceName: string;

            constructor(serviceName: string) {
                this.serviceName = serviceName;
            }

            incrementCounter(name: string, labels?: { [key: string]: string }) {
                const key = this._formatMetricKey(name, labels);
                this.metrics[key] = (this.metrics[key] || 0) + 1;
                // console.log(`[METRIC] Counter ${key}: ${this.metrics[key]}`);
            }

            startTimer(name: string, labels?: { [key: string]: string }): () => void {
                const key = this._formatMetricKey(name, labels);
                this.timers[key] = process.hrtime.bigint().valueOf();
                return () => {
                    const endTime = process.hrtime.bigint().valueOf();
                    const durationMs = Number(endTime - this.timers[key]) / 1_000_000;
                    // console.log(`[METRIC] Timer ${key} duration: ${durationMs}ms`);
                    // In a real Prometheus client, this would be a histogram or summary metric
                    // For simplicity, we just log the duration for now
                    delete this.timers[key];
                };
            }

            private _formatMetricKey(name: string, labels?: { [key: string]: string }): string {
                let key = `${this.serviceName}_${name}`;
                if (labels) {
                    const labelStrings = Object.keys(labels).sort().map(k => `${k}="${labels[k]}"`);
                    key += `{${labelStrings.join(',')}}`;
                }
                return key;
            }

            // In a real application, you'd integrate with a Prometheus client library
            // public exposeMetricsEndpoint(path: string, port: number) {
            //     const express = require('express');
            //     const app = express();
            //     app.get(path, (req, res) => {
            //         // Format metrics for Prometheus
            //         let output = '';
            //         for (const key in this.metrics) {
            //             output += `# TYPE ${key.split('{')[0]} counter\n`;
            //             output += `${key} ${this.metrics[key]}\n`;
            //         }
            //         res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
            //         res.send(output);
            //     });
            //     app.listen(port, () => console.log(`Prometheus metrics exposed on http://localhost:${port}${path}`));
            // }
        }
        ```

---

## UI/UX Integration: The Nexus of Human-AI Interaction
The user experience is paramount. These integrations are not merely backend plumbing; they are surfaced through intuitive, powerful interfaces designed for various personas within the Demo Bank ecosystem.

*   **API Gateway (Developer Portal & Service Registry):**
    *   **"Publish to Apigee/AWS API Gateway" Button:** Within the internal `Service Registry` UI, adjacent to each registered microservice's definition, a prominent button allows one-click publication. A modal appears, prompting for optional API Product bundling, security profile selection (e.g., "OAuth2 Public Client," "Internal JWT"), and environment selection.
    *   **Automated OpenAPI Generation:** The system will automatically generate and display OpenAPI (Swagger) specifications for each exposed API, enhancing developer self-service.
    *   **Live Traffic Dashboard:** A dedicated dashboard visualizes API request/response logs, latency, error rates, and traffic patterns directly sourced from the integrated API management platform's analytics.
    *   **Monetization Configuration:** For business users, a "Monetization" tab enables defining usage plans, pricing tiers, and subscription models for API products.

*   **Graph Explorer (Data Insights Workbench):**
    *   **"Export to Neo4j/Neptune" Option:** In the `Data Insights Workbench`, following any graph query or visualization, an "Export Graph Data" dropdown menu will feature options for "Neo4j," "Amazon Neptune," and "Generic CSV/JSON."
    *   **Export Configuration Modal:** Upon selection, a sophisticated modal will appear:
        *   **Target Instance Details:** Users provide credentials and endpoint for their chosen graph database.
        *   **Schema Mapping:** An interactive interface allows users to confirm or adjust inferred node labels, relationship types, and property mappings from the source data to the target graph schema.
        *   **Data Masking/Anonymization:** Options to apply pre-configured masking policies to sensitive data fields before export, ensuring compliance.
        *   **Export Scope & Filters:** Define the subgraph to export (e.g., "all customers in region X," "transactions related to fraud alerts," "data from last 90 days").
        *   **Progress Monitor:** A real-time progress bar and log viewer for large exports, with email/notification alerts upon completion or failure.
    *   **Direct Visualization Link:** After a successful export, the UI provides a direct link to open the exported data in Neo4j Bloom or a similar visualization tool, pre-configured with the relevant query.

*   **DBQL (Intelligent Query Studio):**
    *   **"Deploy as GraphQL Endpoint" Button:** Within the `DBQL Query Editor`, after a query has been authored, tested, and validated, a "Deploy as GraphQL Endpoint" button becomes active.
    *   **Endpoint Configuration & Schema Preview Modal:** This modal allows:
        *   **Endpoint Naming & Description:** Assign a unique name and description for the new GraphQL field.
        *   **Argument Mapping:** Visually map DBQL query parameters to GraphQL arguments, specifying types, default values, and descriptions.
        *   **Schema Preview:** A live preview of the generated GraphQL type definitions and query schema fragment.
        *   **Authorization Policy Selection:** Choose from pre-defined role-based access control (RBAC) policies or define custom JWT claims required for accessing the endpoint.
        *   **Version Management:** Associate the endpoint with an API version.
        *   **Deployment Status:** Real-time feedback on the deployment status, linking to the Apollo Federation Gateway for verification.
    *   **GraphQL Playground Integration:** The DBQL Query Studio will integrate a live GraphQL Playground where developers can test their newly deployed DBQL-backed GraphQL endpoints immediately.
    *   **Natural Language to DBQL (AI-Powered):** An advanced input mode in the DBQL Query Editor allows users to type queries in natural language (e.g., "Show me all transactions greater than $1000 for accounts in New York last month"), which is then parsed and translated into optimized DBQL by an integrated AI engine, greatly reducing the barrier to entry for complex data analysis.

---

## Conclusion: The Horizon of Intelligent Interconnectivity

This integration plan for the API Gateway, Graph Explorer, and DBQL modules represents a monumental leap forward in Demo Bank's digital capabilities. By meticulously connecting our powerful internal tools with best-in-class external platforms and infusing AI at critical junctures, we are not just building software; we are architecting a future-proof, intelligent, and exponentially valuable digital nervous system. This infrastructure will empower developers to innovate faster, analysts to uncover deeper insights, and the entire organization to operate with unprecedented agility and intelligence, setting the stage for a new era of financial excellence. Every line of code, every architectural decision, and every UI element is crafted to deliver a seamless, secure, and profoundly impactful experience, making our platform an indispensable asset in the competitive landscape.