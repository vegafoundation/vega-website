import SwiftUI
import Combine

public struct DashboardView: View {
    @EnvironmentObject private var appModel: AppModel
    @State private var snapshot: DashboardSnapshot? = nil
    @State private var stories: [Story] = []
    @State private var vision: [VisionAsset] = []
    @State private var cancellables: Set<AnyCancellable> = []

    public init() {}

    public var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                header
                moduleGrid
                storySection
                visionSection
                SoundscapeView()
            }
            .padding()
        }
        .onAppear(perform: load)
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("VEGA Dashboard")
                .font(.largeTitle.bold())
            Text(snapshot?.status ?? "Connecting...")
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 16))
    }

    private var moduleGrid: some View {
        LazyVGrid(columns: [GridItem(.adaptive(minimum: 120))], spacing: 16) {
            ForEach(snapshot?.modules ?? ["Story Engine", "Vision Engine", "Soundscapes", "Infinity Loop"], id: \.self) { module in
                Text(module)
                    .font(.headline)
                    .padding()
                    .frame(maxWidth: .infinity, minHeight: 80)
                    .background(LinearGradient(colors: [.blue.opacity(0.7), .purple.opacity(0.6)], startPoint: .topLeading, endPoint: .bottomTrailing))
                    .overlay(RoundedRectangle(cornerRadius: 16).stroke(.white.opacity(0.4), lineWidth: 1))
                    .clipShape(RoundedRectangle(cornerRadius: 16))
            }
        }
    }

    private var storySection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Stories")
                .font(.title2.bold())
            ForEach(stories) { story in
                VStack(alignment: .leading, spacing: 4) {
                    Text(story.title).font(.headline)
                    Text(story.summary).foregroundStyle(.secondary)
                }
                .padding()
                .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 12))
            }
        }
    }

    private var visionSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Vision")
                .font(.title2.bold())
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(vision) { asset in
                        VStack {
                            Rectangle()
                                .fill(.quinary)
                                .frame(width: 160, height: 100)
                                .overlay(Text(asset.title).padding(6), alignment: .bottomLeading)
                            Text(asset.imageURL.absoluteString)
                                .font(.caption2)
                                .foregroundStyle(.secondary)
                        }
                        .frame(width: 160)
                        .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 12))
                    }
                }
            }
        }
    }

    private func load() {
        guard let services = (appModel as AnyObject).services else { return }
        services.api.fetchDashboard().sink(receiveCompletion: { _ in }, receiveValue: { snapshot in
            self.snapshot = snapshot
        }).store(in: &cancellables)
        services.api.fetchStories().sink(receiveCompletion: { _ in }, receiveValue: { stories in
            self.stories = stories
        }).store(in: &cancellables)
        services.api.fetchVisionGallery().sink(receiveCompletion: { _ in }, receiveValue: { assets in
            self.vision = assets
        }).store(in: &cancellables)
        services.telemetry.log(name: "dashboard_loaded")
    }
}

private extension Array where Element == String {
    func identified() -> [String] { self }
}
