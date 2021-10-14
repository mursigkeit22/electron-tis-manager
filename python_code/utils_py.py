import constants


def log_in_file(text):
    with open(f'{constants.log_path}python.log', 'a', encoding='utf-8') as log_file:
        log_file.write(str(text) + '\n')