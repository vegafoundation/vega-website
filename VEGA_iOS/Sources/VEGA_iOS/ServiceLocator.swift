import Foundation
import Combine

public final class ServiceLocator {
    public let config: VEGAConfig
    public let api: VEGAAPIClient
    public let soundscape: SoundscapeEngine
    public let telemetry: TelemetryService

    public init(
        config: VEGAConfig = .load(),
        api: VEGAAPIClient? = nil,
        soundscape: SoundscapeEngine? = nil,
        telemetry: TelemetryService? = nil
    ) {
        self.config = config
        self.api = api ?? VEGAAPIClient(config: config)
        self.soundscape = soundscape ?? SoundscapeEngine(config: config)
        self.telemetry = telemetry ?? TelemetryService(config: config)
    }

    public func initialize() {
        telemetry.start()
    }
}

public struct VEGAConfig: Codable {
    public var openAIKey: String
    public var sunoKey: String
    public var visionKey: String
    public var telemetryKey: String
    public var baseURL: URL

    public static func load() -> VEGAConfig {
        // Placeholder: replace with secure storage or admin injection
        return VEGAConfig(
            openAIKey: ProcessInfo.processInfo.environment["VEGA_OPENAI_KEY"] ?? "",
            sunoKey: ProcessInfo.processInfo.environment["VEGA_SUNO_KEY"] ?? "",
            visionKey: ProcessInfo.processInfo.environment["VEGA_VISION_KEY"] ?? "",
            telemetryKey: ProcessInfo.processInfo.environment["VEGA_TELEMETRY_KEY"] ?? "",
            baseURL: URL(string: ProcessInfo.processInfo.environment["VEGA_API_BASE"] ?? "https://api.vega.local")!
        )
    }
}
