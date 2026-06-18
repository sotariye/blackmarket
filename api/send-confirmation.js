module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not defined in environment variables.');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const data = req.body;
    if (!data) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const ticketId = data['Ticket ID'] || '#BM2026-UNKNOWN';
    const bizName = data['Business Name'] || 'Your Business';
    const contactName = data['Contact Name'] || 'Vendor';
    const recipientEmail = data['Email'];
    const category = data['Category'] || 'Not Specified';
    const sharing = data['Sharing Table?'] || 'No';
    const partnerDetails = data['Partner Details'] || 'None';
    const power = data['Requires Electrical Power?'] || 'No';

    if (!recipientEmail) {
      return res.status(400).json({ error: 'Recipient email is required' });
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Black Market 2026</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #fafafa;
            color: #4a4a46;
            margin: 0;
            padding: 0;
          }
          .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e5e5df;
            border-radius: 12px;
            overflow: hidden;
            margin-top: 40px;
            margin-bottom: 40px;
          }
          .header {
            background-color: #111111;
            padding: 32px 24px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: 0.5px;
          }
          .header span {
            color: #ca8a04;
          }
          .content {
            padding: 40px 24px;
          }
          .content h2 {
            color: #111111;
            font-size: 20px;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 16px;
          }
          .content p {
            font-size: 15px;
            line-height: 1.6;
            margin-top: 0;
            margin-bottom: 24px;
          }
          .ticket-card {
            border: 2px dashed #ca8a04;
            border-radius: 8px;
            background-color: #fcfcf9;
            padding: 24px;
            margin-bottom: 32px;
          }
          .ticket-header {
            border-bottom: 1px solid #e5e5df;
            padding-bottom: 12px;
            margin-bottom: 16px;
            overflow: auto;
          }
          .ticket-id {
            float: left;
            font-size: 16px;
            font-weight: 800;
            color: #ca8a04;
          }
          .ticket-price {
            float: right;
            font-size: 16px;
            font-weight: 700;
            color: #111111;
          }
          .ticket-row {
            margin-bottom: 8px;
            font-size: 14px;
            clear: both;
          }
          .ticket-label {
            font-weight: 600;
            color: #888884;
            display: inline-block;
            width: 120px;
          }
          .ticket-value {
            color: #111111;
          }
          .detail-list {
            background-color: #fafafa;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 24px;
            font-size: 14px;
            border: 1px solid #e5e5df;
          }
          .detail-row {
            padding: 8px 0;
            border-bottom: 1px solid #e5e5df;
            overflow: auto;
          }
          .detail-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
          .detail-row:first-child {
            padding-top: 0;
          }
          .detail-label {
            float: left;
            font-weight: 600;
            color: #888884;
          }
          .detail-value {
            float: right;
            color: #111111;
            font-weight: 500;
          }
          .footer {
            background-color: #fafafa;
            border-top: 1px solid #e5e5df;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #888884;
          }
          .footer a {
            color: #ca8a04;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="header">
            <h1>SoPlugged <span>Black Market 2026</span></h1>
          </div>
          <div class="content">
            <h2>Welcome to the Market, ${contactName}!</h2>
            <p>Thank you for registering for Black Market 2026. Your vendor booth request is confirmed, and your $250.00 CAD payment has been securely completed via Stripe.</p>
            
            <div class="ticket-card">
              <div class="ticket-header">
                <span class="ticket-id">PASS ${ticketId}</span>
                <span class="ticket-price">$250.00 CAD</span>
              </div>
              <div style="height: 10px; clear: both;"></div>
              <div class="ticket-row">
                <span class="ticket-label">Event:</span>
                <span class="ticket-value">Black Market 2026</span>
              </div>
              <div class="ticket-row">
                <span class="ticket-label">Date & Time:</span>
                <span class="ticket-value">Saturday, August 29, 2026 | 10:00 AM - 10:00 PM EST</span>
              </div>
              <div class="ticket-row">
                <span class="ticket-label">Location:</span>
                <span class="ticket-value">Toronto, Canada (Venue TBD)</span>
              </div>
            </div>

            <h2>Registration Summary</h2>
            <div class="detail-list">
              <div class="detail-row">
                <span class="detail-label">Business Name</span>
                <span class="detail-value">${bizName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Category</span>
                <span class="detail-value">${category}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Sharing Table?</span>
                <span class="detail-value">${sharing === 'yes' ? 'Yes' : 'No'}</span>
              </div>
              ${sharing === 'yes' ? `
              <div class="detail-row">
                <span class="detail-label">Partner Details</span>
                <span class="detail-value">${partnerDetails}</span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span class="detail-label">Power Required</span>
                <span class="detail-value">${power}</span>
              </div>
            </div>

            <p>We will email you full load-in schedules, marketing materials, and final venue coordinates once they are locked in. If you need to make edits to your registration or have questions for the team, please reply directly to hello@soplugged.com.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 SoPlugged. All rights reserved.</p>
            <p>Made with love by <a href="https://soplugged.com">SoPlugged</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'SoPlugged <hello@soplugged.com>',
        to: [recipientEmail],
        reply_to: 'hello@soplugged.com',
        subject: `Your SoPlugged Black Market 2026 Vendor Pass [${ticketId}]`,
        html: emailHtml
      })
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Resend API response error:', responseData);
      return res.status(response.status).json({ error: responseData.message || 'Error sending email' });
    }

    return res.status(200).json({ success: true, id: responseData.id });
  } catch (error) {
    console.error('Server error handling request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
