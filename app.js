// ==========================================================================
// ARCHITECTURE DATA MODEL (L1 & L2)
// ==========================================================================

const L1_DATA = {
  // Column 1: Sources
  sources: [
    {
      id: "src-pos",
      name: "Point of Sales (POS)",
      category: "Data Source",
      status: "Active",
      tech: ["Retail POS Terminal APIs", "SFTP File Feeds", "JSON/CSV Streams"],
      desc: "Captures transactional data across all physical retail stores, duty-free outlets, and food & beverage shops located throughout Changi Airport terminals. Crucial for revenue tracking and tenant sales auditing.",
      inputs: ["Physical Store Transactions", "Cashier Logs"],
      outputs: ["Raw Sales Log Stream (T0)"],
      role: "Primary transaction ledger source feeding into the central financial data warehouse."
    },
    {
      id: "src-rewards",
      name: "Changi Rewards",
      category: "Data Source",
      status: "Active",
      tech: ["REST API Integrations", "Apache Kafka", "JSON Payload"],
      desc: "Collects loyalty point accumulations, redemptions, member profile registrations, and campaign interactions from the Changi Rewards customer loyalty application.",
      inputs: ["Loyalty Registrations", "Point Transactions", "Member Actions"],
      outputs: ["Loyalty Event Stream (T0)"],
      role: "Feeds customer profile and personalization algorithms in the Data Science tier."
    },
    {
      id: "src-finance",
      name: "Financial Data",
      category: "Data Source",
      status: "Active",
      tech: ["SAP ERP Gateway", "DB2 Connectors", "Scheduled Batch Extracts"],
      desc: "Core ledger, corporate accounts, tenant billing, and operational expense datasets sourced from CAG's enterprise financial systems.",
      inputs: ["Enterprise General Ledger", "Tenant Billing Schedules"],
      outputs: ["Structured Financial Ledger Extract (T0)"],
      role: "Provides ground-truth audit tables for executive corporate reporting and Looker dashboards."
    },
    {
      id: "src-flight",
      name: "Flight Data",
      category: "Data Source",
      status: "Active",
      tech: ["AODB Integration", "MQ Series Message Bus", "XML Real-Time Messages"],
      desc: "Real-time updates from the Airport Operations Database (AODB) detailing aircraft arrival/departure times, gate allocations, airline scheduling, and delays.",
      inputs: ["AODB Feeds", "FAA/Eurocontrol flight schedules"],
      outputs: ["Flight Events Stream (T0)"],
      role: "Forms the operational core of the data platform, driving passenger traffic forecasts."
    },
    {
      id: "src-goem",
      name: "Operational (GOEM Data)",
      category: "Data Source",
      status: "Active",
      tech: ["Ground Operations APIs", "SQL Database Mirroring"],
      desc: "Ground Operations & Equipment Maintenance (GOEM) data tracking runway usage, airbridge deployments, terminal shuttle statuses, and service vehicle schedules.",
      inputs: ["Equipment Logs", "Runway Utilization Schedules"],
      outputs: ["Ground Operations Telemetry (T0)"],
      role: "Analyzed for airside operational bottlenecks and resource scheduling optimization."
    },
    {
      id: "src-flight-ops",
      name: "Flight Operations",
      category: "Data Source",
      status: "Active",
      tech: ["Airline APIs", "IATA Standard Message Parsers"],
      desc: "Specific datasets originating from airline dispatch systems, crew rosters, and fuel management consoles.",
      inputs: ["IATA Flight Logs", "Fuel Telemetry Reports"],
      outputs: ["Flight Ops Operational Log (T0)"],
      role: "Assists in tracking airline efficiency and environmental emissions modeling."
    },
    {
      id: "src-images",
      name: "Product Images",
      category: "Data Source",
      status: "Active",
      tech: ["Cloud Storage Blobs", "Metadata DB Logs"],
      desc: "Unstructured high-resolution images of retail products, bag tags, and airport security checks used for vision-based analytics.",
      inputs: ["Retail Product Catalog Photos", "Security Scans"],
      outputs: ["Raw Unstructured Blob Data (T0)"],
      role: "Feeds image processing models in Vertex AI Platform for automated checkout and compliance."
    },
    {
      id: "src-clickstream",
      name: "Clickstream Data",
      category: "Data Source",
      status: "Active",
      tech: ["Google Analytics 4 Export", "Firebase Event Stream", "BigQuery Transfer"],
      desc: "Granular user navigation logs from the iChangi website, Changi Rewards App, and airport public Wi-Fi portal pages.",
      inputs: ["User Click Events", "Page Views", "App Sessions"],
      outputs: ["Real-Time User Sessions Stream (T0)"],
      role: "Enables clickpath analysis, real-time personalization, and website conversion optimization."
    },
    {
      id: "src-ecommerce",
      name: "eCommerce (iShopChangi)",
      category: "Data Source",
      status: "Active",
      tech: ["Magento REST API", "Webhooks", "JSON Payloads"],
      desc: "Order records, shopping cart actions, product reviews, and merchant data from Changi's duty-free e-commerce platform iShopChangi.",
      inputs: ["Digital Shopping Cart State", "Completed Orders", "Merchant Feedbacks"],
      outputs: ["eCommerce Events & Sales Logs (T0)"],
      role: "Drives omnichannel commercial metrics and dynamic product pricing modules."
    },
    {
      id: "src-baggage",
      name: "Baggage Data",
      category: "Data Source",
      status: "Active",
      tech: ["BHS Sensors", "RFID Scanner Streams", "TCP Socket Listeners"],
      desc: "Tracking logs from the Baggage Handling System (BHS) scanning RFID tags of luggage as they traverse terminal tunnels and loading carousels.",
      inputs: ["Luggage Tag Scans", "Sorting Belt Telemetry"],
      outputs: ["Baggage RFID Event Stream (T0)"],
      role: "Used to monitor luggage throughput and alert baggage operations teams of delays."
    },
    {
      id: "src-sensor",
      name: "Sensor Data (IoT)",
      category: "Data Source",
      status: "Active",
      tech: ["MQTT Broker", "GCP IoT Core Integration", "Binary Protocols"],
      desc: "Aggregated IoT sensor logs capturing terminal temperature, ambient humidity, passenger counts in queuing areas, and escalator vibration diagnostics.",
      inputs: ["Terminal Environment Sensors", "Queue Camera Counters"],
      outputs: ["IoT Telemetry Event Stream (T0)"],
      role: "Enables predictive maintenance on facilities and crowd density optimization."
    },
    {
      id: "src-loyalty",
      name: "Loyalty Membership",
      category: "Data Source",
      status: "Active",
      tech: ["CRM Datasets", "SFTP Syncs", "Encrypted CSVs"],
      desc: "Static and dynamic user membership records detailing loyalty status, preferences, historical point claims, and demographic information.",
      inputs: ["Customer Profiles", "Reward Tier Audits"],
      outputs: ["Static Membership Sync Logs (T0)"],
      role: "Forms the master dataset for user segments, used across looker reports and promotional targeting."
    }
  ],

  // Column 2: Ingestion
  ingestion: {
    eventDriven: [
      {
        id: "ing-eventarc",
        name: "EventArc",
        category: "Data Ingestion",
        status: "Active",
        tech: ["GCP EventArc", "Cloud Pub/Sub Router"],
        desc: "Routes events from Google Cloud sources and custom applications. Standardizes event routing structure, triggering downstream Cloud Run Functions upon new file uploads or state changes.",
        inputs: ["GCS Upload Signals", "Firebase Event Hooks"],
        outputs: ["Trigger Signals sent to Cloud Run Functions"],
        role: "Event router orchestrating zero-latency file arrival actions."
      },
      {
        id: "ing-functions",
        name: "Cloud Run Functions",
        category: "Data Ingestion",
        status: "Active",
        tech: ["Cloud Run Functions", "Node.js/Python Runtimes"],
        desc: "Lightweight, event-driven serverless functions executing custom code to sanitize, format, and immediately ingest structured files upon arrival into GCS.",
        inputs: ["EventArc Trigger Signals", "Raw file blobs in GCS Landing Zone"],
        outputs: ["Sanitized Raw Data in Data Lake (T0)"],
        role: "Gatekeeper validation and formatting script executing at the edge of the platform."
      }
    ],
    batchStream: [
      {
        id: "ing-dataflow-batch",
        name: "Cloud Dataflow",
        category: "Data Ingestion",
        status: "Active",
        tech: ["Apache Beam", "GCP Dataflow Pipelines"],
        desc: "Fully managed data processing service. Ingests high-volume flight logs and financial streams in either batch loads or real-time stream pipelines.",
        inputs: ["AODB Message Bus", "ERP File Dumps"],
        outputs: ["Appended Delta Records in Data Lake (T0/T1)"],
        role: "Main ETL ingestion workhorse handling complex schemas and deduplication."
      }
    ],
    pubsub: [
      {
        id: "ing-pubsub",
        name: "Pub/Sub",
        category: "Data Ingestion",
        status: "Active",
        tech: ["GCP Pub/Sub", "JSON Streaming Queue"],
        desc: "Global, distributed message queue that ingests IoT sensor streams and user clickstreams, buffering the data before pushing to Dataflow or BigQuery.",
        inputs: ["GA4 Clickstream SDKs", "IoT MQTT Bridges"],
        outputs: ["Pub/Sub Topic Stream Buffers"],
        role: "High-throughput asynchronous ingest buffer preventing data loss during traffic spikes."
      }
    ]
  },

  // Column 3: Storage & Processing
  storage: {
    t0: {
      name: "Data Lake: Raw (T0)",
      items: [
        { name: "Delta Data", desc: "Change data capture logs reflecting incremental database updates." },
        { name: "Raw Files", desc: "Exact copies of landing documents (JSON, XML, CSV) as received." },
        { name: "External Data", desc: "Partner airlines feeds and external weather datasets." },
        { name: "Videos", desc: "Security and queue flow video chunks." },
        { name: "Images", desc: "Retail product images and boarding pass scans." }
      ]
    },
    t1: {
      name: "Data Lake: Curated (T1)",
      items: [
        { name: "Cleansed Data", desc: "Data with nulls handled, dates standardized, and formatting corrected." },
        { name: "DQ Applied Data", desc: "Records passed through Dataplex validation rules." },
        { name: "Consumption Ready Data", desc: "Intermediary tables ready to join into domain schemas." }
      ]
    },
    t2: {
      name: "Data Lake: Consumption (T2)",
      items: [
        { name: "Unstructured Data", desc: "Indexed audio/video catalogs ready for AI search engines." },
        { name: "Analytical Datasets", desc: "Aggregated, time-sliced transaction databases." },
        { name: "Structured Data by Domain", desc: "Data isolated into Retail, Aviation, and Passenger groups." },
        { name: "Object Table", desc: "Google Cloud Storage files exposed as read-only BigQuery tables." }
      ]
    },
    t3: {
      name: "Data Lake: Research (T3)",
      items: [
        { name: "Training Data", desc: "Labeled inputs ready for ML model training pipelines." },
        { name: "Data Models", desc: "Stored neural networks, regressions, and forecasting models." },
        { name: "BQ Data Mart", desc: "Dedicated, high-performance sandbox tables for data analysts." }
      ]
    },
    processing: [
      {
        id: "prc-dataform",
        name: "BigQuery Dataform",
        category: "Processing & Transformation",
        status: "Active",
        tech: ["SQLX", "BigQuery Dataform Engine"],
        desc: "Orchestrates SQL pipelines directly inside BigQuery. Manages tables, executes quality assertions, and maintains data lineage dependency graphs.",
        inputs: ["Raw (T0) Tables", "Curated (T1) Schemas"],
        outputs: ["Optimized Consumption (T2) Analytics Tables"],
        role: "In-warehouse ELT transformation compiler transforming raw values into reporting marts."
      },
      {
        id: "prc-dataflow-transform",
        name: "Dataflow",
        category: "Processing & Transformation",
        status: "Active",
        tech: ["Apache Beam SDK", "Dataflow Templates"],
        desc: "Executes programmatic transformations, windowed calculations, and out-of-order event corrections for streaming datasets.",
        inputs: ["Pub/Sub Streams", "T0 Raw Blobs"],
        outputs: ["Standardized Curated (T1) Data Lake Tables"],
        role: "Compute engine resolving complex streaming event boundaries prior to storage."
      }
    ],
    science: [
      {
        id: "sci-vertex",
        name: "Vertex AI Platform (ML Training / Ops)",
        category: "Data Science",
        status: "Active",
        tech: ["Vertex AI Workbench", "AutoML", "Kubeflow Pipelines"],
        desc: "Unified environment for training custom AI models, managing hyperparameter tuning, tracking experimentation logs, and registering models in the ML Registry.",
        inputs: ["T3 Research Training Data"],
        outputs: ["Trained ML Model Blobs", "Prediction API Endpoints"],
        role: "Center of CAG's predictive capabilities, generating passenger forecasting models."
      }
    ]
  },

  // Column 4: Enrichment
  enrichment: {
    semantic: [
      {
        id: "enr-looker",
        name: "Looker (Semantic Models)",
        category: "Enrichment",
        status: "Active",
        tech: ["LookML", "Looker Semantic Layer"],
        desc: "Defines business logic, dimensions, and measures in LookML code, offering a unified semantic directory of business terms (e.g. 'Active Passenger', 'Gross Tenant Sales').",
        inputs: ["T2 Consumption Domain Tables"],
        outputs: ["Semantic Queries", "Standardized Metric Feeds"],
        role: "Ensures single-source-of-truth definitions across all reporting platforms."
      },
      {
        id: "enr-bqmart",
        name: "BQ Data Mart",
        category: "Enrichment",
        status: "Active",
        tech: ["BigQuery Partitioned Tables", "Materialized Views"],
        desc: "Aggregated, optimized databases built for specific business units (e.g. Retail Operations, Airside Baggage Services) ensuring fast query performance.",
        inputs: ["T2 Consumption Data Lake"],
        outputs: ["High-speed Business Reports"],
        role: "Localizes query loads and optimizes warehouse consumption costs."
      },
      {
        id: "enr-featurestore",
        name: "Vertex AI Feature Store",
        category: "Enrichment",
        status: "Active",
        tech: ["Vertex AI Feature Store", "Redis Online Store"],
        desc: "Maintains a central repository of machine learning features, serving them at ultra-low latency for online predictions and ensuring feature consistency during training.",
        inputs: ["T1 Curated Data", "T2 Analytical Datasets"],
        outputs: ["Real-time Feature Values for ML Models"],
        role: "Eliminates train-serve skew for ML serving pipelines."
      }
    ],
    graph: [
      {
        id: "enr-neo4j",
        name: "Neo4j Graph Database",
        category: "Enrichment",
        status: "Optional",
        tech: ["Neo4j Enterprise", "Cypher Query Language"],
        desc: "Graph database deployed to store complex connections between passenger journeys, loyalty networks, baggage paths, and flight connections.",
        inputs: ["Passenger Profiles", "Baggage Routing Coordinates", "Transaction Associations"],
        outputs: ["Adjacency Graphs", "Path Finding Network Metrics"],
        role: "Powers advanced fraud detection and customer relationship network analysis."
      }
    ]
  },

  // Column 5: Consumption
  consumption: {
    reporting: [
      {
        id: "con-looker",
        name: "Looker (BI Reports)",
        category: "Consumption",
        status: "Active",
        tech: ["Looker Dashboard Client"],
        desc: "Enterprise reporting dashboard interface serving self-service dashboards, schedule reports, and exploratory queries to business stakeholders.",
        inputs: ["Looker Semantic Models"],
        outputs: ["Interactive Executive Dashboards", "Alert Notifications"],
        role: "Primary business exploration interface for CAG managers."
      },
      {
        id: "con-tableau",
        name: "Tableau",
        category: "Consumption",
        status: "Active",
        tech: ["Tableau Server", "BigQuery Connector"],
        desc: "Visual analysis platform utilized by CAG planning divisions to perform spatial overlays of terminal passenger flows and load schedules.",
        inputs: ["BQ Data Marts", "Aviation Datasets"],
        outputs: ["Terminal Load Maps", "Traffic Distribution Forecasts"],
        role: "Highly tailored visual dashboarding tool for specialized operations."
      },
      {
        id: "con-microstrategy",
        name: "MicroStrategy",
        category: "Consumption",
        status: "Active",
        tech: ["MicroStrategy Analytics Platform"],
        desc: "System used for governed enterprise reporting, financial auditing, and scheduled grid-report distributions to airport tenants.",
        inputs: ["Governed BQ Data Marts"],
        outputs: ["Automated PDF Financial Reports", "Audit Registers"],
        role: "Backbone of tenant billing validation and financial governance reporting."
      }
    ],
    ai: [
      {
        id: "con-gemini",
        name: "Gemini AI Portal",
        category: "Consumption",
        status: "Active",
        tech: ["Gemini 1.5 Pro API", "Vertex AI Agent Builder"],
        desc: "Drives conversational AI actions. Users query the data platform using natural language (e.g. 'Compare terminal passenger traffic for yesterday vs last year') and receive formatted charts.",
        inputs: ["Looker Semantic Metadata", "BigQuery Vector Indexes"],
        outputs: ["Natural Language Answers", "Generated SQL Queries"],
        role: "Democratizes access to data platform queries for non-technical employees."
      }
    ],
    sharing: [
      {
        id: "con-analytics-hub",
        name: "Analytics Hub",
        category: "Consumption",
        status: "Active",
        tech: ["BigQuery Analytics Hub", "Secure Data Sharing"],
        desc: "Provides secure data sharing capabilities, letting CAG publish anonymized passenger statistics and flight logs to partner airlines and retail vendors.",
        inputs: ["Anonymized T2 Consumption Datasets"],
        outputs: ["Shared BQ Datasets (External Projects)"],
        role: "Commercial B2B data exchange portal driving collaborative airport ecosystem partnerships."
      }
    ],
    mlServing: [
      {
        id: "con-vertex-serving",
        name: "Vertex AI ML Serving & Pipelines",
        category: "Consumption",
        status: "Active",
        tech: ["Vertex AI Endpoints", "Triton Server", "Cloud Run"],
        desc: "Hosts trained ML models on auto-scaling endpoints. Runs batch prediction pipelines and serves real-time inference requests (e.g., baggage delay forecasting).",
        inputs: ["Live operational parameters", "Vertex Feature Store"],
        outputs: ["Predictive Scoring (JSON Responses)", "Scheduled batch predictions"],
        role: "Delivers production-grade ML inference to operational airport systems."
      }
    ]
  },

  // Cross-cutting Layers
  composer: {
    id: "layer-composer",
    name: "Cloud Composer",
    category: "Orchestration",
    status: "Active",
    tech: ["Apache Airflow", "Python DAGs"],
    desc: "Fully managed workflow orchestration service built on Apache Airflow. Schedules, coordinates, and monitors all data extraction, ingestion, and warehouse transformation pipelines.",
    inputs: ["DAG definitions", "System triggers"],
    outputs: ["Pipeline execution statuses", "Workflow logs"],
    role: "Central coordinator ensuring pipelines execute in correct order with retry logic."
  },
  
  security: [
    {
      id: "sec-iam",
      name: "Identity & Access Management (IAM)",
      category: "Security & Operations",
      status: "Active",
      tech: ["GCP IAM Policies", "Service Accounts", "Group Roles"],
      desc: "Controls identity-based access across all Google Cloud services in the platform. Defines granular permissions for data engineers, analysts, and automated pipelines.",
      inputs: ["Active Directory Sync", "User Roles"],
      outputs: ["Access Control Tokens", "Policy Bindings"],
      role: "Core security layer enforcing principle of least privilege."
    },
    {
      id: "sec-kms",
      name: "Cloud Key Management Service (KMS)",
      category: "Security & Operations",
      status: "Active",
      tech: ["Customer Managed Encryption Keys (CMEK)"],
      desc: "Manages cryptographic keys to encrypt and decrypt sensitive data fields (like Changi Rewards member IDs) at rest across BigQuery, GCS, and Pub/Sub.",
      inputs: ["Key Rotation Policies"],
      outputs: ["Active CryptoKeys"],
      role: "Provides physical security keys for sensitive field-level and storage encryption."
    },
    {
      id: "sec-security",
      name: "Security & Compliance Center",
      category: "Security & Operations",
      status: "Active",
      tech: ["Security Command Center", "Compliance Reports"],
      desc: "Monitors platform vulnerabilities, detects security misconfigurations, and tracks compliance against data sovereignty regulations.",
      inputs: ["Platform Logs", "Asset Configurations"],
      outputs: ["Threat Alerts", "Compliance Scorecards"],
      role: "Aggregated security dashboard for CAG Risk Management audits."
    },
    {
      id: "sec-logging",
      name: "Logging & Monitoring (Cloud Logging/Monitoring)",
      category: "Security & Operations",
      status: "Active",
      tech: ["Cloud Logging", "Cloud Monitoring", "Muck Alerts"],
      desc: "Centralized logging storage and metric dashboarding. Monitors system health, tracks pipeline runtimes, and triggers automated PagerDuty alerts for system errors.",
      inputs: ["System Stdout Logs", "CPU/Memory Telemetry"],
      outputs: ["Alert Actions", "Unified Dashboard Metrics"],
      role: "Operational visibility hub for the site reliability team."
    },
    {
      id: "sec-capacity",
      name: "Capacity Planner, Backup & DR, App Hub",
      category: "Security & Operations",
      status: "Active",
      tech: ["Cloud Storage Backups", "Cross-Region Replication", "App Hub"],
      desc: "Manages database backups, configures cross-region disaster recovery routes, and maps application resources in GCP App Hub for organizational monitoring.",
      inputs: ["Disaster Recovery Mandates", "Storage Schedules"],
      outputs: ["Snapshot Archives", "Failover Scripts"],
      role: "Ensures business continuity and continuous uptime under terminal incidents."
    },
    {
      id: "sec-registry",
      name: "Artifact Registry",
      category: "Security & Operations",
      status: "Active",
      tech: ["GCP Artifact Registry", "Docker Containers"],
      desc: "Stores build artifacts, container images for Cloud Run Functions and Composer tasks, and library packages (Python wheels, JARs) used in Spark/Dataflow.",
      inputs: ["CI/CD Pipeline Build Artifacts"],
      outputs: ["Secure Container Blobs for Execution"],
      role: "Version-control vault securing execution codes and container environments."
    },
    {
      id: "sec-dlp",
      name: "Cloud DLP (Data Loss Prevention)",
      category: "Security & Operations",
      status: "Active",
      tech: ["Sensitive Data Inspection API", "De-identification Templates"],
      desc: "Inspects pipelines for personally identifiable information (PII) like passports and emails. Masks, hashes, or tokens sensitive data before it reaches T0/T1 storage.",
      inputs: ["Raw Ingest Streams"],
      outputs: ["De-identified Data Streams"],
      role: "Automated privacy shield guarding customer personal details from data analysts."
    }
  ],
  
  dataplex: {
    id: "layer-dataplex",
    name: "Dataplex",
    category: "Data Governance",
    status: "Active",
    tech: ["Google Cloud Dataplex"],
    desc: "An intelligent data fabric that enables unified data management, quality controls, security policy distribution, and lineage mapping across the distributed data lakes.",
    inputs: ["Metadata feeds from GCS and BigQuery"],
    outputs: ["Data Quality Metrics", "Lineage Graphs", "Unified Access Controls"],
    role: "Orchestrating entity for the enterprise data governance layer."
  },
  
  governance: [
    {
      id: "gov-quality",
      name: "Data Quality Management",
      category: "Data Governance",
      status: "Active",
      tech: ["Dataplex Data Quality", "Great Expectations"],
      desc: "Runs automated quality checks (null validations, format checks, schema enforcement) on datasets at ingest and storage checkpoints.",
      inputs: ["Curated Data Lake tables"],
      outputs: ["Data Quality Alert Reports"],
      role: "Guarantees reports and forecasting models ingest highly clean data."
    },
    {
      id: "gov-lineage",
      name: "Data Lineage",
      category: "Data Governance",
      status: "Active",
      tech: ["Dataplex Lineage API", "Dataform Logs"],
      desc: "Maps the lifecycle of data from initial source (e.g. POS terminal) through transformations (Dataform, Dataflow) down to looker consumption dashboards.",
      inputs: ["Pipeline Execution Contexts"],
      outputs: ["Interactive Lineage Dependency Graphs"],
      role: "Crucial for dependency analysis and reporting audit validations."
    },
    {
      id: "gov-lifecycle",
      name: "Lifecycle Management",
      category: "Data Governance",
      status: "Active",
      tech: ["GCS Object Lifecycle Policies", "BigQuery Table Expiration"],
      desc: "Applies automated rules to archive, delete, or move data to colder storage tiers (e.g., Coldline, Archive) as it ages.",
      inputs: ["Storage Retention Mandates"],
      outputs: ["Table Expiration Schedules"],
      role: "Optimizes cloud storage costs and enforces statutory data retention policies."
    },
    {
      id: "gov-unified-sec",
      name: "Unified Security & Governance",
      category: "Data Governance",
      status: "Active",
      tech: ["Dataplex Access Policies", "Tag-based IAM"],
      desc: "Distributes security access tags down to table rows and columns dynamically, matching security tags with user groups across all lakes.",
      inputs: ["Corporate Security Directives"],
      outputs: ["Dynamic Column-level Masking Rules"],
      role: "Centralizes row/column level access control, eliminating redundant permissions management."
    },
    {
      id: "gov-catalog",
      name: "Data Catalog & Discovery",
      category: "Data Governance",
      status: "Active",
      tech: ["Dataplex Catalog", "Metadata Tag Templates"],
      desc: "A search-driven catalog index allowing analysts to search, discover, and tag databases using standardized business metadata tags.",
      inputs: ["Database Schemas", "Business Glossary definitions"],
      outputs: ["Searchable Catalog Index"],
      role: "Empowers data discovery and self-service analytics search."
    }
  ]
};

