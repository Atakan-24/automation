import UIKit

class ContentBlockerRequestHandler: NSObject, NSExtensionRequestHandling {

    private let groupID = "group.com.DEINNAME.feedclear"

    func beginRequest(with context: NSExtensionContext) {
        let defaults     = UserDefaults(suiteName: groupID)
        let blockHome    = defaults?.bool(forKey: "blockHomeFeed") ?? true
        let blockShorts  = defaults?.bool(forKey: "blockShorts")   ?? false

        var rules: [[String: Any]] = []

        if blockHome {
            rules += [
                makeRule("ytd-rich-grid-renderer"),
                makeRule("ytd-rich-item-renderer"),
                makeRule("ytd-rich-section-renderer"),
                makeRule("ytd-feed-filter-chip-bar-renderer"),
                makeRule("ytd-browse[page-subtype=\"home\"] #contents")
            ]
        }

        if blockShorts {
            rules += [
                makeRule("ytd-reel-shelf-renderer"),
                makeRule("ytm-shorts-lockup-view-model"),
                makeRule("a[title=\"Shorts\"]")
            ]
        }

        guard !rules.isEmpty,
              let data = try? JSONSerialization.data(withJSONObject: rules) else {
            context.cancelRequest(withError: URLError(.unknown))
            return
        }

        let tmpURL = FileManager.default.temporaryDirectory
            .appendingPathComponent("rules.json")
        try? data.write(to: tmpURL)

        let item = NSExtensionItem()
        item.attachments = [NSItemProvider(contentsOf: tmpURL)!]
        context.completeRequest(returningItems: [item], completionHandler: nil)
    }

    private func makeRule(_ selector: String) -> [String: Any] {
        return [
            "action": ["type": "css-display-none", "selector": selector],
            "trigger": ["url-filter": ".*", "if-domain": ["*youtube.com"]]
        ]
    }
}
