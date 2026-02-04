import WebKit
import PlaygroundSupport

let html = """
<html>
    <style>
        body { background-color: #f0f0f0; font-family: sans-serif; text-align: center; }
        h1 { color: #007aff; }
    </style>
    <body>
        <h1>Halo dari Xcode!</h1>
        <p>Edit HTML/CSS ini dan lihat perubahannya.</p>
    </body>
</html>
"""

let webView = WKWebView(frame: CGRect(x: 0, y: 0, width: 400, height: 600))
webView.loadHTMLString(html, baseURL: nil)

// Menampilkan di Live View sebelah kanan
PlaygroundPage.current.liveView = webView