const L2_DATA = {
  // Layer 1: Consumption Channels
  consumption: {
    physical: [
      { id: "l2c-iot", name: "IoT Devices", category: "Physical Channels", status: "Active", desc: "Sensors, smart tags, and physical tracking beacons reporting operational events from terminal floors." },
      { id: "l2c-kiosks", name: "Kiosks", category: "Physical Channels", status: "Active", desc: "Interactive check-in screens, retail directories, and bag-drop monitors located within terminals." },
      { id: "l2c-wearables", name: "Wearables", category: "Physical Channels", status: "Active", desc: "Smart watches and handheld industrial scanners worn by ground crew and safety operations personnel." }
    ],
    center: {
      id: "l2c-center",
      name: "Data & AI Consumption Layer",
      category: "Consumption Core",
      status: "Active",
      tech: ["API Gateway", "Websockets", "gRPC Engines"],
      desc: "The central integration layer coordinating real-time data ingestion and generative AI replies between active terminal channels and base AI pipelines.",
      inputs: ["Physical Channel Actions", "Digital Client Queries"],
      outputs: ["Rendered Dashboards", "Operational Command Messages"],
      role: "Orchestration bridge connecting physical/digital endpoints with base engine analytics."
    },
    digital: [
      { id: "l2c-portal", name: "Portal (Web Client)", category: "Digital Channels", status: "Active", desc: "The central corporate web-portal and public facing iChangi web services." },
      { id: "l2c-mobile", name: "Mobile App", category: "Digital Channels", status: "Active", desc: "Native iOS/Android passenger applications supplying flight tracking, shopping checkout, and rewards." },
      { id: "l2c-api", name: "3rd Party APIs", category: "Digital Channels", status: "Active", desc: "External gateways feeding codes, schedules, and metrics to partner airlines and travel networks." }
    ]
  },

  // Layer 2: UDAIP Foundation
  foundation: {
    provisioning: [
      { id: "l2f-marketplace", name: "External Marketplace", category: "Provisioning", status: "Active", desc: "Monetized API registry delivering airport traffic indices to external businesses." },
      { id: "l2f-visualization", name: "Visualization Tools", category: "Provisioning", status: "Active", desc: "Pre-configured templates and libraries enabling fast UI generation for new analytics models." },
      { id: "l2f-regulatory", name: "Regulatory Reporting", category: "Provisioning", status: "Active", desc: "Compliance generators mapping platform parameters to government aviation standards." },
      { id: "l2f-conversational", name: "Conversational Analytics", category: "Provisioning", status: "Active", desc: "Natural language query handlers translating text inputs into relational database searches." },
      { id: "l2f-experimentation", name: "Experimentation Sandbox", category: "Provisioning", status: "Active", desc: "Isolated compute spaces for testing candidate models on mock datasets." }
    ],
    services: [
      { id: "l2f-selfservice", name: "Self Service", category: "Foundation Service", status: "Active", desc: "No-code portal enabling CAG staff to spin up standard virtual notebooks and database buckets." },
      { id: "l2f-sharing", name: "Data Sharing Hub", category: "Foundation Service", status: "Active", desc: "Governed secure share point managing peer-to-peer dataset distributions with external vendors." },
      { id: "l2f-search", name: "Enterprise Search", category: "Foundation Service", status: "Active", desc: "Semantic indexing service facilitating instant search queries across all platform assets." }
    ]
  },

  // Layer 3: Engines
  engines: {
    dataOperating: {
      integration: [
        { id: "l2doe-batch", name: "Batch Pipelines", category: "DOE Integration", status: "Active", desc: "Extracts large structural logs from SAP and operational archives on daily schedules." },
        { id: "l2doe-nearrealtime", name: "Near Real Time Pipelines", category: "DOE Integration", status: "Active", desc: "15-minute micro-batch updates tracking flight rosters and baggage milestones." },
        { id: "l2doe-realtime", name: "Real Time Ingestion", category: "DOE Integration", status: "Active", desc: "Zero-latency streaming pipeline routing sensor metrics and user clickstreams." }
      ],
      engineering: [
        { id: "l2doe-transform", name: "Transformations", category: "DOE Engineering", status: "Active", desc: "Code compilers formatting, cleaning, and normalising schemas across platform zones." },
        { id: "l2doe-orchestration", name: "Workflow Orchestration", category: "DOE Engineering", status: "Active", desc: "Workflow coordinators scheduling pipeline execution sequences and monitoring error status." }
      ],
      storage: [
        { id: "l2doe-bronze", name: "Bronze Lake (Raw)", category: "DOE Storage", status: "Active", desc: "Preserves exact landing copies of ingested schemas without modifications." },
        { id: "l2doe-silver", name: "Silver Lake (Cleansed)", category: "DOE Storage", status: "Active", desc: "Holds deduplicated, validated, and standard-formatted data records." },
        { id: "l2doe-gold", name: "Gold Lake (Business)", category: "DOE Storage", status: "Active", desc: "Stores business-ready structured tables tailored for dashboard reporting." }
      ],
      modelling: [
        { id: "l2doe-ods", name: "Operational Data Store (ODS)", category: "DOE Modelling", status: "Active", desc: "Integrated database maintaining current operational status values (e.g. active aircraft at gate)." }
      ],
      footer: { id: "l2doe-ops", name: "DataOps", category: "Data Operating Engine", status: "Active", desc: "Automated test assertions, CI/CD pipeline version controls, and schema registry protections." }
    },
    
    productModelling: {
      domainProducts: [
        { id: "l2pme-foundational", name: "Foundational Data Products", category: "PME Domain", status: "Active", desc: "Cleaned core datasets like Customer Master or Flight Ledger exposed as reusable modules." },
        { id: "l2pme-enterprise", name: "Enterprise Data Products", category: "PME Domain", status: "Active", desc: "Aggregated global tables detailing passenger volumes or total airport sales logs." },
        { id: "l2pme-business", name: "Business Data Products", category: "PME Domain", status: "Active", desc: "Unit-specific reports tailored for retail teams or airside logistics managers." }
      ],
      semantic: [
        { id: "l2pme-graph", name: "Knowledge Graph", category: "PME Semantic", status: "Active", desc: "Relational maps linking entity records (Passenger to Flight to Reward Points) dynamically." },
        { id: "l2pme-ontology", name: "Ontology (Semantic/Kinetic/Dynamic)", category: "PME Semantic", status: "Active", desc: "Defines rules, properties, and relationships detailing how airport entities react to operational shifts." }
      ]
    },

    analyticsAI: {
      analytics: [
        { id: "l2aae-dashboards", name: "Dashboards & Visualization", category: "AAE Analytics", status: "Active", desc: "Sleek frontend dashboard interfaces exposing charts and telemetry parameters." },
        { id: "l2aae-bi", name: "BI Reporting", category: "AAE Analytics", status: "Active", desc: "Ad-hoc query engines allowing users to export financial tables and operational KPIs." },
        { id: "l2aae-alerts", name: "Alerts & Distribution", category: "AAE Analytics", status: "Active", desc: "Trigger monitors dispatching operational notifications when parameters exceed thresholds." }
      ],
      core: [
        { id: "l2aae-aiml", name: "AI/ML Engine", category: "AAE Core", status: "Active", desc: "Predictive model host executing baggage delay regressions and queuing predictions." },
        { id: "l2aae-genai", name: "Gen AI Engine", category: "AAE Core", status: "Active", desc: "Generates text summaries and processes unstructured passenger feedback forms." },
        { id: "l2aae-agentic", name: "Agentic AI System", category: "AAE Core", status: "Active", desc: "Autonomously acts on insights, executing actions like routing baggage handlers upon predicting delays." },
        { id: "l2aae-marketplace", name: "Agent Marketplace", category: "AAE Core", status: "Active", desc: "Registry of pre-built operational AI agents that can be integrated into unit pipelines." }
      ],
      footer: { id: "l2aae-aiops", name: "AIOps / MLOps / LLMOps", category: "Analytics & AI Engine", status: "Active", desc: "Unified control system hosting Model Registries, prompt templates, and agent pipeline observability trackers." }
    }
  },

  // Layer 4: Unified Governance Layer
  governance: {
    security: [
      { name: "Identity & Access Management", desc: "Governs platform user directory permissions." },
      { name: "Secrets & Key Management", desc: "Safeguards API keys, database credentials, and encryption keys." },
      { name: "Data Protection & Classification", desc: "Applies confidentiality tags to incoming columns." },
      { name: "Data Masking", desc: "Obfuscates sensitive passenger values on non-authorized screens." },
      { name: "Data Encryption", desc: "Protects data integrity both in transit and at rest in lakes." },
      { name: "Auditing", desc: "Captures system access logs mapping who query what values." },
      { name: "Guardrails", desc: "Protects LLM calls against prompt injections." },
      { name: "Policy Engine", desc: "Enforces data access boundaries dynamically." }
    ],
    dataGov: [
      { name: "Metadata Management", desc: "Maintains schema registers and data descriptions." },
      { name: "Master Data Management", desc: "Synchronizes core customer and airline registers." },
      { name: "Data Lineage", desc: "Maps transform paths from raw landing to dashboard." },
      { name: "Reference Data Management", desc: "Standardizes lookup value codes (e.g. airport IATA definitions)." },
      { name: "Data Profiling", desc: "Inspects columns to extract statistics (null percentages, ranges)." },
      { name: "Data Quality", desc: "Applies validation assertions at pipeline checkpoints." },
      { name: "Business Glossary", desc: "Standardizes definitions of corporate metrics." }
    ],
    aiGov: [
      { name: "Guardrails Evaluation", desc: "Audits safety configurations on active agent pipelines." },
      { name: "Observability Responsible AI", desc: "Tracks model bias parameters and input distribution shifts." },
      { name: "Access Controls", desc: "Isolates LLM models from unauthorized user query prompts." },
      { name: "Policy Definitions & Enforcements", desc: "Schedules statutory guidelines on AI responses." },
      { name: "Audit Trials & Availability", desc: "Logs historical agent decisions for diagnostic reviews." },
      { name: "Security & Compliance", desc: "Validates security compliance of generative agents." },
      { name: "Hallucination Audit", desc: "Applies validators reviewing model outputs for fact accuracy." }
    ]
  },

  // Layer 5: Base Platforms (9 Columns)
  basePlatform: [
    { title: "Infrastructure", items: [{ name: "Infrastructure-as-a-Service", desc: "Virtual compute nodes, memory clusters, and high-performance file shares." }, { name: "Backup & Disaster Recovery", desc: "Automated snapshot generation and database replicas across active-active cloud regions." }] },
    { title: "Networking", items: [{ name: "Networking & Connectivity", desc: "Dedicated express routes, load balancing configurations, and private subnets." }, { name: "Patch & Upgrade Management", desc: "Automated OS patching schedules and hardware upgrade cycles." }] },
    { title: "Orchestration", items: [{ name: "Orchestration", desc: "Kubernetes engine clusters scheduling running container routines." }, { name: "Elasticity & Scaling", desc: "Auto-scalers adjusting compute clusters dynamically based on operational query demands." }] },
    { title: "Compute", items: [{ name: "Multi-Tenancy", desc: "Isolates project database allocations across CAG departments." }, { name: "GPU Acceleration", desc: "High-throughput GPU nodes for AI model training pipelines." }] },
    { title: "Security", items: [{ name: "Perimeter Security", desc: "Firewall rule settings and DDoS protection gateways." }, { name: "Compute Orchestration", desc: "Secures VM allocation pipelines and container workloads." }] },
    { title: "Monitoring", items: [{ name: "Platform Monitoring", desc: "Operational dashboards tracking VM health metrics." }, { name: "Container Orchestration", desc: "Secures container lifecycles across Kubernetes environments." }] },
    { title: "Logs", items: [{ name: "Log Management", desc: "Centralized logging storage mapping all platform system logs." }, { name: "DevSecOps", desc: "Automates code security audits within the release pipeline." }] },
    { title: "Observability", items: [{ name: "Observability", desc: "Application traces mapping pipeline performance." }, { name: "AIOps", desc: "AI-driven operational alerts diagnosing platform resource errors." }] },
    { title: "LLM Integration", items: [{ name: "LLM Integration/Hosting", desc: "Maintains offline vector databases and prompt registers." }, { name: "Multimodal Compute Services", desc: "Exposes scalable compute spaces processing audio, video, and image feeds." }] }
  ]
};

