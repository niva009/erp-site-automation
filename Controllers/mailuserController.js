const nodemailer = require("nodemailer");

// Reusable transporter
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: "info@erpeaz.com",
    pass: "cymttpjcbyxxrksq",
  },
});


const userMail = async (email) => {

  const htmlBody = `
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F8F9FA;padding:24px 0;font-family:Arial, Helvetica, sans-serif;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="padding:20px 28px;background:#1A75BB;color:#ffffff;text-align:left;">
              <h2 style="margin:0;font-size:22px;font-weight:700;letter-spacing:0.3px;">Site Creation Successful!</h2>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 16px 0;color:#334155;font-size:15px;line-height:1.6;">
                🎉 Your new site has been created successfully.
              </p>
              <p style="margin:0 0 16px 0;color:#334155;font-size:14px;line-height:1.6;">
                The site is pending approval and this process will not take more than <strong>2 minutes</strong>.
              </p>
              <p style="margin:0;color:#64748b;font-size:13px;line-height:1.5;">
                We’ll notify you once it’s ready to use.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 28px;background:#F9FAFB;color:#475569;font-size:13px;text-align:center;">
              Thank you for choosing <strong>erpeaz</strong> 
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>`;




  try {
    const info = await transporter.sendMail({
      from: '"ERPEAZ" <info@erpeaz.com>',
      to: email,
      subject: "Welcome! Your erpeaz account is ready",
      html: htmlBody,
    });
    console.log("User email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending user email:", error);
  }
};

module.exports = userMail;
