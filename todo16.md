# The Creator's Codex - Integration Plan, Part 16/10
## Module Integrations: The Connectivity Suite - Publisher Edition

This document presents the definitive, commercial-grade integration blueprint for the platform's foundational connectivity modules: **Connect**, **Events**, **Logic Apps**, ****Functions**, and **Data Factory**. These modules, acting as the intelligent nervous system of our digital ecosystem, derive their unparalleled power from seamless, robust integration with a diverse array of external communication, data, and business process platforms. This deep integration is engineered to unlock unprecedented levels of automation, real-time responsiveness, and data-driven intelligence, transforming raw data into actionable insights and routine tasks into streamlined, autonomous processes.

---

## 1. Connect Module: The Weaver's Loom - Orchestrating Digital Interactions

### Core Concept: The Universal Automation Fabric
The Connect module transcends simple automation; it is a sophisticated, AI-augmented universal automation fabric. It empowers users to design, deploy, and manage complex workflows that intelligently interact with the external world. Its "connectors" are not mere API wrappers but highly intelligent, configurable agents capable of adaptive communication, dynamic data mapping, and self-healing integration patterns. This module is the central hub for external service orchestration, enabling the platform to send notifications, trigger actions, synchronize data, and manage customer interactions across a myriad of digital channels and enterprise systems.

### Key API Integrations: Bridging Our Platform to the World's Digital Ecosystem

#### a. Twilio API: Mastering Real-time Omnichannel Communication (SMS, Voice, WhatsApp)
- **Purpose:** To provide a comprehensive suite of real-time communication capabilities within automated workflows. This includes sending personalized SMS, orchestrating interactive voice calls, and managing conversations on popular messaging platforms like WhatsApp.
- **Architectural Approach:** The Connect module's backend incorporates a highly secure, scalable, and fault-tolerant microservice dedicated to Twilio interactions. This service encapsulates the full Twilio SDK, managing credentials, retries, webhook validation, and message queuing. Workflow nodes, such as "Send SMS," "Initiate Call," "Send WhatsApp Message," and "Handle Inbound Message," expose intuitive interfaces to users, abstracting the complexity of Twilio's APIs while providing robust capabilities. Dynamic sender numbers, intelligent routing, and delivery status tracking are built-in.
- **Code Examples:**
  - **TypeScript (Backend Twilio Communication Service):**
    ```typescript
    // services/connectors/twilioService.ts
    import twilio, { Twilio } from 'twilio';
    import { Request, Response } from 'express'; // For webhook handling

    export interface SmsMessage {
      to: string;
      body: string;
      from?: string; // Optional, defaults to primary provisioned number
      mediaUrl?: string[]; // For MMS
      statusCallback?: string; // URL for delivery reports
    }

    export interface CallInitiation {
      to: string;
      from?: string;
      twiml?: string; // TwiML instructions for the call
      url?: string; // URL to fetch TwiML from
      statusCallback?: string;
    }

    export interface MessageWebhookPayload {
      MessageSid: string;
      SmsSid: string;
      AccountSid: string;
      From: string;
      To: string;
      Body: string;
      // ... other Twilio webhook fields
    }

    export class TwilioCommunicationService {
      private client: Twilio;
      private defaultFromNumber: string;
      private webhookSecret: string; // For validating Twilio requests

      constructor(
        accountSid: string,
        authToken: string,
        defaultFromNumber: string,
        webhookSecret: string
      ) {
        if (!accountSid || !authToken || !defaultFromNumber || !webhookSecret) {
          throw new Error("Twilio credentials and secret must be provided.");
        }
        this.client = twilio(accountSid, authToken);
        this.defaultFromNumber = defaultFromNumber;
        this.webhookSecret = webhookSecret;
        console.log("TwilioCommunicationService initialized.");
      }

      /**
       * Sends an SMS message with advanced options.
       * @param messageData - Object containing 'to', 'body', and optional 'from', 'mediaUrl', 'statusCallback'.
       * @returns The message SID on successful send.
       */
      public async sendSms(messageData: SmsMessage): Promise<string> {
        try {
          const message = await this.client.messages.create({
            body: messageData.body,
            from: messageData.from || this.defaultFromNumber,
            to: messageData.to,
            mediaUrl: messageData.mediaUrl,
            statusCallback: messageData.statusCallback,
          });
          console.log(`[Twilio] SMS sent successfully. SID: ${message.sid}, Status: ${message.status}`);
          return message.sid;
        } catch (error: any) {
          console.error(`[Twilio] Failed to send SMS to ${messageData.to}:`, error.message);
          throw new Error(`Twilio SMS error: ${error.message}`);
        }
      }

      /**
       * Initiates an outgoing voice call.
       * @param callData - Object containing 'to', and either 'twiml' or 'url'.
       * @returns The call SID.
       */
      public async initiateCall(callData: CallInitiation): Promise<string> {
        try {
          const call = await this.client.calls.create({
            to: callData.to,
            from: callData.from || this.defaultFromNumber,
            twiml: callData.twiml,
            url: callData.url,
            statusCallback: callData.statusCallback,
            statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
          });
          console.log(`[Twilio] Call initiated successfully. SID: ${call.sid}, Status: ${call.status}`);
          return call.sid;
        } catch (error: any) {
          console.error(`[Twilio] Failed to initiate call to ${callData.to}:`, error.message);
          throw new Error(`Twilio Call error: ${error.message}`);
        }
      }

      /**
       * Validates an incoming Twilio webhook request.
       * @param authToken - The auth token used by Twilio to sign requests (often TWILIO_AUTH_TOKEN).
       * @param signature - The X-Twilio-Signature header.
       * @param url - The full URL of the request.
       * @param params - The POST parameters from the request body.
       * @returns True if the request is valid, false otherwise.
       */
      public validateWebhookRequest(authToken: string, signature: string, url: string, params: object): boolean {
        return twilio.validateRequest(authToken, signature, url, params);
      }

      /**
       * Placeholder for handling an inbound SMS webhook.
       * In a real system, this would trigger an internal event or workflow.
       * @param req - Express request object.
       * @param res - Express response object.
       */
      public async handleInboundSmsWebhook(req: Request, res: Response): Promise<void> {
        // Example validation using the instance's auth token (should be TWILIO_AUTH_TOKEN for validation)
        const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || ''; // Re-fetch or pass securely
        const signature = req.headers['x-twilio-signature'] as string;
        const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        const params = req.body; // Assuming body-parser middleware is used

        if (!this.validateWebhookRequest(twilioAuthToken, signature, url, params)) {
          console.warn("[Twilio Webhook] Invalid webhook signature detected.");
          res.status(403).send('Unauthorized');
          return;
        }

        const payload: MessageWebhookPayload = req.body;
        console.log(`[Twilio Webhook] Inbound SMS received from ${payload.From}: "${payload.Body}"`);

        // Emit an internal event for the Events module
        // For example:
        // internalEventPublisher.publish('twilio.inboundSms', payload);

        // Or trigger a specific Connect workflow based on sender/keywords
        // workflowEngine.triggerWorkflow('inboundSmsProcessor', payload);

        res.type('text/xml').send('<Response><Message>Thanks for your message!</Message></Response>');
      }
    }

    // Export an initialized instance for convenience, assuming env vars are set
    export const twilioCommunicationService = new TwilioCommunicationService(
      process.env.TWILIO_ACCOUNT_SID || '',
      process.env.TWILIO_AUTH_TOKEN || '',
      process.env.TWILIO_PHONE_NUMBER || '',
      process.env.TWILIO_WEBHOOK_SECRET || '' // A separate secret for internal webhook validation if needed
    );

    // Legacy sendSms, for compatibility or direct usage, now leveraging the class
    export async function sendSms(to: string, body: string, from?: string, mediaUrl?: string[]): Promise<string> {
      return twilioCommunicationService.sendSms({ to, body, from, mediaUrl });
    }
    ```

#### b. SendGrid API: Enterprise-Grade Email Delivery and Engagement
- **Purpose:** To facilitate high-volume, secure, and personalized transactional and marketing email communications directly from platform workflows, ensuring deliverability and providing detailed analytics.
- **Architectural Approach:** A dedicated Python-based microservice or module, `EmailDeliveryService`, wraps the SendGrid SDK. This service handles advanced features like dynamic template substitution, attachment management, unsubscribe group management, and robust error handling with intelligent retries. It integrates with our internal eventing system to publish email delivery statuses (delivered, bounced, opened, clicked) for analytics and workflow triggers.
- **Code Examples:**
  - **Python (Backend SendGrid Service - Advanced Features):**
    ```python
    # services/connectors/sendgrid_email_service.py
    import os
    import json
    from typing import List, Dict, Any, Optional
    from sendgrid import SendGridAPIClient
    from sendgrid.helpers.mail import Mail, Email, Personalization, Attachment
    import base64
    import logging

    logger = logging.getLogger(__name__)

    class SendGridEmailService:
        def __init__(self, api_key: str, default_from_email: str, default_from_name: str = "Demo Bank"):
            if not api_key:
                raise ValueError("SendGrid API Key must be provided.")
            self.sg = SendGridAPIClient(api_key)
            self.default_from_email = Email(default_from_email, default_from_name)
            logger.info("SendGridEmailService initialized.")

        def _create_attachment(self, file_content_base64: str, file_name: str, file_type: str) -> Attachment:
            """Helper to create a SendGrid Attachment object."""
            attachment = Attachment()
            attachment.file_content = file_content_base64
            attachment.file_name = file_name
            attachment.file_type = file_type
            attachment.disposition = "attachment"
            return attachment

        def send_email(
            self,
            to_emails: List[str] | str,
            subject: str,
            html_content: Optional[str] = None,
            plain_text_content: Optional[str] = None,
            from_email: Optional[Email] = None,
            attachments: Optional[List[Dict[str, str]]] = None, # [{'file_content_base64': '...', 'file_name': '...', 'file_type': '...'}]
            category: Optional[str] = None,
            custom_args: Optional[Dict[str, Any]] = None,
            send_at: Optional[int] = None, # Unix timestamp for scheduled send
            template_id: Optional[str] = None, # For dynamic templating
            dynamic_template_data: Optional[Dict[str, Any]] = None, # Data for dynamic templates
            reply_to: Optional[Email] = None,
            cc_emails: Optional[List[str] | str] = None,
            bcc_emails: Optional[List[str] | str] = None,
        ) -> int:
            """
            Sends a sophisticated email using SendGrid, supporting templates, attachments, and scheduling.
            """
            message = Mail()
            message.from_email = from_email if from_email else self.default_from_email
            message.subject = subject

            # Add content type (HTML or Plain Text)
            if html_content:
                message.html = html_content
            if plain_text_content:
                message.plain_text = plain_text_content
            if not html_content and not plain_text_content and not template_id:
                 raise ValueError("Email must have HTML content, plain text content, or a template ID.")

            # Handle recipients using Personalization for advanced features
            personalization = Personalization()
            if isinstance(to_emails, str):
                to_emails = [to_emails]
            for email_addr in to_emails:
                personalization.add_to(Email(email_addr))

            if isinstance(cc_emails, str):
                cc_emails = [cc_emails]
            if cc_emails:
                for email_addr in cc_emails:
                    personalization.add_cc(Email(email_addr))

            if isinstance(bcc_emails, str):
                bcc_emails = [bcc_emails]
            if bcc_emails:
                for email_addr in bcc_emails:
                    personalization.add_bcc(Email(email_addr))

            if dynamic_template_data:
                # Add dynamic data to personalization block
                personalization.dynamic_template_data = dynamic_template_data

            message.add_personalization(personalization)

            # Add template ID if specified
            if template_id:
                message.template_id = template_id

            # Add attachments
            if attachments:
                for attachment_data in attachments:
                    try:
                        message.add_attachment(self._create_attachment(
                            attachment_data['file_content_base64'],
                            attachment_data['file_name'],
                            attachment_data['file_type']
                        ))
                    except KeyError as e:
                        logger.error(f"Missing key in attachment data: {e}")
                        raise ValueError(f"Attachment data must contain 'file_content_base64', 'file_name', 'file_type'. Missing: {e}")

            # Add category for analytics
            if category:
                message.add_category(category)

            # Add custom arguments
            if custom_args:
                for key, value in custom_args.items():
                    message.add_custom_arg(key, str(value)) # Custom args must be strings

            # Schedule email
            if send_at:
                message.send_at = send_at

            # Reply-to address
            if reply_to:
                message.reply_to = reply_to

            try:
                response = self.sg.send(message)
                logger.info(f"Email sent with status code: {response.status_code}")
                if 200 <= response.status_code < 300:
                    logger.debug(f"SendGrid Email API Response: {response.body}")
                    # In a real system, publish an event about email sent
                    # event_publisher.publish('email.sent', {'to': to_emails, 'subject': subject, 'status_code': response.status_code})
                else:
                    logger.error(f"SendGrid Email API Error - Status: {response.status_code}, Body: {response.body}")
                    raise Exception(f"SendGrid error: {response.body}")
                return response.status_code
            except Exception as e:
                logger.exception(f"Failed to send email via SendGrid to {to_emails}: {e}")
                # Potentially log to a dead-letter queue or retry mechanism
                raise e

    # Export an initialized instance for consumption across the module
    sendgrid_email_service = SendGridEmailService(
        api_key=os.environ.get('SENDGRID_API_KEY') or '',
        default_from_email=os.environ.get('SENDGRID_DEFAULT_FROM_EMAIL') or 'noreply@demobank.com',
        default_from_name=os.environ.get('SENDGRID_DEFAULT_FROM_NAME') or 'Demo Bank Notifications'
    )

    # Legacy function, now leveraging the class
    def send_email(to_email: str, subject: str, html_content: str, from_email: Optional[str] = None):
        return sendgrid_email_service.send_email(
            to_emails=[to_email],
            subject=subject,
            html_content=html_content,
            from_email=Email(from_email) if from_email else None
        )
    ```