// Global cache of all nodes for fast search lookups
let ALL_NODES = [];

// ==========================================================================
// CARD CREATION & RENDERING LOGIC
// ==========================================================================

function createNodeCardHTML(node, isStatusDot = true) {
  const isOptional = node.status && node.status.toLowerCase() === "optional";
  const statusClass = isOptional ? "optional" : "";
  const metaText = node.tech && node.tech.length > 0 ? node.tech[0] : (node.category || "");
  
  return `
    <div class="node-card" id="${node.id}" data-search="${node.name.toLowerCase()} ${node.desc.toLowerCase()} ${(node.tech || []).join(' ').toLowerCase()}">
      ${isStatusDot ? `<span class="node-status-dot ${statusClass}" title="Status: ${node.status}"></span>` : ''}
      <div class="node-icon-wrapper">
        ${getIconSVG(node.id)}
      </div>
      <div class="node-info">
        <span class="node-name">${node.name}</span>
        <span class="node-meta">${metaText}</span>
      </div>
    </div>
  `;
}

function renderL1() {
  // 1. Sources Grid
  const sourcesContainer = document.querySelector(".sources-grid");
  sourcesContainer.innerHTML = L1_DATA.sources.map(s => createNodeCardHTML(s)).join("");
  L1_DATA.sources.forEach(n => ALL_NODES.push({ ...n, view: "l1" }));

  // 2. Ingestion Sub-categories
  const eventIngest = document.querySelector("#cat-event-ingest .sub-category-items");
  eventIngest.innerHTML = L1_DATA.ingestion.eventDriven.map(n => createNodeCardHTML(n)).join("");
  L1_DATA.ingestion.eventDriven.forEach(n => ALL_NODES.push({ ...n, view: "l1" }));

  const batchIngest = document.querySelector("#cat-batch-ingest .sub-category-items");
  batchIngest.innerHTML = L1_DATA.ingestion.batchStream.map(n => createNodeCardHTML(n)).join("");
  L1_DATA.ingestion.batchStream.forEach(n => ALL_NODES.push({ ...n, view: "l1" }));

  const pubsubIngest = document.querySelector("#cat-pubsub-ingest .sub-category-items");
  pubsubIngest.innerHTML = L1_DATA.ingestion.pubsub.map(n => createNodeCardHTML(n)).join("");
  L1_DATA.ingestion.pubsub.forEach(n => ALL_NODES.push({ ...n, view: "l1" }));

  // 3. Storage Lake Stages (T0 - T3)
  const lakeT0List = document.querySelector("#lake-t0 .lake-item-list");
  lakeT0List.innerHTML = L1_DATA.storage.t0.items.map((it, idx) => `
    <li class="lake-list-item clickable-lake-item" id="l1-lake-t0-${idx}" 
        data-name="Raw Lake: ${it.name}" data-category="Storage Zone" data-desc="${it.desc}">
      ${it.name}
    </li>
  `).join("");
  L1_DATA.storage.t0.items.forEach((it, idx) => {
    ALL_NODES.push({
      id: `l1-lake-t0-${idx}`,
      name: `Raw Lake: ${it.name}`,
      category: "Storage Zone (T0)",
      status: "Active",
      tech: ["Google Cloud Storage"],
      desc: it.desc,
      inputs: ["Ingestion Pipeline Outputs"],
      outputs: ["Curated Lake (T1) Pipeline Inputs"],
      role: "Secure raw repository preserving input schemas for auditing.",
      view: "l1"
    });
  });

  const lakeT1List = document.querySelector("#lake-t1 .lake-item-list");
  lakeT1List.innerHTML = L1_DATA.storage.t1.items.map((it, idx) => `
    <li class="lake-list-item clickable-lake-item" id="l1-lake-t1-${idx}"
        data-name="Curated Lake: ${it.name}" data-category="Storage Zone" data-desc="${it.desc}">
      ${it.name}
    </li>
  `).join("");
  L1_DATA.storage.t1.items.forEach((it, idx) => {
    ALL_NODES.push({
      id: `l1-lake-t1-${idx}`,
      name: `Curated Lake: ${it.name}`,
      category: "Storage Zone (T1)",
      status: "Active",
      tech: ["BigQuery", "Dataplex Quality Guards"],
      desc: it.desc,
      inputs: ["Raw (T0) Lake Files"],
      outputs: ["Consumption (T2) Analytics Datasets"],
      role: "Validates and standardizes records prior to business joins.",
      view: "l1"
    });
  });

  const lakeT2List = document.querySelector("#lake-t2 .lake-item-list");
  lakeT2List.innerHTML = L1_DATA.storage.t2.items.map((it, idx) => `
    <li class="lake-list-item clickable-lake-item" id="l1-lake-t2-${idx}"
        data-name="Consumption Lake: ${it.name}" data-category="Storage Zone" data-desc="${it.desc}">
      ${it.name}
    </li>
  `).join("");
  L1_DATA.storage.t2.items.forEach((it, idx) => {
    ALL_NODES.push({
      id: `l1-lake-t2-${idx}`,
      name: `Consumption Lake: ${it.name}`,
      category: "Storage Zone (T2)",
      status: "Active",
      tech: ["BigQuery Table Partitioning", "BigQuery Object Tables"],
      desc: it.desc,
      inputs: ["Curated (T1) Cleansed Schemas"],
      outputs: ["Looker Models", "Gemini Inquiries", "AI/ML Pipelines"],
      role: "Primary storage space exposing production-grade tables to business layers.",
      view: "l1"
    });
  });

  const lakeT3List = document.querySelector("#lake-t3 .lake-item-list");
  lakeT3List.innerHTML = L1_DATA.storage.t3.items.map((it, idx) => `
    <li class="lake-list-item clickable-lake-item" id="l1-lake-t3-${idx}"
        data-name="Research Lake: ${it.name}" data-category="Storage Zone" data-desc="${it.desc}">
      ${it.name}
    </li>
  `).join("");
  L1_DATA.storage.t3.items.forEach((it, idx) => {
    ALL_NODES.push({
      id: `l1-lake-t3-${idx}`,
      name: `Research Lake: ${it.name}`,
      category: "Storage Zone (T3)",
      status: "Active",
      tech: ["BigQuery Sandboxes", "Vertex AI Storage Connects"],
      desc: it.desc,
      inputs: ["Consumption (T2) Datasets"],
      outputs: ["Vertex AI Training Runs", "Candidate ML Models"],
      role: "Isolated research playground for data science modeling and sandbox queries.",
      view: "l1"
    });
  });

  // Processing & Data Science inside storage/processing
  const processingItems = document.querySelector("#cat-processing-transform .sub-category-items");
  processingItems.innerHTML = L1_DATA.storage.processing.map(n => createNodeCardHTML(n)).join("");
  L1_DATA.storage.processing.forEach(n => ALL_NODES.push({ ...n, view: "l1" }));

  const dataScienceItems = document.querySelector("#cat-data-science .sub-category-items");
  dataScienceItems.innerHTML = L1_DATA.storage.science.map(n => createNodeCardHTML(n)).join("");
  L1_DATA.storage.science.forEach(n => ALL_NODES.push({ ...n, view: "l1" }));

  // 4. Enrichment
  const enrichSemantic = document.querySelector("#cat-enrich-semantic .sub-category-items");
  enrichSemantic.innerHTML = L1_DATA.enrichment.semantic.map(n => createNodeCardHTML(n)).join("");
  L1_DATA.enrichment.semantic.forEach(n => ALL_NODES.push({ ...n, view: "l1" }));

  const enrichGraph = document.querySelector("#cat-enrich-graph .sub-category-items");
  enrichGraph.innerHTML = L1_DATA.enrichment.graph.map(n => createNodeCardHTML(n)).join("");
  L1_DATA.enrichment.graph.forEach(n => ALL_NODES.push({ ...n, view: "l1" }));

  // 5. Consumption
  const consumeReporting = document.querySelector("#cat-consume-reporting .sub-category-items");
  consumeReporting.innerHTML = L1_DATA.consumption.reporting.map(n => createNodeCardHTML(n)).join("");
  L1_DATA.consumption.reporting.forEach(n => ALL_NODES.push({ ...n, view: "l1" }));

  const consumeAI = document.querySelector("#cat-consume-ai .sub-category-items");
  consumeAI.innerHTML = L1_DATA.consumption.ai.map(n => createNodeCardHTML(n)).join("");
  L1_DATA.consumption.ai.forEach(n => ALL_NODES.push({ ...n, view: "l1" }));

  const consumeSharing = document.querySelector("#cat-consume-sharing .sub-category-items");
  consumeSharing.innerHTML = L1_DATA.consumption.sharing.map(n => createNodeCardHTML(n)).join("");
  L1_DATA.consumption.sharing.forEach(n => ALL_NODES.push({ ...n, view: "l1" }));

  const consumeServing = document.querySelector("#cat-consume-serving .sub-category-items");
  consumeServing.innerHTML = L1_DATA.consumption.mlServing.map(n => createNodeCardHTML(n)).join("");
  L1_DATA.consumption.mlServing.forEach(n => ALL_NODES.push({ ...n, view: "l1" }));

  // Orchestration & Dataplex
  const composerContainer = document.querySelector("#l1-composer-container");
  composerContainer.innerHTML = createNodeCardHTML(L1_DATA.composer);
  ALL_NODES.push({ ...L1_DATA.composer, view: "l1" });

  const dataplexNode = document.querySelector("#l1-dataplex-node");
  dataplexNode.innerHTML = createNodeCardHTML(L1_DATA.dataplex);
  ALL_NODES.push({ ...L1_DATA.dataplex, view: "l1" });

  // Security Operations pills
  const securityContainer = document.querySelector("#l1-security-container");
  securityContainer.innerHTML = L1_DATA.security.map(n => createNodeCardHTML(n)).join("");
  L1_DATA.security.forEach(n => ALL_NODES.push({ ...n, view: "l1" }));

  // Dataplex capabilities
  const govItems = document.querySelector("#l1-gov-items");
  govItems.innerHTML = L1_DATA.governance.map(n => createNodeCardHTML(n)).join("");
  L1_DATA.governance.forEach(n => ALL_NODES.push({ ...n, view: "l1" }));
}

