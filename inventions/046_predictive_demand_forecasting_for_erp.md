
**Title of Invention:** System and Method for Predictive Demand Forecasting in an Enterprise Resource Planning System

**Abstract:**
A system for inventory management within an ERP is disclosed. The system analyzes historical sales data, seasonality, and optionally, external market signals. This data is provided to a generative AI model, which is prompted to act as a demand planner. The AI generates a time-series forecast for future product demand, including confidence intervals. This forecast is then used to automatically suggest purchase order quantities to prevent stockouts and reduce excess inventory.

**Background of the Invention:**
Accurate demand forecasting is critical for efficient inventory management but is notoriously difficult. Traditional statistical methods may not capture complex market dynamics. There is a need for a more intelligent system that can leverage modern AI to produce more accurate and explainable demand forecasts.

**Detailed Description of the Invention:**
A scheduled job runs weekly. It pulls the last 24 months of sales data for a specific product SKU. It constructs a prompt for an LLM: `You are a demand forecasting AI. Based on the following historical sales data, generate a weekly sales forecast for the next 3 months. Provide the forecast as a JSON object with dates and predicted units. Data: [time-series data].` The AI's response is used to update the "Forecasted Demand" field in the ERP system, which then informs automated reordering suggestions.

**Claims:**
1. A method for forecasting product demand, comprising:
   a. Accessing historical sales data for a product.
   b. Providing said data to a generative AI model.
   c. Prompting the model to generate a time-series forecast of future sales.
   d. Using the forecast to inform inventory management decisions.