#### c. Salesforce API: Unified CRM Automation and Data Synchronization
- **Purpose:** To enable comprehensive synchronization and automation between platform workflows and Salesforce CRM. This includes creating/updating leads, contacts, accounts, opportunities, and custom objects, as well as querying Salesforce data.
- **Architectural Approach:** A dedicated connector service (e.g., `SalesforceSyncService`) built using a robust Salesforce SDK (e.g., `jsforce` for Node.js). This service manages OAuth 2.0 authentication, API call limits, batch processing, and robust error handling. Workflow nodes like "Create Salesforce Lead," "Update Salesforce Contact," and "Query Salesforce Data" provide declarative interfaces. Smart data mapping tools allow users to visually link platform data fields to Salesforce fields.
- **Code Examples:**
  - **TypeScript (Backend Salesforce Integration Service):**
    ```typescript
    // services/connectors/salesforceService.ts
    import jsforce from 'jsforce';
    import { Connection, QueryResult } from 'jsforce';

    export interface SalesforceLead {
      FirstName: string;
      LastName: string;
      Company: string;
      Email: string;
      Status?: string;
      LeadSource?: string;
      // Add other relevant Lead fields
      [key: string]: any; // Allow for dynamic custom fields
    }

    export interface SalesforceContact {
      FirstName: string;
      LastName: string;
      AccountId?: string;
      Email: string;
      Phone?: string;
      // Add other relevant Contact fields
      [key: string]: any;
    }

    export class SalesforceIntegrationService {
      private conn: Connection | null = null;
      private readonly loginUrl: string;
      private readonly consumerKey: string;
      private readonly consumerSecret: string;
      private readonly username: string;
      private readonly password: string; // Consider more secure auth like JWT bearer flow

      constructor(
        loginUrl: string,
        consumerKey: string,
        consumerSecret: string,
        username: string,
        password_with_token: string // password + security token
      ) {
        this.loginUrl = loginUrl;
        this.consumerKey = consumerKey;
        this.consumerSecret = consumerSecret;
        this.username = username;
        this.password = password_with_token;
        console.log("SalesforceIntegrationService initialized.");
      }

      private async ensureConnection(): Promise<Connection> {
        if (this.conn && this.conn.isLoggedIn()) {
          return this.conn;
        }

        console.log("[Salesforce] Attempting to connect to Salesforce...");
        this.conn = new jsforce.Connection({
          loginUrl: this.loginUrl,
          // InstanceUrl can be discovered after initial login if needed
        });

        try {
          await this.conn.login(this.username, this.password);
          console.log(`[Salesforce] Connected to Salesforce. Instance URL: ${this.conn.instanceUrl}`);
          return this.conn;
        } catch (error: any) {
          console.error("[Salesforce] Failed to connect to Salesforce:", error.message);
          this.conn = null; // Clear connection on failure
          throw new Error(`Salesforce connection error: ${error.message}`);
        }
      }

      /**
       * Creates a new Lead in Salesforce.
       * @param leadData - Data for the new Lead.
       * @returns The ID of the created Lead.
       */
      public async createLead(leadData: SalesforceLead): Promise<string> {
        const conn = await this.ensureConnection();
        try {
          const result = await conn.sobject("Lead").create(leadData);
          if (!result.success) {
            throw new Error(`Failed to create Lead: ${result.errors.map(e => e.message).join(', ')}`);
          }
          console.log(`[Salesforce] Lead created successfully. ID: ${result.id}`);
          return result.id;
        } catch (error: any) {
          console.error("[Salesforce] Error creating Lead:", error.message);
          throw error;
        }
      }

      /**
       * Updates an existing record in Salesforce.
       * @param sObjectType - The Salesforce object type (e.g., 'Contact', 'Account').
       * @param id - The ID of the record to update.
       * @param updateData - The fields and values to update.
       * @returns True if successful.
       */
      public async updateRecord(sObjectType: string, id: string, updateData: any): Promise<boolean> {
        const conn = await this.ensureConnection();
        try {
          const result = await conn.sobject(sObjectType).update({ Id: id, ...updateData });
          if (!result.success) {
            throw new Error(`Failed to update ${sObjectType} (ID: ${id}): ${result.errors.map(e => e.message).join(', ')}`);
          }
          console.log(`[Salesforce] ${sObjectType} (ID: ${id}) updated successfully.`);
          return true;
        } catch (error: any) {
          console.error(`[Salesforce] Error updating ${sObjectType} (ID: ${id}):`, error.message);
          throw error;
        }
      }

      /**
       * Queries Salesforce records using SOQL.
       * @param soqlQuery - The SOQL query string.
       * @returns QueryResult containing records and metadata.
       */
      public async queryRecords<T>(soqlQuery: string): Promise<QueryResult<T>> {
        const conn = await this.ensureConnection();
        try {
          const result = await conn.query<T>(soqlQuery);
          console.log(`[Salesforce] Query executed. Total records: ${result.totalSize}`);
          return result;
        } catch (error: any) {
          console.error("[Salesforce] Error querying records:", error.message);
          throw error;
        }
      }

      // Potentially add methods for upsert, delete, describe, etc.
    }

    export const salesforceIntegrationService = new SalesforceIntegrationService(
      process.env.SF_LOGIN_URL || 'https://login.salesforce.com',
      process.env.SF_CONSUMER_KEY || '',
      process.env.SF_CONSUMER_SECRET || '',
      process.env.SF_USERNAME || '',
      process.env.SF_PASSWORD_WITH_TOKEN || ''
    );
    ```

#### d. Stripe API: Seamless Financial Transactions and Subscription Management
- **Purpose:** To embed secure, robust payment processing, subscription management, and financial operations directly into platform workflows, supporting a wide range of business models.
- **Architectural Approach:** A Node.js microservice (`StripePaymentService`) using the official Stripe SDK. This service handles PCI compliance concerns by minimizing direct handling of sensitive card data (e.g., using Stripe Elements for tokenization). Features include creating charges, managing customers, handling subscriptions, issuing refunds, and processing webhooks for real-time payment event notifications. Strong emphasis on idempotency keys and error handling.
- **Code Examples:**
  - **TypeScript (Backend Stripe Payment Processing Service):**
    ```typescript
    // services/connectors/stripePaymentService.ts
    import Stripe from 'stripe';

    export interface ChargeDetails {
      amount: number; // in cents
      currency: string;
      source: string; // Token or ID of card/payment method
      customerId?: string;
      description?: string;
      metadata?: Stripe.Metadata;
      capture?: boolean; // Whether to immediately capture the charge
      idempotencyKey?: string; // For ensuring unique transactions
    }

    export interface CustomerDetails {
      email: string;
      name?: string;
      description?: string;
      payment_method?: string; // A payment method ID to attach
      invoice_settings?: {
        default_payment_method?: string;
      };
      metadata?: Stripe.Metadata;
    }

    export interface SubscriptionDetails {
      customerId: string;
      priceId: string; // The ID of the Stripe Price object
      cancelAtPeriodEnd?: boolean;
      defaultPaymentMethod?: string;
      trialPeriodDays?: number;
      metadata?: Stripe.Metadata;
    }

    export class StripePaymentService {
      private stripe: Stripe;

      constructor(apiKey: string) {
        if (!apiKey) {
          throw new Error("Stripe API Key must be provided.");
        }
        this.stripe = new Stripe(apiKey, {
          apiVersion: '2023-10-16', // Ensure using a specific API version
          typescript: true,
        });
        console.log("StripePaymentService initialized.");
      }

      /**
       * Creates a new Stripe Customer.
       * @param details - Customer details.
       * @returns The created customer object.
       */
      public async createCustomer(details: CustomerDetails): Promise<Stripe.Customer> {
        try {
          const customer = await this.stripe.customers.create({
            email: details.email,
            name: details.name,
            description: details.description,
            payment_method: details.payment_method, // Attach a payment method if provided
            invoice_settings: details.invoice_settings,
            metadata: details.metadata,
          });
          console.log(`[Stripe] Customer created: ${customer.id}`);
          return customer;
        } catch (error: any) {
          console.error("[Stripe] Error creating customer:", error.message);
          throw new Error(`Stripe customer creation error: ${error.message}`);
        }
      }

      /**
       * Attaches a Payment Method to a Customer.
       * @param customerId - ID of the customer.
       * @param paymentMethodId - ID of the payment method (e.g., from Stripe Elements).
       * @returns The attached payment method.
       */
      public async attachPaymentMethodToCustomer(customerId: string, paymentMethodId: string): Promise<Stripe.PaymentMethod> {
        try {
          const paymentMethod = await this.stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
          // Optionally set as default for invoices
          await this.stripe.customers.update(customerId, {
            invoice_settings: {
              default_payment_method: paymentMethod.id,
            },
          });
          console.log(`[Stripe] Payment Method ${paymentMethod.id} attached to Customer ${customerId}`);
          return paymentMethod;
        } catch (error: any) {
          console.error(`[Stripe] Error attaching payment method ${paymentMethodId} to customer ${customerId}:`, error.message);
          throw new Error(`Stripe payment method attachment error: ${error.message}`);
        }
      }

      /**
       * Creates a charge (one-time payment).
       * @param details - Charge details.
       * @returns The created charge object.
       */
      public async createCharge(details: ChargeDetails): Promise<Stripe.Charge> {
        try {
          const charge = await this.stripe.charges.create({
            amount: details.amount,
            currency: details.currency,
            source: details.source, // Payment source (e.g., 'tok_visa') or PaymentMethod ID
            customer: details.customerId,
            description: details.description,
            metadata: details.metadata,
            capture: details.capture ?? true, // Default to true (immediate capture)
          }, {
            idempotencyKey: details.idempotencyKey,
          });
          console.log(`[Stripe] Charge created/captured: ${charge.id}, Status: ${charge.status}`);
          return charge;
        } catch (error: any) {
          console.error("[Stripe] Error creating charge:", error.message);
          throw new Error(`Stripe charge error: ${error.message}`);
        }
      }

      /**
       * Creates a new subscription for a customer.
       * @param details - Subscription details.
       * @returns The created subscription object.
       */
      public async createSubscription(details: SubscriptionDetails): Promise<Stripe.Subscription> {
        try {
          const subscription = await this.stripe.subscriptions.create({
            customer: details.customerId,
            items: [{ price: details.priceId }],
            cancel_at_period_end: details.cancelAtPeriodEnd,
            default_payment_method: details.defaultPaymentMethod,
            trial_period_days: details.trialPeriodDays,
            metadata: details.metadata,
            expand: ['latest_invoice.payment_intent'] // Expand related objects
          });
          console.log(`[Stripe] Subscription created: ${subscription.id} for customer ${details.customerId}`);
          return subscription;
        } catch (error: any) {
          console.error("[Stripe] Error creating subscription:", error.message);
          throw new Error(`Stripe subscription error: ${error.message}`);
        }
      }

      /**
       * Handles incoming Stripe webhooks for real-time event processing.
       * @param rawBody - The raw request body as a string.
       * @param signature - The 'stripe-signature' header.
       * @returns The verified Stripe Event object.
       * @throws Error if the webhook signature is invalid.
       */
      public async handleWebhookEvent(rawBody: string, signature: string, webhookSecret: string): Promise<Stripe.Event> {
        try {
          const event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
          console.log(`[Stripe Webhook] Received event of type: ${event.type}`);
          // Emit internal event for the Events module
          // internalEventPublisher.publish(`stripe.${event.type}`, event.data.object);
          return event;
        } catch (error: any) {
          console.error("[Stripe Webhook] Error verifying webhook signature or processing event:", error.message);
          throw new Error(`Stripe webhook error: ${error.message}`);
        }
      }
    }

    export const stripePaymentService = new StripePaymentService(
      process.env.STRIPE_SECRET_KEY || ''
    );
    ```