function renderL2() {
  // 1. Consumption channels
  const physicalChannels = document.querySelector("#l2-physical-channels .channel-items");
  physicalChannels.innerHTML = L2_DATA.consumption.physical.map(n => createNodeCardHTML(n, false)).join("");
  L2_DATA.consumption.physical.forEach(n => ALL_NODES.push({ ...n, status: "Active", tech: ["MQTT / gRPC"], inputs: ["Sensor/Hardware States"], outputs: ["Data & AI Consumption Gateway"], role: "Physical terminal interfaces capturing field events.", view: "l2" }));

  const consumptionCenter = document.querySelector("#l2-consumption-center");
  consumptionCenter.innerHTML = createNodeCardHTML(L2_DATA.consumption.center);
  ALL_NODES.push({ ...L2_DATA.consumption.center, view: "l2" });

  const digitalChannels = document.querySelector("#l2-digital-channels .channel-items");
  digitalChannels.innerHTML = L2_DATA.consumption.digital.map(n => createNodeCardHTML(n, false)).join("");
  L2_DATA.consumption.digital.forEach(n => ALL_NODES.push({ ...n, status: "Active", tech: ["JSON REST / GA4 Websockets"], inputs: ["Mobile/Web User Clickpaths"], outputs: ["Data & AI Consumption Gateway"], role: "Digital endpoints generating online clickstreams.", view: "l2" }));

  // 2. UDAIP Foundation
  const provisioningItems = document.querySelector("#l2-provisioning .provisioning-items");
  provisioningItems.innerHTML = L2_DATA.foundation.provisioning.map(n => createNodeCardHTML(n, false)).join("");
  L2_DATA.foundation.provisioning.forEach(n => ALL_NODES.push({ ...n, status: "Active", tech: ["Self-service APIs"], inputs: ["Platform resources Catalog"], outputs: ["New workspace deployments"], role: "Standardized environments facilitating data modeling.", view: "l2" }));

  const servicesGroup = document.querySelector("#l2-foundation-services");
  servicesGroup.innerHTML = L2_DATA.foundation.services.map(n => createNodeCardHTML(n, false)).join("");
  L2_DATA.foundation.services.forEach(n => ALL_NODES.push({ ...n, status: "Active", tech: ["Security access tokens"], inputs: ["Internal files databases"], outputs: ["Catalog indexes", "Secure sharing shares"], role: "Facilitates discovery and distribution of platform assets.", view: "l2" }));

  // 3. Data Operating Engine
  const doeSections = document.querySelector("#l2-doe-sections");
  doeSections.innerHTML = `
    <div class="sub-category-card">
      <span class="sub-category-title">Integration</span>
      <div class="sub-category-items">${L2_DATA.engines.dataOperating.integration.map(n => createNodeCardHTML(n, false)).join("")}</div>
    </div>
    <div class="sub-category-card">
      <span class="sub-category-title">Data Engineering</span>
      <div class="sub-category-items">${L2_DATA.engines.dataOperating.engineering.map(n => createNodeCardHTML(n, false)).join("")}</div>
    </div>
    <div class="sub-category-card">
      <span class="sub-category-title">Data Storage</span>
      <div class="sub-category-items flex-row">${L2_DATA.engines.dataOperating.storage.map(n => createNodeCardHTML(n, false)).join("")}</div>
    </div>
    <div class="sub-category-card">
      <span class="sub-category-title">Data Modelling</span>
      <div class="sub-category-items">${L2_DATA.engines.dataOperating.modelling.map(n => createNodeCardHTML(n, false)).join("")}</div>
    </div>
  `;
  // Push DOE nodes to global array
  L2_DATA.engines.dataOperating.integration.forEach(n => ALL_NODES.push({ ...n, status: "Active", tech: ["Ingestion Drivers"], inputs: ["Sources Feeds"], outputs: ["Raw Storage (Bronze)"], role: "Ingestion pathways buffering source schemas.", view: "l2" }));
  L2_DATA.engines.dataOperating.engineering.forEach(n => ALL_NODES.push({ ...n, status: "Active", tech: ["ETL Engines"], inputs: ["Bronze Lake Tables"], outputs: ["Silver Lake Tables"], role: "Executes format parsing and cleansing scripts.", view: "l2" }));
  L2_DATA.engines.dataOperating.storage.forEach(n => ALL_NODES.push({ ...n, status: "Active", tech: ["Data Lakes Tiers"], inputs: ["Ingestion pipeline writes"], outputs: ["Consumption queries"], role: "Organizes platform tables into medallion quality tiers.", view: "l2" }));
  L2_DATA.engines.dataOperating.modelling.forEach(n => ALL_NODES.push({ ...n, status: "Active", tech: ["Structured databases"], inputs: ["Silver Medallion Tables"], outputs: ["Business dashboard queries"], role: "Exposes active relational models detailing airport logs.", view: "l2" }));
  
  const doeFooter = document.querySelector("#l2-doe-footer");
  doeFooter.innerHTML = createNodeCardHTML(L2_DATA.engines.dataOperating.footer, false);
  ALL_NODES.push({ ...L2_DATA.engines.dataOperating.footer, tech: ["CI/CD Git Pipelines", "Testing Hooks"], inputs: ["Engineering script updates"], outputs: ["Active production builds"], role: "Maintains code standards and testing pipelines across DOE.", view: "l2" });

  // 4. Product Modelling Engine
  const pmeSections = document.querySelector("#l2-pme-sections");
  pmeSections.innerHTML = `
    <div class="sub-category-card">
      <span class="sub-category-title">Domain Data Products</span>
      <div class="sub-category-items">${L2_DATA.engines.productModelling.domainProducts.map(n => createNodeCardHTML(n, false)).join("")}</div>
    </div>
    <div class="sub-category-card">
      <span class="sub-category-title">Semantic Layer</span>
      <div class="sub-category-items">${L2_DATA.engines.productModelling.semantic.map(n => createNodeCardHTML(n, false)).join("")}</div>
    </div>
  `;
  L2_DATA.engines.productModelling.domainProducts.forEach(n => ALL_NODES.push({ ...n, status: "Active", tech: ["Domain Data Shares"], inputs: ["Gold Medallion Tables"], outputs: ["Unit consumption applications"], role: "Packages database tables as logical business modules.", view: "l2" }));
  L2_DATA.engines.productModelling.semantic.forEach(n => ALL_NODES.push({ ...n, status: "Active", tech: ["RDF graphs", "LookML Directories"], inputs: ["Domain tables"], outputs: ["Coordinated metric search queries"], role: "Establishes relationship models across platform assets.", view: "l2" }));

  // 5. Analytics & AI Engine
  const aaeSections = document.querySelector("#l2-aae-sections");
  aaeSections.innerHTML = `
    <div class="sub-category-card">
      <span class="sub-category-title">Analytics</span>
      <div class="sub-category-items">${L2_DATA.engines.analyticsAI.analytics.map(n => createNodeCardHTML(n, false)).join("")}</div>
    </div>
    <div class="sub-category-card">
      <span class="sub-category-title">Core Engines</span>
      <div class="sub-category-items flex-row">${L2_DATA.engines.analyticsAI.core.map(n => createNodeCardHTML(n, false)).join("")}</div>
    </div>
  `;
  L2_DATA.engines.analyticsAI.analytics.forEach(n => ALL_NODES.push({ ...n, status: "Active", tech: ["BI Dashboards"], inputs: ["Gold domain products"], outputs: ["Executive charts reports"], role: "Main visual reporting hub for decision makers.", view: "l2" }));
  L2_DATA.engines.analyticsAI.core.forEach(n => ALL_NODES.push({ ...n, status: "Active", tech: ["PyTorch / Transformers / Agent Systems"], inputs: ["Training data features", "User prompts"], outputs: ["Classifications", "Predictive alerts", "Conversational replies"], role: "Drives predictive models and agent actions across the platform.", view: "l2" }));

  const aaeFooter = document.querySelector("#l2-aae-footer");
  aaeFooter.innerHTML = createNodeCardHTML(L2_DATA.engines.analyticsAI.footer, false);
  ALL_NODES.push({ ...L2_DATA.engines.analyticsAI.footer, tech: ["Model registries", "Observability metrics"], inputs: ["Model source files"], outputs: ["Active endpoint predictions"], role: "Governs modeling lifecycles and prompt templates.", view: "l2" });

  // 6. Unified Governance (Chips)
  const govSecurity = document.querySelector("#l2-gov-security .gov-chips-grid");
  govSecurity.innerHTML = L2_DATA.governance.security.map((c, idx) => `
    <span class="gov-chip" id="l2-gov-sec-${idx}">${c.name}</span>
  `).join("");
  L2_DATA.governance.security.forEach((c, idx) => {
    ALL_NODES.push({
      id: `l2-gov-sec-${idx}`,
      name: c.name,
      category: "Governance: Security",
      status: "Active",
      tech: ["Security Tokens", "KMS CMEK Keys"],
      desc: c.desc,
      inputs: ["Access control logs", "Data flow encryption targets"],
      outputs: ["Access credentials", "Masked data outputs"],
      role: "Protects security parameters across UDAIP data databases.",
      view: "l2"
    });
  });

  const govData = document.querySelector("#l2-gov-data .gov-chips-grid");
  govData.innerHTML = L2_DATA.governance.dataGov.map((c, idx) => `
    <span class="gov-chip" id="l2-gov-dat-${idx}">${c.name}</span>
  `).join("");
  L2_DATA.governance.dataGov.forEach((c, idx) => {
    ALL_NODES.push({
      id: `l2-gov-dat-${idx}`,
      name: c.name,
      category: "Governance: Data Quality",
      status: "Active",
      tech: ["Dataplex fabric", "Quality Rules assertion"],
      desc: c.desc,
      inputs: ["Metadata feeds", "Database assertions"],
      outputs: ["Quality summaries", "Lineage path coordinates"],
      role: "Standardizes quality checkpoints across running pipelines.",
      view: "l2"
    });
  });

  const govAI = document.querySelector("#l2-gov-ai .gov-chips-grid");
  govAI.innerHTML = L2_DATA.governance.aiGov.map((c, idx) => `
    <span class="gov-chip" id="l2-gov-ai-${idx}">${c.name}</span>
  `).join("");
  L2_DATA.governance.aiGov.forEach((c, idx) => {
    ALL_NODES.push({
      id: `l2-gov-ai-${idx}`,
      name: c.name,
      category: "Governance: AI Observability",
      status: "Active",
      tech: ["Responsible AI guards", "Agent trace reviews"],
      desc: c.desc,
      inputs: ["LLM prompts", "Agent logs outputs"],
      outputs: ["Hallucination indices", "Compliance registers"],
      role: "Validates facts and audits actions of active generative agents.",
      view: "l2"
    });
  });

  // 7. Base Platform Columns
  const basePlatforms = document.querySelector("#l2-base-platforms");
  basePlatforms.innerHTML = L2_DATA.basePlatform.map((col, cIdx) => `
    <div class="base-platform-col">
      ${col.items.map((it, idx) => `
        <div class="infra-stack-card" id="l2-base-plat-${cIdx}-${idx}">
          ${it.name}
        </div>
      `).join("")}
    </div>
  `).join("");
  L2_DATA.basePlatform.forEach((col, cIdx) => {
    col.items.forEach((it, idx) => {
      ALL_NODES.push({
        id: `l2-base-plat-${cIdx}-${idx}`,
        name: it.name,
        category: `Base Cloud: ${col.title}`,
        status: "Active",
        tech: ["Cloud VM clusters", "Terraform modules"],
        desc: it.desc,
        inputs: ["Operations configurations"],
        outputs: ["Compute power", "Disaster redundancy"],
        role: "Underpinning hardware and virtualization support for UDAIP systems.",
        view: "l2"
      });
    });
  });
}

