# TorDex Research Findings

## Overview
TorDex is a dark web search engine that provides uncensored access to .onion sites. However, it has significant limitations for integration into a standard web application.

## Key Findings

### Access Requirements
- **Tor Browser Required**: TorDex is only accessible through the Tor network
- **Onion Address**: http://tordexu73joywapk2txdr54jed4imqledpcvcuf75qsas2gwdgksvnyd.onion
- **No Public API**: No documented public API for programmatic access
- **Dark Web Only**: Not accessible from regular internet connections

### Limitations
1. **No Standard HTTP API**: TorDex does not provide a REST API for integration
2. **Tor Network Dependency**: Requires Tor proxy/SOCKS5 connection
3. **Legal/Ethical Concerns**: Primarily indexes illegal and undesirable content
4. **Ad-Heavy**: Full of scam advertisements
5. **Performance Issues**: Slow loading times

## Alternative Approaches

Since TorDex doesn't provide a suitable API for integration into a standard web application, here are alternative implementations:

### Option 1: Uncensored AI Search
- Use existing uncensored AI models (like the Llama3 Abliterated already in use)
- Implement web scraping with user-provided search terms
- Use DuckDuckGo or Brave Search APIs (privacy-focused, less censored)

### Option 2: Custom "Uncensored" Features
- Allow users to configure their own search providers
- Implement a plugin system for custom data sources
- Add support for alternative search engines (SearX, Brave, etc.)

### Option 3: Torrent/Content Search
- Integrate torrent search APIs (1337x, ThePirateBay, etc.)
- Use existing torrent-search-api libraries
- Focus on legal use cases (public domain content, Linux ISOs, etc.)

## Recommendation

**Do not integrate TorDex directly** due to:
- Lack of API
- Legal/ethical concerns
- Technical complexity (Tor network requirement)
- Poor user experience

Instead, implement **Option 1**: Enhance the existing chat with web search capabilities using privacy-focused, less-censored search APIs like DuckDuckGo or Brave Search, which can be accessed without special infrastructure and provide "uncensored" results within legal boundaries.
