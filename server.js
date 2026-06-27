const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// ---- Page HTML embarquée directement ici (pas de dossier public/) ----
const HTML_PAGE = "<!DOCTYPE html>\n<html lang=\"fr\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n<title>Robot Vérification — Mobile Money BF</title>\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.31.0/dist/tabler-icons.min.css\">\n<style>\n*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n:root {\n  --bg: #f5f5f3; --surface: #ffffff; --surface-2: #f9f9f8;\n  --border: rgba(0,0,0,0.1); --border-strong: rgba(0,0,0,0.2);\n  --text: #1a1a18; --text-muted: #6b6b68; --text-secondary: #4a4a47;\n  --accent: #2563eb; --accent-bg: #eff6ff;\n  --success: #16a34a; --success-bg: #f0fdf4;\n  --danger: #dc2626; --danger-bg: #fef2f2;\n  --warning: #d97706; --warning-bg: #fffbeb;\n  --radius: 8px;\n}\n@media (prefers-color-scheme: dark) {\n  :root {\n    --bg: #1a1a18; --surface: #252523; --surface-2: #2c2c2a;\n    --border: rgba(255,255,255,0.1); --border-strong: rgba(255,255,255,0.2);\n    --text: #f0f0ee; --text-muted: #888886; --text-secondary: #b0b0ae;\n    --accent-bg: #1e3a6e; --success-bg: #052e16;\n    --danger-bg: #450a0a; --warning-bg: #422006;\n  }\n}\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif;\n  background: var(--bg); color: var(--text);\n  min-height: 100vh; display: flex; flex-direction: column;\n  align-items: center; padding: 1.5rem 1rem 3rem;\n}\n.container { width: 100%; max-width: 480px; }\n\nheader { text-align: center; margin-bottom: 1.5rem; }\n.logo {\n  width: 64px; height: 64px; background: var(--accent-bg);\n  border-radius: 18px; display: flex; align-items: center;\n  justify-content: center; margin: 0 auto 12px;\n  font-size: 32px; color: var(--accent);\n}\nheader h1 { font-size: 21px; font-weight: 600; margin-bottom: 4px; }\nheader p { font-size: 14px; color: var(--text-muted); }\n\n.card { background: var(--surface); border: 0.5px solid var(--border); border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; }\n.card-label { font-size: 13px; color: var(--text-secondary); font-weight: 500; display: block; margin-bottom: 8px; }\nselect {\n  width: 100%; padding: 10px 12px;\n  border: 0.5px solid var(--border-strong); border-radius: var(--radius);\n  background: var(--surface); color: var(--text);\n  font-size: 15px; font-family: inherit;\n}\n\n.upload-zone {\n  border: 1.5px dashed var(--border-strong); border-radius: 12px;\n  padding: 2.5rem 1rem; text-align: center; cursor: pointer;\n  transition: all 0.15s; background: var(--surface-2); margin-bottom: 1rem;\n}\n.upload-zone:hover, .upload-zone.drag { border-color: var(--accent); background: var(--accent-bg); }\n.upload-zone i { font-size: 38px; color: var(--text-muted); display: block; margin-bottom: 10px; }\n.upload-zone p { font-size: 15px; color: var(--text-secondary); margin-bottom: 3px; }\n.upload-zone small { font-size: 12px; color: var(--text-muted); }\n#fileInput { display: none; }\n\n.preview { display: none; margin-bottom: 1rem; border-radius: 12px; overflow: hidden; border: 0.5px solid var(--border); }\n.preview img { width: 100%; display: block; max-height: 300px; object-fit: contain; background: var(--surface-2); }\n.preview-bar { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: var(--surface); border-top: 0.5px solid var(--border); }\n.preview-bar span { font-size: 12px; color: var(--text-muted); }\n.preview-bar button { font-size: 12px; color: var(--danger); background: none; border: none; cursor: pointer; font-family: inherit; }\n\n.btn {\n  display: flex; align-items: center; justify-content: center; gap: 8px;\n  width: 100%; padding: 13px; border: none; border-radius: var(--radius);\n  font-size: 16px; font-weight: 500; font-family: inherit;\n  cursor: pointer; transition: all 0.15s;\n}\n.btn-primary { background: var(--accent); color: #fff; }\n.btn-primary:hover { filter: brightness(1.1); }\n.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }\n.btn-ghost { background: transparent; color: var(--text-secondary); border: 0.5px solid var(--border-strong); margin-top: 10px; font-size: 14px; padding: 11px; }\n.btn-ghost:hover { background: var(--surface-2); }\n\n.result { border-radius: 12px; overflow: hidden; border: 0.5px solid var(--border); margin-top: 1rem; }\n.result-header { padding: 1.1rem 1.25rem; display: flex; align-items: center; gap: 12px; }\n.result-header.ok   { background: var(--success-bg); }\n.result-header.fail { background: var(--danger-bg); }\n.result-header.warn { background: var(--warning-bg); }\n.result-header i { font-size: 28px; flex-shrink: 0; }\n.result-header.ok   i { color: var(--success); }\n.result-header.fail i { color: var(--danger); }\n.result-header.warn i { color: var(--warning); }\n.result-header h3 { font-size: 17px; font-weight: 600; }\n.result-header.ok   h3 { color: var(--success); }\n.result-header.fail h3 { color: var(--danger); }\n.result-header.warn h3 { color: var(--warning); }\n.result-header .sub { font-size: 12px; opacity: 0.7; margin-top: 2px; }\n\n.result-body { padding: 1rem 1.25rem; background: var(--surface); }\n.check-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 0.5px solid var(--border); font-size: 14px; }\n.check-item:last-child { border-bottom: none; }\n.check-item > i { font-size: 18px; margin-top: 1px; flex-shrink: 0; }\n.ok-icon   { color: var(--success); }\n.fail-icon { color: var(--danger); }\n.check-label { color: var(--text-secondary); min-width: 76px; font-weight: 500; padding-top: 1px; }\n.check-val strong { display: block; font-weight: 500; color: var(--text); }\n.check-val span   { font-size: 12px; color: var(--text-muted); margin-top: 1px; display: block; }\n\n.notes-box { margin-top: 12px; padding: 10px 12px; background: var(--surface-2); border-radius: var(--radius); border: 0.5px solid var(--border); font-size: 12px; color: var(--text-muted); line-height: 1.5; }\n\n.loading { text-align: center; padding: 2.5rem 1rem; }\n.loading i { font-size: 36px; color: var(--accent); display: block; margin-bottom: 10px; animation: spin 1s linear infinite; }\n.loading p { font-size: 14px; color: var(--text-secondary); }\n@keyframes spin { to { transform: rotate(360deg); } }\n\nfooter { text-align: center; margin-top: 2rem; font-size: 12px; color: var(--text-muted); }\n</style>\n</head>\n<body>\n<div class=\"container\">\n  <header>\n    <div class=\"logo\"><i class=\"ti ti-robot\"></i></div>\n    <h1>Robot de vérification</h1>\n    <p>Transactions Mobile Money — Burkina Faso</p>\n  </header>\n\n  <div class=\"card\">\n    <label class=\"card-label\"><i class=\"ti ti-arrows-exchange\" style=\"font-size:14px;vertical-align:-2px;margin-right:5px\"></i>Type de transaction</label>\n    <select id=\"txType\">\n      <option value=\"om_national\">Orange Money — National (BF)</option>\n      <option value=\"moov_benin\">Moov Bénin → Moov BF</option>\n      <option value=\"moov_togo\">Moov Togo → Moov BF</option>\n      <option value=\"wave\">Wave (CI / SN / ML / NE → BF)</option>\n      <option value=\"moov_national\">Moov Money — National (BF)</option>\n      <option value=\"om_international\">Orange Money — International (CI/ML/SN)</option>\n    </select>\n  </div>\n\n  <div class=\"upload-zone\" id=\"uploadZone\">\n    <i class=\"ti ti-photo-up\"></i>\n    <p>Appuyez pour choisir une image</p>\n    <small>Capture d'écran ou photo du SMS de confirmation</small>\n    <input type=\"file\" id=\"fileInput\" accept=\"image/*\">\n  </div>\n\n  <div class=\"preview\" id=\"preview\">\n    <img id=\"previewImg\" src=\"\" alt=\"Aperçu de la transaction\">\n    <div class=\"preview-bar\">\n      <span id=\"fileName\">image.jpg</span>\n      <button onclick=\"reset()\"><i class=\"ti ti-x\" style=\"font-size:12px;vertical-align:-1px\"></i> Changer</button>\n    </div>\n  </div>\n\n  <button class=\"btn btn-primary\" id=\"analyzeBtn\" disabled onclick=\"analyze()\">\n    <i class=\"ti ti-search\"></i> Vérifier la transaction\n  </button>\n\n  <div id=\"resultArea\"></div>\n</div>\n\n<footer>Propulsé par Gemini AI · Vérification automatique</footer>\n\n<script>\nconst RULES = {\n  om_national:      { numero: \"56853244\",    nom: true,  date: false, jours: 0 },\n  moov_benin:       { numero: \"22651507834\", nom: false, date: true,  jours: 3 },\n  moov_togo:        { numero: \"22651507834\", nom: false, date: true,  jours: 3 },\n  wave:             { numero: \"56853244\",    nom: false, date: true,  jours: 3 },\n  moov_national:    { numero: \"22651507834\", nom: false, date: true,  jours: 3 },\n  om_international: { numero: \"22656853244\", nom: false, date: true,  jours: 3 }\n};\n\nlet base64Data = null, fileType = \"image/jpeg\", fileName = \"\";\n\nconst uploadZone = document.getElementById(\"uploadZone\");\nconst fileInput  = document.getElementById(\"fileInput\");\n\nuploadZone.addEventListener(\"click\", () => fileInput.click());\nuploadZone.addEventListener(\"dragover\", e => { e.preventDefault(); uploadZone.classList.add(\"drag\"); });\nuploadZone.addEventListener(\"dragleave\", () => uploadZone.classList.remove(\"drag\"));\nuploadZone.addEventListener(\"drop\", e => { e.preventDefault(); uploadZone.classList.remove(\"drag\"); handleFile(e.dataTransfer.files[0]); });\nfileInput.addEventListener(\"change\", e => handleFile(e.target.files[0]));\n\nfunction handleFile(file) {\n  if (!file) return;\n  fileType = file.type || \"image/jpeg\";\n  fileName = file.name;\n  const reader = new FileReader();\n  reader.onload = ev => {\n    base64Data = ev.target.result.split(\",\")[1];\n    document.getElementById(\"previewImg\").src = ev.target.result;\n    document.getElementById(\"fileName\").textContent = fileName;\n    document.getElementById(\"preview\").style.display = \"block\";\n    document.getElementById(\"uploadZone\").style.display = \"none\";\n    document.getElementById(\"analyzeBtn\").disabled = false;\n    document.getElementById(\"resultArea\").innerHTML = \"\";\n  };\n  reader.readAsDataURL(file);\n}\n\nfunction reset() {\n  base64Data = null;\n  document.getElementById(\"preview\").style.display = \"none\";\n  document.getElementById(\"uploadZone\").style.display = \"block\";\n  document.getElementById(\"previewImg\").src = \"\";\n  document.getElementById(\"fileInput\").value = \"\";\n  document.getElementById(\"analyzeBtn\").disabled = true;\n  document.getElementById(\"resultArea\").innerHTML = \"\";\n}\n\nasync function analyze() {\n  if (!base64Data) return;\n  const txType = document.getElementById(\"txType\").value;\n  const rule = RULES[txType];\n  const today = new Date();\n\n  document.getElementById(\"analyzeBtn\").disabled = true;\n  document.getElementById(\"resultArea\").innerHTML = `\n    <div class=\"result\">\n      <div class=\"loading\">\n        <i class=\"ti ti-loader-2\"></i>\n        <p>Analyse de l'image en cours…</p>\n      </div>\n    </div>`;\n\n  try {\n    const resp = await fetch(\"/api/verify\", {\n      method: \"POST\",\n      headers: { \"Content-Type\": \"application/json\" },\n      body: JSON.stringify({\n        imageBase64: base64Data,\n        mediaType: fileType,\n        txType,\n        todayStr: today.toLocaleDateString(\"fr-FR\")\n      })\n    });\n\n    const json = await resp.json();\n    if (!json.ok || !json.data) throw new Error(json.error || \"Erreur serveur\");\n\n    const parsed = json.data;\n    const checks = [];\n    let allOk = true;\n\n    // Numéro\n    const numExtrait = (parsed.numero || \"\").replace(/[\\s\\+]/g, \"\").replace(/^226/, \"\");\n    const numAttendu = rule.numero.replace(/[\\s\\+]/g, \"\").replace(/^226/, \"\");\n    const numOk = numExtrait === numAttendu\n      || numExtrait.endsWith(numAttendu)\n      || numAttendu.endsWith(numExtrait)\n      || (numExtrait.length >= 8 && numAttendu.includes(numExtrait.slice(-8)));\n    if (!numOk) allOk = false;\n    checks.push({\n      label: \"Numéro\", ok: numOk,\n      val: parsed.numero || \"non trouvé\",\n      detail: numOk ? `Correspond à ${rule.numero}` : `Attendu : ${rule.numero}`\n    });\n\n    // Montant\n    const montantVal = parseInt((parsed.montant || \"\").replace(/\\D/g, \"\"));\n    const montantOk = montantVal > 0;\n    checks.push({\n      label: \"Montant\", ok: montantOk,\n      val: montantOk ? `${montantVal.toLocaleString(\"fr-FR\")} FCFA` : \"non trouvé\",\n      detail: montantOk ? \"Montant détecté\" : \"Montant introuvable\"\n    });\n\n    // Nom (OM national uniquement)\n    if (rule.nom) {\n      const nomOk = parsed.nom && parsed.nom.trim().length > 2;\n      if (!nomOk) allOk = false;\n      checks.push({\n        label: \"Nom\", ok: nomOk,\n        val: parsed.nom || \"non trouvé\",\n        detail: nomOk ? \"Nom complet présent\" : \"Nom complet requis\"\n      });\n    }\n\n    // Date\n    if (rule.date && rule.jours > 0) {\n      let dateOk = false, dateDetail = \"Date introuvable\";\n      if (parsed.date) {\n        const m = parsed.date.match(/(\\d{1,2})[\\/\\-\\.](\\d{1,2})[\\/\\-\\.](\\d{2,4})/);\n        if (m) {\n          let y = parseInt(m[3]); if (y < 100) y += 2000;\n          const txDate = new Date(y, parseInt(m[2]) - 1, parseInt(m[1]));\n          if (!isNaN(txDate)) {\n            const diff = Math.floor((today - txDate) / 86400000);\n            dateOk = diff >= 0 && diff <= rule.jours;\n            dateDetail = dateOk\n              ? `Il y a ${diff} jour(s) — valide (max ${rule.jours}j)`\n              : diff > rule.jours\n                ? `Trop ancien : ${diff} jours (max ${rule.jours})`\n                : \"Date future — invalide\";\n          } else { dateDetail = \"Date non reconnue\"; }\n        } else { dateDetail = \"Format de date non reconnu\"; }\n      }\n      if (!dateOk) allOk = false;\n      checks.push({ label: \"Date\", ok: dateOk, val: parsed.date || \"non trouvée\", detail: dateDetail });\n    }\n\n    // Statut\n    const s = (parsed.statut || \"\").toLowerCase();\n    const statutOk = s.includes(\"succ\") || s.includes(\"réuss\") || s.includes(\"reuss\") || s.includes(\"effectu\") || s.includes(\"reussi\");\n    if (!statutOk) allOk = false;\n    checks.push({\n      label: \"Statut\", ok: statutOk,\n      val: parsed.statut || \"inconnu\",\n      detail: statutOk ? \"Transaction réussie\" : \"Transaction non confirmée\"\n    });\n\n    const checksHtml = checks.map(c => `\n      <div class=\"check-item\">\n        <i class=\"ti ${c.ok ? \"ti-circle-check ok-icon\" : \"ti-circle-x fail-icon\"}\"></i>\n        <span class=\"check-label\">${c.label}</span>\n        <div class=\"check-val\">\n          <strong>${c.val}</strong>\n          <span>${c.detail}</span>\n        </div>\n      </div>`).join(\"\");\n\n    const st = allOk ? \"ok\" : \"fail\";\n    const ico = allOk ? \"ti-shield-check\" : \"ti-shield-x\";\n    const titre = allOk ? \"Transaction validée ✓\" : \"Transaction refusée ✗\";\n\n    document.getElementById(\"resultArea\").innerHTML = `\n      <div class=\"result\">\n        <div class=\"result-header ${st}\">\n          <i class=\"ti ${ico}\"></i>\n          <div>\n            <h3>${titre}</h3>\n            <div class=\"sub\">${parsed.type_detecte || \"\"} · confiance: ${parsed.confiance || \"?\"}</div>\n          </div>\n        </div>\n        <div class=\"result-body\">\n          ${checksHtml}\n          ${parsed.notes ? `<div class=\"notes-box\"><i class=\"ti ti-info-circle\" style=\"font-size:13px;vertical-align:-1px;margin-right:4px\"></i>${parsed.notes}</div>` : \"\"}\n        </div>\n      </div>\n      <button class=\"btn btn-ghost\" onclick=\"reset(); document.getElementById('resultArea').innerHTML='';\">\n        <i class=\"ti ti-refresh\"></i> Vérifier une autre transaction\n      </button>`;\n\n  } catch(err) {\n    document.getElementById(\"resultArea\").innerHTML = `\n      <div class=\"result\">\n        <div class=\"result-header warn\"><i class=\"ti ti-alert-triangle\"></i><h3>Erreur</h3></div>\n        <div class=\"result-body\"><p style=\"font-size:13px;color:var(--text-secondary)\">${err.message}</p></div>\n      </div>`;\n  }\n  document.getElementById(\"analyzeBtn\").disabled = false;\n}\n</script>\n</body>\n</html>\n";

