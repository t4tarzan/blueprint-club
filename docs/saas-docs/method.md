# Voice Agent Integration with Eleven Labs and n8n

This tutorial guides you through creating an intelligent voice agent using Eleven Labs and automating tasks using n8n workflows.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Eleven Labs Agent Setup](#eleven-labs-agent-setup)
3. [n8n Workflow Configuration](#n8n-workflow-configuration)
4. [Integration Implementation](#integration-implementation)
5. [Testing and Validation](#testing-and-validation)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Credentials
1. Eleven Labs:
   ```
   ELEVEN_LABS_API_KEY=your_api_key
   ELEVEN_LABS_VOICE_ID=your_voice_id
   ```

2. n8n:
   ```
   N8N_WEBHOOK_URL=your_webhook_url
   N8N_API_KEY=your_api_key
   ```

### System Requirements
- Python 3.8+
- n8n instance (local or hosted)
- Flask server (for webhook handling)

## Eleven Labs Agent Setup

### 1. Agent Creation
```bash
# Example API call to create agent
curl -X POST "https://api.elevenlabs.io/v1/agents" \
  -H "xi-api-key: $ELEVEN_LABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer Service Agent",
    "description": "Handles customer inquiries and automates tasks",
    "voice_id": "$ELEVEN_LABS_VOICE_ID"
  }'
```

### 2. Training Data Format
```json
{
  "intents": [
    {
      "name": "schedule_meeting",
      "examples": [
        "I need to schedule a meeting",
        "Can we set up a call",
        "Book an appointment"
      ]
    },
    {
      "name": "support_request",
      "examples": [
        "I need help with",
        "Having an issue with",
        "Problem with my service"
      ]
    },
    {
      "name": "product_inquiry",
      "examples": [
        "Tell me about your products",
        "What services do you offer",
        "Product information"
      ]
    }
  ]
}
```

### 3. Knowledge Base Integration
```python
# Example knowledge base structure
knowledge_base = {
    "products": {
        "descriptions": [...],
        "faqs": [...],
        "pricing": [...]
    },
    "services": {
        "types": [...],
        "availability": [...],
        "requirements": [...]
    }
}
```

## n8n Workflow Configuration

### 1. Webhook Setup
- Create new workflow in n8n
- Add Webhook node
- Configure webhook URL
- Set authentication if required

### 2. Intent Handling
```javascript
// n8n Function node for intent routing
function routeIntent(input) {
  const intent = input.json.intent;
  switch(intent) {
    case 'schedule_meeting':
      return [0]; // Route to meeting scheduler
    case 'support_request':
      return [1]; // Route to support ticket creator
    case 'product_inquiry':
      return [2]; // Route to product information
    default:
      return [3]; // Route to default handler
  }
}
```

### 3. Action Nodes
Each intent should have corresponding action nodes:

1. Schedule Meeting:
   ```javascript
   // Meeting scheduler node
   {
     "calendar_api": "Google Calendar",
     "event_details": {
       "title": "{{$json.query}}",
       "duration": "30m",
       "attendees": ["{{$json.customer_email}}"]
     }
   }
   ```

2. Support Ticket:
   ```javascript
   // Ticket creation node
   {
     "ticket_system": "Zendesk/JIRA",
     "ticket_details": {
       "title": "{{$json.query}}",
       "priority": "{{$json.context.urgency}}",
       "customer_id": "{{$json.customer_id}}"
     }
   }
   ```

3. Product Information:
   ```javascript
   // Product info node
   {
     "database": "Product DB",
     "query": {
       "type": "{{$json.query}}",
       "fields": ["name", "description", "price"]
     }
   }
   ```

## Integration Implementation

### 1. Flask Server Setup
```python
# app.py configuration
app.config.update(
    ELEVEN_LABS_API_KEY=os.getenv('ELEVEN_LABS_API_KEY'),
    N8N_WEBHOOK_URL=os.getenv('N8N_WEBHOOK_URL'),
    DEBUG=True
)
```

### 2. Webhook Handler
```python
@app.route('/agent-webhook', methods=['POST'])
def handle_agent_webhook():
    data = request.json
    # Process webhook data
    # Trigger n8n workflow
    return jsonify({'status': 'success'})
```

### 3. Response Handler
```python
@app.route('/agent-response', methods=['POST'])
def handle_response():
    data = request.json
    # Process n8n response
    # Send back to Eleven Labs agent
    return jsonify({'status': 'success'})
```

## Testing and Validation

### 1. Agent Testing
```bash
# Test agent response
curl -X POST "http://localhost:5000/agent-webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "test123",
    "query": "Schedule a meeting for tomorrow",
    "intent": "schedule_meeting"
  }'
```

### 2. Workflow Testing
1. Manual testing through n8n interface
2. Webhook testing using Postman/curl
3. End-to-end flow validation

### 3. Integration Testing
```python
def test_integration():
    # Send test request
    # Verify workflow execution
    # Check response handling
    pass
```

## Troubleshooting

### Common Issues
1. Webhook Connection:
   - Check URL configuration
   - Verify authentication
   - Check network connectivity

2. Agent Response:
   - Verify API keys
   - Check response format
   - Monitor error logs

3. Workflow Execution:
   - Check n8n logs
   - Verify node configurations
   - Test individual nodes

### Logging
```python
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### Monitoring
1. Set up health checks
2. Monitor API rate limits
3. Track workflow execution times

## Security Considerations

### 1. API Security
- Use environment variables for credentials
- Implement rate limiting
- Validate webhook signatures

### 2. Data Protection
- Encrypt sensitive data
- Implement access controls
- Regular security audits

## Maintenance and Updates

### 1. Regular Tasks
- Update dependencies
- Backup configurations
- Monitor performance

### 2. Version Control
- Document changes
- Track configurations
- Maintain backups

---

**Note**: Replace placeholder values (API keys, URLs, etc.) with your actual credentials when implementing. Never commit sensitive information to version control.
