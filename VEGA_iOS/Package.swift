// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "VEGA_iOS",
    platforms: [
        .iOS(.v17)
    ],
    products: [
        .library(
            name: "VEGA_iOS",
            targets: ["VEGA_iOS"]
        )
    ],
    dependencies: [
        // OpenAI SDK placeholder
        .package(url: "https://github.com/openai/openai-swift", from: "0.0.6"),
        // Audio engine placeholder
        .package(url: "https://github.com/suno-ai/suno-swift.git", from: "0.1.0"),
        // Networking
        .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.8.0")
    ],
    targets: [
        .target(
            name: "VEGA_iOS",
            dependencies: [
                .product(name: "OpenAI", package: "openai-swift"),
                .product(name: "Suno", package: "suno-swift"),
                "Alamofire"
            ],
            path: "Sources/VEGA_iOS"
        )
    ]
)