---

## 2. Events Module: The Town Crier - The Pulse of the Digital Ecosystem

### Core Concept: The Distributed Event Fabric and Observability Hub
The Events module is the central nervous system for real-time awareness and reaction. It provides a highly scalable, resilient, and observable event fabric that allows both internal components and external systems to publish, subscribe, and react to critical business events. It enforces event schema validation, guarantees delivery semantics, and integrates with sophisticated message brokers to support a truly enterprise-wide event-driven architecture, fostering loose coupling and extreme scalability. This module also acts as a data pipeline for observability metrics, ensuring event integrity and flow can be monitored end-to-end.

### Key API Integrations: Spreading Awareness Across the Enterprise and Beyond

#### a. Amazon EventBridge: Cloud-Native Event Routing and Management
- **Purpose:** To publish and consume platform events to and from a custom AWS EventBridge event bus, enabling seamless integration with other AWS services, SaaS applications, and custom applications within the AWS ecosystem. It acts as a central router for our business events.
- **Architectural Approach:** The core Events service includes an `EventBridgeAdapter` that translates internal event formats into the CloudEvents standard for EventBridge. It supports custom event buses for environment separation (e.g., `dev-demobank-events`, `prod-demobank-events`), robust retry policies, and dead-letter queue configurations. It also provides functionality to create rules and targets in EventBridge for consuming external events.
- **Code Examples:**
  - **Go (Event Publishing & Consumption Service with Advanced Features):**
    ```go
    // services/event_publisher.go
    package services

    import (
        "context"
        "encoding/json"
        "fmt"
        "time"

        "github.com/aws/aws-sdk-go-v2/aws"
        "github.com/aws/aws-sdk-go-v2/config"
        "github.com/aws/aws-sdk-go-v2/service/eventbridge"
        "github.com/aws/aws-sdk-go-v2/service/eventbridge/types"
        "github.com/aws/aws-sdk-go-v2/service/sqs"
        "github.com/aws/aws-sdk-go-v2/service/sqs/model" // For SQS Message attributes
        "github.com/google/uuid" // For unique event IDs
        "log" // Using standard log for simplicity, could be structured logger
    )

    // EventSchema defines a standardized structure for platform events.
    type EventSchema struct {
        EventID      string                 `json:"eventId"`
        Source       string                 `json:"source"`
        DetailType   string                 `json:"detailType"` // Corresponds to EventBridge DetailType
        Timestamp    time.Time              `json:"timestamp"`
        CorrelationID string                 `json:"correlationId,omitempty"` // For tracing
        Payload      map[string]interface{} `json:"payload"`
        Metadata     map[string]string      `json:"metadata,omitempty"` // e.g., tenantId, userId
    }

    // EventBridgePublisher manages publishing events to AWS EventBridge.
    type EventBridgePublisher struct {
        client       *eventbridge.Client
        eventBusName string
        sourceName   string
    }

    // NewEventBridgePublisher creates a new instance of EventBridgePublisher.
    func NewEventBridgePublisher(ctx context.Context, eventBusName, sourceName string) (*EventBridgePublisher, error) {
        cfg, err := config.LoadDefaultConfig(ctx)
        if err != nil {
            return nil, fmt.Errorf("failed to load AWS config: %w", err)
        }
        client := eventbridge.NewFromConfig(cfg)
        log.Printf("EventBridgePublisher initialized for bus: %s, source: %s", eventBusName, sourceName)
        return &EventBridgePublisher{
            client:       client,
            eventBusName: eventBusName,
            sourceName:   sourceName,
        }, nil
    }

    // PublishToEventBridge publishes a structured event to the configured EventBridge bus.
    func (p *EventBridgePublisher) Publish(ctx context.Context, eventType string, payload map[string]interface{}, metadata map[string]string, correlationID string) error {
        eventID := uuid.New().String()
        timestamp := time.Now().UTC()

        eventDetail := EventSchema{
            EventID:      eventID,
            Source:       p.sourceName,
            DetailType:   eventType,
            Timestamp:    timestamp,
            CorrelationID: correlationID,
            Payload:      payload,
            Metadata:     metadata,
        }

        detailJSON, err := json.Marshal(eventDetail)
        if err != nil {
            return fmt.Errorf("failed to marshal event detail: %w", err)
        }

        input := &eventbridge.PutEventsInput{
            Entries: []types.PutEventsRequestEntry{
                {
                    Detail:       aws.String(string(detailJSON)),
                    DetailType:   aws.String(eventType),
                    Source:       aws.String(p.sourceName),
                    EventBusName: aws.String(p.eventBusName),
                    Time:         aws.Time(timestamp),
                },
            },
        }

        _, err = p.client.PutEvents(ctx, input)
        if err != nil {
            return fmt.Errorf("failed to put event to EventBridge: %w", err)
        }
        log.Printf("Event '%s' (ID: %s) published to EventBridge bus '%s'. Correlation ID: %s", eventType, eventID, p.eventBusName, correlationID)
        return nil
    }

    // EventConsumer for EventBridge events delivered via SQS.
    type EventBridgeSqsConsumer struct {
        sqsClient   *sqs.Client
        queueURL    string
        messageChan chan model.Message
        stopChan    chan struct{}
    }

    // NewEventBridgeSqsConsumer initializes a consumer for SQS-delivered EventBridge events.
    func NewEventBridgeSqsConsumer(ctx context.Context, queueURL string) (*EventBridgeSqsConsumer, error) {
        cfg, err := config.LoadDefaultConfig(ctx)
        if err != nil {
            return nil, fmt.Errorf("failed to load AWS config for SQS: %w", err)
        }
        sqsClient := sqs.NewFromConfig(cfg)
        return &EventBridgeSqsConsumer{
            sqsClient:   sqsClient,
            queueURL:    queueURL,
            messageChan: make(chan model.Message, 100), // Buffered channel
            stopChan:    make(chan struct{}),
        }, nil
    }

    // StartPolling begins polling the SQS queue for EventBridge messages.
    func (c *EventBridgeSqsConsumer) StartPolling(ctx context.Context) {
        log.Printf("Starting SQS polling for EventBridge events from queue: %s", c.queueURL)
        go func() {
            for {
                select {
                case <-c.stopChan:
                    log.Println("Stopping SQS polling.")
                    return
                default:
                    output, err := c.sqsClient.ReceiveMessage(ctx, &sqs.ReceiveMessageInput{
                        QueueUrl:            aws.String(c.queueURL),
                        MaxNumberOfMessages: 10,
                        WaitTimeSeconds:     20, // Long polling
                        VisibilityTimeout:   30,
                    })
                    if err != nil {
                        log.Printf("Error receiving SQS messages: %v", err)
                        time.Sleep(5 * time.Second) // Back-off on error
                        continue
                    }

                    if len(output.Messages) > 0 {
                        for _, msg := range output.Messages {
                            c.messageChan <- msg
                        }
                    }
                }
            }
        }()
    }

    // StopPolling gracefully stops the SQS consumer.
    func (c *EventBridgeSqsConsumer) StopPolling() {
        close(c.stopChan)
        close(c.messageChan) // Close message channel after stop signal
    }

    // GetMessageChannel returns a read-only channel for consuming messages.
    func (c *EventBridgeSqsConsumer) GetMessageChannel() <-chan model.Message {
        return c.messageChan
    }

    // DeleteMessage deletes a message from the SQS queue after successful processing.
    func (c *EventBridgeSqsConsumer) DeleteMessage(ctx context.Context, receiptHandle *string) error {
        _, err := c.sqsClient.DeleteMessage(ctx, &sqs.DeleteMessageInput{
            QueueUrl:      aws.String(c.queueURL),
            ReceiptHandle: receiptHandle,
        })
        if err != nil {
            return fmt.Errorf("failed to delete SQS message: %w", err)
        }
        return nil
    }

    // ProcessEventBridgeSqsMessage extracts and decodes the actual EventBridge event from an SQS message.
    func ProcessEventBridgeSqsMessage(sqsMsg model.Message) (*EventSchema, error) {
        if sqsMsg.Body == nil {
            return nil, fmt.Errorf("SQS message body is nil")
        }

        var sqsBody struct {
            Message string `json:"Message"` // Assuming EventBridge directly sends as raw message to SQS
            // Some EventBridge to SQS integrations wrap the event in a "Message" field of an SNS notification
            // Need to adjust parsing based on how EventBridge targets SQS (direct or via SNS)
        }
        
        // Try parsing as a direct EventBridge JSON first
        var eventSchema EventSchema
        err := json.Unmarshal([]byte(*sqsMsg.Body), &eventSchema)
        if err == nil && eventSchema.EventID != "" { // Check for a key field to confirm it's an EventSchema
            log.Printf("Successfully parsed direct EventBridge event from SQS message: %s", eventSchema.EventID)
            return &eventSchema, nil
        }

        // If direct parse failed, try parsing as an SNS-wrapped message
        err = json.Unmarshal([]byte(*sqsMsg.Body), &sqsBody)
        if err != nil {
            return nil, fmt.Errorf("failed to unmarshal SQS message body (neither direct nor SNS-wrapped): %w", err)
        }

        err = json.Unmarshal([]byte(sqsBody.Message), &eventSchema)
        if err != nil {
            return nil, fmt.Errorf("failed to unmarshal EventBridge event from SNS 'Message' field: %w", err)
        }
        if eventSchema.EventID == "" {
             return nil, fmt.Errorf("extracted EventBridge event from SQS/SNS is missing EventID")
        }
        log.Printf("Successfully parsed SNS-wrapped EventBridge event from SQS message: %s", eventSchema.EventID)
        return &eventSchema, nil
    }

    // Global publisher instance (initialize once)
    var GlobalEventBridgePublisher *EventBridgePublisher

    func InitGlobalEventBridgePublisher(ctx context.Context) error {
        if GlobalEventBridgePublisher != nil {
            log.Println("GlobalEventBridgePublisher already initialized.")
            return nil
        }
        eventBusName := aws.Getenv("EVENTBRIDGE_EVENT_BUS_NAME")
        sourceName := aws.Getenv("EVENTBRIDGE_SOURCE_NAME") // e.g., "com.demobank"
        if eventBusName == "" || sourceName == "" {
            return fmt.Errorf("EVENTBRIDGE_EVENT_BUS_NAME and EVENTBRIDGE_SOURCE_NAME environment variables must be set")
        }
        publisher, err := NewEventBridgePublisher(ctx, eventBusName, sourceName)
        if err != nil {
            return fmt.Errorf("failed to create EventBridge publisher: %w", err)
        }
        GlobalEventBridgePublisher = publisher
        return nil
    }

    // Legacy PublishToEventBridge, now using the global instance
    func PublishToEventBridge(eventData map[string]interface{}, eventType string) error {
        if GlobalEventBridgePublisher == nil {
            return fmt.Errorf("EventBridge publisher not initialized. Call InitGlobalEventBridgePublisher first.")
        }
        return GlobalEventBridgePublisher.Publish(context.TODO(), eventType, eventData, nil, "")
    }
    ```

