# Email Setup Guide

## Current Error
```
Invalid login: 535-5.7.8 Username and Password not accepted
```

This means Gmail is rejecting your credentials.

## Option 1: Gmail (Recommended for Production)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", enable **2-Step Verification**
3. Follow the prompts to set it up

### Step 2: Create App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Or: Google Account → Security → 2-Step Verification → App passwords
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Name it "Nodemailer Agent" or similar
5. Click **Generate**
6. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)

### Step 3: Update .env file
```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcdefghijklmnop  # 16-character app password (remove spaces)
OPENAI_API_KEY=your-openai-key
```

### Step 4: Test
```bash
node agent_tool.js
```

---

## Option 2: Mailtrap (Recommended for Testing)

Mailtrap is a fake SMTP server for testing - emails don't actually send, but you can see them in the Mailtrap inbox.

### Step 1: Sign up
1. Go to [mailtrap.io](https://mailtrap.io/)
2. Create a free account

### Step 2: Get credentials
1. Go to **Email Testing** → **Inboxes** → **My Inbox**
2. Click **Show Credentials**
3. Copy the SMTP settings

### Step 3: Update agent_tool.js
```javascript
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.SMTP_USER,  // From Mailtrap
        pass: process.env.SMTP_PASS,  // From Mailtrap
    },  
});
```

### Step 4: Update .env
```env
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
OPENAI_API_KEY=your-openai-key
```

---

## Option 3: Other Email Providers

### Outlook/Hotmail
```javascript
host: "smtp-mail.outlook.com",
port: 587,
secure: false,
```

### Yahoo Mail
```javascript
host: "smtp.mail.yahoo.com",
port: 465,
secure: true,
```

### SendGrid (Transactional Email Service)
```javascript
host: "smtp.sendgrid.net",
port: 587,
secure: false,
auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
}
```

---

## Troubleshooting

### "Username and Password not accepted"
- ✅ Make sure you're using an **App Password**, not your regular password
- ✅ Ensure 2-Factor Authentication is enabled
- ✅ Remove any spaces from the app password in .env

### "Connection timeout"
- ✅ Check your firewall/antivirus
- ✅ Try a different port (587 vs 465)
- ✅ Check if your network blocks SMTP

### "Self-signed certificate"
Add to transporter config:
```javascript
tls: {
    rejectUnauthorized: false
}
```
