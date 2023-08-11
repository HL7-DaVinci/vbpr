export default function handler(req, res) {
  const codespace = process.env.CODESPACE_NAME;
  const endpoint = codespace ? `https://${codespace}-8080.app.github.dev/fhir` : 'http://localhost:8080/fhir'
  res.status(200).json({ endpoint })
}