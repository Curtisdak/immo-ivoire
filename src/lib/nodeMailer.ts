// src/lib/nodeMailer.ts
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: false, //important pour Windows/dev
  tls: {
    rejectUnauthorized: false, // utilser seulement en dev pas en prod
  },
})


if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error("EMAIL_USER ou EMAIL_PASS non défini dans .env")
}

// Test de connexion automatique (optionnel mais utile en dev)
transporter.verify(function (error, success) {
  if (error) {
    console.error("Erreur connexion SMTP :", error)
  } else {
    console.log("✅ Serveur SMTP prêt à envoyer des e-mails",success)
  }
})

export default transporter
