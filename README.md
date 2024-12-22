# Blueprint Club - Enterprise SaaS Platform

<p align="center">
  <img src="public/logo.png" alt="Blueprint Club Logo" width="200"/>
</p>

<p align="center">
  An enterprise-grade SaaS platform built with Next.js 14, BoxyHQ, and modern web technologies.
</p>

## 📚 README Files Guide

This project contains multiple README files for different components. Here's a quick guide:

### Core Documentation
| README Location | Purpose | Key Information |
|----------------|---------|-----------------|
| `/README.md` | Main project documentation | Project overview, setup, architecture |

### Addon Documentation
| README Location | Purpose | Key Information |
|----------------|---------|-----------------|
| `/addons/boxyhq-core/README.md` | BoxyHQ Core | Enterprise features, SSO setup, team management |
| `/addons/ai-features/vercel-chat/README.md` | AI Chat | Vercel AI implementation, model configuration |
| `/addons/social-features/taxonomy/README.md` | Social Features | Blog system, documentation, user engagement |

### UI Components Documentation
| README Location | Purpose | Key Information |
|----------------|---------|-----------------|
| `/addons/ui-components/shadcn-ui/README.md` | Main UI Docs | Component library overview |
| `/addons/ui-components/shadcn-ui/packages/shadcn/README.md` | Core Components | Component implementation details |
| `/addons/ui-components/shadcn-ui/packages/cli/README.md` | CLI Tools | Component generation and management |

## 📚 Documentation Map

This project uses a comprehensive documentation system. Here's your guide to finding specific information:

### Project Documentation
| File | Purpose | When to Use |
|------|---------|-------------|
| `README.md` | Project overview and main documentation | Start here for project overview |
| `docs/integration-plan.md` | Integration strategy and timeline | Planning and tracking implementation |
| `docs/integration-log.md` | Development progress log | Tracking daily progress and changes |
| `docs/auth-analysis.md` | Authentication system analysis | Understanding auth implementation |
| `docs/addon-features.md` | Available addon features | Exploring available features |
| `docs/boilerplate-features.md` | Boilerplate feature analysis | Understanding available boilerplates |
| `docs/saas-docs/approach.md` | SaaS implementation approach | High-level architecture decisions |
| `notionp.md` | Notion integration notes | When working with Notion features |

### Addon Documentation
| Directory | Purpose | Key Files |
|-----------|---------|-----------|
| `addons/boxyhq-core/` | BoxyHQ Integration | - `README.md`: Core setup guide<br>- `CONTRIBUTING.md`: Contribution guidelines<br>- `CODE_OF_CONDUCT.md`: Community guidelines |
| `addons/ai-features/` | AI Implementation | - `vercel-chat/README.md`: AI chat setup |
| `addons/social-features/` | Social Features | - `taxonomy/README.md`: Social feature guide |
| `addons/ui-components/` | UI Components | - `shadcn-ui/README.md`: Component library docs |

## 📚 Documentation Guide

This project uses a structured documentation approach. Here's where to find specific information:

### Core Documentation
- `README.md` (this file): Project overview, setup instructions, and documentation guide
- `docs/integration-plan.md`: Overall integration strategy and timeline
- `docs/integration-log.md`: Ongoing development updates and progress tracking

### Technical Documentation
- `docs/auth-analysis.md`: Authentication system design and implementation details
- `docs/addon-features.md`: Available addon features and their implementation status
- `docs/boilerplate-features.md`: Features from integrated boilerplates and their usage
- `docs/saas-docs/approach.md`: SaaS implementation approach and architecture

### Development Guides
- `docs/setup-guide.md`: Development environment setup instructions
- `docs/contribution.md`: Guidelines for contributing to the project
- `docs/testing.md`: Testing strategies and procedures

### Feature Documentation
- `docs/features/auth.md`: Authentication and authorization
- `docs/features/teams.md`: Team management functionality
- `docs/features/billing.md`: Subscription and billing system
- `docs/features/ai.md`: AI features implementation

### API Documentation
- `docs/api/overview.md`: API architecture and design
- `docs/api/endpoints.md`: API endpoint documentation
- `docs/api/authentication.md`: API authentication guide

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/blueprint-club.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```

## 🛠 Tech Stack

- **Framework**: Next.js 14
- **Authentication**: BoxyHQ SAML SSO
- **Database**: PostgreSQL with Prisma
- **UI**: Tailwind CSS + shadcn/ui
- **AI**: Vercel AI SDK
- **Testing**: Jest + Playwright

## 🔐 Environment Variables

Required environment variables:

```bash
# Core
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Database
DATABASE_URL=postgresql://...

# BoxyHQ
BOXYHQ_SAML_JACKSON_URL=http://localhost:5225
BOXYHQ_ENTERPRISE_SLUG=blueprint

# Additional services...
```

## 🏗 Project Structure

```
blueprint-club/
├── app/                 # Next.js 14 app directory
├── components/          # React components
├── lib/                 # Utility functions and shared logic
├── prisma/             # Database schema and migrations
├── public/             # Static assets
├── styles/             # Global styles
└── docs/               # Documentation
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

## 📈 Features

- ✅ Enterprise SSO with SAML
- ✅ Team Management
- ✅ Role-Based Access Control
- ✅ Audit Logging
- ✅ AI-powered Features
- ✅ Social Features
- ✅ Stripe Integration

## 🤝 Contributing

Please read our [Contributing Guide](docs/contribution.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- BoxyHQ Team for the enterprise features
- Vercel Team for Next.js and AI SDK
- shadcn for the UI components
- All our contributors

## 🆘 Support

For support, email support@blueprintclub.com or join our [Discord channel](https://discord.gg/blueprintclub).
