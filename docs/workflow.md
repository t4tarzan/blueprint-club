# Blueprint Club Development Workflow

## Using Cascade Memories Effectively

### 1. Checklist-Driven Development
```yaml
Workflow:
  1. Reference checklist.md at start of session
  2. Identify current phase and task
  3. Use as prompt for Cascade: "Continuing from Phase X: [Task]"
  4. Track progress in checklist.md

Character Limit Strategy:
  - Keep task descriptions concise
  - Use hierarchical structure
  - Focus on current phase
  - Link to detailed docs when needed
```

### 2. Development Phases
```yaml
Phase Structure:
  1. Planning:
     - Reference checklist.md
     - Review related documentation
     - Set phase objectives
  
  2. Development:
     - Work on features
     - Update checklist progress
     - Create implementation notes
  
  3. Review:
     - Test implementations
     - Document challenges
     - Update relevant docs
```

### 3. Logging System
```yaml
Trigger Points for New Logs:
  1. Phase Completion:
     - Create phase_X_summary.md
     - Document key implementations
     - Note challenges and solutions

  2. Extended Feature Work:
     - Create feature_log.md after 3+ sessions
     - Document progress and decisions
     - Note implementation patterns

  3. Major Changes:
     - Create change_log.md
     - Document architectural decisions
     - Update affected components
```

### 4. Cross-Referencing System
```yaml
Reference Structure:
  1. Primary References:
     - checklist.md: Current tasks and progress
     - memories.md: Project context and patterns
     - workflow.md: Development process
  
  2. Phase Logs:
     - phase_X_summary.md: Phase completion details
     - feature_logs/: Extended feature documentation
     
  3. Implementation Details:
     - approach.md: Overall strategy
     - Social.md: Social features spec
     - notionp.md: Notion integration plans
```

## Workflow Examples

### Starting a New Session
```yaml
Steps:
1. Check checklist.md:
   "Currently at Phase 2: Social Features
    Next Task: Implement user connections"

2. Reference memories.md:
   "Previous work on user authentication
    Established patterns for user relations"

3. Start Development:
   "Continuing from Phase 2: Implementing user connections
    Building on our authentication system..."
```

### Extended Feature Development
```yaml
When to Log:
1. After 3rd session on same feature:
   - Create logs/social_connections_log.md
   - Document progress and decisions
   - Note reusable patterns

2. Reference in future sessions:
   "Based on patterns in social_connections_log.md..."
```

### Phase Completion
```yaml
Steps:
1. Create Summary:
   - phase_2_social_features_summary.md
   - Document all implementations
   - Note key decisions and patterns

2. Update Documentation:
   - Mark completed items in checklist.md
   - Update memories.md with new patterns
   - Add to reference documentation
```

## Automatic Cross-Referencing

### Implementation
```yaml
Format Standards:
1. File Naming:
   - phase_X_summary_YYYYMMDD.md
   - feature_X_log_YYYYMMDD.md
   - change_log_YYYYMMDD.md

2. Content Structure:
   - Clear headers for easy parsing
   - Consistent section formatting
   - Tagged code blocks
```

### Reference System
```yaml
Cross-Reference Tags:
  #PHASE-2
  #FEATURE-SOCIAL
  #PATTERN-AUTH
  #ISSUE-TYPES
  #SOLUTION-ADAPTER
```

## Best Practices

### 1. Session Management
```yaml
Start of Session:
  1. Check checklist.md
  2. Review relevant logs
  3. Set session goals

End of Session:
  1. Update checklist.md
  2. Document progress
  3. Create/update logs if needed
```

### 2. Documentation Updates
```yaml
When to Update:
  1. New implementation patterns
  2. Resolved challenges
  3. Phase completion
  4. Extended feature work
```

### 3. Memory Optimization
```yaml
Strategies:
  1. Keep references concise
  2. Use consistent formatting
  3. Tag important sections
  4. Link related documentation
```

## Maintenance

### Regular Reviews
```yaml
Weekly:
  - Update checklist progress
  - Review active logs
  - Clean up documentation

Monthly:
  - Consolidate logs
  - Update main documentation
  - Archive completed phases
```

### Documentation Cleanup
```yaml
Triggers:
  1. Phase completion
  2. Feature completion
  3. Major version releases
  4. Significant architecture changes
```

This workflow is designed to evolve with the project. Adjust as needed based on development patterns and team feedback.
