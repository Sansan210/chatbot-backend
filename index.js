const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// Fungsi sederhana untuk hitung status gizi
function hitungStatusGizi(usia, berat, tinggi) {
  const usiaNum = parseInt(usia);
  const beratNum = parseFloat(berat);
  const tinggiNum = parseFloat(tinggi);

  if (usiaNum <= 2 && beratNum < 9) return "Stunting";
  if (beratNum >= 9 && beratNum <= 12) return "Normal";
  return "Berisiko stunting";
}

// Fungsi rekomendasi makanan
function rekomendasiMakanan(status) {
  if (status === "Stunting") {
    return ["Bubur kacang hijau", "Telur rebus", "Sayur bayam", "Daging cincang"];
  } else if (status === "Normal") {
    return ["Nasi tim ayam", "Sup sayur", "Buah pisang", "Ikan kukus"];
  } else {
    return ["Bubur oat", "Susu tinggi protein", "Sayur wortel", "Tahu tempe"];
  }
}

// Endpoint webhook
app.post('/webhook', (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const params = req.body.queryResult.parameters;

  if (intent === "Pantau_Tumbuh") {
    const status = hitungStatusGizi(params.usia, params.berat, params.tinggi);
    res.json({
      fulfillmentMessages: [
        {
          text: {
            text: [
              `📊 Status gizi anak: ${status}\nUsia: ${params.usia}, Berat: ${params.berat}, Tinggi: ${params.tinggi}`
            ]
          }
        }
      ]
    });
  }

  else if (intent === "Rekomendasi_Makanan") {
    const status = hitungStatusGizi(params.usia, params.berat, params.tinggi);
    const rekomendasi = rekomendasiMakanan(status);
    res.json({
      fulfillmentMessages: [
        {
          text: {
            text: [
              `🍽️ Rekomendasi makanan untuk anak dengan status gizi *${status}*:\n- ${rekomendasi.join('\n- ')}`
            ]
          }
        }
      ]
    });
  }

  else {
    res.json({
      fulfillmentMessages: [
        {
          text: {
            text: ["Maaf, saya belum mengerti intent ini."]
          }
        }
      ]
    });
  }
});

app.listen(3000, () => console.log('Webhook listening on port 3000'));