// ==========================================================================
// SVG SVG PATHS & CONNECTORS GENERATION (L1 FLOWS)
// ==========================================================================

function setupFlowConnections() {
  const svg = document.getElementById("flow-svg");
  if (!svg) return;
  svg.innerHTML = ""; // Clear existing lines

  // If L1 view is not active, do not try to draw lines
  if (!document.getElementById("l1-view").classList.contains("active")) return;

  const colSources = document.getElementById("col-sources");
  const colIngestion = document.getElementById("col-ingestion");
  const colStorage = document.getElementById("col-storage-processing");
  const colEnrichment = document.getElementById("col-enrichment");
  const colConsumption = document.getElementById("col-consumption");

  if (!colSources || !colIngestion || !colStorage || !colEnrichment || !colConsumption) return;

  // Let's create lines connecting columns
  // Column Centers or Edges
  const svgRect = svg.getBoundingClientRect();
  const isStacked = window.innerWidth <= 1024;

  function getElementAnchor(elementId, side = "right") {
    const el = document.getElementById(elementId);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    if (isStacked) {
      // Stacked vertically: connect bottom of source to top of target
      const x = rect.left + rect.width / 2;
      const y = side === "right" ? rect.bottom : rect.top;
      return {
        x: x - svgRect.left,
        y: y - svgRect.top
      };
    } else {
      // Side-by-side horizontally: connect right of source to left of target
      const x = side === "left" ? rect.left : rect.right;
      const y = rect.top + rect.height / 2;
      return {
        x: x - svgRect.left,
        y: y - svgRect.top
      };
    }
  }

  function getColumnAnchor(colElement, side = "right") {
    const rect = colElement.getBoundingClientRect();
    if (isStacked) {
      const x = rect.left + rect.width / 2;
      const y = side === "right" ? rect.bottom : rect.top;
      return {
        x: x - svgRect.left,
        y: y - svgRect.top
      };
    } else {
      const x = side === "left" ? rect.left : rect.right;
      const y = rect.top + rect.height / 2;
      return {
        x: x - svgRect.left,
        y: y - svgRect.top
      };
    }
  }

  // Draw lines from Sources to Ingestion Cards
  const activeSources = ["src-pos", "src-flight", "src-clickstream"];
  const ingestNodes = ["ing-functions", "ing-dataflow-batch", "ing-pubsub"];

  const pathsData = [];

  activeSources.forEach((srcId, index) => {
    const targetIngestId = ingestNodes[index];
    const pStart = getElementAnchor(srcId, "right");
    const pEnd = getElementAnchor(targetIngestId, "left");

    if (pStart && pEnd) {
      let controlPoints;
      if (isStacked) {
        controlPoints = `C ${pStart.x} ${(pStart.y + pEnd.y) / 2}, ${pEnd.x} ${(pStart.y + pEnd.y) / 2}, ${pEnd.x} ${pEnd.y}`;
      } else {
        controlPoints = `C ${(pStart.x + pEnd.x) / 2} ${pStart.y}, ${(pStart.x + pEnd.x) / 2} ${pEnd.y}, ${pEnd.x} ${pEnd.y}`;
      }
      pathsData.push({
        path: `M ${pStart.x} ${pStart.y} ${controlPoints}`,
        colorClass: index === 0 ? "" : (index === 1 ? "purple" : "emerald")
      });
    }
  });

  // From Ingestion to Storage Zones (Raw / Curated / Consumption)
  const ingestOuts = ["ing-functions", "ing-dataflow-batch", "ing-pubsub"];
  const storageTargets = ["lake-t0", "lake-t1", "lake-t2"];

  ingestOuts.forEach((ingId, index) => {
    const targetLakeId = storageTargets[index];
    const pStart = getElementAnchor(ingId, "right");
    const pEnd = getElementAnchor(targetLakeId, "left");

    if (pStart && pEnd) {
      let controlPoints;
      if (isStacked) {
        controlPoints = `C ${pStart.x} ${(pStart.y + pEnd.y) / 2}, ${pEnd.x} ${(pStart.y + pEnd.y) / 2}, ${pEnd.x} ${pEnd.y}`;
      } else {
        controlPoints = `C ${(pStart.x + pEnd.x) / 2} ${pStart.y}, ${(pStart.x + pEnd.x) / 2} ${pEnd.y}, ${pEnd.x} ${pEnd.y}`;
      }
      pathsData.push({
        path: `M ${pStart.x} ${pStart.y} ${controlPoints}`,
        colorClass: index === 0 ? "" : (index === 1 ? "purple" : "emerald")
      });
    }
  });

  // From storage zones to transformations and enrichment
  const lakeOuts = ["lake-t2", "lake-t3"];
  const enrichmentTargets = ["enr-looker", "enr-featurestore"];

  lakeOuts.forEach((lakeId, index) => {
    const targetEnrId = enrichmentTargets[index];
    const pStart = getElementAnchor(lakeId, "right");
    const pEnd = getElementAnchor(targetEnrId, "left");

    if (pStart && pEnd) {
      let controlPoints;
      if (isStacked) {
        controlPoints = `C ${pStart.x} ${(pStart.y + pEnd.y) / 2}, ${pEnd.x} ${(pStart.y + pEnd.y) / 2}, ${pEnd.x} ${pEnd.y}`;
      } else {
        controlPoints = `C ${(pStart.x + pEnd.x) / 2} ${pStart.y}, ${(pStart.x + pEnd.x) / 2} ${pEnd.y}, ${pEnd.x} ${pEnd.y}`;
      }
      pathsData.push({
        path: `M ${pStart.x} ${pStart.y} ${controlPoints}`,
        colorClass: index === 0 ? "" : "purple"
      });
    }
  });

  // Enrichment to Consumption
  const enrichOuts = ["enr-looker", "enr-featurestore", "enr-neo4j"];
  const consumeTargets = ["con-looker", "con-vertex-serving", "con-gemini"];

  enrichOuts.forEach((enrId, index) => {
    const targetConId = consumeTargets[index];
    const pStart = getElementAnchor(enrId, "right");
    const pEnd = getElementAnchor(targetConId, "left");

    if (pStart && pEnd) {
      let controlPoints;
      if (isStacked) {
        controlPoints = `C ${pStart.x} ${(pStart.y + pEnd.y) / 2}, ${pEnd.x} ${(pStart.y + pEnd.y) / 2}, ${pEnd.x} ${pEnd.y}`;
      } else {
        controlPoints = `C ${(pStart.x + pEnd.x) / 2} ${pStart.y}, ${(pStart.x + pEnd.x) / 2} ${pEnd.y}, ${pEnd.x} ${pEnd.y}`;
      }
      pathsData.push({
        path: `M ${pStart.x} ${pStart.y} ${controlPoints}`,
        colorClass: index === 0 ? "" : (index === 1 ? "purple" : "emerald")
      });
    }
  });

  // Draw the SVG paths and append animation tags if flow is active
  const isFlowActive = document.getElementById("flow-toggle-btn").classList.contains("active");

  pathsData.forEach((pathObj, i) => {
    const pathId = `flow-path-${i}`;
    
    // Create base path line
    const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathEl.setAttribute("d", pathObj.path);
    pathEl.setAttribute("id", pathId);
    pathEl.setAttribute("class", `flow-path ${isFlowActive ? 'active-flow' : ''}`);
    svg.appendChild(pathEl);

    // Create moving particles if flow is enabled
    if (isFlowActive) {
      const circleEl = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circleEl.setAttribute("r", "4");
      circleEl.setAttribute("class", `flow-particle ${pathObj.colorClass}`);

      // Add motion animation
      const animateEl = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
      animateEl.setAttribute("dur", `${3 + (i % 3)}s`);
      animateEl.setAttribute("repeatCount", "indefinite");
      
      const mpathEl = document.createElementNS("http://www.w3.org/2000/svg", "mpath");
      mpathEl.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#${pathId}`);
      
      animateEl.appendChild(mpathEl);
      circleEl.appendChild(animateEl);
      svg.appendChild(circleEl);
    }
  });
}