#### b. Apache Kafka / Confluent Cloud: High-Throughput Streaming for Mission-Critical Data
- **Purpose:** To provide a robust, high-throughput, and fault-tolerant message streaming backbone for critical real-time events, analytics pipelines, and inter-service communication within a microservices architecture. Ideal for large-scale, low-latency data streams.
- **Architectural Approach:** A `KafkaEventProducer` and `KafkaEventConsumer` service, implemented using a battle-tested Kafka client library (e.g., `librdkafka` or `sarama` in Go, `confluent-kafka-python` in Python). These services manage connection pooling, batching, compression, and idempotent production. Event schemas are registered and enforced using a Schema Registry, ensuring data quality and backward/forward compatibility. Dead-letter topics are used for message reprocessing.
- **Code Examples:**
  - **Go (Kafka Event Producer with Schema Registry Integration):**
    ```go
    // services/kafka_publisher.go
    package services

    import (
        "context"
        "encoding/json"
        "fmt"
        "time"

        "github.com/confluentinc/confluent-kafka-go/v2/kafka"
        "github.com/confluentinc/confluent-kafka-go/v2/schemaregistry"
        "github.com/confluentinc/confluent-kafka-go/v2/schemaregistry/serde"
        "github.com/confluentinc/confluent-kafka-go/v2/schemaregistry/serde/avro"
        "github.com/google/uuid"
        "log"
    )

    // Avro schema for a generic platform event
    const eventAvroSchema = `{
        "type": "record",
        "name": "PlatformEvent",
        "namespace": "com.demobank.events",
        "fields": [
            {"name": "eventId", "type": "string", "doc": "Unique ID for the event"},
            {"name": "source", "type": "string", "doc": "Originating system/module"},
            {"name": "detailType", "type": "string", "doc": "Type of event, e.g., 'transaction.created'"},
            {"name": "timestamp", "type": {"type": "long", "logicalType": "timestamp-millis"}, "doc": "Event timestamp in UTC milliseconds"},
            {"name": "correlationId", "type": ["null", "string"], "default": null, "doc": "For tracing related events"},
            {"name": "payload", "type": {"type": "string", "logicalType": "json"}, "doc": "JSON string of the event-specific payload"},
            {"name": "metadata", "type": ["null", {"type": "map", "values": "string"}], "default": null, "doc": "Additional key-value metadata"}
        ]
    }`

    // KafkaEventProducer manages producing events to Kafka topics with Avro serialization.
    type KafkaEventProducer struct {
        producer      *kafka.Producer
        serializer    *avro.SpecificSerializer
        schemaRegistryClient schemaregistry.Client
        topicPrefix   string
    }

    // NewKafkaEventProducer creates a new instance of KafkaEventProducer.
    func NewKafkaEventProducer(ctx context.Context, bootstrapServers, schemaRegistryURL, topicPrefix string, kafkaConfig kafka.ConfigMap) (*KafkaEventProducer, error) {
        // Initialize Kafka Producer
        p, err := kafka.NewProducer(&kafkaConfig)
        if err != nil {
            return nil, fmt.Errorf("failed to create Kafka producer: %w", err)
        }

        // Initialize Schema Registry Client
        sr, err := schemaregistry.NewClient(schemaregistry.NewConfig(schemaRegistryURL))
        if err != nil {
            p.Close()
            return nil, fmt.Errorf("failed to create Schema Registry client: %w", err)
        }

        // Initialize Avro Serializer
        serializer, err := avro.NewSpecificSerializer(sr, serde.ValueSerde, avro.NewSerializerConfig())
        if err != nil {
            p.Close()
            return nil, fmt.Errorf("failed to create Avro serializer: %w", err)
        }

        // Register the schema if not already present
        _, err = sr.Register(ctx, fmt.Sprintf("%s.demobank.events.PlatformEvent-value", topicPrefix), eventAvroSchema, false)
        if err != nil {
            log.Printf("Warning: Failed to register Avro schema, might already exist or SR is down: %v", err)
            // Do not fail if schema registration fails, as it might already be registered.
            // A production system would have more robust schema management.
        }


        log.Printf("KafkaEventProducer initialized for bootstrap servers: %s, schema registry: %s, topic prefix: %s", bootstrapServers, schemaRegistryURL, topicPrefix)
        return &KafkaEventProducer{
            producer:      p,
            serializer:    serializer,
            schemaRegistryClient: sr,
            topicPrefix:   topicPrefix,
        }, nil
    }

    // Close closes the Kafka producer and serializer.
    func (p *KafkaEventProducer) Close() {
        if p.producer != nil {
            p.producer.Close()
        }
        if p.serializer != nil {
            p.serializer.Close()
        }
        log.Println("KafkaEventProducer closed.")
    }

    // KafkaEventPayload is the Go struct representation of our Avro schema.
    type KafkaEventPayload struct {
        EventID      string            `json:"eventId"`
        Source       string            `json:"source"`
        DetailType   string            `json:"detailType"`
        Timestamp    int64             `json:"timestamp"` // Milliseconds since epoch
        CorrelationID *string          `json:"correlationId,omitempty"`
        Payload      string            `json:"payload"`   // JSON string
        Metadata     map[string]string `json:"metadata,omitempty"`
    }

    // PublishToKafka publishes a structured event to a Kafka topic.
    func (p *KafkaEventProducer) Publish(ctx context.Context, eventType string, payload map[string]interface{}, metadata map[string]string, correlationID *string) error {
        eventID := uuid.New().String()
        timestamp := time.Now().UTC().UnixMilli()

        payloadJSON, err := json.Marshal(payload)
        if err != nil {
            return fmt.Errorf("failed to marshal event payload to JSON: %w", err)
        }

        kafkaEvent := KafkaEventPayload{
            EventID:      eventID,
            Source:       p.topicPrefix, // Using topic prefix as source for consistency
            DetailType:   eventType,
            Timestamp:    timestamp,
            CorrelationID: correlationID,
            Payload:      string(payloadJSON),
            Metadata:     metadata,
        }

        topic := fmt.Sprintf("%s.%s", p.topicPrefix, eventType) // e.g., "demobank.transaction.created"

        // Serialize the event using Avro
        encodedValue, err := p.serializer.Serialize(topic, &kafkaEvent)
        if err != nil {
            return fmt.Errorf("failed to serialize event payload: %w", err)
        }

        deliveryChan := make(chan kafka.Event)
        err = p.producer.Produce(&kafka.Message{
            TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
            Value:          encodedValue,
            Key:            []byte(eventID), // Use event ID as key for consistent partitioning
            Headers: []kafka.Header{
                {Key: "correlationId", Value: []byte(*correlationID)},
                {Key: "eventId", Value: []byte(eventID)},
                {Key: "timestamp", Value: []byte(fmt.Sprintf("%d", timestamp))},
            },
            Timestamp: time.Now(),
        }, deliveryChan)

        if err != nil {
            return fmt.Errorf("failed to produce Kafka message: %w", err)
        }

        // Wait for delivery report (optional, can be done asynchronously in a goroutine)
        e := <-deliveryChan
        m := e.(*kafka.Message)

        if m.TopicPartition.Error != nil {
            return fmt.Errorf("delivery failed for topic %s: %v", *m.TopicPartition.Topic, m.TopicPartition.Error)
        } else {
            log.Printf("Event '%s' (ID: %s) produced to Kafka topic '%s' [%d] at offset %v. Correlation ID: %s", eventType, eventID, *m.TopicPartition.Topic, m.TopicPartition.Partition, m.TopicPartition.Offset, *correlationID)
        }
        close(deliveryChan)
        return nil
    }

    // Global publisher instance for Kafka
    var GlobalKafkaEventProducer *KafkaEventProducer

    func InitGlobalKafkaEventProducer(ctx context.Context) error {
        if GlobalKafkaEventProducer != nil {
            log.Println("GlobalKafkaEventProducer already initialized.")
            return nil
        }

        bootstrapServers := aws.Getenv("KAFKA_BOOTSTRAP_SERVERS")
        schemaRegistryURL := aws.Getenv("SCHEMA_REGISTRY_URL")
        topicPrefix := aws.Getenv("KAFKA_TOPIC_PREFIX") // e.g., "demobank-prod"

        if bootstrapServers == "" || schemaRegistryURL == "" || topicPrefix == "" {
            return fmt.Errorf("KAFKA_BOOTSTRAP_SERVERS, SCHEMA_REGISTRY_URL, and KAFKA_TOPIC_PREFIX environment variables must be set")
        }

        kafkaConfig := kafka.ConfigMap{
            "bootstrap.servers": bootstrapServers,
            "acks":              "all", // Ensure message durability
            "retries":           3,
            "max.in.flight.requests.per.connection": 1, // Ensure ordering for retries
            // Add SSL/SASL configuration for production
            // "security.protocol": "SASL_SSL",
            // "sasl.mechanisms": "PLAIN",
            // "sasl.username": os.Getenv("KAFKA_SASL_USERNAME"),
            // "sasl.password": os.Getenv("KAFKA_SASL_PASSWORD"),
        }

        producer, err := NewKafkaEventProducer(ctx, bootstrapServers, schemaRegistryURL, topicPrefix, kafkaConfig)
        if err != nil {
            return fmt.Errorf("failed to create Kafka event producer: %w", err)
        }
        GlobalKafkaEventProducer = producer
        return nil
    }
    ```

#### c. Azure Event Grid / Service Bus: Multi-Cloud Eventing for Microsoft Ecosystem
- **Purpose:** To extend event publishing and consumption capabilities to Azure-native services and applications, enabling hybrid-cloud event-driven architectures and leveraging Azure's robust messaging infrastructure for enterprise integration patterns (e.g., queues, topics, subscriptions).
- **Architectural Approach:** A C# or Python service (`AzureEventService`) leveraging the Azure SDKs for Event Grid and Service Bus. This service handles topic/subscription management, dead-lettering, message filtering, and authentication with Azure AD. It can publish to Event Grid topics for reactive, push-based scenarios or to Service Bus queues/topics for more advanced messaging patterns with guaranteed delivery and transaction support.
- **Code Examples:**
  - **Python (Azure Event Grid Publisher):**
    ```python
    # services/azure_event_publisher.py
    import os
    import json
    import logging
    from typing import Dict, Any, List
    from azure.eventgrid import EventGridPublisherClient
    from azure.core.credentials import AzureKeyCredential

    logger = logging.getLogger(__name__)

    class AzureEventGridPublisherService:
        def __init__(self, endpoint: str, key: str, source_id: str = "com.demobank.azure"):
            if not endpoint or not key:
                raise ValueError("Azure Event Grid endpoint and key must be provided.")
            self.client = EventGridPublisherClient(
                endpoint=endpoint,
                credential=AzureKeyCredential(key)
            )
            self.source_id = source_id
            logger.info(f"AzureEventGridPublisherService initialized for endpoint: {endpoint}")

        def publish_event(
            self,
            event_type: str,
            data: Dict[str, Any],
            subject: Optional[str] = None,
            data_version: str = "1.0",
            event_id: Optional[str] = None
        ) -> None:
            """
            Publishes a single event to Azure Event Grid.
            """
            from uuid import uuid4
            event_id = event_id if event_id else str(uuid4())
            subject = subject if subject else f"/demobank/{event_type.replace('.', '/')}"

            event = {
                "id": event_id,
                "eventtype": event_type,
                "subject": subject,
                "eventTime": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                "data": data,
                "dataVersion": data_version,
                "topic": None, # Event Grid populates this
            }

            try:
                # Event Grid expects a list of events
                self.client.send([event])
                logger.info(f"Event '{event_type}' (ID: {event_id}) published to Azure Event Grid with subject '{subject}'.")
            except Exception as e:
                logger.exception(f"Failed to publish event '{event_type}' (ID: {event_id}) to Azure Event Grid: {e}")
                raise e

        def publish_batch_events(
            self,
            events_data: List[Dict[str, Any]], # Each dict has 'event_type', 'data', 'subject', etc.
            data_version: str = "1.0"
        ) -> None:
            """
            Publishes a batch of events to Azure Event Grid for efficiency.
            """
            from uuid import uuid4
            from datetime import datetime, timezone

            eventgrid_events = []
            for event_dict in events_data:
                event_id = event_dict.get('event_id', str(uuid4()))
                event_type = event_dict['event_type']
                data = event_dict['data']
                subject = event_dict.get('subject', f"/demobank/{event_type.replace('.', '/')}")

                eventgrid_events.append({
                    "id": event_id,
                    "eventtype": event_type,
                    "subject": subject,
                    "eventTime": datetime.now(timezone.utc).isoformat(),
                    "data": data,
                    "dataVersion": data_version,
                    "topic": None,
                })

            if not eventgrid_events:
                logger.warning("Attempted to publish an empty batch of events to Azure Event Grid.")
                return

            try:
                self.client.send(eventgrid_events)
                logger.info(f"Successfully published {len(eventgrid_events)} events in a batch to Azure Event Grid.")
            except Exception as e:
                logger.exception(f"Failed to publish batch events to Azure Event Grid: {e}")
                raise e

    # Global publisher instance for Azure Event Grid
    azure_event_grid_publisher_service = AzureEventGridPublisherService(
        endpoint=os.environ.get('AZURE_EVENT_GRID_ENDPOINT') or '',
        key=os.environ.get('AZURE_EVENT_GRID_KEY') or '',
        source_id=os.environ.get('AZURE_EVENT_GRID_SOURCE_ID') or 'com.demobank.platform'
    )
    ```

