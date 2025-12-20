import Foundation
import Combine

public struct TelemetryEvent: Codable, Identifiable {
    public var id: UUID = UUID()
    public var name: String
    public var metadata: [String: String]
    public var createdAt: Date = .init()
}

public final class TelemetryService {
    private let config: VEGAConfig
    private let queue = DispatchQueue(label: "telemetry.queue")
    private let subject = PassthroughSubject<TelemetryEvent, Never>()
    private var cancellables = Set<AnyCancellable>()

    public init(config: VEGAConfig) {
        self.config = config
    }

    public func start() {
        subject
            .sink { event in
                print("Telemetry event: \(event.name) -> \(event.metadata)")
            }
            .store(in: &cancellables)
    }

    public func log(name: String, metadata: [String: String] = [:]) {
        let event = TelemetryEvent(name: name, metadata: metadata)
        queue.async {
            self.subject.send(event)
        }
    }
}
