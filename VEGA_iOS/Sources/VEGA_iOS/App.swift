import SwiftUI
import Combine

@main
public struct VEGAApp: App {
    @StateObject private var appModel = AppModel()

    public init() {}

    public var body: some Scene {
        WindowGroup {
            DashboardView()
                .environmentObject(appModel)
        }
    }
}

public final class AppModel: ObservableObject {
    @Published public private(set) var state: AppState = .initial
    public let services = ServiceLocator()

    public func bootstrap() {
        state = .loading
        services.initialize()
        state = .ready
    }
}

public enum AppState {
    case initial
    case loading
    case ready
    case error(String)
}