---

## 3. Logic Apps & Functions Modules: The Developer's Canvas - Intelligent Automation & Serverless Execution

### Core Concept: Empowering Developers with Extendable and Scalable Computing
The Logic Apps and Functions modules are the bedrock for custom, developer-driven integrations and serverless compute.
- **Logic Apps** provide a visual, low-code/no-code environment for building sophisticated workflows that connect hundreds of services. They excel at orchestrating long-running processes, managing state, and integrating diverse APIs with minimal code.
- **Functions** offer a highly scalable, event-driven serverless compute platform. They are ideal for executing small, single-purpose code blocks in response to events (e.g., API calls, database changes, timer triggers), allowing developers to build custom logic without managing infrastructure.

Together, they enable dynamic, extensible, and infinitely adaptable extensions to the core platform. Their value is in providing the *tools* for developers to *write* the integrations that the Connect and Events modules then leverage and orchestrate.

### Key API Integrations (Focus on extensibility mechanisms)

#### a. Logic Apps: Integration Gateway for SaaS and Enterprise Systems
- **Purpose:** To serve as a powerful orchestration engine within the Azure ecosystem (or equivalent for other cloud providers, e.g., AWS Step Functions or Google Cloud Workflows), allowing users to define complex, multi-step workflows that integrate with a vast array of services and APIs, often without writing code. The platform integrates *with* Logic Apps by allowing workflows to be triggered and their status monitored.
- **Architectural Approach:** The platform's Connect module can directly call Logic Apps via HTTP triggers, passing event payloads. The Events module can publish to Azure Event Grid, which can then trigger Logic Apps. Logic Apps are configured to interact with the platform's APIs for data exchange. This creates a bidirectional integration loop.
- **Code Examples:** (Logic Apps are primarily declarative; this shows how to trigger one and define its structure)
  - **JSON (Azure Logic App Definition - excerpt for a workflow that processes an internal event):**
    ```json
    // logicapps/process_transaction_event.json (Conceptual representation)
    {
      "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflow.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {},
      "triggers": {
        "When_a_HTTP_request_is_received": {
          "type": "Request",
          "kind": "Http",
          "inputs": {
            "schema": {
              "type": "object",
              "properties": {
                "transactionId": { "type": "string" },
                "amount": { "type": "number" },
                "currency": { "type": "string" },
                "customerId": { "type": "string" },
                "eventCorrelationId": { "type": "string" }
              },
              "required": ["transactionId", "amount", "currency", "customerId", "eventCorrelationId"]
            }
          }
        }
      },
      "actions": {
        "Get_Customer_Details_from_CRM": {
          "type": "Http",
          "inputs": {
            "method": "GET",
            "uri": "https://api.demobank.com/v1/customers/@{triggerBody()['customerId']}",
            "headers": {
              "Authorization": "Bearer @{variables('platformApiToken')}"
            }
          },
          "runAfter": {}
        },
        "Send_Email_Notification": {
          "type": "ApiConnection",
          "inputs": {
            "host": { "connection": { "name": "@parameters('$connections')['sendgrid']['connectionId']" } },
            "method": "post",
            "path": "/sendemail",
            "queries": {
              "mailSettings": {
                "sendEmailOptions": {
                  "from": { "emailAddress": "notifications@demobank.com" },
                  "subject": "Transaction Confirmation - @{triggerBody()['transactionId']}",
                  "to": [ { "emailAddress": "@body('Get_Customer_Details_from_CRM')['email']" } ],
                  "html": "Your transaction of @{triggerBody()['amount']} @{triggerBody()['currency']} is complete. Reference: @{triggerBody()['transactionId']}"
                }
              }
            }
          },
          "runAfter": {
            "Get_Customer_Details_from_CRM": [ "Succeeded" ]
          }
        },
        "Log_Workflow_Completion": {
          "type": "Http",
          "inputs": {
            "method": "POST",
            "uri": "https://logging.demobank.com/v1/logs",
            "body": {
              "level": "INFO",
              "message": "Logic App workflow 'process_transaction_event' completed for transaction @{triggerBody()['transactionId']}",
              "correlationId": "@{triggerBody()['eventCorrelationId']}"
            }
          },
          "runAfter": {
            "Send_Email_Notification": [ "Succeeded" ]
          }
        }
      },
      "outputs": {}
    }
    ```

#### b. Azure Functions: Serverless Compute for Scalable Custom Logic
- **Purpose:** To provide a highly scalable, cost-effective serverless compute environment for executing custom code in response to events or HTTP requests. Functions are used for specific, fine-grained tasks, enabling developers to extend the platform's capabilities with bespoke logic.
- **Architectural Approach:** Platform components can trigger Azure Functions via HTTP endpoints or by publishing events to Azure Event Grid/Service Bus queues which then trigger Functions. Functions, in turn, can interact with platform APIs (e.g., to update records, publish new events) or external systems (e.g., calling an external fraud detection service, transforming data before ingestion).
- **Code Examples:**
  - **C# (Azure Function for Data Transformation and Event Publishing):**
    ```csharp
    // functions/DataProcessorFunction.cs
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.Http;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Logging;
    using Newtonsoft.Json;
    using System.Net.Http;
    using System.Text;
    using Azure.Messaging.EventGrid;
    using Azure.Messaging.EventGrid.CloudEventTypes; // For CloudEvent

    public static class DataProcessorFunction
    {
        private static readonly HttpClient httpClient = new HttpClient();
        private static readonly string InternalApiBaseUrl = Environment.GetEnvironmentVariable("InternalApiBaseUrl") ?? "https://api.demobank.com";
        private static readonly string EventGridEndpoint = Environment.GetEnvironmentVariable("EventGridEndpoint") ?? "";
        private static readonly string EventGridKey = Environment.GetEnvironmentVariable("EventGridKey") ?? "";

        // Example binding for publishing to Event Grid
        [FunctionName("ProcessAndPublishData")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function 'ProcessAndPublishData' received a request.");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);

            if (data == null)
            {
                return new BadRequestObjectResult("Please pass a valid JSON payload in the request body.");
            }

            try
            {
                // 1. Data Validation and Transformation
                // This is where custom logic for cleaning, enriching, or transforming data would go.
                // For example, standardize names, calculate derived fields, or redact sensitive info.
                string originalId = data.originalId ?? Guid.NewGuid().ToString();
                string transformedName = (data.name ?? "Unknown").ToString().ToUpper();
                decimal processedValue = (decimal)(data.value ?? 0.0m) * 1.05m; // Example transformation

                var processedData = new {
                    correlationId = originalId,
                    processedAt = DateTime.UtcNow,
                    normalizedName = transformedName,
                    calculatedValue = processedValue,
                    originalPayload = data // Keep original for audit
                };

                // 2. Interact with Internal Platform API (e.g., update a record)
                var internalApiPayload = new StringContent(
                    JsonConvert.SerializeObject(new {
                        id = originalId,
                        status = "Processed",
                        details = processedData
                    }),
                    Encoding.UTF8, "application/json"
                );

                // Assuming an API key or managed identity for auth
                httpClient.DefaultRequestHeaders.Add("X-Api-Key", Environment.GetEnvironmentVariable("PlatformApiKey"));
                var apiResponse = await httpClient.PostAsync($"{InternalApiBaseUrl}/v1/data/update", internalApiPayload);

                if (!apiResponse.IsSuccessStatusCode)
                {
                    string errorContent = await apiResponse.Content.ReadAsStringAsync();
                    log.LogError($"Failed to update internal platform API: {apiResponse.StatusCode} - {errorContent}");
                    // Potentially rethrow or return appropriate error
                }
                log.LogInformation($"Successfully updated internal platform API for ID: {originalId}");


                // 3. Publish a new event to Azure Event Grid
                if (!string.IsNullOrEmpty(EventGridEndpoint) && !string.IsNullOrEmpty(EventGridKey))
                {
                    var credential = new AzureKeyCredential(EventGridKey);
                    var eventGridClient = new EventGridPublisherClient(new Uri(EventGridEndpoint), credential);

                    var cloudEvent = new CloudEvent(
                        "com.demobank.platform/data.processed", // Event Type
                        "/functions/dataprocessor",             // Source
                        processedData,                          // Event Data
                        "1.0"                                   // Data Version
                    )
                    {
                        Id = Guid.NewGuid().ToString(),
                        Time = DateTimeOffset.UtcNow,
                        Subject = $"processedData/{originalId}"
                    };

                    await eventGridClient.SendEventAsync(cloudEvent);
                    log.LogInformation($"Published 'data.processed' event for originalId: {originalId}");
                }
                else
                {
                    log.LogWarning("Event Grid credentials not configured. Skipping event publication.");
                }

                return new OkObjectResult(new {
                    message = "Data processed and event published successfully.",
                    correlationId = originalId,
                    output = processedData
                });
            }
            catch (Exception ex)
            {
                log.LogError($"An error occurred during data processing: {ex.Message} - StackTrace: {ex.StackTrace}");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }
    }
    ```

---

## 4. Data Factory: The Alchemist's Refinery - Transforming Raw Material into Gold

### Core Concept: Intelligent Data Pipelines with Built-in Observability & Governance
The Data Factory module is an advanced data orchestration and transformation engine. It is designed to ingest, process, transform, and move vast quantities of data across heterogeneous systems, ensuring data quality, lineage, and security throughout its lifecycle. Beyond mere movement, it incorporates intelligent data profiling, schema inference, and AI-driven transformation suggestions. Every pipeline execution is a traceable, auditable event, feeding into a comprehensive data observability framework that ensures trust in the data.

### Key API Integrations: Ensuring Data Health and Driving Advanced Analytics