app.get("/", (req, res) => {
  res.type("html").send(HTML_PAGE);
});

app.post("/api/verify", async (req, res) => {
  const { imageBase64, mediaType, txType, todayStr } = req.body;
  if (!imageBase64 || !txType) {
    return res.status(400).json({ error: "Paramètres manquants." });
  }

  const LABELS = {
    om_national:      "Orange Money National BF",
    moov_benin:       "Moov Bénin → BF",
    moov_togo:        "Moov Togo → BF",
    wave:             "Wave",
    moov_national:    "Moov Money National BF",
    om_international: "Orange Money International (CI/ML/SN)"
  };

  const prompt = `Tu es un robot de vérification de transactions mobiles en Afrique de l'Ouest. Analyse cette image de confirmation de paiement de type: ${LABELS[txType] || txType}. Date d'aujourd'hui: ${todayStr}.

Extrais les données et réponds UNIQUEMENT en JSON valide, sans markdown ni backticks.

Format exact:
{
  "montant": "valeur numérique sans espaces ni unité (ex: 15000)",
  "numero": "numéro du destinataire sans espaces ni + (ex: 22651507834)",
  "nom": "nom complet si présent sinon null",
  "date": "date au format DD/MM/YYYY ou null",
  "statut": "succès ou échec",
  "type_detecte": "type de transaction détecté",
  "confiance": "haute ou moyenne ou faible",
  "notes": "observations importantes"
}

Règles importantes:
- Le numéro est celui du DESTINATAIRE (à qui l'argent est envoyé)
- Pour Wave: numéro affiché au-dessus du bouton Partager, format comme "À africa t d 56853244"
- Pour Orange Money: numéro dans "au numero XXXXXXXX" ou "vers le +XXXXXXXXXXX"
- Pour Moov: numéro dans "au 22651507834" ou "Numéro de mobile: XXXXXXXXXXX"
- Montant: chiffres seulement, sans FCFA ni espaces
- Date exacte visible dans l'image`;

  try {
    const apiKey = "AQ.Ab8RN6LTb7kMvBpt5M6UIFOYjXPkqBRT8Ntc4jV_7P59-i5HZA"; // ⚠️ à remplacer plus tard par GEMINI_API_KEY
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const body = {
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: mediaType || "image/jpeg",
              data: imageBase64
            }
          },
          { text: prompt }
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 512
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    let parsed;
    try {
      const clean = text.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      return res.status(500).json({ error: "Réponse invalide de l'IA: " + text.slice(0, 100) });
    }

    res.json({ ok: true, data: parsed });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