// ==========================================================================
// SEARCH & FILTER FUNCTIONALITY
// ==========================================================================

function handleSearch(query) {
  const cleanQuery = query.trim().toLowerCase();
  const clearBtn = document.getElementById("clear-search");
  
  if (cleanQuery === "") {
    clearBtn.style.display = "none";
    // Reset all highlights
    document.querySelectorAll(".node-card, .lake-list-item, .gov-chip, .infra-stack-card").forEach(el => {
      el.classList.remove("highlight-active");
      el.classList.remove("highlight-inactive");
    });
    return;
  }

  clearBtn.style.display = "block";

  // Check matching cards or items
  ALL_NODES.forEach(node => {
    const element = document.getElementById(node.id);
    if (!element) return;

    const matches = 
      node.name.toLowerCase().includes(cleanQuery) || 
      node.desc.toLowerCase().includes(cleanQuery) ||
      (node.tech && node.tech.some(t => t.toLowerCase().includes(cleanQuery))) ||
      node.category.toLowerCase().includes(cleanQuery);

    if (matches) {
      element.classList.add("highlight-active");
      element.classList.remove("highlight-inactive");
    } else {
      element.classList.remove("highlight-active");
      element.classList.add("highlight-inactive");
    }
  });
}

// ==========================================================================
// INSPECTOR DRAWER CONTROLLER
// ==========================================================================

