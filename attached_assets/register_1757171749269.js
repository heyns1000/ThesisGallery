{\rtf1\ansi\ansicpg1252\cocoartf2709
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww13440\viewh7800\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import nodemailer from 'nodemailer';\
\
export default async function handler(req, res) \{\
  if (req.method !== 'POST') \{\
    return res.status(405).json(\{ success: false, error: 'Method Not Allowed' \});\
  \}\
\
  const data = req.body;\
\
  const transporter = nodemailer.createTransport(\{\
    host: 'smtp.zoho.com',\
    port: 465,\
    secure: true,\
    auth: \{\
      user: 'vault@faa.zone',\
      pass: process.env.ZOHO_APP_PASS\
    \}\
  \});\
\
  const mailOptions = \{\
    from: '"FAA Vault" <vault@faa.zone>',\
    to: data['Email Address'],\
    subject: `\uc0\u55357 \u57057 \u65039  Your FAA.Zone Access Has Been Logged`,\
    text: `\
Hi $\{data['Full Name'] || data['Family Representative Name'] || data['Company Name'] || 'Guest'\},\
\
Thank you for completing your registration at FAA.Zone.\
\
Our team is reviewing your submission and will activate your vault or contact you shortly.\
\
If you did not submit this, please disregard this message.\
\
\'97\
\
FAA Mesh Team\
vault@faa.zone\
    `.trim()\
  \};\
\
  try \{\
    await transporter.sendMail(mailOptions);\
    return res.status(200).json(\{ success: true \});\
  \} catch (error) \{\
    console.error('\uc0\u10060  Email send failed:', error);\
    return res.status(500).json(\{ success: false, error: 'Email delivery error' \});\
  \}\
\}\
\
}