#### a. Monte Carlo API: Proactive Data Observability and Quality Assurance
- **Purpose:** To seamlessly integrate with Monte Carlo, a leading data observability platform, providing real-time visibility into data health, lineage, and quality across all Data Factory pipelines. This ensures that data anomalies, freshness issues, or schema changes are detected and alerted proactively, before impacting downstream consumers.
- **Architectural Approach:** After every Data Factory pipeline run (or critical transformation step), a dedicated post-execution hook or service calls the Monte Carlo GraphQL API. This call reports detailed metadata including pipeline name, run status (success/failure), start/end times, row counts, volume changes, affected data assets (sources and targets), and any detected data quality incidents. The integration also allows for fetching data quality metrics from Monte Carlo to influence downstream pipeline logic (e.g., pause a pipeline if quality thresholds are breached).
- **Code Examples:**
  - **TypeScript (Pipeline Post-Execution Step with Detailed Monte Carlo Reporting):**
    ```typescript
    // steps/report_to_montecarlo.ts
    import axios from 'axios';
    import { v4 as uuidv4 } from 'uuid';
    import {
      PipelineRunReport,
      DataAsset,
      DataAssetType,
      JobExecutionInput,
      JobExecutionStatus,
      FieldLevelLineage,
      QueryPayload
    } from './montecarlo.types'; // Define these types in a separate file for clarity

    const MONTE_CARLO_API_BASE_URL = process.env.MC_API_BASE_URL || 'https://api.getmontecarlo.com/graphql';
    const MONTE_CARLO_API_KEY = process.env.MC_API_KEY || '';
    const MONTE_CARLO_API_SECRET = process.env.MC_API_SECRET || '';
    const MONTE_CARLO_ORGANIZATION_ID = process.env.MC_ORGANIZATION_ID || ''; // Often required for API calls

    class MonteCarloIntegrationService {
      private readonly headers: Record<string, string>;

      constructor() {
        if (!MONTE_CARLO_API_KEY || !MONTE_CARLO_API_SECRET) {
          console.warn("Monte Carlo API credentials not fully provided. Integration may fail.");
        }
        this.headers = {
          'x-mc-id': MONTE_CARLO_API_KEY,
          'x-mc-token': MONTE_CARLO_API_SECRET,
          'Content-Type': 'application/json',
          'x-mc-organization-id': MONTE_CARLO_ORGANIZATION_ID, // Some MC APIs require this
        };
      }

      /**
       * Reports a comprehensive pipeline run execution to Monte Carlo.
       * This includes basic status, duration, and data lineage information.
       * @param report - Detailed report object for the pipeline run.
       * @returns The response data from Monte Carlo.
       */
      public async reportPipelineRun(report: PipelineRunReport): Promise<any> {
        const jobExecutionId = report.jobExecutionId || uuidv4();
        const startTime = report.startTime.toISOString();
        const endTime = report.endTime.toISOString();

        const jobExecutionInput: JobExecutionInput = {
          id: jobExecutionId,
          name: report.pipelineName,
          namespace: report.namespace,
          status: report.status,
          startTime: startTime,
          endTime: endTime,
          duration: Math.abs(report.endTime.getTime() - report.startTime.getTime()), // duration in ms
          runId: report.runId,
          triggeredBy: report.triggeredBy,
          message: report.message,
          metadata: report.metadata,
          inputs: report.inputs.map(input => ({
            name: input.name,
            type: input.type,
            urn: input.urn,
            properties: {
              numRecords: input.numRecords,
              bytes: input.bytes,
              timestamp: input.timestamp?.toISOString(),
              // Add more asset-specific properties as needed
            }
          })),
          outputs: report.outputs.map(output => ({
            name: output.name,
            type: output.type,
            urn: output.urn,
            properties: {
              numRecords: output.numRecords,
              bytes: output.bytes,
              timestamp: output.timestamp?.toISOString(),
            }
          })),
          fieldLevelLineage: report.fieldLevelLineage,
        };

        const mutation: QueryPayload = {
          query: `
            mutation CreateJobExecution($jobExecution: JobExecutionInput!) {
              createJobExecution(jobExecution: $jobExecution) {
                id
                name
                status
                startTime
                endTime
                runId
              }
            }
          `,
          variables: {
            jobExecution: jobExecutionInput,
          },
        };

        try {
          const response = await axios.post(MONTE_CARLO_API_BASE_URL, mutation, { headers: this.headers });
          console.log(`[Monte Carlo] Reported pipeline run '${report.pipelineName}' (ID: ${jobExecutionId}) with status '${report.status}'.`);
          return response.data;
        } catch (error: any) {
          console.error(`[Monte Carlo] Failed to report pipeline run '${report.pipelineName}':`, error.response?.data || error.message);
          throw new Error(`Monte Carlo reporting error: ${error.response?.data?.errors?.[0]?.message || error.message}`);
        }
      }

      /**
       * Fetches data quality incidents for a given data asset or pipeline.
       * @param assetUrn - The URN of the data asset (e.g., 'urn:mcd:dataset:snowflake:my_db.my_schema.my_table').
       * @returns List of data quality incidents.
       */
      public async getActiveDataIncidents(assetUrn?: string, pipelineName?: string): Promise<any[]> {
        const query: QueryPayload = {
          query: `
            query GetIncidents($filter: IncidentFilter) {
              incidents(filter: $filter) {
                nodes {
                  id
                  incidentTime
                  status
                  severity
                  rule { name }
                  dataAsset { urn name type }
                  description
                  lastUpdated
                }
              }
            }
          `,
          variables: {
            filter: {
              // status: { eq: "OPEN" }, // Example: only fetch open incidents
              dataAssetUrn: assetUrn ? { eq: assetUrn } : undefined,
              jobExecutionName: pipelineName ? { eq: pipelineName } : undefined,
              // Add more filters as needed
            },
          },
        };

        try {
          const response = await axios.post(MONTE_CARLO_API_BASE_URL, query, { headers: this.headers });
          const incidents = response.data?.data?.incidents?.nodes || [];
          console.log(`[Monte Carlo] Fetched ${incidents.length} active data incidents for ${assetUrn || pipelineName || 'all assets'}.`);
          return incidents;
        } catch (error: any) {
          console.error(`[Monte Carlo] Failed to fetch incidents for ${assetUrn || pipelineName || 'all assets'}:`, error.response?.data || error.message);
          throw new Error(`Monte Carlo incident fetch error: ${error.response?.data?.errors?.[0]?.message || error.message}`);
        }
      }
    }

    // Define the types used by the Monte Carlo service for clarity and strong typing.
    // In a real codebase, these would typically be in a shared `types` or `models` directory.
    export enum JobExecutionStatus {
      SUCCESS = 'SUCCESS',
      FAILURE = 'FAILURE',
      RUNNING = 'RUNNING',
      SKIPPED = 'SKIPPED',
    }

    export enum DataAssetType {
      DATASET = 'DATASET',
      REPORT = 'REPORT',
      DASHBOARD = 'DASHBOARD',
      NOTEBOOK = 'NOTEBOOK',
      FLOW = 'FLOW', // e.g., for data pipeline itself
      // ... more types as defined by Monte Carlo
    }

    export interface DataAsset {
      name: string;
      type: DataAssetType;
      urn: string; // Unique Resource Name, e.g., 'urn:mcd:dataset:snowflake:my_db.my_schema.my_table'
      numRecords?: number;
      bytes?: number;
      timestamp?: Date; // Last modified/ingested timestamp
      properties?: Record<string, any>; // Additional asset-specific properties
    }

    export interface FieldLevelLineage {
      sourceFieldUrn: string;
      targetFieldUrn: string;
    }

    export interface JobExecutionInput {
      id: string; // Unique ID for this specific run
      name: string; // Name of the job/pipeline
      namespace: string; // e.g., "DataFactory", "Airflow", "dbt"
      status: JobExecutionStatus;
      startTime: string; // ISO 8601 string
      endTime: string; // ISO 8601 string
      duration?: number; // Duration in milliseconds
      runId?: string; // Optional ID from the orchestrator (e.g., Data Factory run ID)
      triggeredBy?: string; // e.g., "User", "Schedule", "Event"
      message?: string; // Additional context or error message
      metadata?: Record<string, string>; // Custom metadata key-value pairs
      inputs: Array<{ // Data assets consumed by this run
        name: string;
        type: DataAssetType;
        urn: string;
        properties?: {
          numRecords?: number;
          bytes?: number;
          timestamp?: string;
        };
      }>;
      outputs: Array<{ // Data assets produced by this run
        name: string;
        type: DataAssetType;
        urn: string;
        properties?: {
          numRecords?: number;
          bytes?: number;
          timestamp?: string;
        };
      }>;
      fieldLevelLineage?: FieldLevelLineage[]; // Detailed field-level lineage
    }

    export interface PipelineRunReport {
      pipelineName: string;
      namespace: string; // e.g., "DataFactory"
      status: JobExecutionStatus;
      startTime: Date;
      endTime: Date;
      runId?: string; // The ID from the orchestrator
      jobExecutionId?: string; // Optional: A globally unique ID for the MC execution
      triggeredBy?: string;
      message?: string;
      metadata?: Record<string, string>;
      inputs: DataAsset[];
      outputs: DataAsset[];
      fieldLevelLineage?: FieldLevelLineage[];
    }

    export interface QueryPayload {
      query: string;
      variables?: Record<string, any>;
    }

    export const monteCarloIntegrationService = new MonteCarloIntegrationService();

    // Legacy function, now leveraging the class
    async function reportPipelineRun(pipelineName: string, status: JobExecutionStatus, inputs: DataAsset[] = [], outputs: DataAsset[] = [], runId?: string) {
      const startTime = new Date(Date.now() - 60000); // Simulate 1 min ago
      const endTime = new Date();
      const report: PipelineRunReport = {
        pipelineName,
        namespace: "DataFactory",
        status,
        startTime,
        endTime,
        runId,
        triggeredBy: "System-Scheduled",
        message: status === JobExecutionStatus.SUCCESS ? "Pipeline completed successfully." : "Pipeline encountered an error.",
        inputs,
        outputs,
        // Example: hardcoded lineage if simple
        fieldLevelLineage: inputs.length > 0 && outputs.length > 0 ? [{
          sourceFieldUrn: `${inputs[0].urn}.id`,
          targetFieldUrn: `${outputs[0].urn}.new_id`
        }] : [],
      };
      return monteCarloIntegrationService.reportPipelineRun(report);
    }
    ```

