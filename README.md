# OpenAI SDK Tutorial

A comprehensive tutorial project demonstrating the capabilities of OpenAI's Agents SDK, including agent handoffs, tool usage, and multi-agent orchestration.

## 📋 Overview

This project showcases three different implementations of AI agents using the OpenAI Agents SDK:

1. **Agent with Tools** - Weather agent with email capabilities
2. **Agent Manager** - Sales and refund agent coordination
3. **Agent Handoff** - Reception agent that routes to specialized agents

## 🚀 Features

### 1. Weather Agent with Email (`agent_tool.js`)
- Fetches real-time weather data for any city
- Sends email notifications with weather information
- Demonstrates tool integration with external APIs

### 2. Agent Manager (`agent_manager.js`)
- Sales agent for internet broadband plans
- Refund processing agent
- Demonstrates agent-as-tool pattern

### 3. Agent Handoff System (`agent_handoff.js`)
- Reception agent that intelligently routes queries
- Sales agent for plan inquiries
- Refund agent for customer support
- Demonstrates multi-agent orchestration and handoffs

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **OpenAI Agents SDK** (`@openai/agents`) - AI agent framework
- **Zod** - Schema validation
- **Nodemailer** - Email functionality
- **Axios** - HTTP requests
- **dotenv** - Environment variable management

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/anshukr96/openai-sdk-tutorial.git
cd openai-sdk-tutorial
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your credentials:
```env
OPENAI_API_KEY=your_openai_api_key_here
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
```

> **Note**: For Gmail, you need to use an [App Password](https://support.google.com/accounts/answer/185833), not your regular password.

## 🎯 Usage

### Run the Weather Agent
```bash
npm run agent
```
This demonstrates:
- Fetching weather for multiple cities
- Sending results via email

### Run the Agent Manager
```bash
node --import dotenv/config agent_manager.js
```
This demonstrates:
- Agent-as-tool pattern
- Refund processing workflow

### Run the Agent Handoff System
```bash
node --import dotenv/config agent_handoff.js
```
This demonstrates:
- Intelligent query routing
- Multi-agent collaboration
- Reception → Sales/Refund agent handoffs

### Development Mode
```bash
npm run dev
```
Runs with auto-reload on file changes.

## 📁 Project Structure

```
openai-sdk-tutorial/
├── agent_tool.js          # Weather agent with email tool
├── agent_manager.js       # Sales & refund agent manager
├── agent_handoff.js       # Multi-agent handoff system
├── index.js               # Entry point
├── refunds.txt            # Refund logs
├── package.json           # Dependencies
├── .env.example           # Environment template
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🔧 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Run with auto-reload |
| `start` | `npm start` | Run production mode |
| `agent` | `npm run agent` | Run weather agent demo |

## 🤖 Agent Examples

### Weather Query with Email
```javascript
main("What is the weather of delhi, new york, kerala? 
      and then email the response to user@example.com 
      with subject as Weather Report")
```

### Sales Query
```javascript
runAgent('Hi There, can you please tell me the best 
          available plan for me? Show me all available plans')
```

### Refund Request
```javascript
main('Hi There, I am facing internet related issue, 
      so kindly provide me a refund of id cust_123')
```

## 🔐 Security

- **Never commit `.env`** - Contains sensitive API keys
- **Use `.env.example`** - Template for required variables
- **App Passwords** - Use Gmail App Passwords, not regular passwords
- **`.gitignore`** - Excludes sensitive files from version control

## 📚 Learn More

- [OpenAI Agents SDK Documentation](https://platform.openai.com/docs/agents)
- [Zod Schema Validation](https://zod.dev/)
- [Nodemailer Documentation](https://nodemailer.com/)

## 🤝 Contributing

Feel free to fork this project and experiment with different agent configurations!

## 📝 License

ISC

## 👤 Author

Anshu Kumar

---

**Happy Learning! 🎓**
