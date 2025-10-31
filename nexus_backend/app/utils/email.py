import smtplib
from email.mime.text import MIMEText
import os

def send_simple_email(to_email, subject, message):
    """Send simple email"""
    try:
        sender_email = os.getenv('MAIL_USERNAME')
        sender_password = os.getenv('MAIL_PASSWORD')
        
        if not sender_email or not sender_password:
            print("Email not configured - skipping email send")
            return True  # Don't fail if email not configured
        
        # Create email
        msg = MIMEText(message)
        msg['Subject'] = subject
        msg['From'] = sender_email
        msg['To'] = to_email
        
        # Send email
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        
        return True
    except Exception as e:
        print(f"Email failed: {e}")
        return True  # Don't fail the main operation

def send_welcome_email(email, name, password):
    """Send welcome email to new user"""
    subject = "Welcome to NEXUS - Your Account is Ready!"
    
    message = f"""
Hello {name},

Welcome to NEXUS Attendance System!

Your account has been created by an administrator.

Login Details:
Email: {email}
Temporary Password: {password}

Please login and change your password immediately.

Login at: http://localhost:3000

Best regards,
NEXUS Team
    """
    
    return send_simple_email(email, subject, message)

def send_reset_email(email, code):
    """Send password reset code"""
    subject = "NEXUS - Password Reset Code"
    
    message = f"""
Hello,

Your password reset code is: {code}

This code expires in 15 minutes.

If you didn't request this, ignore this email.

Best regards,
NEXUS Team
    """
    
    return send_simple_email(email, subject, message)