#### b. Databricks / Spark API: Scalable Data Transformation and Analytics
- **Purpose:** To integrate with Databricks (or a native Apache Spark cluster) for executing large-scale data transformations, complex analytical workloads, and machine learning model training directly within Data Factory pipelines. This provides immense processing power for big data.
- **Architectural Approach:** Data Factory workflows can trigger Databricks jobs (notebooks, JARs, Python scripts) via the Databricks Jobs API. Data can be staged in cloud storage (e.g., S3, ADLS) before being processed by Spark, or Data Factory can directly orchestrate data loading into Delta Lake tables. The integration includes monitoring Databricks job status and fetching logs for robust error handling.
- **Code Examples:**
  - **Python (Triggering a Databricks Job from Data Factory Orchestrator):**
    ```python
    # services/data_factory/databricks_orchestrator.py
    import os
    import requests
    import json
    import time
    import logging
    from typing import Dict, Any, Optional

    logger = logging.getLogger(__name__)

    class DatabricksJobOrchestrator:
        def __init__(self, databricks_host: str, databricks_token: str):
            if not databricks_host or not databricks_token:
                raise ValueError("Databricks host and token must be provided.")
            self.databricks_host = databricks_host
            self.headers = {
                "Authorization": f"Bearer {databricks_token}",
                "Content-Type": "application/json"
            }
            logger.info(f"DatabricksJobOrchestrator initialized for host: {databricks_host}")

        def _make_request(self, method: str, path: str, data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
            """Helper for making HTTP requests to Databricks API."""
            url = f"{self.databricks_host}/api/2.1/{path}"
            try:
                if method.upper() == "GET":
                    response = requests.get(url, headers=self.headers, params=data, timeout=60)
                elif method.upper() == "POST":
                    response = requests.post(url, headers=self.headers, data=json.dumps(data), timeout=60)
                else:
                    raise ValueError(f"Unsupported HTTP method: {method}")

                response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
                return response.json()
            except requests.exceptions.HTTPError as http_err:
                logger.error(f"HTTP error calling Databricks API ({url}): {http_err} - {response.text}")
                raise
            except requests.exceptions.ConnectionError as conn_err:
                logger.error(f"Connection error calling Databricks API ({url}): {conn_err}")
                raise
            except requests.exceptions.Timeout as timeout_err:
                logger.error(f"Timeout error calling Databricks API ({url}): {timeout_err}")
                raise
            except Exception as e:
                logger.exception(f"An unexpected error occurred calling Databricks API ({url}): {e}")
                raise

        def submit_notebook_job(
            self,
            notebook_path: str,
            cluster_id: str,
            parameters: Optional[Dict[str, str]] = None,
            timeout_seconds: int = 3600,
            job_name: Optional[str] = None
        ) -> str:
            """
            Submits a Databricks notebook as a run-now job.
            Returns the run_id.
            """
            job_settings = {
                "run_name": job_name if job_name else f"df_triggered_{os.path.basename(notebook_path)}_{int(time.time())}",
                "notebook_task": {
                    "notebook_path": notebook_path,
                    "base_parameters": parameters
                },
                "new_cluster": None, # Could define a new ephemeral cluster here, or use existing_cluster_id
                "existing_cluster_id": cluster_id,
                "timeout_seconds": timeout_seconds,
                "max_retries": 1,
                "retry_on_timeout": True
            }

            try:
                response = self._make_request("POST", "jobs/runs/submit", job_settings)
                run_id = str(response.get("run_id"))
                logger.info(f"Databricks notebook job '{notebook_path}' submitted. Run ID: {run_id}")
                return run_id
            except Exception as e:
                logger.error(f"Failed to submit Databricks job for notebook '{notebook_path}': {e}")
                raise

        def get_job_run_status(self, run_id: str) -> Dict[str, Any]:
            """
            Retrieves the status of a Databricks job run.
            """
            try:
                response = self._make_request("GET", f"jobs/runs/get?run_id={run_id}")
                return response
            except Exception as e:
                logger.error(f"Failed to get status for Databricks run ID '{run_id}': {e}")
                raise

        def wait_for_job_completion(self, run_id: str, poll_interval_seconds: int = 30) -> str:
            """
            Polls a Databricks job run until it completes or fails.
            Returns the final state (e.g., "SUCCESS", "FAILED").
            """
            while True:
                status_response = self.get_job_run_status(run_id)
                life_cycle_state = status_response.get("state", {}).get("life_cycle_state")
                result_state = status_response.get("state", {}).get("result_state")

                logger.debug(f"Databricks run {run_id} current state: {life_cycle_state}, result: {result_state}")

                if life_cycle_state in ["TERMINATED", "SKIPPED", "INTERNAL_ERROR"]:
                    if result_state:
                        return result_state
                    else:
                        # Fallback for internal errors or skipped
                        return life_cycle_state

                logger.info(f"Databricks run {run_id} is still {life_cycle_state}. Waiting {poll_interval_seconds} seconds...")
                time.sleep(poll_interval_seconds)

    # Global orchestrator instance
    databricks_job_orchestrator = DatabricksJobOrchestrator(
        databricks_host=os.environ.get('DATABRICKS_HOST') or '',
        databricks_token=os.environ.get('DATABRICKS_TOKEN') or ''
    )
    ```

#### c. dbt (data build tool): Analytics Engineering and Data Transformation Governance
- **Purpose:** To integrate with `dbt` (data build tool) for managing, testing, and documenting complex SQL transformations within data warehouses. This shifts the paradigm from simple ELT to a more robust, version-controlled, and test-driven approach to data modeling and analytics engineering.
- **Architectural Approach:** Data Factory orchestrates `dbt` job executions, typically by running `dbt` CLI commands within a containerized environment (e.g., Azure Container Instances, Kubernetes pods) or by interacting with dbt Cloud's API. This involves staging `dbt` project code, executing `dbt run`, `dbt test`, and `dbt docs generate`, and capturing the results. The `manifest.json` and `run_results.json` generated by `dbt` are then parsed to extract lineage and data quality metrics for reporting to Monte Carlo or internal dashboards.
- **Code Examples:**
  - **Python (Executing dbt Commands in a Container and Parsing Results):**
    ```python
    # services/data_factory/dbt_orchestrator.py
    import subprocess
    import json
    import os
    import logging
    from typing import Dict, Any, List, Optional

    logger = logging.getLogger(__name__)

    class DbtOrchestrator:
        def __init__(self, dbt_project_path: str, dbt_profiles_dir: str, target: str = "production"):
            self.dbt_project_path = dbt_project_path
            self.dbt_profiles_dir = dbt_profiles_dir
            self.target = target
            self.env = os.environ.copy()
            # Ensure dbt can find profiles
            self.env["DBT_PROFILES_DIR"] = self.dbt_profiles_dir
            logger.info(f"DbtOrchestrator initialized for project: {dbt_project_path}, target: {target}")

        def _run_dbt_command(self, command: List[str], capture_output: bool = True) -> Optional[Dict[str, Any]]:
            """Helper to execute dbt CLI commands."""
            full_command = ["dbt"] + command + ["--target", self.target]
            logger.info(f"Executing dbt command: {' '.join(full_command)}")
            try:
                process = subprocess.run(
                    full_command,
                    cwd=self.dbt_project_path,
                    capture_output=capture_output,
                    text=True,
                    check=True, # Raise an exception for non-zero exit codes
                    env=self.env
                )
                if capture_output:
                    logger.debug(f"dbt stdout:\n{process.stdout}")
                    if process.stderr:
                        logger.warning(f"dbt stderr:\n{process.stderr}")
                    # For `dbt ls -j` or similar, output is JSON
                    if "-j" in command:
                        return json.loads(process.stdout)
                return None
            except subprocess.CalledProcessError as e:
                logger.error(f"dbt command failed: {' '.join(full_command)}")
                logger.error(f"dbt stdout:\n{e.stdout}")
                logger.error(f"dbt stderr:\n{e.stderr}")
                raise RuntimeError(f"dbt command failed with exit code {e.returncode}") from e
            except FileNotFoundError:
                logger.error("dbt executable not found. Ensure dbt is installed and in PATH.")
                raise
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse dbt command output as JSON: {e}")
                raise
            except Exception as e:
                logger.exception(f"An unexpected error occurred during dbt command execution: {e}")
                raise

        def run_dbt_models(self, select_models: Optional[List[str]] = None) -> Dict[str, Any]:
            """
            Executes dbt run command for specified models or the entire project.
            Returns the parsed run_results.json.
            """
            command = ["run"]
            if select_models:
                command.extend(["--select", *select_models])

            self._run_dbt_command(command, capture_output=False) # run command can be verbose

            # After run, parse the run_results.json for detailed outcomes
            run_results_path = os.path.join(self.dbt_project_path, "target", "run_results.json")
            if not os.path.exists(run_results_path):
                raise FileNotFoundError(f"dbt run_results.json not found at {run_results_path}")

            with open(run_results_path, 'r') as f:
                run_results = json.load(f)
            logger.info(f"dbt run completed. Status: {run_results.get('status', 'N/A')}")
            return run_results

        def run_dbt_tests(self, select_models: Optional[List[str]] = None) -> Dict[str, Any]:
            """
            Executes dbt test command for specified models or the entire project.
            Returns the parsed test_results.json (usually part of run_results).
            """
            command = ["test"]
            if select_models:
                command.extend(["--select", *select_models])

            self._run_dbt_command(command, capture_output=False)

            # Test results are typically embedded in run_results.json or in a separate file based on dbt version
            # For simplicity, we assume we check run_results.json for test results.
            run_results_path = os.path.join(self.dbt_project_path, "target", "run_results.json")
            if not os.path.exists(run_results_path):
                raise FileNotFoundError(f"dbt run_results.json not found at {run_results_path}")

            with open(run_results_path, 'r') as f:
                run_results = json.load(f)

            # Filter for test results
            test_results = [r for r in run_results.get("results", []) if r.get("resource_type") == "test"]
            failed_tests = [t for t in test_results if t.get("status") == "fail"]
            if failed_tests:
                logger.warning(f"{len(failed_tests)} dbt tests failed!")
                for test in failed_tests:
                    logger.warning(f"  Failed test: {test.get('unique_id')} - {test.get('message')}")
            else:
                logger.info("All dbt tests passed.")
            return run_results # Return full run_results, tests are embedded

        def generate_dbt_docs(self) -> None:
            """
            Generates dbt documentation.
            """
            self._run_dbt_command(["docs", "generate"], capture_output=False)
            logger.info("dbt documentation generated successfully.")
            # The docs are generated in target/index.html and related assets.
            # In a real pipeline, these would be uploaded to a static web host.

        def parse_dbt_lineage(self) -> Dict[str, Any]:
            """
            Parses the dbt manifest.json to extract data lineage.
            """
            manifest_path = os.path.join(self.dbt_project_path, "target", "manifest.json")
            if not os.path.exists(manifest_path):
                # Run `dbt compile` or `dbt run` to generate manifest.json if it doesn't exist
                logger.warning("manifest.json not found. Running `dbt compile` to generate it.")
                self._run_dbt_command(["compile"], capture_output=False)
                if not os.path.exists(manifest_path): # Check again
                    raise FileNotFoundError(f"dbt manifest.json still not found at {manifest_path} after compile attempt.")

            with open(manifest_path, 'r') as f:
                manifest = json.load(f)

            # Basic parsing of models and their dependencies
            lineage = {}
            nodes = manifest.get("nodes", {})
            for node_id, node_data in nodes.items():
                if node_data.get("resource_type") in ["model", "seed", "snapshot", "source"]:
                    # Create a simplified representation: {model_name: {dependencies: [...], columns: [...]}}
                    lineage[node_data["name"]] = {
                        "resource_type": node_data["resource_type"],
                        "database": node_data.get("database"),
                        "schema": node_data.get("schema"),
                        "alias": node_data.get("alias", node_data["name"]),
                        "dependencies": [dep.split('.')[-1] for dep in node_data.get("depends_on", {}).get("nodes", [])],
                        "columns": {col_name: col_info for col_name, col_info in node_data.get("columns", {}).items()},
                        "unique_id": node_data.get("unique_id"),
                        "tags": node_data.get("tags", []),
                    }
            logger.info("dbt manifest parsed for lineage information.")
            return lineage

    # Global dbt orchestrator instance
    # Example usage: dbt_project_path would be mounted from a repo, profiles_dir from a secret volume
    dbt_orchestrator = DbtOrchestrator(
        dbt_project_path=os.environ.get('DBT_PROJECT_PATH') or '/app/dbt_project',
        dbt_profiles_dir=os.environ.get('DBT_PROFILES_DIR') or '/app/dbt_profiles',
        target=os.environ.get('DBT_TARGET') or 'production'
    )
    ```

---

## UI/UX Integration: The Command Center - A Unified, Intuitive Experience

The platform's user interface is designed for intuitive interaction across all these sophisticated integration points, transforming complex backend systems into manageable, actionable elements.

-   **Connect Module - The Workflow Maestro:**
    -   The workflow builder features an expansive **node palette** dynamically populated with rich icons and descriptions for Twilio, SendGrid, Salesforce, Stripe, and other connectors.
    -   Each connector node offers a **smart configuration wizard** with AI-driven suggestions for parameter mapping, data transformations, and common use cases. For example, the "Send SMS" node might suggest pulling phone numbers from a `Customer` object.
    -   A **"Connections" dashboard** provides a centralized view of all active integrations, their health status, API call metrics, and configuration details, allowing for easy management and re-authentication.
    -   **Real-time execution logs and trace views** enable users to debug workflows, visualize data flow, and identify bottlenecks or errors instantly, with direct links to external service logs where applicable.

-   **Events Module - The Event Console:**
    -   A dedicated **"Event Schemas" tab** allows users to browse, define, and validate schemas for internal and external events, ensuring data consistency. It supports standard formats like CloudEvents.
    -   The **"Targets" configuration interface** provides a streamlined experience for configuring external event destinations like AWS EventBridge, Kafka topics, or Azure Event Grid. Users can visually map internal event types to external targets with filtering rules.
    -   **Event Stream Monitoring:** A live dashboard displays event throughput, latency, and delivery status, with alerts for anomalies. Users can replay historical events for debugging or testing.

