# -*- coding: utf-8 -*-

from django.core.mail import EmailMessage
from .models import EmailTemplate
from django.utils.html import strip_tags
import html 
from .SentDataForEmailMessage import replace_placeholders

def send_welcome_email(user_email, user_data):
    try:
        # Get the first active email template for the welcome message
        email_template = EmailTemplate.objects.filter(
            message_type='Welcome for registration', is_active=True
        ).order_by('-priority').first()
        
        if email_template:
            # Log the original message before replacing placeholders
            # print("Original message:", email_template.message)
            
            # Replace placeholders in the HTML message
            html_message = replace_placeholders(email_template.message, user_data)

            # Log the message after replacing placeholders
            # print("Message after placeholder replacement:", html_message)

            # Strip HTML tags to create a plain-text version
            plain_message = strip_tags(html_message)
            
            # Decode HTML entities to plain text (e.g., &rsquo; -> ’)
            plain_message = html.unescape(plain_message)
            
            # Send email
            email = EmailMessage(
                subject=email_template.subject,
                body=plain_message,  # Use plain text message as body
                from_email=None,
                to=[user_email],
            )
            

            # Add HTML content if required (optional)
            email.content_subtype = 'plain'  # Set as plain text
            if email_template.attachment:
                email.attach_file(email_template.attachment.path)
            email.send()
        else:
            print("No active welcome email template found.")
    except EmailTemplate.DoesNotExist:
        print("Welcome email template not found.")

def send_create_user_message_for_admin(user_and_owner_data):
            # Fetch the owner email template
        email_template_owner = EmailTemplate.objects.get(message_type='Create user message for owner')
        if email_template_owner:
            # Debug: Check user_and_owner_data before sending the email
            # print("Owner email data before sending:", user_and_owner_data)

            # Replace placeholders for owner email
            html_message_owner = replace_placeholders(email_template_owner.message, user_and_owner_data)
            plain_message_owner = html.unescape(strip_tags(html_message_owner))

            owner_email = "staypure@decorationbd.com"
            owner_email_message = EmailMessage(subject=email_template_owner.subject, body=plain_message_owner, to=[owner_email])
            owner_email_message.content_subtype = 'plain'
            if email_template_owner.attachment:
                owner_email_message.attach_file(email_template_owner.attachment.path)
            owner_email_message.send()

        else:
            print("No active email template found for the owner.")

def change_password_success_email(user_email, user_data):
    try:
        email_template = EmailTemplate.objects.filter(message_type='Password change success', is_active=True
        ).order_by('-priority').first()
        if email_template:
            # Log the original message before replacing placeholders
            # print("Original message:", email_template.message)
            
            # Replace placeholders in the HTML message
            html_message = replace_placeholders(email_template.message, user_data)

            # Log the message after replacing placeholders
            # print("Message after placeholder replacement:", html_message)

            # Strip HTML tags to create a plain-text version
            plain_message = strip_tags(html_message)
            
            # Decode HTML entities to plain text (e.g., &rsquo; -> ’)
            plain_message = html.unescape(plain_message)
            
            # Send email
            email = EmailMessage(
                subject=email_template.subject,
                body=plain_message,  # Use plain text message as body
                from_email=None,
                to=[user_email],
            )

            # Add HTML content if required (optional)
            email.content_subtype = 'plain'  # Set as plain text
            if email_template.attachment:
                email.attach_file(email_template.attachment.path)
            email.send()
        else:
            print("No active welcome email template found.")
    except EmailTemplate.DoesNotExist:
        print("Password change success email template not found.")        



def send_password_reset_link_email(user_email, user_data):
    try:
        email_template = EmailTemplate.objects.filter(message_type='Send password reset link', is_active=True
        ).order_by('-priority').first()
        if email_template:
            # Log the original message before replacing placeholders
            # print("Original message:", email_template.message)
            
            # Replace placeholders in the HTML message
            html_message = replace_placeholders(email_template.message, user_data)

            # Log the message after replacing placeholders
            # print("Message after placeholder replacement:", html_message)

            # Strip HTML tags to create a plain-text version
            plain_message = strip_tags(html_message)
            
            # Decode HTML entities to plain text (e.g., &rsquo; -> ’)
            plain_message = html.unescape(plain_message)
            
            # Send email
            email = EmailMessage(
                subject=email_template.subject,
                body=plain_message,  # Use plain text message as body
                from_email=None,
                to=[user_email],
            )

            # Add HTML content if required (optional)
            email.content_subtype = 'plain'  # Set as plain text
            if email_template.attachment:
                email.attach_file(email_template.attachment.path)
            email.send()
        else:
            print("No active welcome email template found.")
    except EmailTemplate.DoesNotExist:
        print("Send password reset link email template not found.")   


def password_reset_success_email(user_email, user_data):
    try:
        email_template = EmailTemplate.objects.filter(message_type='password reset success', is_active=True
        ).order_by('-priority').first()
        if email_template:
            # Log the original message before replacing placeholders
            # print("Original message:", email_template.message)
            
            # Replace placeholders in the HTML message
            html_message = replace_placeholders(email_template.message, user_data)

            # Log the message after replacing placeholders
            # print("Message after placeholder replacement:", html_message)

            # Strip HTML tags to create a plain-text version
            plain_message = strip_tags(html_message)
            
            # Decode HTML entities to plain text (e.g., &rsquo; -> ’)
            plain_message = html.unescape(plain_message)
            
            # Send email
            email = EmailMessage(
                subject=email_template.subject,
                body=plain_message,  # Use plain text message as body
                from_email=None,
                to=[user_email],
            )

            # Add HTML content if required (optional)
            email.content_subtype = 'plain'  # Set as plain text
            if email_template.attachment:
                email.attach_file(email_template.attachment.path)
            email.send()
        else:
            print("No active welcome email template found.")
    except EmailTemplate.DoesNotExist:
        print("password reset success email template not found.") 


