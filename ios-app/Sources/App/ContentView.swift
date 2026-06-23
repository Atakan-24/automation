import SwiftUI
import SafariServices

struct ContentView: View {

    private let groupID   = "group.com.DEINNAME.feedclear"
    private let blockerID = "com.DEINNAME.feedclear.BlockerExtension"

    @State private var blockHomeFeed: Bool
    @State private var blockShorts:   Bool
    @State private var statusText = ""
    @State private var showSetup  = false

    private var defaults: UserDefaults? { UserDefaults(suiteName: groupID) }

    init() {
        let d = UserDefaults(suiteName: "group.com.DEINNAME.feedclear")
        _blockHomeFeed = State(initialValue: d?.bool(forKey: "blockHomeFeed") ?? true)
        _blockShorts   = State(initialValue: d?.bool(forKey: "blockShorts")   ?? false)
    }

    var body: some View {
        NavigationView {
            Form {

                Section(header: Text("YouTube blockieren")) {
                    ToggleRow(
                        title: "Home Feed",
                        subtitle: "Alle Empfehlungen auf der Startseite",
                        isOn: $blockHomeFeed
                    )
                    .onChange(of: blockHomeFeed) { val in
                        defaults?.set(val, forKey: "blockHomeFeed")
                        reload()
                    }

                    ToggleRow(
                        title: "Shorts",
                        subtitle: "Kurzvideos ausblenden",
                        isOn: $blockShorts
                    )
                    .onChange(of: blockShorts) { val in
                        defaults?.set(val, forKey: "blockShorts")
                        reload()
                    }
                }

                Section(footer: Text(statusText).foregroundColor(.secondary)) {
                    Button("Blocker neu laden") { reload() }
                }

                Section {
                    Button("Aktivierungsanleitung") { showSetup = true }
                        .foregroundColor(.accentColor)
                }
            }
            .navigationTitle("FeedClear")
            .sheet(isPresented: $showSetup) { SetupView() }
        }
    }

    func reload() {
        SFContentBlockerManager.reloadContentBlocker(withIdentifier: blockerID) { error in
            DispatchQueue.main.async {
                statusText = error == nil ? "✓ Aktualisiert" : "Fehler: \(error!.localizedDescription)"
            }
        }
    }
}

struct ToggleRow: View {
    let title: String
    let subtitle: String
    @Binding var isOn: Bool

    var body: some View {
        Toggle(isOn: $isOn) {
            VStack(alignment: .leading, spacing: 3) {
                Text(title)
                Text(subtitle)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
    }
}

struct SetupView: View {
    @Environment(\.dismiss) var dismiss

    let steps: [(String, String)] = [
        ("1", "Einstellungen → Safari → Erweiterungen öffnen"),
        ("2", "FeedClear aktivieren"),
        ("3", "Zur FeedClear App → gewünschte Blöcke einschalten"),
        ("4", "YouTube in Safari öffnen — Home Feed ist weg ✅")
    ]

    var body: some View {
        NavigationView {
            List {
                ForEach(steps, id: \.0) { num, text in
                    HStack(spacing: 14) {
                        Text(num)
                            .font(.caption.bold())
                            .foregroundColor(.white)
                            .frame(width: 28, height: 28)
                            .background(Color.orange)
                            .clipShape(Circle())
                        Text(text)
                            .font(.subheadline)
                    }
                    .padding(.vertical, 4)
                }
            }
            .navigationTitle("Einrichtung")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Fertig") { dismiss() }
                }
            }
        }
    }
}
