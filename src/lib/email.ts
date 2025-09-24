import nodemailer from 'nodemailer'

export interface EmailData {
  name: string
  email: string
  subject?: string
  message: string
}

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })
  }

  async sendContactEmail(data: EmailData) {
    const { name, email, subject, message } = data

    // Email to yourself (notification)
    const notificationEmail = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_FROM,
      subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject || 'No subject provided'}</p>
          </div>
          
          <div style="background: white; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e7f3ff; border-left: 4px solid #007bff;">
            <p style="margin: 0;"><strong>Quick Actions:</strong></p>
            <p style="margin: 5px 0 0 0;">
              <a href="mailto:${email}?subject=Re: ${subject || 'Your inquiry'}" style="color: #007bff;">Reply to ${name}</a>
            </p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This email was sent from your portfolio contact form at ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    }

    // Auto-reply to the sender
    const autoReplyEmail = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Thank you for contacting me - ${subject || 'Your message has been received'}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Thank You for Your Message!
          </h2>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for reaching out! I've received your message and will get back to you as soon as possible, typically within 24-48 hours.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your Message Summary:</h3>
            <p><strong>Subject:</strong> ${subject || 'No subject provided'}</p>
            <p><strong>Sent:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p>In the meantime, feel free to:</p>
          <ul>
            <li>Check out my latest projects on my <a href="${process.env.NEXT_PUBLIC_APP_URL}/projects" style="color: #007bff;">portfolio</a></li>
            <li>Connect with me on <a href="https://linkedin.com/in/yourprofile" style="color: #007bff;">LinkedIn</a></li>
            <li>Follow my work on <a href="https://github.com/yourprofile" style="color: #007bff;">GitHub</a></li>
          </ul>
          
          <p>Best regards,<br>
          <strong>Your Name</strong><br>
          Full Stack Developer</p>
          
          <div style="margin-top: 30px; padding: 15px; background: #e7f3ff; border-left: 4px solid #007bff;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Need immediate assistance?</strong><br>
              For urgent matters, you can reach me directly at <a href="mailto:${process.env.EMAIL_FROM}" style="color: #007bff;">${process.env.EMAIL_FROM}</a>
            </p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This is an automated response. Please do not reply to this email.
          </p>
        </div>
      `,
    }

    try {
      // Send both emails
      await Promise.all([
        this.transporter.sendMail(notificationEmail),
        this.transporter.sendMail(autoReplyEmail)
      ])

      return { success: true, message: 'Emails sent successfully' }
    } catch (error) {
      console.error('Email sending failed:', error)
      throw new Error('Failed to send email')
    }
  }

  async testConnection() {
    try {
      await this.transporter.verify()
      return { success: true, message: 'Email service is ready' }
    } catch (error) {
      console.error('Email service test failed:', error)
      return { success: false, message: 'Email service configuration error' }
    }
  }
}

export const emailService = new EmailService()