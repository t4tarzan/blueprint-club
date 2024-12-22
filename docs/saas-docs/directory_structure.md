# Directory Structure

```
n8n-voice-chat/
├── poc/                              # Proof of Concept implementations
│   ├── elevenlabs-n8n/              # Eleven Labs + n8n stack
│   │   ├── src/
│   │   ├── workflows/               # n8n workflow files
│   │   ├── tests/
│   │   └── README.md
│   │
│   ├── gcp-n8n/                     # GCP + n8n stack
│   │   ├── src/
│   │   ├── workflows/
│   │   ├── tests/
│   │   └── README.md
│   │
│   ├── opensource/                   # Open source stack
│   │   ├── src/
│   │   ├── workflows/
│   │   ├── tests/
│   │   └── README.md
│   │
│   └── aws-ml-n8n/                  # AWS ML + n8n stack
│       ├── src/
│       ├── workflows/
│       ├── tests/
│       └── README.md
│
├── src/                             # Production code
│   ├── voice/                       # Voice processing components
│   │   ├── synthesis/
│   │   └── recognition/
│   │
│   ├── chat/                        # Chat engine components
│   │   ├── core/
│   │   └── models/
│   │
│   ├── workflows/                   # n8n workflow definitions
│   │   ├── templates/
│   │   └── custom/
│   │
│   └── integrations/                # Third-party integrations
│
├── tests/                           # Test suites
│   ├── unit/
│   ├── integration/
│   └── performance/
│
├── docs/                            # Documentation
│   ├── approach.md
│   ├── directory_structure.md
│   ├── api/
│   └── workflows/
│
├── config/                          # Configuration files
│   ├── development/
│   ├── staging/
│   └── production/
│
├── scripts/                         # Utility scripts
│   ├── setup/
│   ├── deployment/
│   └── testing/
│
└── .github/                         # GitHub specific files
    ├── workflows/                   # GitHub Actions
    └── ISSUE_TEMPLATE/

# Key Aspects of the Structure

1. **Proof of Concept (poc/)**
   - Separate directories for each technology stack
   - Isolated environments for testing
   - Each POC has its own workflows and tests
   - Easy to compare and evaluate

2. **Production Code (src/)**
   - Modular structure for core components
   - Clear separation of concerns
   - Easy to migrate from POC to production
   - Scalable architecture

3. **Configuration Management**
   - Environment-specific configurations
   - Secure credential management
   - Easy environment switching

4. **Documentation**
   - Comprehensive documentation structure
   - API documentation
   - Workflow documentation
   - Implementation guides

5. **Testing**
   - Separate test types
   - Performance benchmarking
   - Integration testing
   - Easy to run test suites

6. **Deployment**
   - CI/CD workflow templates
   - Deployment scripts
   - Environment management

# Migration Strategy

1. **POC to Production**
   - Evaluate POC results
   - Copy successful implementation to src/
   - Adapt configuration for production
   - Implement additional security measures

2. **Version Control**
   - Main branch for production
   - Feature branches for POCs
   - Protected production branches
   - Proper PR review process

3. **Configuration Management**
   - Use environment variables
   - Secure credential storage
   - Configuration validation
   - Easy environment switching
