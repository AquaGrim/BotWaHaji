const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");

// Load semua handler menu
const menu1 = require("./handlers/menu1_jadwal");
const menu2 = require("./handlers/menu2_nomorPorsi");
const menu3 = require("./handlers/menu3_vaksin");
const menu4 = require("./handlers/menu4_barang");
const menu5 = require("./handlers/menu5_manasik");
const menu6 = require("./handlers/menu6_biaya");
const menu7 = require("./handlers/menu7_layananArab");
const menu8 = require("./handlers/menu8_transport");
const menu9 = require("./handlers/menu9_darurat");
const menu10 = require("./handlers/menu10_pascaHaji");
const menu0 = require("./handlers/menu0_umum");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
    ],
  },
});

// File untuk menyimpan daftar nomor yang sudah disapa
const welcomeFile = "./sentWelcome.json";
let sentWelcome = fs.existsSync(welcomeFile)
  ? JSON.parse(fs.readFileSync(welcomeFile))
  : [];

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ Bot WhatsApp siap digunakan!");
});

// Fungsi untuk kirim menu utama
function sendMainMenu(client, sender) {
  const menuText = `Selamat Datang di *LABBAIKALLAH* 🙏
*(Layanan Berbagi Informasi ke Baitullah)*
Kantor Kemenag Kabupaten Kuantan Singingi

Silakan pilih layanan yang Anda butuhkan:

1️⃣ Jadwal & Keberangkatan  
2️⃣ Nomor Porsi Haji  
3️⃣ Vaksinasi & Kesehatan  
4️⃣ Barang Bawaan  
5️⃣ Ibadah & Manasik  
6️⃣ Biaya Haji & Umrah  
7️⃣ Layanan di Arab Saudi  
8️⃣ Transportasi  
9️⃣ Kontak Darurat  
🔟 Informasi Pasca Haji  
0️⃣ Pertanyaan Umum/Personal

Ketik angka sesuai menu.`;
  client.sendMessage(sender, menuText);
}

client.on("message", async (msg) => {
  const sender = msg.from;

  // Abaikan pesan dari grup
  if (sender.endsWith("@g.us")) return;

  const text = msg.body.trim().toLowerCase();

  // Pertama kali chat → kirim sambutan + menu
  if (!sentWelcome.includes(sender)) {
    sendMainMenu(client, sender);
    sentWelcome.push(sender);
    fs.writeFileSync(welcomeFile, JSON.stringify(sentWelcome, null, 2));
    return;
  }

  // Trigger manual → ketik "menu" untuk melihat menu lagi
  if (text === "menu") {
    sendMainMenu(client, sender);
    return;
  }

  // Handler menu berdasarkan angka
  switch (msg.body.trim()) {
    case "1":
      menu1(client, sender);
      break;
    case "2":
      menu2(client, sender);
      break;
    case "3":
      menu3(client, sender);
      break;
    case "4":
      menu4(client, sender);
      break;
    case "5":
      menu5(client, sender);
      break;
    case "6":
      menu6(client, sender);
      break;
    case "7":
      menu7(client, sender);
      break;
    case "8":
      menu8(client, sender);
      break;
    case "9":
      menu9(client, sender);
      break;
    case "10":
      menu10(client, sender);
      break;
    case "0":
      menu0(client, sender);
      break;
  }
});

client.initialize();
