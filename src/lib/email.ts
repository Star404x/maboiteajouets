import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || "noreply@maboiteajouets.com";

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(
  customerEmail: string,
  customerName: string,
  orderId: string,
  items: Array<{ name: string; price: number; quantity: number }>,
  total: number
) {
  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${item.quantity}x</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)} €</td>
    </tr>`
    )
    .join("");

  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Merci pour votre commande, ${customerName}!</h2>
          
          <p>Nous avons reçu votre commande <strong>#${orderId}</strong>.</p>
          
          <h3>Détails de la commande:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 12px; text-align: left;">Produit</th>
                <th style="padding: 12px; text-align: right;">Qty</th>
                <th style="padding: 12px; text-align: right;">Prix</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot>
              <tr style="border-top: 2px solid #333; font-weight: bold;">
                <td colspan="2" style="padding: 12px;">TOTAL</td>
                <td style="padding: 12px; text-align: right;">${total.toFixed(2)} €</td>
              </tr>
            </tfoot>
          </table>
          
          <p style="margin-top: 20px;">
            <a href="https://maboiteajouets.com/compte/commandes/${orderId}" 
               style="background: #FF6B35; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
              Voir ma commande
            </a>
          </p>
          
          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            Vous recevrez bientôt un email de suivi avec le numéro de tracking.<br>
            Si vous avez des questions, n'hésitez pas à nous contacter.
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Commande confirmée #${orderId} - Ma Boîte à Jouets`,
      html,
    });

    console.log(`✅ Order confirmation email sent to ${customerEmail}`);
    return result;
  } catch (error) {
    console.error(
      `❌ Failed to send order confirmation to ${customerEmail}:`,
      error
    );
    throw error;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  customerEmail: string,
  customerName: string,
  resetToken: string,
  expiresIn: number = 3600 // 1 hour default
) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://maboiteajouets.com"}/reset-password?token=${resetToken}`;
  const expiresAt = new Date(Date.now() + expiresIn * 1000).toLocaleString("fr-FR");

  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Réinitialisation de votre mot de passe</h2>
          
          <p>Bonjour ${customerName},</p>
          
          <p>Vous avez demandé une réinitialisation de mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe:</p>
          
          <p style="margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-size: 16px;">
              Réinitialiser mon mot de passe
            </a>
          </p>
          
          <p style="color: #666; font-size: 12px;">
            Ce lien expire le: <strong>${expiresAt}</strong>
          </p>
          
          <p style="margin-top: 30px; color: #666; font-size: 12px;">
            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.<br>
            Pour des raisons de sécurité, ne partagez jamais ce lien avec d'autres personnes.
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: "Réinitialisation de votre mot de passe - Ma Boîte à Jouets",
      html,
    });

    console.log(`✅ Password reset email sent to ${customerEmail}`);
    return result;
  } catch (error) {
    console.error(
      `❌ Failed to send password reset email to ${customerEmail}:`,
      error
    );
    throw error;
  }
}

/**
 * Send newsletter welcome email
 */
export async function sendNewsletterWelcome(
  customerEmail: string,
  customerName: string
) {
  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Bienvenue sur la newsletter Ma Boîte à Jouets! 🎉</h2>
          
          <p>Bonjour ${customerName},</p>
          
          <p>Merci de vous être abonné(e) à notre newsletter! Vous recevrez:</p>
          
          <ul style="line-height: 1.8;">
            <li>Les nouveaux produits en exclusivité</li>
            <li>Des codes de réduction spéciaux</li>
            <li>Des conseils et actus sur les jouets pour enfants</li>
            <li>Et bien d'autres surprises!</li>
          </ul>
          
          <p style="margin-top: 30px; color: #666; font-size: 12px;">
            Vous pouvez vous désabonner à tout moment en bas de nos emails.
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: "Bienvenue sur la newsletter Ma Boîte à Jouets!",
      html,
    });

    console.log(`✅ Newsletter welcome email sent to ${customerEmail}`);
    return result;
  } catch (error) {
    console.error(
      `❌ Failed to send newsletter email to ${customerEmail}:`,
      error
    );
    throw error;
  }
}