def payment_success_and_order_confirm_email(user_email, user_data, user_and_owner_data):
    try:
        # Fetch the user email template
        email_template = EmailTemplate.objects.get(message_type='Payment success and order confirmation')
        if email_template:
            # Replace placeholders for user email
            html_message = replace_placeholders(email_template.message, user_data)
            plain_message = html.unescape(strip_tags(html_message))
            email = EmailMessage(subject=email_template.subject, body=plain_message, to=[user_email])
            email.content_subtype = 'plain'
            if email_template.attachment:
                email.attach_file(email_template.attachment.path)
            email.send()

        # Fetch the owner email template
        email_template_owner = EmailTemplate.objects.get(message_type='Received new order')
        if email_template_owner:
            # Debug: Check user_and_owner_data before sending the email
            # print("Owner email data before sending:", user_and_owner_data)

            # Replace placeholders for owner email
            html_message_owner = replace_placeholders(email_template_owner.message, user_and_owner_data)
            plain_message_owner = html.unescape(strip_tags(html_message_owner))

            owner_email = "admin@decorationbd.com"
            owner_email_message = EmailMessage(subject=email_template_owner.subject, body=plain_message_owner, to=[owner_email])
            owner_email_message.content_subtype = 'plain'
            if email_template_owner.attachment:
                owner_email_message.attach_file(email_template_owner.attachment.path)
            owner_email_message.send()

        else:
            print("No active email template found for the owner.")
    except EmailTemplate.DoesNotExist:
        print("Payment success and order confirmation email template not found.")


def payment_failure_and_order_saved_email(user_email, user_data):
    try:
        email_template = EmailTemplate.objects.get(message_type='Payment failure and order saved')
        if email_template:
            # Log the original message before replacing placeholders
            # print("Original message:", email_template.message)
            
            # Replace placeholders in the HTML message
            html_message = replace_placeholders(email_template.message, user_data)

            # Log the message after replacing placeholders
            # print("Message after placeholder replacement:", html_message)

            # Strip HTML tags to create a plain-text version
            plain_message = strip_tags(html_message)
            
            # Decode HTML entities to plain text (e.g., &rsquo; -> ’)
            plain_message = html.unescape(plain_message)
            
            # Send email
            email = EmailMessage(
                subject=email_template.subject,
                body=plain_message,  # Use plain text message as body
                from_email=None,
                to=[user_email],
            )

            # Add HTML content if required (optional)
            email.content_subtype = 'plain'  # Set as plain text
            if email_template.attachment:
                email.attach_file(email_template.attachment.path)
            email.send()
        else:
            print("No active welcome email template found.")
    except EmailTemplate.DoesNotExist:
        print("Payment failure and order cancelled email template not found.")  



def send_set_password_link_email(user_email, user_data_and_link):
    try:
        email_template = EmailTemplate.objects.filter(message_type='Anonymous user create and set password', is_active=True
        ).order_by('-priority').first()
        if email_template:
            # Log the original message before replacing placeholders
            # print("Original message:", email_template.message)
            
            # Replace placeholders in the HTML message
            html_message = replace_placeholders(email_template.message, user_data_and_link)

            # Log the message after replacing placeholders
            # print("Message after placeholder replacement:", html_message)

            # Strip HTML tags to create a plain-text version
            plain_message = strip_tags(html_message)
            
            # Decode HTML entities to plain text (e.g., &rsquo; -> ’)
            plain_message = html.unescape(plain_message)
            
            # Send email
            email = EmailMessage(
                subject=email_template.subject,
                body=plain_message,  # Use plain text message as body
                from_email=None,
                to=[user_email],
            )

            # Add HTML content if required (optional)
            email.content_subtype = 'plain'  # Set as plain text
            if email_template.attachment:
                email.attach_file(email_template.attachment.path)
            email.send()
        else:
            print("No active welcome email template found.")
    except EmailTemplate.DoesNotExist:
        print("Send password reset link email template not found.")   

def set_password_success_email(user_email, user_data):
    try:
        email_template = EmailTemplate.objects.filter(message_type='Anonymous user create and set password success', is_active=True
        ).order_by('-priority').first()
        if email_template:
            # Log the original message before replacing placeholders
            # print("Original message:", email_template.message)
            
            # Replace placeholders in the HTML message
            html_message = replace_placeholders(email_template.message, user_data)

            # Log the message after replacing placeholders
            # print("Message after placeholder replacement:", html_message)

            # Strip HTML tags to create a plain-text version
            plain_message = strip_tags(html_message)
            
            # Decode HTML entities to plain text (e.g., &rsquo; -> ’)
            plain_message = html.unescape(plain_message)
            
            # Send email
            email = EmailMessage(
                subject=email_template.subject,
                body=plain_message,  # Use plain text message as body
                from_email=None,
                to=[user_email],
            )

            # Add HTML content if required (optional)
            email.content_subtype = 'plain'  # Set as plain text
            if email_template.attachment:
                email.attach_file(email_template.attachment.path)
            email.send()
        else:
            print("No active welcome email template found.")
    except EmailTemplate.DoesNotExist:
        print("password reset success email template not found.")         
