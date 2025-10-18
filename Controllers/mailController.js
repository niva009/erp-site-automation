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


  const sendEmail = async (email, username, password, domain) => {

    console.log("email information", email, username, password, domain);
    if (!email) {
      console.log("Email is missing");
      return;
    }

    const htmlBody = `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F8F9FA;padding:24px 0;font-family:Arial, Helvetica, sans-serif;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.06);">
            
            <!-- Header -->
            <tr>
              <td style="padding:20px 28px;background:#1A75BB;color:#ffffff;text-align:left;">
                <h2 style="margin:0;font-size:22px;font-weight:700;letter-spacing:0.3px;">Welcome to erpeaz!</h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 16px 0;color:#334155;font-size:15px;line-height:1.6;">
                  We are thrilled to have you onboard. Below are your account details to help you get started:
                </p>

                <!-- Account Details Box -->
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:16px 0 20px 0;border:1px solid #e5e7eb;border-radius:8px;background:#FAFAFA;">
                  <tr>
                    <td style="padding:16px;font-size:14px;color:#1e293b;line-height:1.6;">
                      <p style="margin:0 0 8px 0;"><strong>Login URL:</strong> <a href="${domain}/#login" style="color:#1A75BB;text-decoration:none;">${domain}</a></p>
                      <p style="margin:0 0 8px 0;"><strong>Username:</strong> ${username}</p>
                      <p style="margin:0;"><strong>Password:</strong> ${password}</p>
                    </td>
                  </tr>
                </table>

                <!-- CTA Button -->
                <p style="margin:0 0 20px 0 cursor:pointer;">
                  <a href="${domain}/#login" target="_blank" style="display:inline-block;cursor:pointer;padding:14px 24px;border-radius:6px;text-decoration:none;font-weight:600;background:#1A75BB;color:#ffffff;font-size:14px;">
                    Log in to your account
                  </a>
                </p>

                <p style="margin:0 0 16px 0;color:#334155;font-size:14px;line-height:1.6;">
                  You can now log in and start managing your business efficiently.
                </p>
                <p style="margin:0 0 16px 0;color:#334155;font-size:14px;line-height:1.6;">
                  If you have any questions, feel free to reach out to us at 
                  <a href="mailto:info@erpeaz.com" style="color:#1A75BB;text-decoration:none;">info@erpeaz.com</a>.
                </p>
                <p style="margin:0;color:#64748b;font-size:13px;line-height:1.5;">
                  We look forward to supporting your growth!
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 28px;background:#F9FAFB;color:#475569;font-size:13px;text-align:center;">
                Best regards,<br>
                <strong>The erpeaz Team</strong>
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

  // Send admin notification
  const sendAdminEmail = async (siteName, username) => {

    const htmlBody = `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F8F9FA;padding:24px 0;font-family:Arial, Helvetica, sans-serif;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.06);">
            
            <!-- Header -->
            <tr>
              <td style="padding:20px 28px;background:#1A75BB;color:#ffffff;text-align:left;">
                <h2 style="margin:0;font-size:20px;font-weight:700;letter-spacing:0.3px;">New Site Created</h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 16px 0;color:#334155;font-size:15px;line-height:1.6;">
                  Hello Admin,
                </p>
                <p style="margin:0 0 16px 0;color:#334155;font-size:15px;line-height:1.6;">
                  A new site has been created on <strong>erpeaz</strong>. Below are the details:
                </p>

                <!-- Site Details Box -->
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:16px 0 20px 0;border:1px solid #e5e7eb;border-radius:8px;background:#FAFAFA;">
                  <tr>
                    <td style="padding:16px;font-size:14px;color:#1e293b;line-height:1.6;">
                      <p style="margin:0 0 8px 0;"><strong>Site Name:</strong> ${siteName}</p>
                      <p style="margin:0;"><strong>User:</strong> ${username}</p>
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 16px 0;color:#334155;font-size:14px;line-height:1.6;">
                  Please review the setup and ensure everything is configured correctly.  
                  If required, reach out to the user for further assistance.
                </p>
                <p style="margin:0;color:#64748b;font-size:13px;line-height:1.5;">
                  Thank you!
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 28px;background:#F9FAFB;color:#475569;font-size:13px;text-align:center;">
                Regards,<br>
                <strong>The erpeaz System</strong>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>`;



    try {
      const info = await transporter.sendMail({
        from: '"ERPEAZ" <info@erpeaz.com>',
        to: "raindropsindian@gmail.com",
        subject: "New erpeaz site has been created",
        html: htmlBody,
      });
      console.log("Admin email sent:", info.messageId);
    } catch (error) {
      console.error("Error sending user email:", error.message, error.response, error.responseCode);
    }
  };

  module.exports = sendEmail;
