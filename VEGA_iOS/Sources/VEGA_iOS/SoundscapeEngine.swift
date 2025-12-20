import Foundation
import Combine

public final class SoundscapeEngine: ObservableObject {
    @Published public private(set) var isPlaying: Bool = false
    @Published public private(set) var nowPlaying: String? = nil

    private let config: VEGAConfig

    public init(config: VEGAConfig) {
        self.config = config
    }

    public func play(soundscape id: String) {
        nowPlaying = id
        isPlaying = true
    }

    public func stop() {
        isPlaying = false
        nowPlaying = nil
    }
}
