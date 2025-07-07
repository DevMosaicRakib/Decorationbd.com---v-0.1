# # def replace_placeholders(message, user_data):
# #     # Log the initial message and user_data being passed
# #     # print("Initial message:", message)
# #     # print("User data:", user_data)

# #     # for key, value in user_data.items():
# #     #     placeholder = f'{{{key}}}'  # Placeholder format is {key}
# #     #     # Log the current placeholder and value being replaced
# #     #     print(f"Replacing placeholder: {placeholder} with {value}")
# #     #     message = message.replace(placeholder, str(value))
    
# #     # # Log the final message after replacement
# #     # print("Final message after placeholder replacement:", message)

# #     # return message
    
    
# #     final_message = message.format(**user_data)
# #     print("Final message after placeholder replacement:", final_message)
# #     return final_message

# def replace_placeholders(message, user_data):
#     # Log the initial message and user_data being passed
#     # print("Initial message:", message)
#     # print("User data:", user_data)

#     for key, value in user_data.items():
#         placeholder = f'{{{key}}}'  # Placeholder format is {key}
#         # Log the current placeholder and value being replaced
#         print(f"Replacing placeholder: {placeholder} with {value}")
#         message = message.replace(placeholder, str(value))
    
#     # Log the final message after replacement
#     # print("Final message after placeholder replacement:", message)
    
#     print("Final message after placeholder replacement:", message.encode('utf-8'))


#     return message





import logging

logger = logging.getLogger(__name__)

def replace_placeholders(message, user_data):
    for key, value in user_data.items():
        placeholder = f'{{{key}}}'  # Placeholder format is {key}
        logger.debug(f"Replacing placeholder: {placeholder} with {value}")
        message = message.replace(placeholder, str(value))
    
    logger.debug("Final message after placeholder replacement: %s", message)
    print("Final message after placeholder replacement:", message.encode('utf-8'))
    return message
    
    
    