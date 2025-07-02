# Azure Hosting Cost Estimation

This document provides an estimated monthly cost breakdown for hosting the AI Puzzle Site application in Azure using production-grade services. These estimates are based on Azure pricing as of July 2025 and represent a typical production deployment scenario for a rapidly growing application that will scale from 500 to 100,000 users over a one-year period.

## Cost Summary Table - Q4 (100,000 Users)

| Azure Service | SKU/Configuration | Instance Count | Unit Cost (per month) | Total Cost (per month) |
|---------------|-------------------|----------------|------------------------|-------------------------|
| Azure Container Apps | Consumption Plan (4vCPU, 8Gi Memory) | 30 avg. replicas | $216.08 | $6,482.40 |
| Azure Static Web App | Premium Plan | 1 | $30.00 | $30.00 |
| Azure Front Door | Premium | 1 | $285.00 | $285.00 |
| Azure PostgreSQL Flexible Server | Business Critical, 32 vCores, 128 GB RAM | 1 | $4,382.28 | $4,382.28 |
| PostgreSQL Read Replicas | Business Critical, 16 vCores, 64 GB RAM | 2 | $2,191.14 | $4,382.28 |
| Azure Cache for Redis | Premium P4 (26GB, zone redundant) | 1 | $1,452.04 | $1,452.04 |
| Azure Container Registry | Standard | 1 | $50.00 | $50.00 |
| Azure Monitor & Application Insights | Pay-as-you-go | - | $250.00 | $250.00 |
| Azure Key Vault | Standard | 1 | $0.03/10,000 operations | ~$50.00 |
| Azure Service Bus | Standard | 1 | $75.00 | $75.00 |
| Azure Blob Storage (Logs/Backups) | Standard GRS (1 TB) | 1 | $46.92 | $46.92 |
| **TOTAL** | | | | **$17,485.92** |

## Detailed Breakdown and Considerations

### 1. Azure Container Apps (Backend API)

**Configuration:**
- Consumption plan
- 1 vCPU, 2 GiB memory per replica
- Average of 2 replicas (scaling between 0-5 based on load)
- ~730 hours per month

**Cost Calculation:**
- vCPU cost: $0.000042/vCPU-second × 60 × 60 × 24 × 30 × 1 vCPU × 2 replicas = $72.58
- Memory cost: $0.000003/GiB-second × 60 × 60 × 24 × 30 × 2 GiB × 2 replicas = $10.37
- Request cost: $0.000350/million requests × 20 million requests = $7.00
- HTTP Ingress: $0.12/GB × 150 GB = $18.00
- Outbound data transfer: Included in ingress cost

**Total Container Apps: $108.04/month**

**Notes:**
- Actual costs will vary based on actual usage patterns
- Scale-to-zero capability during off-hours can further reduce costs
- Higher request volumes will increase costs linearly

### 2. Azure Static Web App (Frontend)

**Configuration:**
- Standard tier (necessary for production workloads)
- 1 app with custom domain and SSL
- Includes CI/CD integration with GitHub

**Cost Calculation:**
- Standard plan: $19.00/month

**Total Static Web App: $19.00/month**

**Notes:**
- Includes free built-in CDN for static content delivery
- Free tier is available but lacks custom domain validation and has lower limits

### 3. Azure Front Door (Global Routing and WAF)

**Configuration:**
- Standard tier
- 1 routing rule
- Basic WAF policy
- 500 GB data transfer

**Cost Calculation:**
- Base price: $35.00/month
- Data processing: Included in the first 500 GB

**Total Front Door: $35.00/month**

**Notes:**
- Provides global routing, load balancing, and WAF protection
- Higher tiers available for advanced security requirements

### 4. Azure PostgreSQL Flexible Server (Database)

**Configuration:**
- General Purpose tier
- 4 vCores, 16 GB memory
- 512 GB storage
- Zone redundant high availability
- 7-day automated backup retention

**Cost Calculation:**
- Compute: $219.00/month
- Storage: $0.115/GB/month × 512 GB = $58.88
- Backup storage: 512 GB × 7 days retention × ($0.095/GB/month ÷ 30 days) = $11.31
- IO operations: Included in General Purpose tier

**Total PostgreSQL: $266.61/month**

**Notes:**
- Can be scaled down to 2 vCores for lower traffic applications
- Consider reserved instances for 1-year (approx. 20% savings) or 3-year commitments (approx. 35% savings)
- Add read replicas for higher read scalability at additional cost

### 5. Azure Cache for Redis (Performance Optimization)

**Configuration:**
- Basic C1 (1 GB, no replication)
- 730 hours per month

**Cost Calculation:**
- Basic C1: $44.46/month

**Total Redis Cache: $44.46/month**