function openInspector(nodeId) {
  const node = ALL_NODES.find(n => n.id === nodeId);
  if (!node) return;

  const drawer = document.getElementById("detail-drawer");
  const title = document.getElementById("drawer-title");
  const cat = document.getElementById("drawer-cat");
  const status = document.getElementById("drawer-status");
  const desc = document.getElementById("drawer-desc");
  const techTags = document.getElementById("drawer-tech-tags");
  const inputsList = document.getElementById("drawer-inputs");
  const outputsList = document.getElementById("drawer-outputs");
  const roleText = document.getElementById("drawer-role-text");

  // Populate basic text
  title.innerText = node.name;
  cat.innerText = node.category;
  status.innerText = node.status || "Active";

  if (node.status && node.status.toLowerCase() === "optional") {
    status.classList.add("optional");
  } else {
    status.classList.remove("optional");
  }

  desc.innerText = node.desc;
  roleText.innerText = node.role || `Core infrastructure node supporting ${node.category} services.`;

  // Tech tags
  if (node.tech && node.tech.length > 0) {
    document.getElementById("drawer-tech-section").style.display = "block";
    techTags.innerHTML = node.tech.map(t => `<span class="tech-tag">${t}</span>`).join("");
  } else {
    document.getElementById("drawer-tech-section").style.display = "none";
  }

  // I/O streams
  if ((node.inputs && node.inputs.length > 0) || (node.outputs && node.outputs.length > 0)) {
    document.getElementById("drawer-io-section").style.display = "block";
    inputsList.innerHTML = (node.inputs || ["Static configuration source"]).map(i => `<li>${i}</li>`).join("");
    outputsList.innerHTML = (node.outputs || ["Downstream query triggers"]).map(o => `<li>${o}</li>`).join("");
  } else {
    document.getElementById("drawer-io-section").style.display = "none";
  }

  // Open the drawer
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
}

