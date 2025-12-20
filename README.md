# VEGA Mobile Skeleton

This repository now contains starter scaffolding for the VEGA mobile applications for iOS (SwiftUI + Combine) and Android (Kotlin + Jetpack Compose). Each project includes placeholder API connectors, telemetry hooks, and UI shells aligned with the requested feature set.

- `VEGA_iOS`: Swift Package manifest and SwiftUI views demonstrating the dashboard, story/vision previews, and an 8D soundscape controller stub.
- `VEGA_Android`: Gradle-based Android project with Compose UI, Retrofit/Coroutines dependencies, and placeholder telemetry and soundscape services.

Environment variables such as `VEGA_OPENAI_KEY`, `VEGA_SUNO_KEY`, `VEGA_VISION_KEY`, `VEGA_TELEMETRY_KEY`, and `VEGA_API_BASE` should be set for secure runtime configuration.
