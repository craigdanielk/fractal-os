

# FractalOS Economics & Contribution Engine

The Economics & Contribution Engine provides the quantitative backbone of FractalOS. It links time, cost, revenue, and workflow data into a unified contribution model. This enables operational clarity for any business, from agencies to manufacturing.

---

## 1. Purpose of the Economics Engine

The engine answers core operational questions:

- What is the true cost of each project?
- How much contribution margin does each client generate?
- Which tasks or workflows are profitable or unprofitable?
- How much value does each employee deliver?
- Which industries or modules yield the highest ROI?
- What is the time-to-revenue ratio per job or deliverable?

It unlocks 20–30% efficiency gains for high-volume operators.

---

## 2. Core Responsibilities

- Convert time logs into cost models  
- Map revenue to projects and clients  
- Compute contribution margin  
- Generate economics views for the Cockpit  
- Support industry-specific cost models  
- Integrate with manifests and patterns  
- Feed data into dashboards for decision-making  
- Provide APIs for Cockpit, Agents, and Modules  

---

## 3. Data Dependencies

The engine relies on the following schemas:

- `users`  
- `clients`  
- `projects`  
- `tasks`  
- `time_entries`  
- `economics_costs`  
- `economics_revenue`  
- `economics_contribution_view` (materialized)  

Time is the foundational input.

---

## 4. Economics Model Structure

Each economics model contains:

```
{
  "name": "agency-standard",
  "hourly_rate_defaults": {
    "developer": 65,
    "designer": 55,
    "strategist": 80
  },
  "cost_components": [
    "labour",
    "overhead",
    "software",
    "logistics"
  ],
  "revenue_mapping": "project-based",
  "margin_targets": {
    "min": 0.25,
    "ideal": 0.40
  }
}
```

Models are defined in JSON for portability.

---

## 5. Contribution Formula

Base formula:

```
contribution = revenue - (labour_cost + overhead_cost + direct_expenses)
```

Labour costs are derived from:

```
labour_cost = sum(time_entry.hours * role.hourly_rate)
```

Contribution margin:

```
margin = contribution / revenue
```

This is surfaced in dashboards per:

- task  
- project  
- client  
- module  
- pattern  
- employee  

---

## 6. Economics Views (Materialized)

Views include:

- `economics_overview_view`  
- `project_contribution_view`  
- `client_contribution_view`  
- `module_performance_view`  
- `employee_contribution_view`  

These accelerate Cockpit performance and long-term analytics.

---

## 7. Integration with Patterns and Manifests

Patterns may define:

- economics defaults  
- cost models  
- revenue models  
- job-specific cost multipliers  
- machine/labour rates (manufacturing)  

Manifests declare which economics model to use:

```
{
  "economics": {
    "model": "manufacturing-cutting-job"
  }
}
```

The Kernel validates model existence and compatibility.

---

## 8. Industry Adaptation Layer

The engine supports multiple verticals:

### 8.1 Agency / Digital
- hourly labour rates  
- project-based revenue  
- contribution per sprint  

### 8.2 Manufacturing
- machine hours  
- scrap loss  
- material COGS  
- batch-level contribution  

### 8.3 Logistics
- route cost  
- load efficiency  
- fuel models  
- delivery-level margin  

### 8.4 Retail / eCommerce
- SKU profitability  
- fulfilment cost  
- channel attribution  

Every industry is supported through economics model definitions, not code changes.

---

## 9. Cockpit Integration

The Cockpit surfaces:

- contribution summary  
- margin per project  
- margin per client  
- weekly/monthly contribution  
- cost drivers  
- revenue drivers  
- profit alerts  

This gives the user immediate insight into operational health.

---

## 10. Engine Integrity Rules

- All computations must be deterministic  
- No hidden side effects  
- No model mutation at runtime  
- All models must be versioned  
- Backwards compatibility required for major releases  
- Economics logic must remain Kernel-level  
- Cockpit displays results but never computes them  

The Economics Engine is a universal module that transforms operational activity into financial intelligence.