function closeInspector() {
  const drawer = document.getElementById("detail-drawer");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
}

// ==========================================================================
// EVENT LISTENERS & INITS
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Render data panels
  renderL1();
  renderL2();

  // 2. Setup initial layouts & sizing for SVG lines
  setTimeout(setupFlowConnections, 200);
  window.addEventListener("resize", setupFlowConnections);

  // 3. Tab Switches (L1 vs L2)
  document.querySelectorAll(".nav-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      // Toggle tab buttons
      document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // Toggle views
      const targetView = tab.getAttribute("data-target");
      document.querySelectorAll(".view-panel").forEach(p => p.classList.remove("active"));
      document.getElementById(targetView).classList.add("active");

      // Toggle flow button state depending on view (only available on L1)
      const flowBtn = document.getElementById("flow-toggle-btn");
      if (targetView === "l1-view") {
        flowBtn.style.display = "flex";
      } else {
        flowBtn.style.display = "none";
      }

      // Re-draw connections for L1 if active
      setTimeout(setupFlowConnections, 100);
    });
  });

  // 4. Data Card Click for details
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".node-card, .clickable-lake-item, .gov-chip, .infra-stack-card");
    if (card) {
      openInspector(card.id);
    }
  });

  // 5. Drawer Closes
  document.getElementById("drawer-close").addEventListener("click", closeInspector);
  document.getElementById("drawer-overlay-close").addEventListener("click", closeInspector);

  // Close drawer on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeInspector();
  });

  // 6. Search Inputs
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    handleSearch(e.target.value);
  });

  document.getElementById("clear-search").addEventListener("click", () => {
    searchInput.value = "";
    handleSearch("");
  });

  // 7. Ingestion Flow Animation Toggle
  const flowToggleBtn = document.getElementById("flow-toggle-btn");
  flowToggleBtn.addEventListener("click", () => {
    flowToggleBtn.classList.toggle("active");
    setupFlowConnections();
  });
});

// ==========================================================================
// STATIC SVG ICON DIRECTORY
// ==========================================================================
function getIconSVG(nodeId) {
  // POS, Sales, rewards
  if (nodeId.includes("pos") || nodeId.includes("rewards") || nodeId.includes("finance") || nodeId.includes("ecommerce") || nodeId.includes("loyalty")) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="2" y1="12" x2="22" y2="12"/></svg>`;
  }
  // Flights
  if (nodeId.includes("flight") || nodeId.includes("baggage") || nodeId.includes("goem")) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`;
  }
  // Clickstream, website
  if (nodeId.includes("clickstream") || nodeId.includes("portal") || nodeId.includes("mobile")) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`;
  }
  // Images
  if (nodeId.includes("image") || nodeId.includes("visualization")) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
  }
  // Sensors, IoT
  if (nodeId.includes("sensor") || nodeId.includes("iot")) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;
  }
  // Ingest: Functions, Run, EventArc
  if (nodeId.includes("eventarc") || nodeId.includes("functions") || nodeId.includes("pubsub")) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
  }
  // Dataflow
  if (nodeId.includes("dataflow")) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`;
  }
  // Bigquery, Dataform, storage, lakes
  if (nodeId.includes("dataform") || nodeId.includes("lake") || nodeId.includes("ods") || nodeId.includes("bronze") || nodeId.includes("silver") || nodeId.includes("gold")) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>`;
  }
  // AI, Vertex, Gemini
  if (nodeId.includes("vertex") || nodeId.includes("gemini") || nodeId.includes("aiml") || nodeId.includes("genai") || nodeId.includes("agent")) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`;
  }
  // Looker, Reporting, Tableau, BI, microstrategy
  if (nodeId.includes("looker") || nodeId.includes("tableau") || nodeId.includes("micro") || nodeId.includes("reporting") || nodeId.includes("dash")) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;
  }
  // Composer, Orchestration
  if (nodeId.includes("composer") || nodeId.includes("orchestra")) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  }
  // Dataplex, governance, security
  if (nodeId.includes("dataplex") || nodeId.includes("gov") || nodeId.includes("sec") || nodeId.includes("policy") || nodeId.includes("compliance") || nodeId.includes("quality")) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
  }
  // Default fallback
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
}
