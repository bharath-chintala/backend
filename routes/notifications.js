const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

/**
 * Professional HTML Email Template for Techyarts
 */
function buildContactEmailHtml({ name, email, phone, service, source, message }) {
    const sourceBlock = source ? `
    <div class="field-group">
        <span class="label">Inquiry Source</span>
        <p class="value">Came from page: <span class="accent">${source}</span></p>
    </div>` : '';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f4f7fa; }
            .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #eef2f7; }
            .header { background: #0f172a; padding: 40px 24px; text-align: center; color: #ffffff; }
            
            /* Logo Styling */
            .logo-wrap { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 12px; }
            .logo-box { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); width: 32px; height: 32px; border-radius: 8px; display: inline-block; vertical-align: middle; }
            .logo-text { font-size: 26px; font-weight: 900; letter-spacing: -0.04em; color: #ffffff; vertical-align: middle; margin-left: 8px; }
            .logo-dot { color: #3b82f6; }
            
            .header p { margin: 8px 0 0; font-size: 13px; opacity: 0.7; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; }
            .content { padding: 40px 48px; }
            .field-group { margin-bottom: 28px; border-bottom: 1px solid #f0f4f8; padding-bottom: 18px; }
            .field-group:last-child { border-bottom: none; }
            .label { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.1em; margin-bottom: 8px; display: block; }
            .value { font-size: 17px; color: #1e293b; font-weight: 600; margin: 0; }
            .message-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 24px; border-radius: 0 10px 10px 0; margin-top: 10px; color: #334155; font-style: italic; line-height: 1.7; }
            .footer { padding: 32px; text-align: center; border-top: 1px solid #f0f4f8; background: #fafbfc; }
            .footer p { margin: 0; font-size: 12px; color: #94a3b8; font-weight: 500; }
            .accent { color: #3b82f6; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-wrap">
                    <span class="logo-box"></span>
                    <span class="logo-text">Techyarts<span class="logo-dot">.</span></span>
                </div>
                <p>New Project Exploration</p>
            </div>
            <div class="content">
                <div class="field-group">
                    <span class="label">Contact Person</span>
                    <p class="value">${name}</p>
                </div>
                <div class="field-group">
                    <span class="label">Email Address</span>
                    <p class="value"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></p>
                </div>
                <div class="field-group">
                    <span class="label">Phone Number</span>
                    <p class="value">${phone || 'Not Provided'}</p>
                </div>
                <div class="field-group">
                    <span class="label">Building Inquiry</span>
                    <p class="value"><span class="accent">${service || 'General Software'}</span></p>
                </div>
                ${sourceBlock}
                <div class="field-group">
                    <span class="label">Project Brief</span>
                    <div class="message-box">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                </div>
            </div>
            <div class="footer">
                <p>© 2026 <span class="accent">Techyarts Digital Agency</span>. Built for the Future.</p>
                <p style="margin-top: 6px;">Secure Transmission · End-to-End Encryption Enabled</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

/**
 * Route: POST /api/contact
 */
router.post('/contact', async (req, res) => {
    const { name, email, phone, service, source, message } = req.body;

    console.log('[API] Processing contact form from:', name);

    // Basic Validation
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Required fields (name, email, message) are missing.' });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"Techyarts Website" <${process.env.SMTP_USER}>`,
            to: 'thetechyarts@gmail.com', // Explicit recipient as requested
            subject: `🚀 New Project: ${service || 'Inquiry'} - ${name}`,
            replyTo: email,
            html: buildContactEmailHtml({ name, email, phone, service, source, message })
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('[SMTP] Mail sent successfully:', info.messageId);

        return res.status(200).json({ success: true, message: 'Your message has been received. We will contact you shortly.' });
    } catch (error) {
        console.error('[SMTP] Critical failure sending contact email:', error);
        return res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
    }
});

module.exports = router;
