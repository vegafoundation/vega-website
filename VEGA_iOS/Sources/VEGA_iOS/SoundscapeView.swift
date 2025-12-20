import SwiftUI

public struct SoundscapeView: View {
    @EnvironmentObject private var appModel: AppModel
    @State private var soundscapeID: String = "infinity_loop"

    public init() {}

    public var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("8D Soundscape")
                .font(.title2.bold())
            TextField("Soundscape ID", text: $soundscapeID)
                .textFieldStyle(.roundedBorder)
            HStack {
                Button(action: { appModel.services.soundscape.play(soundscape: soundscapeID) }) {
                    Label("Play", systemImage: "play.fill")
                }
                Button(action: { appModel.services.soundscape.stop() }) {
                    Label("Stop", systemImage: "stop.fill")
                }
            }
            .buttonStyle(.borderedProminent)
            if let nowPlaying = appModel.services.soundscape.nowPlaying {
                Text("Now playing: \(nowPlaying)")
                    .foregroundStyle(.secondary)
            }
        }
        .padding()
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 16))
    }
}
