import sys
import pythone_functions2 as pf
import docx2txt

directory = sys.argv[-1]
pf.log_in_file('1. got argv')
pf.log_in_file('DIRECTORY: ' + directory)

names_and_paths = dict()  # имя файла: путь до файла
filenames_and_texts = dict()  # имя файла: текст файла
filenames_and_indents = dict()
filenames_and_commongrams = dict()  # имя файла: общие 4-граммы с text_from_google

for i in range(1, len(sys.argv) - 1, 2):
    names_and_paths[sys.argv[i]] = sys.argv[i + 1]
pf.log_in_file('2. LEN(NAMES AND PATHS.DICT): ' + str(len(names_and_paths)))
