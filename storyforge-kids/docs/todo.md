# Children's Book Creator App TODO

## Rebranding for General Market
- [x] Remove Queen Aurora-specific content
- [x] Make AI prompts generic for any children's book
- [x] Update app name and branding (StoryForge Kids)
- [x] Create new app logo (book/pencil theme)
- [x] Update all UI text to be generic
- [x] Remove character reference tab
- [ ] Add genre/theme selection
- [ ] Support multiple book series per user
- [ ] Pricing: $5.99 one-time purchase
- [ ] Add app store listing content
- [ ] Create marketing materials

## Per-Book Publishing Paywall ($5.99)
- [x] Create $5.99 product in Stripe for book publishing (price_1Ss2NCHqSDtb2XZx2wmpK31w)
- [x] Add "Publish to Amazon" button on book detail page
- [x] Show paywall when user clicks publish
- [x] After payment: unlock publishing features
- [x] Generate print-ready PDF with Amazon KDP specs
- [x] Implement server-side PDF generation
- [x] Use proper Amazon KDP dimensions (8.5x11")
- [x] Embed fonts and high-res images
- [x] Add copyright page and ISBN placeholder
- [ ] Generate social media marketing content
- [ ] Track which books are "published" vs "draft"
- [ ] Allow re-download of published books
- [x] Integrate Stripe Checkout for $5.99 publishing payment
- [x] Download images from URLs in PDF generation
- [x] Embed real images in PDFs instead of placeholders
- [x] Create payment verification and success screen
- [x] Update book status after successful payment

## Payment Integration
- [x] Install RevenueCat SDK
- [x] Configure RevenueCat products (needs API keys)
- [x] Implement free trial (1 book limit)
- [x] Create paywall screen
- [x] Add "Unlock Full Access" button
- [x] Track purchase status
- [x] Restore purchases functionality
- [x] Handle payment errors
- [x] Integrate paywall into book creation flow
- [x] Initialize payments on app startup

## Stripe Payment Setup (Easiest - Get Paid Fast)
- [ ] Create Stripe account with LLC info (Aurora Rayes LLC, EIN: 41-2843438)
- [ ] Link personal bank account (or debit card)
- [ ] Add EIN for LLC tax reporting
- [x] Integrate Stripe Checkout (server-side ready)
- [ ] Create $5.99 product in Stripe Dashboard
- [ ] Get API keys from Stripe
- [ ] Add API keys to app
- [x] Add payment success/cancel pages
- [ ] Test payment flow

## Bank Account Setup (Optional - For App Stores Later)
- [ ] Create Google Play Console account
- [ ] Set up merchant account
- [ ] Link bank account for payouts
- [ ] Configure tax information
- [ ] Create RevenueCat account
- [ ] Configure in-app products in RevenueCat
- [ ] Link RevenueCat to Google Play

# Original Queen Aurora App TODO

## AI Assistant Integration
- [x] Conversational AI assistant powered by Gemini
- [x] Chat interface for book creation guidance
- [x] Natural language book generation requests
- [ ] AI suggestions for story improvements
- [ ] Voice-to-text input for story ideas
- [x] Context-aware assistance based on current workflow
- [ ] AI-powered content editing and refinement
- [x] Unrestricted/unfiltered AI mode for creative freedom

## Core Automation Features
- [x] Automated book creation workflow with AI
- [x] AI-powered story text generation from prompts
- [x] Automated image prompt generation
- [ ] Batch image generation via Gemini API (placeholder ready)
- [ ] Integrate server-side image generation
- [ ] Integrate server-side PDF generation
- [ ] File storage for generated images
- [ ] File storage for exported PDFs
- [ ] Marketing content automation

## Legal & Publishing Requirements
- [ ] Copyright notice generator
- [ ] ISBN number management
- [ ] Library of Congress cataloging info
- [ ] Trademark protection guidance
- [ ] Amazon KDP legal compliance
- [ ] Copyright registration workflow
- [ ] Publishing contract templates
- [ ] Rights and permissions tracking
- [x] Automated PDF assembly and export (placeholder ready)
- [ ] One-tap publishing preparation
- [x] Connect AI chat to book generation flow
- [x] Parse AI responses and create book objects
- [x] Save generated books to storage

## Book Management
- [x] Book series library view
- [x] Create new book with metadata
- [ ] Edit book details
- [x] Delete books
- [x] Book completion status tracking
- [x] Book detail view with all pages
- [x] Navigate from library to book detail

## Automated Content Generation
- [ ] AI story generation from milestone/topic input
- [ ] Generate all 12 pages of text automatically
- [ ] Generate image prompts for all pages
- [ ] Batch generate all images for a book
- [ ] Preview generated content before finalizing

## Image Management
- [ ] View generated images by book
- [ ] Regenerate individual images
- [ ] Download images to device
- [ ] Image quality settings

## PDF Export
- [x] Generate print-ready PDF (placeholder)
- [x] Amazon KDP formatting guidelines
- [x] Text overlay on images (HTML template)
- [ ] Export to device storage (needs implementation)
- [ ] Share PDF via email/cloud (needs implementation)

## Character Database
- [x] Character profiles (Aurora, Azrael, King, Queen)
- [x] Character consistency guidelines
- [x] Visual reference descriptions

## Marketing Tools
- [ ] Marketing strategy templates
- [ ] Social media content generator
- [ ] Product bundle ideas
- [ ] Affiliate link manager

## Publishing Workflow
- [ ] Step-by-step checklist
- [ ] Amazon KDP guidelines
- [ ] ISBN tracking
- [ ] Publication status

## Settings
- [ ] AI generation preferences
- [ ] Image quality settings
- [ ] PDF export settings
- [ ] App theme customization