**Notes:**
- Consider Standard tier for production with higher reliability
- Sizing should be adjusted based on caching requirements

### 6. Azure Container Registry (Container Image Storage)

**Configuration:**
- Basic tier
- 10 GB storage

**Cost Calculation:**
- Basic tier: $5.00/month
- Storage: Included in Basic tier

**Total Container Registry: $5.00/month**

**Notes:**
- Sufficient for most small to medium applications
- Standard tier recommended for higher throughput requirements (+$45/month)

### 7. Azure Monitor & Application Insights (Monitoring)

**Configuration:**
- Pay-as-you-go pricing
- 5 GB data ingestion per month
- Standard retention (30 days)

**Cost Calculation:**
- Data ingestion: $2.30/GB × 5 GB = $11.50
- Alerts and notifications: ~$0.50

**Total Monitoring: $12.00/month**

**Notes:**
- Costs scale with application usage and logging volume
- Consider Log Analytics retention settings to control costs

### 8. Azure Key Vault (Secrets Management)

**Configuration:**
- Standard tier
- 5,000 operations per day

**Cost Calculation:**
- Operations: $0.03/10,000 operations × (5,000 operations × 30 days ÷ 10,000) = $4.50
- Certificate renewals: ~$0.50

**Total Key Vault: ~$5.00/month**

**Notes:**
- Costs scale with the number of secret operations
- HSM-backed keys available at higher cost if needed

### 9. Azure Blob Storage (Logs and Backups)

**Configuration:**
- Standard LRS (Locally Redundant Storage)
- 100 GB storage
- Minimal transaction volume

**Cost Calculation:**
- Storage: $0.0184/GB/month × 100 GB = $1.84
- Transactions: ~$0.56

**Total Blob Storage: $2.40/month**

**Notes:**
- Consider higher redundancy options for critical data
- Lifecycle management can reduce costs by archiving older logs

## Cost Optimization Strategies

### 1. Right-sizing Resources

- Start with smaller PostgreSQL instance (2 vCores) and scale up if needed
- Adjust Container Apps memory/CPU allocation based on actual utilization
- Monitor Redis cache usage and adjust size accordingly

### 2. Reserved Instances

- Consider 1-year or 3-year reserved instances for PostgreSQL
- Potential savings: 20-35% on database costs

### 3. Autoscaling Configuration

- Optimize Container Apps scaling rules to balance performance and cost
- Scale to zero during predictable low-usage periods
- Implement proper min/max replica settings

### 4. Storage Optimization

- Implement lifecycle management for logs and backups
- Use appropriate storage redundancy levels based on data criticality
- Compress data where applicable

### 5. Monitoring and Governance

- Set up budget alerts to notify when costs exceed thresholds
- Regularly review resource utilization and right-size as needed
- Tag resources properly for cost allocation and tracking

## Traffic-Based Cost Scenarios

### Low Traffic (500 DAU)

| Azure Service | Adjusted Configuration | Est. Monthly Cost |
|---------------|------------------------|-------------------|
| Azure Container Apps | 1 avg. replica | $54.02 |
| PostgreSQL | 2 vCores, 8 GB RAM | $148.32 |
| Other services | As above | $122.86 |
| **TOTAL** | | **$325.20** |

### High Traffic (10,000+ DAU)

| Azure Service | Adjusted Configuration | Est. Monthly Cost |
|---------------|------------------------|-------------------|
| Azure Container Apps | 4 avg. replicas | $216.08 |
| PostgreSQL | 8 vCores, 32 GB RAM | $457.38 |
| Redis Cache | Standard C2 (6 GB) | $102.53 |
| Front Door | Premium tier with enhanced WAF | $285.00 |
| Other services | As above | $43.40 |
| **TOTAL** | | **$1,104.39** |

## Notes and Disclaimers

1. All prices are in USD and based on Azure pricing as of July 2025.
2. Actual costs may vary based on:
   - Actual usage patterns and traffic volumes
   - Region-specific pricing variations
   - Azure pricing changes
   - Additional services or features added to the solution
3. Network egress costs may apply for data transferred out of Azure
4. Development and testing environments will incur additional costs
5. These estimates do not include:
   - Development costs or licensing fees
   - Personnel costs for managing the infrastructure
   - Cost for any additional services or integrations

## Conclusion

The estimated monthly cost for hosting the AI Puzzle Site in Azure with production-grade services is approximately **$497.51**. This provides a scalable, secure, and highly available infrastructure suitable for a production application with moderate traffic.

For budget-conscious deployments, several optimizations can be made to reduce costs while still maintaining adequate performance and reliability. As the application scales, costs will increase, primarily driven by database, container instances, and data transfer requirements.

It's recommended to regularly review and optimize the infrastructure based on actual usage patterns and performance requirements to maintain a balance between cost and performance.