-   **Data Factory - The Data Refinery Control Tower:**
    -   The pipeline editor includes advanced nodes for **Databricks/Spark job orchestration** and **dbt command execution**, with direct links to Databricks notebooks or dbt Cloud projects.
    -   A **"Data Quality & Lineage" tab** on each pipeline's history page provides an integrated view of data health metrics from Monte Carlo. It shows data freshness, volume anomalies, schema drift, and "View in Monte Carlo" deep links for detailed analysis.
    -   **Automated data cataloging:** Integrates with `dbt` and Monte Carlo to automatically populate a discoverable data catalog with model definitions, column-level lineage, and data quality scores.
    -   **AI-driven data transformation suggestions:** Leverage historical pipeline runs and data profiles to suggest optimal transformation logic or identify potential data quality issues before deployment.

-   **Logic Apps & Functions - The Developer's Extension Kit:**
    -   While primarily code-focused, the UI provides **integrated development environments (IDEs)** for editing Azure Functions code, with built-in debugging, testing, and deployment tools.
    -   **Visual monitoring dashboards** for Logic Apps and Functions display execution history, duration, success/failure rates, and detailed trace information, making it easy to diagnose issues.
    -   The platform offers **API Gateway integration** for custom Functions, enabling secure exposure and management of bespoke logic as part of the overall API ecosystem, complete with authentication and rate limiting.
    -   **"SDKs & CLI Tools"** section for developers provides comprehensive documentation, code samples, and CLI utilities to programmatically interact with the platform's modules, accelerating custom development and automation.

---

## 5. Security & Compliance: The Citadel's Guard - Ensuring Trust and Integrity

### Core Concept: Integrated Security-by-Design and Continuous Compliance
Security and compliance are not afterthoughts but are woven into the very fabric of the platform. Every module, every integration, is designed with a zero-trust mindset, ensuring data protection, access control, and auditability at every layer. We adhere to industry best practices and prepare for stringent regulatory requirements.

#### a. Data Encryption at Rest and in Transit
-   **Approach:** All data stored within the platform's databases (e.g., customer profiles, event logs, workflow definitions) is encrypted at rest using AES-256. Data in transit between services, and with external APIs (Twilio, SendGrid, Salesforce, Stripe, AWS, Azure, Kafka, Monte Carlo, Databricks), is encrypted using TLS 1.2+ protocols.
-   **Key Management:** Leverages cloud-native Key Management Services (KMS) (e.g., AWS KMS, Azure Key Vault, Google Cloud KMS) for secure storage and rotation of encryption keys, API keys, and secrets.

#### b. Identity and Access Management (IAM)
-   **Fine-grained Access Controls:** Role-Based Access Control (RBAC) is implemented across all modules, allowing administrators to define precise permissions for users and service accounts. This ensures that only authorized entities can configure integrations, access sensitive data, or deploy workflows.
-   **OAuth 2.0 and OpenID Connect:** For user authentication and authorization, standard protocols are used, integrating with enterprise identity providers (e.g., Azure AD, Okta, Auth0). API integrations (Salesforce, Stripe) leverage OAuth 2.0 flows where possible, minimizing direct credential handling.
-   **Service-to-Service Authentication:** Utilizes managed identities (e.g., AWS IAM Roles, Azure Managed Identities) for secure, credential-less authentication between internal microservices and cloud resources, eliminating the need to hardcode or manage API keys for internal communication.

#### c. Auditing and Logging
-   **Comprehensive Audit Trails:** Every significant action (e.g., workflow deployment, connector configuration change, sensitive data access) is logged to an immutable audit trail. These logs capture who performed the action, when, from where, and what was affected.
-   **Centralized Logging and SIEM Integration:** All application, infrastructure, and security logs are aggregated into a centralized logging platform (e.g., ELK Stack, Splunk, Azure Monitor). This enables real-time monitoring, anomaly detection, and seamless integration with Security Information and Event Management (SIEM) systems for threat detection and compliance reporting.

#### d. Data Residency and Compliance
-   **Geo-fencing and Data Sovereignty:** The platform supports deployment in specific geographic regions to meet data residency requirements (e.g., GDPR in Europe, CCPA in California). Data is processed and stored within the specified region.
-   **Certifications:** Designed to comply with industry standards such as ISO 27001, SOC 2 Type II, PCI DSS (for relevant components), GDPR, and CCPA, with regular third-party audits and certifications.

---

## 6. Scalability & Resiliency: The Adaptive Foundation - Built for Unwavering Performance

### Core Concept: Cloud-Native Elasticity and Fault-Tolerant Architecture
The platform is architected for extreme scalability and continuous availability, leveraging cloud-native principles of distributed systems, microservices, and elastic infrastructure. It is designed to handle fluctuating workloads, absorb failures gracefully, and maintain peak performance even under immense demand.

#### a. Horizontal Scaling of Services
-   **Stateless Microservices:** Core services are designed to be stateless, allowing for effortless horizontal scaling. Instances can be added or removed dynamically based on load.
-   **Containerization and Orchestration:** All services are deployed as Docker containers orchestrated by Kubernetes (or managed services like AWS ECS/EKS, Azure AKS), providing automated scaling, self-healing, and efficient resource utilization.
-   **Serverless Functions:** Azure Functions and similar serverless offerings automatically scale to handle bursts of events, paying only for execution time.

#### b. Fault Tolerance and High Availability
-   **Redundant Deployments:** Critical services are deployed across multiple availability zones and regions to ensure business continuity in the event of localized outages.
-   **Load Balancing and API Gateways:** Traffic is distributed across multiple service instances using intelligent load balancers and API gateways, providing resilience and optimal routing.
-   **Circuit Breaker and Retry Mechanisms:** Inter-service communication incorporates circuit breaker patterns, intelligent retry logic with back-offs, and timeouts to prevent cascading failures and improve overall system stability.
-   **Idempotent Operations:** API calls and event processing are designed to be idempotent where possible, allowing safe retries without unintended side effects.

#### c. Auto-Scaling and Resource Optimization
-   **Metric-driven Auto-scaling:** Infrastructure and application components are configured with auto-scaling rules based on real-time metrics (CPU utilization, memory, request queue length), ensuring resources are dynamically allocated to match demand.
-   **Cost Optimization:** Leverages spot instances, reserved instances, and serverless computing to optimize cloud infrastructure costs while maintaining performance targets.

---

## 7. Observability & Monitoring: The Panopticon - Illuminating the Digital Landscape

### Core Concept: Full-Stack Visibility and Proactive Intelligence
Beyond basic logging, the platform implements a comprehensive observability stack, providing deep insights into system behavior, performance, and health. This enables proactive issue detection, rapid diagnosis, and continuous performance optimization, ensuring a seamless user experience.

#### a. Centralized Logging
-   **Structured Logging:** All services emit structured logs (JSON format) containing rich context (correlation IDs, tenant IDs, service names, timestamps, log levels).
-   **Log Aggregation and Search:** Logs from all components are aggregated into a central platform (e.g., Grafana Loki, Elasticsearch) for efficient search, filtering, and analysis.

#### b. Distributed Tracing
-   **End-to-End Request Tracing:** Implements distributed tracing (e.g., OpenTelemetry, Jaeger) to visualize the flow of requests across multiple microservices and integration points. This provides invaluable insight into latency bottlenecks and error origins across complex workflows.
-   **Correlation IDs:** Every transaction or event initiates a correlation ID that propagates across all services, linking all related logs and traces for easy debugging.

#### c. Metrics and Alerting
-   **Granular Metrics Collection:** Collects a wide array of operational metrics (CPU, memory, network I/O, disk I/O, latency, error rates, throughput) from infrastructure, services, and integrations.
-   **Custom Business Metrics:** Beyond operational metrics, also collects business-specific metrics (e.g., number of SMS sent, successful payments, data pipeline run duration, number of failed data quality checks).
-   **Dashboarding:** Utilizes advanced dashboarding tools (e.g., Grafana, Datadog) to visualize real-time and historical trends of all collected metrics, providing operators and business users with clear insights.
-   **Intelligent Alerting:** Configures sophisticated alerting rules on key metrics and log patterns, with dynamic thresholds and integration with incident management systems (PagerDuty, Opsgenie) for timely notification of critical issues.

---

## 8. Developer Experience (DX): The Craftsman's Workbench - Empowering Innovation

### Core Concept: Streamlined Development-to-Deployment Lifecycle
The platform prioritizes an exceptional developer experience, providing intuitive tools, comprehensive documentation, and robust environments that empower developers to rapidly build, test, and deploy integrations and custom functionalities.

#### a. Comprehensive SDKs and APIs
-   **Multi-language SDKs:** Provides official SDKs (TypeScript, Python, Go) for interacting with the platform's core APIs (Connect, Events, Data Factory), facilitating easy integration from custom applications.
-   **Well-documented REST APIs:** All external-facing platform functionalities are exposed via RESTful APIs with OpenAPI (Swagger) specifications, enabling easy discovery and consumption.

#### b. CLI Tools and Infrastructure-as-Code (IaC)
-   **Powerful CLI:** A command-line interface (CLI) tool allows developers to manage platform resources, deploy configurations, trigger workflows, and interact with the API programmatically.
-   **Terraform/CloudFormation Providers:** Provides Infrastructure-as-Code (IaC) templates and providers (e.g., Terraform, CloudFormation, Azure Resource Manager) for provisioning and managing platform components and integrations in a version-controlled, automated manner.

#### c. Sandbox and Staging Environments
-   **Self-service Sandbox Environments:** Developers can provision isolated sandbox environments on demand for development and testing, mirroring production configurations without affecting live systems.
-   **Staging and CI/CD Integration:** Integrates seamlessly with Continuous Integration/Continuous Deployment (CI/CD) pipelines, enabling automated testing and phased deployments to staging and production environments.

#### d. Rich Documentation and Community Support
-   **Interactive API Documentation:** Automatically generated and hosted API documentation (e.g., Swagger UI) with "try-it-out" capabilities.
-   **Developer Portal:** A dedicated developer portal provides tutorials, how-to guides, best practices, and a knowledge base for building on the platform.
-   **Community Forums:** Fosters a vibrant developer community through forums, Q&A sections, and open-source contributions to share knowledge and accelerate problem-solving.

---

## 9. Future Vision & Roadmap: The Horizon's Promise - Intelligent Evolution

### Core Concept: AI-Powered Augmentation and Predictive Intelligence
The future trajectory of the platform is centered on infusing every layer with advanced AI and machine learning capabilities, moving beyond reactive automation to proactive, predictive, and self-optimizing intelligence.

#### a. AI/ML-Driven Workflow Optimization
-   **Intelligent Workflow Design:** AI assistants will recommend optimal workflow patterns, connector configurations, and data transformations based on historical usage and industry best practices.
-   **Predictive Anomaly Detection:** Machine learning models will monitor workflow execution and data streams to predict potential failures, performance bottlenecks, or data quality issues before they impact operations.
-   **Self-healing Integrations:** AI agents will automatically detect, diagnose, and in some cases, remediate common integration failures (e.g., retry with exponential back-off, switch to a fallback API, alert appropriate teams).

#### b. Enhanced Semantic Data Layer
-   **Knowledge Graph Integration:** Build a comprehensive knowledge graph that links data assets, business processes, and semantic meanings across all modules and integrated systems.
-   **Natural Language Querying:** Enable business users to query data and workflow statuses using natural language interfaces, powered by advanced NLP models.

#### c. Predictive Analytics and Business Intelligence
-   **AI-driven Insights:** Leverage the aggregated data and event streams to generate predictive analytics and business intelligence, identifying trends, forecasting outcomes, and suggesting actionable strategies.
-   **Personalized Experiences:** Use AI to personalize customer communications and workflow interactions based on individual behavior patterns and preferences.

#### d. Multi-Cloud and Hybrid-Cloud Orchestration
-   **Cloud-Agnostic Connectors:** Further expand cloud-agnostic connectors and services, enabling seamless orchestration of workloads and data across AWS, Azure, GCP, and on-premise environments.
-   **Unified Governance:** Implement a unified governance plane for managing security, compliance, and cost across diverse cloud environments from a single control point.

This comprehensive integration plan, with its deep technical details, robust architectural considerations, and visionary roadmap, ensures that the platform is not merely functional, but a truly transformative force in the digital landscape. It is engineered for the future, ready to deliver unparalleled value and adapt to the evolving demands of a dynamic digital economy.