# GitHub Copilot Instructions for MindSpace

## Project Overview
MindSpace is a mobile mental health and wellness app powered by AI, using Cognitive Behavioral Therapy (CBT) techniques to provide therapy support, mood tracking, journaling, and crisis resources.

## Tech Stack
- **Frontend**: React Native
- **AI/ML**: LLM Integration for CBT-based therapy
- **Storage**: Secure local storage
- **Notifications**: Push notifications
- **Payments**: Subscription integration
- **Authentication**: Biometric authentication

## Project Structure
```
mindspace/
└── docs/
    ├── mindspace-design.md    # Full app design specification
    └── MindSpace_-_TODO.md    # Feature roadmap & TODO list
```

## Key Features

### AI Therapy Support
- CBT-based conversational AI
- Guided therapy sessions
- Personalized responses
- Crisis detection and intervention

### Mood Tracking
- Daily mood logging
- Mood trend analysis
- Visual mood charts
- Pattern recognition

### Journaling
- Private, secure journal entries
- Rich text support
- Mood tagging
- Search and filter entries

### CBT Exercises
- Guided cognitive behavioral therapy exercises
- Thought record templates
- Behavioral activation tools
- Progress tracking

### Crisis Resources
- Emergency mental health resources
- Crisis hotline integration
- Safety planning tools
- Emergency contact management

### Additional Features
- Therapist integration
- Biometric authentication
- Community support features
- Subscription-based premium features

## Development Workflow

### Installation
```bash
npm install
```

### Development Server
```bash
npx expo start
```

### Building
```bash
npx expo build:android
npx expo build:ios
```

## Configuration

### Required Environment Variables
- **AI/LLM API Keys** - For therapy AI functionality
- **Push Notification Keys** - For notifications
- **Payment Gateway Keys** - For subscriptions
- **Analytics Keys** - For user analytics

### Security Considerations
- All user data must be encrypted
- Biometric authentication required
- Secure local storage implementation
- HIPAA compliance considerations
- Crisis intervention protocols

## Code Style Guidelines
- Use TypeScript for type safety
- Follow React Native best practices
- Implement proper error handling
- Maintain accessibility standards
- Follow mental health app guidelines

## Critical Implementation Requirements

### Privacy & Security
- **Data Encryption**: All user data must be encrypted at rest and in transit
- **Biometric Auth**: Require biometric authentication for sensitive features
- **Secure Storage**: Use secure storage APIs for journal entries and mood data
- **HIPAA Compliance**: Follow healthcare data protection standards
- **Crisis Protocols**: Implement proper crisis detection and intervention

### AI Therapy Implementation
- **CBT Techniques**: Use evidence-based CBT methodologies
- **Crisis Detection**: AI must detect crisis situations and provide resources
- **Professional Disclaimer**: Always include professional help disclaimers
- **Response Quality**: Ensure AI responses are empathetic and appropriate
- **Safety First**: Prioritize user safety over engagement

### User Experience
- **Calm Design**: Use soothing colors and gentle animations
- **Accessibility**: Ensure app is accessible to users with disabilities
- **Offline Support**: Core features should work offline
- **Performance**: Fast loading times and smooth interactions
- **Clear Navigation**: Simple, intuitive interface

## Common Issues & Solutions

### AI Response Quality
- Ensure prompts are well-designed for CBT
- Test AI responses thoroughly
- Implement content filtering
- Have human review processes
- Provide feedback mechanisms

### Crisis Detection
- Implement keyword detection for crisis terms
- Provide immediate crisis resources
- Don't rely solely on AI for crisis intervention
- Test crisis flows regularly
- Have emergency protocols

### Data Privacy
- Encrypt all sensitive data
- Implement proper data retention policies
- Provide data export/deletion features
- Follow GDPR and HIPAA guidelines
- Regular security audits

### Performance Issues
- Optimize image and media loading
- Implement proper caching
- Test on low-end devices
- Monitor app performance
- Optimize database queries

## Testing
- Test AI responses for safety and appropriateness
- Verify crisis detection and intervention
- Test biometric authentication
- Test offline functionality
- Test on various devices and OS versions
- Accessibility testing
- Security penetration testing

## Deployment
- Follow app store guidelines for health apps
- Include proper disclaimers and terms of service
- Implement proper age restrictions
- Set up crash reporting and analytics
- Have crisis response protocols in place
- Regular security updates

## Legal & Ethical Considerations
- **Medical Disclaimer**: Clearly state this is not a replacement for professional therapy
- **Crisis Resources**: Always provide access to emergency mental health resources
- **Data Privacy**: Follow all relevant healthcare data protection laws
- **Age Restrictions**: Implement appropriate age restrictions
- **Professional Oversight**: Consider having mental health professionals review AI responses

## Additional Resources
- See `docs/mindspace-design.md` for full design specification
- See `docs/MindSpace_-_TODO.md` for feature roadmap
- Consult mental health professionals for AI therapy design
- Review mental health app best practices
- Stay updated on healthcare regulations

## Important Notes
- **Safety First**: User safety is the highest priority
- **Professional Help**: Always encourage users to seek professional help
- **Crisis Response**: Have robust crisis detection and intervention
- **Data Privacy**: Treat all user data with extreme care
- **Ethical AI**: Ensure AI responses are appropriate and helpful
- **Regular Review**: Regularly review and update AI responses and crisis protocols