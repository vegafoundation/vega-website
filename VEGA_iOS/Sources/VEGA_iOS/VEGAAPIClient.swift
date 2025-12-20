import Foundation
import Alamofire
import Combine

public protocol VEGAAPI {
    func fetchDashboard() -> AnyPublisher<DashboardSnapshot, Error>
    func fetchStories() -> AnyPublisher<[Story], Error>
    func fetchVisionGallery() -> AnyPublisher<[VisionAsset], Error>
    func submitTelemetry(event: TelemetryEvent) -> AnyPublisher<Void, Error>
}

public final class VEGAAPIClient: VEGAAPI {
    private let session: Session
    private let config: VEGAConfig
    private let decoder = JSONDecoder()

    public init(config: VEGAConfig) {
        self.config = config
        self.session = Session()
    }

    public func fetchDashboard() -> AnyPublisher<DashboardSnapshot, Error> {
        request(path: "/dashboard")
    }

    public func fetchStories() -> AnyPublisher<[Story], Error> {
        request(path: "/stories")
    }

    public func fetchVisionGallery() -> AnyPublisher<[VisionAsset], Error> {
        request(path: "/vision")
    }

    public func submitTelemetry(event: TelemetryEvent) -> AnyPublisher<Void, Error> {
        let url = config.baseURL.appendingPathComponent("telemetry")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("Bearer \(config.telemetryKey)", forHTTPHeaderField: "Authorization")
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try? JSONEncoder().encode(event)

        return session.request(request)
            .validate()
            .publishData()
            .tryMap { _ in () }
            .retry(2)
            .eraseToAnyPublisher()
    }

    private func request<T: Decodable>(path: String) -> AnyPublisher<T, Error> {
        let url = config.baseURL.appendingPathComponent(path)
        var request = URLRequest(url: url)
        request.addValue("Bearer \(config.openAIKey)", forHTTPHeaderField: "Authorization")

        return session.request(request)
            .validate()
            .publishData()
            .value()
            .decode(type: T.self, decoder: decoder)
            .retry(2)
            .eraseToAnyPublisher()
    }
}

public struct DashboardSnapshot: Codable {
    public var modules: [String]
    public var status: String
}

public struct Story: Codable, Identifiable {
    public var id: UUID
    public var title: String
    public var summary: String
    public var content: String
}

public struct VisionAsset: Codable, Identifiable {
    public var id: UUID
    public var title: String
    public var imageURL: URL
}
