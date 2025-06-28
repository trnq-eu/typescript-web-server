import { config } from "../config.js";
export async function handlerMetrics(_, res) {
    // res.send(`Hits: ${config.fileServerHits}`);
    const html = `
  <html>
    <body>
      <h1>Welcome, Chirpy Admin</h1>
      <p>Chirpy has been visited ${config.fileServerHits} times!</p>
    </body>
  </html>
  `;
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(html);
    res.end();
}
